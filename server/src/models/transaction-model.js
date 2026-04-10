import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 40
    },
    date: {
      type: Date,
      required: true
    },
    note: {
      type: String,
      default: '',
      trim: true,
      maxlength: 200
    }
  },
  { timestamps: true }
)

export const TransactionModel =
  mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema)
