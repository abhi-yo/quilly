import mongoose from 'mongoose';

export interface IArticle {
  title: string;
  content: string;
  author: string;
  authorId: string;
  createdAt: Date;
}

const articleSchema = new mongoose.Schema<IArticle>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
    minlength: [10, 'Content must be at least 10 characters long'],
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

articleSchema.index({ createdAt: -1 });

export const Article = mongoose.models.Article || mongoose.model<IArticle>('Article', articleSchema); 