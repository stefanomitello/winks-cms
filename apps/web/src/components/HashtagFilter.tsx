import { Button } from "@cloudflare/kumo";

interface HashtagFilterProps {
  hashtags: string[];
  selected?: string;
  onSelect: (tag: string) => void;
}

export default function HashtagFilter({
  hashtags,
  selected,
  onSelect,
}: HashtagFilterProps) {
  if (hashtags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {hashtags.map((tag) => (
        <Button
          key={tag}
          type="button"
          variant={selected === tag ? "primary" : "secondary"}
          size="sm"
          onClick={() => onSelect(tag)}
        >
          #{tag}
        </Button>
      ))}

      {selected && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSelect(selected)}
          className="ml-1"
        >
          Reset
        </Button>
      )}
    </div>
  );
}
