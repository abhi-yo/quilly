import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IPayment extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  razorpayOrderId: string;
  razorpayPaymentId?: string; // Optional until paid
  razorpaySignature?: string; // Optional until paid
  amount: number; // In paisa
  currency: string;
  status: 'created' | 'paid' | 'failed';
  receiptId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to your User model
      required: true,
      index: true,
    },
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      index: true,
    },
    razorpaySignature: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['created', 'paid', 'failed'],
      default: 'created',
      index: true,
    },
    receiptId: {
      type: String,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

export const Payment: Model<IPayment> = mongoose.models.Payment || mongoose.model<IPayment>('Payment', paymentSchema); 