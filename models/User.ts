import mongoose from 'mongoose';

export interface IUser {
  email: string;
  name?: string;
  role: string;
  createdAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  name: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['reader', 'writer', 'admin'],
    default: 'reader',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add method to check if user is a writer
userSchema.methods.isWriter = function(): boolean {
  return this.role === 'writer' || this.role === 'admin';
};

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema); 