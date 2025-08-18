import mongoose from 'mongoose';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: 26,
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, "Email already in use"],
        trim: true,
        match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long']
    },

    salt: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },

    mfa: {
        type: Map,
        default: {
            twoFactorSecret: null,
            twoFactorEnabled: false
        }
    }
}, { timestamps: true });


const UserModel = mongoose.model('UserModel', userSchema);
export default UserModel;
