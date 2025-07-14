import mongoose from "mongoose";

export interface IArticle {
  title: string;
  content: string;
  author: string;
  authorId: string;
  tags: string[];
  views: number;
  reads: number;
  copyrightProtected?: boolean;
  copyrightTxHash?: string;
  copyrightRecordId?: string;
  createdAt: Date;
}

const articleSchema = new mongoose.Schema<IArticle>({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    minlength: [3, "Title must be at least 3 characters long"],
    maxlength: [100, "Title cannot be more than 100 characters"],
  },
  content: {
    type: String,
    required: [true, "Content is required"],
    trim: true,
    minlength: [10, "Content must be at least 10 characters long"],
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  authorId: {
    type: String,
    required: true,
    index: true,
  },
  tags: {
    type: [String],
    default: [],
    validate: {
      validator: function (tags: string[]) {
        return tags.length <= 10;
      },
      message: "Cannot have more than 10 tags",
    },
  },
  views: {
    type: Number,
    default: 0,
    min: 0,
  },
  reads: {
    type: Number,
    default: 0,
    min: 0,
  },
  copyrightProtected: {
    type: Boolean,
    default: false,
  },
  copyrightTxHash: {
    type: String,
    trim: true,
  },
  copyrightRecordId: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

articleSchema.index({ createdAt: -1 });
articleSchema.index({ views: -1 });
articleSchema.index({ authorId: 1, createdAt: -1 });

export const Article =
  mongoose.models.Article || mongoose.model<IArticle>("Article", articleSchema);
