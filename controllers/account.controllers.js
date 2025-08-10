import Account from "../models/Account.js";
import User from "../models/User.js";

export const createAccountForUser = async (userId) => {
  try {
    const existing = await Account.findOne({ userId });
    if (existing) return existing;

    const account = await Account.create({ userId, balance: 0 });
    return account;
  } catch (err) {
    throw new Error("Failed to create account");
  }
};

export const getAccountByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const account = await Account.findOne({ userId });
    if (!account) return res.status(404).json({ message: "Account not found" });

    res.status(200).json(account);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving account", error: err.message });
  }
};
