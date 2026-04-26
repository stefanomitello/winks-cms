import { useState, useEffect, useCallback } from "react";
import CreatePostForm from "../components/CreatePostForm";
import HashtagFilter from "../components/HashtagFilter";
import { PageHeader } from "../components/blocks/page-header/page-header";
import { DeleteResource } from "../components/blocks/delete-resource/delete-resource";
import {
  Button,
  Breadcrumbs,
  Badge,
  Loader,
  LayerCard,
  DialogRoot,
  Dialog,
  DialogTitle,
  DialogClose,
  useKumoToastManager,
} from "@cloudflare/kumo";
import {
  XIcon,
  HouseIcon,
  PlusIcon,
  RocketLaunchIcon,
  TrashSimpleIcon,
} from "@phosphor-icons/react";

import {
  getAllPosts,
  createPost,
  publishPost,
  deletePost,
} from "../api/client";
import type { Post, CreatePostPayload } from "../types";
import { formatDate } from "../utils";

export default function CmsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [allHashtags, setAllHashtags] = useState<string[]>([]);
  const [selectedHashtag, setSelectedHashtag] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  const fetchPosts = useCallback(async (hashtag?: string) => {
    setLoading(true);
    try {
      const res = await getAllPosts(hashtag);
      setPosts(res.data);
      if (!hashtag) {
        const tags = [...new Set(res.data.flatMap((p) => p.hashtags))].sort();
        setAllHashtags(tags);
      }
    } catch (err) {
      toastManager.add({
        type: "error",
        title: "Errore!",
        description: "Failed to load posts",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(selectedHashtag);
  }, [fetchPosts, selectedHashtag]);

  const handleCreate = async (data: CreatePostPayload) => {
    await createPost(data);
    toastManager.add({
      type: "success",
      title: "Successo!",
      description: "Post creato",
    });
    setShowForm(false);
    fetchPosts(selectedHashtag);
  };

  const handlePublish = async (post: Post) => {
    try {
      await publishPost(post._id);
      toastManager.add({
        type: "success",
        description: `"${post.title}" pubblicato!`,
      });
      fetchPosts(selectedHashtag);
    } catch (err) {
      toastManager.add({
        type: "error",
        description: "Non sono riuscito a pubblicare il post.",
      });
    }
  };

  const handleDelete = async () => {
    if (!postToDelete) return;
    try {
      await deletePost(postToDelete._id);
      toastManager.add({
        type: "success",
        description: `"${postToDelete.title}" eliminato!`,
      });
      fetchPosts(selectedHashtag);
    } catch (err) {
      toastManager.add({
        type: "error",
        description: "Non riesco ad eliminarlo.",
      });
    } finally {
      setPostToDelete(null);
    }
  };

  const handleTagSelect = (tag: string) => {
    setSelectedHashtag((prev) => (prev === tag ? undefined : tag));
  };

  const draftCount = posts.filter((p) => p.status === "draft").length;
  const publishedCount = posts.filter((p) => p.status === "published").length;
  const toastManager = useKumoToastManager();
  return (
    <div className="p-12">
      {/*    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`px-4 py-3 rounded-xl text-sm font-medium shadow-xl
              backdrop-blur-sm border pointer-events-auto animate-in fade-in slide-in-from-bottom-2
              ${
                t.type === "error"
                  ? "bg-red-900/80 border-red-500/30 text-red-200"
                  : "bg-emerald-900/80 border-emerald-500/30 text-emerald-200"
              }`}
            >
              {t.message}
            </div>
          ))}
        </div> */}

      <PageHeader
        breadcrumbs={
          <Breadcrumbs>
            <Breadcrumbs.Link icon={<HouseIcon size={16} />} href="/">
              Winks CMS
            </Breadcrumbs.Link>
            <Breadcrumbs.Separator />
            <Breadcrumbs.Current>Gestione Posts</Breadcrumbs.Current>
          </Breadcrumbs>
        }
        title="Gestione Posts"
        description={`${publishedCount} pubblicati · ${draftCount} bozze`}
        className="w-full"
      >
        <Button
          icon={<PlusIcon />}
          variant="primary"
          className="h-8"
          onClick={() => setShowForm(true)}
        >
          Nuovo Post
        </Button>
      </PageHeader>

      {allHashtags.length > 0 && (
        <div className="mb-6">
          <HashtagFilter
            hashtags={allHashtags}
            selected={selectedHashtag}
            onSelect={handleTagSelect}
          />
        </div>
      )}

      <DialogRoot open={showForm} onOpenChange={setShowForm}>
        <Dialog size="base" className="p-0">
          <div className="flex items-center justify-between border-b border-kumo-line px-6 py-4">
            <DialogTitle className="text-lg font-semibold">
              Crea nuovo post
            </DialogTitle>
            <DialogClose
              aria-label="Close"
              render={(props) => (
                <Button
                  {...props}
                  variant="ghost"
                  shape="square"
                  size="sm"
                  aria-label="Close"
                >
                  <XIcon size={18} />
                </Button>
              )}
            />
          </div>
          <div className="p-6">
            <CreatePostForm
              onSubmit={handleCreate}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </Dialog>
      </DialogRoot>

      <DeleteResource
        open={!!postToDelete}
        onOpenChange={(open) => !open && setPostToDelete(null)}
        resourceType="Post"
        resourceName={postToDelete?.title || ""}
        onDelete={handleDelete}
      />

      <LayerCard className="overflow-hidden border-kumo-line">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader size="lg" />
            <p className="text-kumo-subtle text-sm">Carico i post…</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4 text-kumo-dim">✦</p>
            <p className="text-kumo-subtle">
              Nessun post presente. Crea il primo post!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-kumo-fill">
                <tr className="border-b border-kumo-line text-kumo-subtle">
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider">
                    Titolo
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider hidden md:table-cell">
                    Hashtags
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">
                    Data
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-right">
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post, idx) => (
                  <tr
                    key={post._id}
                    className={`border-b border-kumo-line hover:bg-kumo-fill transition-colors ${
                      idx === posts.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    <td className="px-5 py-4 max-w-[260px]">
                      <p className="font-medium text-kumo-default truncate">
                        {post.title}
                      </p>
                      <p className="text-xs text-kumo-subtle truncate mt-0.5">
                        {post.author}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <Badge
                        variant={
                          post.status === "published" ? "success" : "warning"
                        }
                      >
                        {post.status === "published"
                          ? "● Pubblicato"
                          : "○ Bozza"}
                      </Badge>
                    </td>

                    <td className="px-5 py-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {post.hashtags.length > 0 ? (
                          post.hashtags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="px-1 py-0 text-[10px]"
                            >
                              #{tag}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-kumo-dim">—</span>
                        )}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <time className="text-kumo-subtle">
                        {formatDate(post.createdAt)}
                      </time>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {post.status === "draft" && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handlePublish(post)}
                          >
                            <RocketLaunchIcon /> Pubblica
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setPostToDelete(post)}
                        >
                          <TrashSimpleIcon /> Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </LayerCard>
    </div>
  );
}
