const { AccountModel } = require("../models/Account.model");

export const getSavingsByAccountNumber = async (req, res, next) => {
    try {
        const { id } = req.params;
        const account = await AccountModel.findOne( { accountNumber: id });
        if (!account) {
            const error = new Error("Account not found");
            error.status = 404;
            throw error;
        }

        res.status(200).send( {
            success: true,
            data: {
                savings: account.savings,
            }
        });

    } catch (error) {
        next(error);
    }
}