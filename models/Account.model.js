import mongoose from 'mongoose';
import crypto from 'crypto';
import { maskAccountNumber } from '../utils/formatter.util.js';

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
        required: true
    },

    accountNumber: {
        type: String,
        unique: true
    },

    accountType: {
        type: String,
        enum: ['checking', 'savings', 'business', 'loan'],
        default: 'checking'
    },

    currency: {
        type: String,
        default: 'USD'
    },

    balance: {
        type: Number,
        default: 0
    },

    overdraftLimit: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        enum: ['active', 'closed', 'frozen'],
        default: 'active'
    },

    branchCode: {
        type: String,
        default: '0001'
    }

}, { timestamps: true });

// Auto-generate unique account number
accountSchema.pre('validate', function (next) {
    if (!this.accountNumber) {
        // Generate 12-digit numeric account number
        const randomNum = crypto.randomInt(100000000000, 999999999999).toString();
        this.accountNumber = randomNum;
    }
    next();
});

// Virtual field for masked account number
accountSchema.virtual('maskedAccountNumber').get(function () {
    return maskAccountNumber(this.accountNumber);
});

const AccountModel = mongoose.model('AccountModel', accountSchema);
export default AccountModel;
