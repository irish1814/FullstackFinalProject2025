import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'transfer', 'loan', 'currencyExchange', 'saving'],
    required: true
  },
  amount: { type: Number, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
