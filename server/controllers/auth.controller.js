import {comparePassword, hashPassword} from '../utils/password.util.js'
import {generateToken} from '../utils/jwt.util.js'
import UserModel from '../models/User.model.js';
import AccountModel from "../models/Account.model.js";
import bcrypt from "bcrypt";
import {ADMIN_SECRET_KEY} from '../config/env.js';

export const register = async (req, res, next) => {
    try {
        const { name, email, password, role, adminKey } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            const error = new Error(`Name, Email and Password are required`);
            error.statusCode = 400;
            throw error;
        }

        // Prevent role abuse: default to "user"
        let finalRole = "user";

        // 🔹 Condition 1: Admin registration only if a valid adminKey is provided
        if (role === "admin") {
            if (!adminKey || adminKey !== ADMIN_SECRET_KEY) {
                const error = new Error("Unauthorized attempt to register as admin, missing adminKey");
                error.statusCode = 403;
                throw error;
            }
            finalRole = "admin";
        }

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            const error = new Error(`Email already in use`);
            error.statusCode = 409;
            throw error;
        }

        // Salt + Hash
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await hashPassword(password, salt);

        // Create new user
        const newUser = await UserModel.create({
            name,
            email,
            password: hashedPassword,
            salt,
            role: finalRole
        });

        // Create account linked to user
        const newAccount = await AccountModel.create({
            userId: newUser._id
        });

        // JWT
        const token = generateToken({ userId: newUser._id, role: newUser.role });

        res.status(201).json({
            message: 'User registered successfully',
            data: { token, user: newUser, account: newAccount }
        });

    } catch (err) {
        next(err);
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

        const account = await AccountModel.findOne({ userId: user._id });
        // Respond with success
        res.status(200).json({
            message: 'User signed in successfully',
            data: { token, user, account }
        });
    } catch (err) {
        next(err); // Pass error to error-handling middleware
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const { name, password } = req.body;

        // 1. Find user
        const user = await UserModel.findOne({ name });
        if (!user) {
            const error = new Error(`User not found`);
            error.statusCode = 404;
            throw error;
        }

        // 2. Verify password
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            const error = new Error(`Invalid password`);
            error.statusCode = 401;
            throw error;
        }

        // 3. Delete user
        await UserModel.deleteOne({
            _id: user._id
        });

        await AccountModel.deleteOne({
            userId: user._id
        });

        res.json({ message: `User '${name}' deleted successfully.` });
    } catch (err) {
        next(err); // Pass error to error-handling middleware
    }
};

export const logout = async (req, res) => {
    res.status(200).json({ message: 'Logged out' });
};
