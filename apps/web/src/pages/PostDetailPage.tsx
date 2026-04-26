import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById } from "../api/client";
import { Badge, Button, Loader, LayerCard } from "@cloudflare/kumo";
import { CaretLeftIcon } from "@phosphor-icons/react";
import type { Post } from "../types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getPostById(id)
      .then((res) => setPost(res.data))
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Post not found"),
      )
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-10 px-0"
        >
          <CaretLeftIcon className="mr-1" /> Torna agli articoli
        </Button>

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader size="lg" />
            <p className="text-kumo-subtle text-sm">Caricamento...</p>
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <p className="text-5xl mb-5">404</p>
            <p className="text-kumo-subtle mb-6">{error}</p>
            <Button variant="primary" onClick={() => navigate("/")}>
              TOrna alla home
            </Button>
          </div>
        )}

        {!loading && !error && post && (
          <LayerCard className="p-8 md:p-12 border-none bg-kumo-fill">
            <article>
              {post.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.hashtags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer hover:bg-kumo-dim"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              <h1 className="text-4xl md:text-5xl font-bold text-kumo-default leading-tight mb-6">
                {post.title}
              </h1>

              <div className="flex items-center gap-4 mb-10 pb-8 border-b border-kumo-line">
                <div>
                  <p className="text-sm font-semibold text-kumo-default">
                    di {post.author}
                  </p>
                  <time className="text-xs text-kumo-subtle">
                    {formatDate(post.createdAt)}
                  </time>
                </div>
              </div>

              <div className="prose prose-invert max-w-none text-kumo-default">
                <p>{post.body}</p>
              </div>
            </article>
          </LayerCard>
        )}
      </div>
    </div>
  );
}
