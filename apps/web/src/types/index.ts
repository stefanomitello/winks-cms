export interface Post {
  _id: string;
  title: string;
  body: string;
  hashtags: string[];
  status: 'draft' | 'published';
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
}

export interface CreatePostPayload {
  title: string;
  body: string;
  hashtags: string[];
}
