import { useState, useEffect, useCallback } from "react";
import PostCard from "../components/PostCard";
import HashtagFilter from "../components/HashtagFilter";
import { getPublishedPosts } from "../api/client";
import type { Post } from "../types";
import { PageHeader } from "../components/blocks/page-header/page-header";
import { Breadcrumbs, Button, Empty, Loader } from "@cloudflare/kumo";
import {
  FolderSimpleDashedIcon,
  HouseIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [allHashtags, setAllHashtags] = useState<string[]>([]);
  const [selectedHashtag, setSelectedHashtag] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    getPublishedPosts()
      .then((res) => {
        const tags = [...new Set(res.data.flatMap((p) => p.hashtags))].sort();
        setAllHashtags(tags);
      })
      .catch(() => null);
  }, []);

  const fetchPosts = useCallback(async (hashtag?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPublishedPosts(hashtag);
      setPosts(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(selectedHashtag);
  }, [fetchPosts, selectedHashtag]);

  const handleTagSelect = (tag: string) => {
    setSelectedHashtag((prev) => (prev === tag ? undefined : tag));
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <PageHeader
          breadcrumbs={
            <Breadcrumbs>
              <Breadcrumbs.Link icon={<HouseIcon size={16} />} href="/">
                Wink
              </Breadcrumbs.Link>
              <Breadcrumbs.Separator />
              <Breadcrumbs.Current>Posts</Breadcrumbs.Current>
            </Breadcrumbs>
          }
          title="Blog"
          className="w-full"
        >
          <Button
            icon={<UserIcon />}
            variant="primary"
            className="h-8"
            onClick={() => navigate("/cms", { viewTransition: true })}
          >
            Accedi
          </Button>
        </PageHeader>

        {!loading && allHashtags.length > 0 && (
          <div className="mb-8">
            <HashtagFilter
              hashtags={allHashtags}
              selected={selectedHashtag}
              onSelect={handleTagSelect}
            />
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader size="lg" />
            <p className="text-kumo-subtle text-sm">Caricamento posts…</p>
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <p className="text-red-500">{error}</p>
            <Button
              variant="secondary"
              onClick={() => fetchPosts(selectedHashtag)}
            >
              Riprova
            </Button>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <Empty
            icon={<FolderSimpleDashedIcon size={48} />}
            title="Nessun post adesso!"
            description="Torna più tardi o accedi e scrivene uno."
            contents={
              <div className="flex items-center gap-2">
                <Button
                  icon={<UserIcon />}
                  variant="primary"
                  onClick={() => navigate("/cms")}
                >
                  Accedi
                </Button>
              </div>
            }
          />
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
