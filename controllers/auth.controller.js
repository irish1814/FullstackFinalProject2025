import { comparePassword, hashPassword} from '../utils/password.util.js'
import { generateToken } from '../utils/jwt.util.js'
import UserModel from '../models/User.model.js';
import AccountModel from "../models/Account.model.js";
import bcrypt from "bcrypt";


export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Check if all required fields are provided
        if (!name || !email || !password) {
            const error = new Error(`Name, Email and Password are required`);
            error.statusCode = 400;
            throw error;
        }

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            const error = new Error(`Email already in use`);
            error.statusCode = 409;
            throw error;
        }

        // Create salt and hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await hashPassword(password, salt);

        // Create a new user
        const newUser = await UserModel.create({
            name,
            email,
            password: hashedPassword,
            salt
        });

        // Create new account for the new user with his userId
        const newAccount = await AccountModel.create(
            { userId: newUser._id }
        );

        // Generate JWT token
        const token = generateToken(
            { userId: newUser._id }
        );

        // Respond with success
        res.status(201).json({
            message: 'User registered successfully',
            data: { token, user: newUser, account: newAccount }
        });
    } catch (err) {
        next(err); // Pass error to error-handling middleware
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            const error = new Error(`Email and Password are required`);
            error.statusCode = 400;
            throw error;
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            const error = new Error(`User does not exist`);
            error.statusCode = 400;
            throw error;
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            const error = new Error(`Invalid Credentials`);
            error.statusCode = 401;
            throw error;
        }

        // Generate JWT token
        const token = generateToken({ userId: user._id });

        const account = await AccountModel.findById(user._id);
        // Respond with success
        res.status(200).json({
            message: 'User signed in successfully',
            data: { token, user, account }
        });
    } catch (err) {
        next(err); // Pass error to error-handling middleware
    }
};

export const logout = async (req, res) => {
    res.status(200).json({ message: 'Logged out' });
};
