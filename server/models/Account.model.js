import mongoose from 'mongoose';
import crypto from 'crypto';
import { maskAccountNumber } from '../utils/formatter.util.js';


// Subdocument schema for multiple savings plans
const savingsSchema = new mongoose.Schema({
    name: { type: String, required: true },            // e.g., "Vacation Fund"
    targetAmount: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    interestRate: { type: Number, default: 0.02 },    // yearly %
    startDate: { type: Date, default: Date.now },
    maturityDate: { type: Date },
    isLocked: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'closed'], default: 'active' }
}, { _id: true });

// Subdocument schema for multiple loans
const loanSchema = new mongoose.Schema({
    name: { type: String, required: true },            // e.g., "Car Loan"
    principal: { type: Number, required: true },
    remainingBalance: { type: Number, required: true },
    interestRate: { type: Number, default: 0 },
    monthlyPayment: { type: Number },
    termMonths: { type: Number },
    startDate: { type: Date, default: Date.now },
    dueDate: { type: Date },
    status: { type: String, enum: ['ongoing', 'paid', 'defaulted'], default: 'ongoing' }
}, { _id: true });

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
    },

    savingsPlans: [savingsSchema],

    loans: [loanSchema],

    subBalances: {
        type: Map,
        of: Number,
        default: {}
    }

}, { timestamps: true });

// Auto-generate unique 12-digit account number
accountSchema.pre('validate', function (next) {
    if (!this.accountNumber) {
        this.accountNumber = crypto.randomInt(100000000000, 999999999999).toString();
    }
    next();
});

// Virtual field for masked account number
accountSchema.virtual('maskedAccountNumber').get(function () {
    return maskAccountNumber(this.accountNumber);
});

const AccountModel = mongoose.model('AccountModel', accountSchema);
export default AccountModel;
