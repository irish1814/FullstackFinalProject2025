import AccountModel from "../models/Account.model.js";
import TransactionModel from "../models/Transaction.model.js";

export const cashDeposit = async (req, res, next) => {
  try {
    const { accountNumberSender, transactionAmount } = req.body;
    if (!accountNumberSender || !transactionAmount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const account = await AccountModel.findOne({ accountNumber: accountNumberSender });
    if (!account) return res.status(404).json({ error: "Account not found" });

    account.balance += Number(transactionAmount);
    await account.save();

    const tx = new TransactionModel({
      accountNumber: account.accountNumber,
      accountId: account._id,
      type: "deposit",
      transactionAmount,
      description: "Cash deposit"
    });
    await tx.save();

    res.status(201).json({ success: true, transaction: tx, balance: account.balance });
  } catch (err) {
    next(err);
  }
};

export const cashWithdraw = async (req, res, next) => {
  try {
    const { accountNumberSender, transactionAmount } = req.body;
    if (!accountNumberSender || !transactionAmount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const account = await AccountModel.findOne({ accountNumber: accountNumberSender });
    if (!account) return res.status(404).json({ error: "Account not found" });

    if (account.balance < transactionAmount) {
      return res.status(400).json({ error: "Insufficient funds" });
    }

    account.balance -= Number(transactionAmount);
    await account.save();

    const tx = new TransactionModel({
      accountNumber: account.accountNumber,
      accountId: account._id,
      type: "withdrawal",
      transactionAmount,
      description: "Cash withdrawal"
    });
    await tx.save();

    res.status(201).json({ success: true, transaction: tx, balance: account.balance });
  } catch (err) {
    next(err);
  }
};

export const checkDeposit = async (req, res, next) => {
  try {
    const { accountNumberSender } = req.body;
    const file = req.file;
    if (!accountNumberSender || !file) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const account = await AccountModel.findOne({ accountNumber: accountNumberSender });
    if (!account) return res.status(404).json({ error: "Account not found" });

    const tx = new TransactionModel({
      accountNumber: account.accountNumber,
      accountId: account._id,
      type: "deposit",
      transactionAmount: 0,
      description: `Check deposit - ${file.originalname}`
    });
    await tx.save();

    res.status(201).json({ success: true, transaction: tx, file: file.originalname });
  } catch (err) {
    next(err);
  }
};
