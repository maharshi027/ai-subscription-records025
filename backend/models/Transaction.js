const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  category: {
    type: String,
    enum: ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Salary', 'Investment', 'Subscription', 'Other'],
    default: 'Other'
  },
  date: { type: Date, default: Date.now },
  note: { type: String, trim: true },
  isRecurring: { type: Boolean, default: false },
  recurringInterval: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly', null], default: null },
  tags: [{ type: String }]
}, { timestamps: true });

transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
