import UserModel from "../models/User.model.js";
import AccountModel from "../models/Account.model.js";


export const getUsers = async (req, res, next) => {
    try {
        const users = await UserModel.find();
        res.status(200).send({
                success: true,
                data: {
                    users: users,
                },
            }
        );
    } catch (err) {
        next(err);
    }
}

export const getUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findOne({ id });
        console.log(user);
        res.status(200).send({
                success: true,
                data: {
                    user: user,
                },
            }
        );
    } catch (err) {
        next(err);
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await UserModel.findById(id);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        // Delete all accounts associated with this user
        await AccountModel.deleteMany({ userId: id });

        // Delete the user
        await UserModel.deleteOne({ _id: id });

        res.status(200).json({
            success: true,
            message: 'User deleted successfully.'
        });
    } catch (err) {
        next(err);
    }
};
