import React, { useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import ConversationListItem from '../../components/chats/ConversationListItem';

export default function ConversationsListPage() {
  const { conversations, loading, refresh } = useChat();

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="flex flex-col gap-6 mx-auto w-full pb-16 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-(--color-foreground)">Messages</h1>
        <p className="text-sm text-(--color-muted-foreground) mt-1">
          Conversations tied to your service requests.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {loading && conversations.length === 0 ? (
          <div className="p-12 text-center text-sm text-(--color-muted-foreground)">
            Loading conversations...
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center rounded-(--radius-lg) bg-(--color-card) border border-(--color-border) gap-2">
            <MessageSquare size={40} className="text-(--color-muted-foreground)/40" />
            <p className="text-base font-semibold text-(--color-foreground)">No conversations yet</p>
            <p className="text-xs text-(--color-muted-foreground)">
              Chats appear here once a request is accepted.
            </p>
          </div>
        ) : (
          conversations.map((conv) => <ConversationListItem key={conv.id} conversation={conv} />)
        )}
      </div>
    </div>
  );
}