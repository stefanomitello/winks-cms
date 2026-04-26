import { useState } from "react";
import { Button, Input, Label, Banner, InputArea } from "@cloudflare/kumo";
import { WarningCircleIcon } from "@phosphor-icons/react";
import type { CreatePostPayload } from "../types";

interface CreatePostFormProps {
  onSubmit: (data: CreatePostPayload) => Promise<void>;
  onCancel: () => void;
}

export default function CreatePostForm({
  onSubmit,
  onCancel,
}: CreatePostFormProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [hashtagsRaw, setHashtagsRaw] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !body.trim()) {
      setError("Title and body are required.");
      return;
    }

    const hashtags = hashtagsRaw
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter(Boolean);

    setLoading(true);
    try {
      await onSubmit({ title: title.trim(), body: body.trim(), hashtags });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Input
          id="post-title"
          label="Titolo*"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titolo del post…"
          required
          className="w-full"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <InputArea
          id="post-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          label="Testo"
          required
          rows={7}
          placeholder="Scrivi il tuo post…"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="post-hashtags">
          Hashtags{" "}
          <span className="text-kumo-subtle font-normal text-xs">
            (separati da virgola)
          </span>
        </Label>
        <Input
          id="post-hashtags"
          type="text"
          value={hashtagsRaw}
          onChange={(e) => setHashtagsRaw(e.target.value)}
          placeholder="tech, design, news"
          className="w-full"
        />
      </div>

      <p className="text-xs text-kumo-subtle -mt-2">
        Autore:{" "}
        <span className="text-kumo-default font-medium">Brian Fox</span>{" "}
      </p>

      {error && (
        <Banner icon={<WarningCircleIcon />} variant="error">
          {error}
        </Banner>
      )}

      <div className="flex justify-end gap-3 pt-1">
        <Button type="button" onClick={onCancel} variant="ghost">
          Annulla
        </Button>
        <Button
          type="submit"
          disabled={loading}
          loading={loading}
          variant="primary"
        >
          Crea
        </Button>
      </div>
    </form>
  );
}
