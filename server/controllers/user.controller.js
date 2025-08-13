import UserModel from "../models/User.model.js";

export const getUsers = async (req, res, next) => {
    try {
        const users = await UserModel.find();
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
}