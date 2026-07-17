import { MessageCircle } from "lucide-react";
import { useState } from "react";

import { conversations } from "../lib/mock-app-data";

import ChatSidebar from "../components/messages/ChatSidebar";
import ChatHeader from "../components/messages/ChatHeader";
import ChatMessages from "../components/messages/ChatMessages";
import ChatInput from "../components/messages/ChatInput";

export default function Messages() {
  const [activeId, setActiveId] = useState(conversations[0].id);
  const [draft, setDraft] = useState("");

  const active = conversations.find((c) => c.id === activeId);

  return (
    // <div className="h-[calc(100vh-4rem)]">
      <div className="grid h-full grid-cols-1 md:grid-cols-[320px_1fr]">
        <aside className="hidden w-80 flex-col border-r border-border bg-card md:flex">
            <ChatSidebar
                conversations={conversations}
                activeId={activeId}
                setActiveId={setActiveId}
            />
        </aside>

        <section className="flex min-w-0 flex-col bg-background">
          <ChatHeader
            active={active}
            conversations={conversations}
            activeId={activeId}
            setActiveId={setActiveId}
          />

          <ChatMessages active={active} />

          <ChatInput
            active={active}
            draft={draft}
            setDraft={setDraft}
          />
        </section>
      </div> 
    // </div>
  );
}