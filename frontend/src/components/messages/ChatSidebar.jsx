import { Search } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { Input } from "../ui/Input";

export default function ChatSidebar({
  conversations,
  activeId,
  setActiveId,
  showHeader = true,
}) {
  return (
    <>
      {showHeader && (
        <div className="border-b border-border p-4">
          <h1 className="text-lg font-semibold">Messages</h1>

          <label className="mt-3 flex items-center gap-2 rounded-lg bg-secondary/60 px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />

            <Input
              placeholder="Search conversations..."
              className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
            />
          </label>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveId(c.id)}
            className={`flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left transition-colors ${
              activeId === c.id
                ? "bg-primary-soft/60"
                : "hover:bg-secondary"
            }`}
          >
            <div className="relative">
              <Avatar className="h-11 w-11">
                <AvatarImage src={c._avatar} alt={c._name} />
                <AvatarFallback>{c._name[0]}</AvatarFallback>
              </Avatar>

              {c._online && (
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-accent" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="truncate text-sm font-medium">
                  {c._name}
                </span>

                <span className="text-[10px] text-muted-foreground">
                  {c._time}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span
                  className={`truncate text-xs ${
                    c.unread_count
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {c._typing ? (
                    <span className="text-accent">typing...</span>
                  ) : (
                    c.last_message?.content
                  )}
                </span>

                {c.unread_count > 0 && (
                  <span className="grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                    {c.unread_count}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}