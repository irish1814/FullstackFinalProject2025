import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'AccountModel', required: true },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'transfer', 'loan', 'currencyExchange', 'saving'],
    required: true
  },
  amount: { type: Number, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const TransactionModel = mongoose.model('TransactionModel', transactionSchema);
export default TransactionModel;
