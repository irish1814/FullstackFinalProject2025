import TransactionModel from "../models/Transaction.model.js";
import AccountModel from "../models/Account.model.js";

// Create a new transaction
export const createTransaction = async (req, res, next) => {
    try {
        const { accountNumberSender, accountNumberReceiver, typeOfTransaction, description, transactionAmount, extra } = req.body;

        // Basic validation
        if (!accountNumberSender || !typeOfTransaction || !transactionAmount) {
            const error = new Error("Missing required fields");
            error.statusCode = 400;
            throw error;
        }

        const senderAccount = await AccountModel.findOne( { accountNumber: accountNumberSender } );

        // Ensure the sender & receiver account exists
        if (!senderAccount) {
            const error = new Error("Sender Account not found");
            error.statusCode = 404;
            throw error;
        }

        if (!accountNumberReceiver && typeOfTransaction === "transfer") {
            const error = new Error("Receiver Account not found");
            error.statusCode = 404;
            throw error;
        }

        const receiverAccount = await AccountModel.findOne( { accountNumber: accountNumberReceiver });

        if (typeOfTransaction === "transfer") {
            if (senderAccount.balance + senderAccount.overdraftLimit < transactionAmount) {
                const error = new Error("Insufficient funds for transfer");
                error.statusCode = 400;
                throw error;
            }
        }

        // Create the transaction
        const transaction = await new TransactionModel({
            accountNumber: accountNumberSender,
            accountId: senderAccount.id,
            type: typeOfTransaction,
            description: description,
            transactionAmount: transactionAmount,
            receiverAccountNumber: accountNumberReceiver,
        });

        let error = new Error("Transaction type is invalid");

        // Update account balances based on transaction type
        switch (typeOfTransaction) {
            case "transfer":
                // Deduct from sender
                senderAccount.balance -= transactionAmount;
                // Add to recipient
                TransactionModel.findByIdAndUpdate(
                    { id: receiverAccount.id },
                    { balance: receiverAccount.balance += transactionAmount }
                );
                await receiverAccount.save();
                break;

            case "deposit":
                TransactionModel.findByIdAndUpdate(
                    { accountNumber: accountNumberSender },
                    { balance: senderAccount.balance += transactionAmount }
                );
                break;

            case "withdrawal":
                TransactionModel.findByIdAndUpdate(
                    { accountNumber: accountNumberSender },
                    { balance: senderAccount.balance -= transactionAmount }
                );
                break;

            case "loan":
                senderAccount.loans.push({
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
                senderAccount.savingsPlans.push({
                    name: extra?.name || "Saving",
                    balance: transactionAmount,
                    targetAmount: extra?.targetAmount || transactionAmount,
                    interestRate: extra?.interestRate || 0,
                    startDate: new Date(),
                    maturityDate: extra?.maturityDate || null,
                    isLocked: extra?.isLocked || false
                });
                senderAccount.balance -= transactionAmount;
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

            default:
                error = new Error("Invalid transaction type");
                error.statusCode = 400;
                throw error;
        }

        await transaction.save();
        await senderAccount.save();

        res.status(201).json({
            success: true,
            data: {
                Transaction: transaction,
                senderAccountNumber: accountNumberSender,
                receiverAccountNumber: accountNumberReceiver
            }
        });
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

export const deleteTransactions = async (req, res, next) => {
    await TransactionModel.collection.drop();

    await TransactionModel.updateMany(
        { receiverAccountNumber: { $exists: false } },
        { $set: { receiverAccountNumber: null } }
    );

    res.status(200).send({ success: true });
}
