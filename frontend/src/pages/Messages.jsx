import { MessageCircle, Paperclip, Search, Send, Smile } from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/Avatar";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { conversations } from "../lib/mock-app-data";

export default function Messages() {
  const [activeId, setActiveId] = useState(conversations[0].id);
  const [draft, setDraft] = useState("");
  const active = conversations.find((c) => c.id === activeId);

  return (
    <div className="h-[calc(100vh-4rem)]">
      <div className="grid h-full grid-cols-1 md:grid-cols-[320px_1fr]">
        <aside className="hidden flex-col border-r border-border bg-card md:flex">
          <div className="border-b border-border p-4">
            <h1 className="text-lg font-semibold">Messages</h1>
            <label className="mt-3 flex items-center gap-2 rounded-lg bg-secondary/60 px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search conversations…" className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0" />
            </label>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left transition-colors ${
                  activeId === c.id ? "bg-primary-soft/60" : "hover:bg-secondary"
                }`}
              >
                <div className="relative">
                  <Avatar className="h-11 w-11">
                    <AvatarImage src={c._avatar} alt={c._name} />
                    <AvatarFallback>{c._name.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  {c._online && <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-accent" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="truncate text-sm font-medium">{c._name}</span>
                    <span className="text-[10px] text-muted-foreground">{c._time}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className={`truncate text-xs ${c.unread_count ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                      {c._typing ? <span className="text-accent">typing…</span> : c.last_message?.content}
                    </span>
                    {c.unread_count > 0 && (
                      <span className="grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">{c.unread_count}</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <section className="flex min-w-0 flex-col bg-background">
          <header className="flex items-center gap-3 border-b border-border bg-card px-5 py-3">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src={active._avatar} alt={active._name} />
                <AvatarFallback>{active._name.slice(0, 1)}</AvatarFallback>
              </Avatar>
              {active._online && <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-accent" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{active._name}</div>
              <div className="text-xs text-muted-foreground">
                {active._online ? <span className="text-accent">Online</span> : "Offline"} · {active._role}
              </div>
            </div>
            <Button variant="outline" size="sm">View booking</Button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto px-5 py-6">
            <div className="text-center text-[11px] text-muted-foreground">Today</div>
            {active.messages.map((m) => (
              <div key={m.id} className={`flex ${m._from === "me" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-soft ${
                  m._from === "me"
                    ? "rounded-br-md bg-primary text-primary-foreground"
                    : "rounded-bl-md bg-card border border-border"
                }`}>
                  <p className="leading-relaxed">{m.content}</p>
                  <div className={`mt-1 text-[10px] ${m._from === "me" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {m._time}{m._from === "me" && m.is_read ? " · Read" : ""}
                  </div>
                </div>
              </div>
            ))}
            {active._typing && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-border bg-card px-4 py-3">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
                </div>
              </div>
            )}
          </div>

          <form
            className="flex items-center gap-2 border-t border-border bg-card px-4 py-3"
            onSubmit={(e) => { e.preventDefault(); setDraft(""); }}
          >
            <Button type="button" variant="ghost" size="icon" aria-label="Attach"><Paperclip className="h-4 w-4" /></Button>
            <Button type="button" variant="ghost" size="icon" aria-label="Emoji"><Smile className="h-4 w-4" /></Button>
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={`Message ${active._name}…`}
              className="flex-1 rounded-full border-border bg-secondary/60"
            />
            <Button type="submit" size="icon" disabled={!draft.trim()} aria-label="Send">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </section>
      </div>

      <div className="grid h-full place-items-center md:hidden">
        <div className="text-center">
          <MessageCircle className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Open on desktop for the full inbox.</p>
        </div>
      </div>
    </div>
  );
}