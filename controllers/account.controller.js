import AccountModel from '../models/Account.model.js';


export const getAccounts = async (req, res, next) => {
    try {
        const accounts = await AccountModel.find();
        res.status(200).json( { success: true, data: accounts });
    } catch (err)  {
        next(err);
    }
}

export const getAccount = async (req, res, next) => {
    try {
        const { id } = req.params.id;

        const account = await AccountModel
            .findOne({ id })
            .select('-userId') || AccountModel.findById(id).select('-userId');

        if (!account) {
            const error = new Error("Account not found for this user");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json(account);
    } catch (err) {
        next(err);
    }
};