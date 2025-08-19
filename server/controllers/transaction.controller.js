import TransactionModel from "../models/Transaction.model.js";
import AccountModel from "../models/Account.model.js";
import axios from "axios";

// Create a new transaction
export const createTransaction = async (req, res, next) => {
    try {
        const { accountNumberSender, accountNumberReceiver, typeOfTransaction, transactionAmount,
            loanPayload, savingPayload, exchangePayload } = req.body;

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

        let error = new Error("Transaction type is invalid");
        let description = `account ${accountNumberSender} Transfered ${transactionAmount} to ${accountNumberReceiver}`;

        // Update account balances based on transaction type
        switch (typeOfTransaction) {
            case "transfer":
                // Deduct from sender
                senderAccount.balance -= transactionAmount;
                // Add to recipient
                AccountModel.findByIdAndUpdate(
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
                description = `Deposition of ${transactionAmount} to account ${accountNumberSender}`;
                break;

            case "withdrawal":
                TransactionModel.findByIdAndUpdate(
                    { accountNumber: accountNumberSender },
                    { balance: senderAccount.balance -= transactionAmount }
                );
                description = `Withdrawal of ${transactionAmount} from account ${accountNumberSender}`;
                break;

            case "loan":
                senderAccount.loans.push({
                    name: loanPayload?.name || "New Loan",
                    remainingBalance: transactionAmount,
                    interestRate: loanPayload?.interestRate || 0.1,
                    monthlyPayment: loanPayload?.monthlyPayment || transactionAmount / 12,
                    termMonths: loanPayload?.termMonths || 12,
                    dueDate: loanPayload?.dueDate || new Date(new Date().setMonth(new Date().getMonth() + 12))
                });
                senderAccount.balance += transactionAmount;
                description = `${accountNumberSender} asks for a loan of ${transactionAmount} for ${loanPayload?.monthlyPayment} months`;
                break;

            case "saving":
                const startDate = new Date();
                const maturityDate = savingPayload?.maturityDate || new Date(new Date().setMonth(startDate.getMonth() + 12));
                const durationInMonths = (maturityDate.getFullYear() - startDate.getFullYear()) * 12
                    + (maturityDate.getMonth() - startDate.getMonth());

                senderAccount.savingsPlans.push({
                    name: savingPayload?.name || "Saving",
                    balance: transactionAmount,
                    targetAmount: savingPayload?.targetAmount,
                    interestRate: savingPayload?.interestRate || 0.03,
                    startDate,
                    maturityDate,
                    isLocked: durationInMonths < 6 ? true : (savingPayload?.isLocked || false)
                });
                senderAccount.balance -= transactionAmount;

                description = `${accountNumberSender} opens a saving plan of ${savingPayload?.targetAmount} for ${maturityDate} months`;
                break;

            case "currencyExchange":
                const currencyToBuy = exchangePayload?.currencyToBuy.toUpperCase();
                const payingCurrency = exchangePayload?.payingCurrency.toUpperCase();
                const amount = exchangePayload?.amount;

                if (!currencyToBuy || !payingCurrency || !amount) {
                    error = new Error("Missing required fields in exchangePayload payload");
                    error.statusCode = 400;
                    throw error;
                }

                const response = await axios.get(
                    `https://open.er-api.com/v6/latest/${currencyToBuy}`
                );

                if(response.status === 200) {
                    const priceOfBuyCurrency = response.data['rates'][payingCurrency];
                    let cost = priceOfBuyCurrency * amount;
                    if (senderAccount.balance >= cost) {
                        await AccountModel.findByIdAndUpdate(
                            senderAccount.id,
                            {
                                $inc: {
                                    balance: -cost,
                                    [`subBalances.${currencyToBuy}`]: amount
                                }
                            },
                            { new: true, upsert: true } // upsert ensures the field exists
                        );

                        const exchangeTransaction = await new TransactionModel({
                            accountNumber: accountNumberSender,
                            accountId: senderAccount.id,
                            type: typeOfTransaction,
                            description: `Exchange of ${cost} ${payingCurrency} to ${amount} ${currencyToBuy}`,
                            transactionAmount: cost,
                        });

                        await exchangeTransaction.save();
                        await senderAccount.save();

                        return res.status(201).send({
                            success: true,
                            data: {
                                Transaction: exchangeTransaction,
                                senderAccountNumber: accountNumberSender,
                                subBalances: senderAccount.subBalances
                            }
                        });
                    } else {
                        error = new Error("Insufficient funds");
                        error.statusCode = 400;
                        throw error;
                    }
                } else {
                    error = new Error("Failed to find currencies prices");
                    error.statusCode = 500;
                    throw error;
                }
                break;

            default:
                error = new Error("Invalid transaction type");
                error.statusCode = 400;
                throw error;
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
export const getTransactionsByAccountNumber = async (req, res, next) => {
    try {
        const { id } = req.params;
        const transactions = await TransactionModel.find({ accountNumber: id }).sort({ transactionTime: -1 });
        res.status(200).send({
            success: true,
            data: {
                transactions: transactions,
            }
        });
    } catch (err) {
        next(err);
    }
};

export const deleteTransactions = async (req, res, next) => {
    try {
        await TransactionModel.collection.drop();

        await TransactionModel.updateMany(
            {receiverAccountNumber: {$exists: false}},
            {$set: {receiverAccountNumber: null}}
        );

        res.status(200).send({success: true});
    } catch (error) {
        next(error);
    }
}
