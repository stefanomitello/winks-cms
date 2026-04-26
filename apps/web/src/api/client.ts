import type { ApiResponse, Post, CreatePostPayload } from "../types";

const API_BASE = "";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = (await res
      .json()
      .catch(() => ({ error: "Unknown error" }))) as { error?: string };
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

export const getPublishedPosts = (hashtag?: string) =>
  request<ApiResponse<Post[]>>(
    `/api/blog/posts${hashtag ? `?hashtag=${encodeURIComponent(hashtag)}` : ""}`,
  );

export const getPostById = (id: string) =>
  request<ApiResponse<Post>>(`/api/blog/posts/${id}`);

//CMS (admin)

export const getAllPosts = (hashtag?: string) =>
  request<ApiResponse<Post[]>>(
    `/api/cms/posts${hashtag ? `?hashtag=${encodeURIComponent(hashtag)}` : ""}`,
  );

export const createPost = (data: CreatePostPayload) =>
  request<ApiResponse<Post>>("/api/cms/posts", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const publishPost = (id: string) =>
  request<ApiResponse<Post>>(`/api/cms/posts/${id}/publish`, {
    method: "PATCH",
  });

export const deletePost = (id: string) =>
  request<void>(`/api/cms/posts/${id}`, { method: "DELETE" });
