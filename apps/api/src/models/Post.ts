import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
  title: string;
  body: string;
  hashtags: string[];
  status: 'draft' | 'published';
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    hashtags: { type: [String], default: [] },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    author: { type: String, default: 'Brian Fox' },
  },
  { timestamps: true }
);

PostSchema.index({ hashtags: 1 });
PostSchema.index({ status: 1 });
PostSchema.index({ createdAt: -1 });

export const Post = mongoose.model<IPost>('Post', PostSchema);
