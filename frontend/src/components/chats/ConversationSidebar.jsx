import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export default function ConversationSidebar() {
  const { conversations, loading, refresh } = useChat();

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-(--color-border) shrink-0">
        <h1 className="text-lg font-bold text-(--color-foreground)">Messages</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && conversations.length === 0 ? (
          <div className="p-8 text-center text-sm text-(--color-muted-foreground)">Loading...</div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 text-center gap-2">
            <MessageSquare size={32} className="text-(--color-muted-foreground)/40" />
            <p className="text-sm font-semibold text-(--color-foreground)">No conversations yet</p>
            <p className="text-xs text-(--color-muted-foreground)">
              Chats appear here once a request is accepted.
            </p>
          </div>
        ) : (
          conversations.map((conv) => (
            <NavLink
              key={conv.id}
              to={`/chats/${conv.id}`}
              className={({ isActive }) =>
                `flex items-center justify-between gap-3 px-4 py-3 border-b border-(--color-border)/60 transition-colors ${
                  isActive ? 'bg-(--color-primary-soft)' : 'hover:bg-(--color-muted)'
                }`
              }
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-(--color-foreground) truncate">
                  {conv.other_participant_name || conv.other_participant_email}
                </p>
                <p className="text-xs text-(--color-muted-foreground) truncate mt-0.5">
                  {conv.last_message ? conv.last_message.content : 'No messages yet'}
                </p>
              </div>
              {conv.unread_count > 0 && (
                <span className="shrink-0 min-w-[1.25rem] h-5 px-1.5 rounded-full bg-(--color-primary) text-(--color-primary-foreground) text-xs font-semibold flex items-center justify-center">
                  {conv.unread_count}
                </span>
              )}
            </NavLink>
          ))
        )}
      </div>
    </div>
  );
}