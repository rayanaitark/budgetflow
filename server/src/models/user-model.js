import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 40
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    monthlyBudget: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  { timestamps: true }
)

export const UserModel = mongoose.models.User || mongoose.model('User', userSchema)
