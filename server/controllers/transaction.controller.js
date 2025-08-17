import TransactionModel from "../models/Transaction.model.js";
import AccountModel from "../models/Account.model.js";

// Create a new transaction
export const createTransaction = async (req, res, next) => {
    try {
        const { accountNumber, accountId, type, description, transactionAmount, extra, recipientAccountId } = req.body;

        // Basic validation
        if (!accountNumber || !accountId || !type || !transactionAmount) {
            const error = new Error("Missing required fields");
            error.statusCode = 400;
            throw error;
        }

        // Ensure the sender account exists
        const account = await AccountModel.findById(accountId);
        if (!account) {
            const error = new Error("Account not found");
            error.statusCode = 404;
            throw error;
        }

        let recipientAccount = null;
        if (type === "transfer") {
            if (!recipientAccountId) {
                const error = new Error("Recipient account ID required for transfer");
                error.statusCode = 400;
                throw error;
            }
            recipientAccount = await AccountModel.findById(recipientAccountId);
            if (!recipientAccount) {
                const error = new Error("Recipient account not found");
                error.statusCode = 404;
                throw error;
            }
            if (account.balance + account.overdraftLimit < transactionAmount) {
                const error = new Error("Insufficient funds for transfer");
                error.statusCode = 400;
                throw error;
            }
        }

        // Create the transaction
        const transaction = new TransactionModel({
            accountNumber,
            accountId,
            type,
            description,
            transactionAmount,
            recipientAccountId: recipientAccountId || null
        });

        let error = new Error("Transaction type is invalid");

        // Update account balances based on transaction type
        switch (type) {
            case "deposit":
                account.balance += transactionAmount;
                break;

            case "withdrawal":
                if (account.balance + account.overdraftLimit < transactionAmount) {
                    const error = new Error("Insufficient funds");
                    error.statusCode = 400;
                    throw error;
                }
                account.balance -= transactionAmount;
                break;

            case "loan":
                account.loans.push({
                    name: extra?.name || "Loan",
                    principal: transactionAmount,
                    remainingBalance: transactionAmount,
                    interestRate: extra?.interestRate || 0,
                    monthlyPayment: extra?.monthlyPayment || 0,
                    termMonths: extra?.termMonths || 0,
                    dueDate: extra?.dueDate || null
                });
                account.balance += transactionAmount;
                break;

            case "saving":
                account.savingsPlans.push({
                    name: extra?.name || "Saving",
                    balance: transactionAmount,
                    targetAmount: extra?.targetAmount || transactionAmount,
                    interestRate: extra?.interestRate || 0,
                    startDate: new Date(),
                    maturityDate: extra?.maturityDate || null,
                    isLocked: extra?.isLocked || false
                });
                account.balance -= transactionAmount;
                break;

            case "currencyExchange":
                let cost = extra?.currencyPrice * extra?.amountBought;
                if(account.balance >= cost) {
                    account.subBalances[extra?.currencyName] += extra?.amountBought;
                    account.balance -= cost;
                }
                error = new Error("Insufficient funds");
                error.statusCode = 400;
                throw error;
                break;

            case "transfer":
                // Deduct from sender
                account.balance -= transactionAmount;
                // Add to recipient
                recipientAccount.balance += transactionAmount;
                await recipientAccount.save();
                break;

            default:
                error = new Error("Invalid transaction type");
                error.statusCode = 400;
                throw error;
        }

        await transaction.save();
        await account.save();

        res.status(201).json({ transaction, account, recipientAccount: recipientAccount || null });
    } catch (err) {
        next(err);
    }
};
// Get all transactions
export const getAllTransactions = async (req, res, next) => {
    try {
        const transactions = await TransactionModel.find().populate("accountId", "accountNumber");
        res.status(200).json(transactions);
    } catch (err) {
        next(err);
    }
};

// Get transaction by ID
export const getTransactionById = async (req, res, next) => {
    try {
        const transaction = await TransactionModel.findById(req.params.id)
            .populate("accountId", "accountNumber");
        if (!transaction) {
            const error = new Error("Transaction not found");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json(transaction);
    } catch (err) {
        next(err);
    }
};

// Get all transactions for a given account
export const getTransactionsByAccount = async (req, res, next) => {
    try {
        const { accountId } = req.params;
        const transactions = await TransactionModel.find({ accountId }).sort({ transactionTime: -1 });
        res.status(200).json(transactions);
    } catch (err) {
        next(err);
    }
};
