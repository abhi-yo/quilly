import mongoose from "mongoose";

export interface ICopyrightRecord {
  authorId: string;
  articleId?: string;
  title: string;
  contentHash: string;
  txHash: string;
  blockchainRecordId?: string;
  registrationFee: number;
  status: "pending" | "confirmed" | "failed";
  blockchain: string;
  ipfsHash?: string;
  createdAt: Date;
  confirmedAt?: Date;
}

const copyrightRecordSchema = new mongoose.Schema<ICopyrightRecord>({
  authorId: {
    type: String,
    required: true,
    index: true,
  },
  articleId: {
    type: String,
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [200, "Title cannot exceed 200 characters"],
  },
  contentHash: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  txHash: {
    type: String,
    required: true,
    unique: true,
  },
  blockchainRecordId: {
    type: String,
    index: true,
  },
  registrationFee: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "confirmed", "failed"],
    default: "pending",
  },
  blockchain: {
    type: String,
    required: true,
    default: "polygon-amoy",
  },
  ipfsHash: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  confirmedAt: {
    type: Date,
  },
});

copyrightRecordSchema.index({ authorId: 1, createdAt: -1 });
copyrightRecordSchema.index({ contentHash: 1, status: 1 });

export const CopyrightRecord =
  mongoose.models.CopyrightRecord ||
  mongoose.model<ICopyrightRecord>("CopyrightRecord", copyrightRecordSchema);
