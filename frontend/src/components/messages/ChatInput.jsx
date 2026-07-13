import { Paperclip, Send, Smile } from "lucide-react";

import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export default function ChatInput({
  active,
  draft,
  setDraft,
}) {
  function handleSubmit(e) {
    e.preventDefault();
    setDraft("");
  }

  return (
    <form
      className="flex items-center gap-2 border-t border-border bg-card px-4 py-3"
      onSubmit={handleSubmit}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Attach"
      >
        <Paperclip className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Emoji"
      >
        <Smile className="h-4 w-4" />
      </Button>

      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder={`Message ${active._name}…`}
        className="flex-1 rounded-full border-border bg-secondary/60"
      />

      <Button
        type="submit"
        size="icon"
        disabled={!draft.trim()}
        aria-label="Send"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}