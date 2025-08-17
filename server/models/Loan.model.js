import mongoose from "mongoose";

const loanSchema = new mongoose.Schema({
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'AccountModel', required: true },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    remainingBalance: { type: Number, required: true },
    interestRate: { type: Number, default: 0.1 },
    monthlyPayment: { type: Number },
    termMonths: { type: Number },
    startDate: { type: Date, default: Date.now },
    dueDate: { type: Date },
    status: { type: String, enum: ['ongoing', 'paid', 'defaulted'], default: 'ongoing' }
}, { timestamps: true });

const LoanModel = mongoose.model('LoanModel', loanSchema);
export default LoanModel;