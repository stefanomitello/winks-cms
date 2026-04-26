import { useNavigate } from "react-router-dom";
import { LayerCard, Badge } from "@cloudflare/kumo";
import type { Post } from "../types";

interface PostCardProps {
  post: Post;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function PostCard({ post }: PostCardProps) {
  const navigate = useNavigate();
  const excerpt =
    post.body.length > 140 ? post.body.slice(0, 140) + "…" : post.body;

  return (
    <div
      onClick={() => navigate(`/post/${post._id}`)}
      className="cursor-pointer h-full"
    >
      <LayerCard className="p-6 h-full flex flex-col gap-4 card-hover hover:border-kumo-line-focus">
        {/* Hashtags */}
        {post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.hashtags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary">
                #{tag}
              </Badge>
            ))}
            {post.hashtags.length > 3 && (
              <Badge variant="secondary">+{post.hashtags.length - 3}</Badge>
            )}
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-semibold text-kumo-default leading-snug line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-kumo-subtle leading-relaxed line-clamp-3 flex-1">
          {excerpt}
        </p>

        <div className="flex items-center justify-between pt-2 mt-auto">
          <span className="text-xs text-kumo-dim font-medium">
            {post.author}
          </span>
          <time className="text-xs text-kumo-dim">
            {formatDate(post.createdAt)}
          </time>
        </div>
      </LayerCard>
    </div>
  );
}
