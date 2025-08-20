import AccountModel from '../models/Account.model.js';
import UserModel from "../models/User.model.js";
import accountModel from "../models/Account.model.js";


export const getAccounts = async (req, res, next) => {
    try {
        const accounts = await AccountModel.find();
        res.status(200).json( { success: true, data: accounts });
    } catch (err)  {
        next(err);
    }
}

export const getAccountByAccountNumber = async (req, res, next) => {
    try {
        const { id } = req.params;
        const account = await AccountModel.findOne({ accountNumber: id });
        if (!account) {
            const error = new Error("Account not found for this user");
            error.statusCode = 404;
            throw error;
        }

        return res.status(200).send({
            success: true,
            data: { account }
        });
    } catch (err) {
        next(err);
    }
};

export const toggleAccount = async (req, res, next) => {
    try {
        const accountNumber = req.params.id;
        const newStatus = req.body.status;

        if (!["active", "frozen", "closed"].includes(newStatus)) {
            const error = new Error("Invalid status");
            error.statusCode = 400;
            throw error;
        }

        const updatedAccount = await AccountModel.findOneAndUpdate(
            { accountNumber },
            { status: newStatus },
            { new: true } // return updated doc
        );

        if (!updatedAccount) {
            const error = new Error("Account not found");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).send({
            success: true,
            data: { accountStatus: updatedAccount.status }
        });
    } catch (error) {
        next(error);
    }
};


export const updateAccount = async (req, res, next) => {
    try {
        const accountId = req.params.id;
        const updates = req.body;
        const user = req.user;

        const account = await AccountModel.findById(accountId);
        if (!account) {
            const error = new Error("Account not found");
            error.statusCode = 404;
            throw error;
        }

        // Status restriction
        if ((account.status === 'frozen' || account.status === 'closed')) {
            const error = new Error(`Your account is ${accout.status}!`);
            error.statusCode = 403;
            throw error;
        }

        // Admin-only updates
        if ('overdraftLimit' in updates && user.role !== 'admin') {
            const error = new Error("Only admin can update the overdraft limit");
            error.statusCode = 403;
            throw error;
        }

        if ('overdraftLimit' in updates) account.overdraftLimit = updates.overdraftLimit;

        if ('balance' in updates) {
            if (updates.balance > account.balance + account.overdraftLimit) {
                throw Object.assign(new Error("Balance exceeds allowed overdraft limit"), { statusCode: 400 });
            }
            account.balance = updates.balance;
        }

        if (updates.newSavingsPlan) account.savingsPlans.push(updates.newSavingsPlan);
        if (updates.newLoan) account.loans.push({ ...updates.newLoan, remainingBalance: updates.newLoan.principal });

        // Currency exchange using existing controller logic
        if (updates.currency && updates.currency !== account.currency) {
            const fakeReq = { body: { currencyToBuy: updates.currency, payingCurrency: account.currency, amount: account.balance } };
            const fakeRes = {
                status: () => ({ json: (data) => data }),
                json: (data) => data
            };
            const exchangeData = await currencyExchange(fakeReq, fakeRes, next);

            if (!exchangeData || !exchangeData.convertedAmount) {
                throw Object.assign(new Error(`Failed to convert to currency ${updates.currency}`), { statusCode: 400 });
            }

            account.balance = parseFloat(exchangeData.convertedAmount);
            account.currency = updates.currency;

            // Update subBalances proportionally
            for (let [key, val] of account.subBalances.entries()) {
                const rate = exchangeData.rates[key] || 1;
                account.subBalances.set(key, parseFloat((val * rate).toFixed(2)));
            }
        }

        if (updates.status && isAdmin(user)) account.status = updates.status;

        await account.save();

        res.status(200).json({ message: "Account updated successfully", account });

    } catch (err) {
        next(err);
    }
};

export const deleteAccount = async (req, res, next) => {
    try {
        const { accountNumber } = req.body;
        const account = await accountModel.findOne( { accountNumber });

        if (!account) {
            const error = new Error("Account number not found");
            error.statusCode = 404;
            throw error;
        }

        await AccountModel.deleteOne({
            accountNumber: accountNumber
        });

        await UserModel.deleteMany({
            _id: account.userId
        });

        res.json({ message: `account '${accountNumber}' deleted successfully.` });
    } catch (error) {
        next(error);
    }
}