import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    accountNumber: { type: Number, required: "please ensure that the account number exists" },
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'AccountModel', required: true },
    type: {
        type: String,
        enum: ['deposit', 'withdrawal', 'transfer', 'loan', 'currencyExchange', 'saving'],
        required: true
    },
    description: { type: String },
    transactionAmount: { type: Number, required: "please enter a transaction amount" },
    transactionTime: { type: Date, default: Date.now },
});

const TransactionModel = mongoose.model('TransactionModel', transactionSchema);
export default TransactionModel;
