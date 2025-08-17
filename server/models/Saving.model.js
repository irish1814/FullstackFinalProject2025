import mongoose from "mongoose";

const savingsSchema = new mongoose.Schema({
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'AccountModel', required: true },
    name: { type: String, required: true },
    targetAmount: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    interestRate: { type: Number, default: 0.03 },
    startDate: { type: Date, default: Date.now },
    maturityDate: { type: Date },
    status: { type: String, enum: ['active', 'closed'], default: 'active' }
}, { timestamps: true });

const SavingsModel = mongoose.model('SavingsModel', savingsSchema);
export default SavingsModel;