import { Request, Response, NextFunction } from 'express';
import { Post } from '../models/Post';

// ─── BLOG — public ───────────────────────────────────────────────────────────

export const getPublishedPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { hashtag } = req.query;
    const filter: Record<string, unknown> = { status: 'published' };

    if (hashtag && typeof hashtag === 'string') {
      filter.hashtags = hashtag;
    }

    const posts = await Post.find(filter).sort({ createdAt: -1 });
    res.json({ data: posts });
  } catch (err) {
    next(err);
  }
};

export const getPublishedPostById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      status: 'published',
    });

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    res.json({ data: post });
  } catch (err) {
    next(err);
  }
};

// ─── CMS — admin ─────────────────────────────────────────────────────────────

export const getAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { hashtag } = req.query;
    const filter: Record<string, unknown> = {};

    if (hashtag && typeof hashtag === 'string') {
      filter.hashtags = hashtag;
    }

    const posts = await Post.find(filter).sort({ createdAt: -1 });
    res.json({ data: posts });
  } catch (err) {
    next(err);
  }
};

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, body, hashtags } = req.body as {
      title: string;
      body: string;
      hashtags?: string[];
    };

    const post = await Post.create({
      title,
      body,
      hashtags: hashtags ?? [],
      author: 'Brian Fox',
      status: 'draft',
    });

    res.status(201).json({ data: post });
  } catch (err) {
    next(err);
  }
};

export const publishPost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { status: 'published' },
      { new: true }
    );

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    res.json({ data: post });
  } catch (err) {
    next(err);
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
