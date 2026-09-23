import React from 'react';
import { Link } from 'react-router-dom';

export default function ConversationListItem({ conversation }) {
  const { id, other_participant_name, other_participant_email, service_title, last_message, unread_count } = conversation;

  return (
    <Link
      to={`/chats/${id}`}
      className="flex items-center justify-between gap-4 p-4 rounded-(--radius-lg) bg-(--color-card) border border-(--color-border) hover:border-(--color-primary)/50 transition-colors"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-(--color-foreground) truncate">
            {other_participant_name || other_participant_email}
          </p>
          <span className="text-xs text-(--color-muted-foreground)">· {service_title}</span>
        </div>
        <p className="text-sm text-(--color-muted-foreground) truncate mt-0.5">
          {last_message ? last_message.content : 'No messages yet'}
        </p>
      </div>

      {unread_count > 0 && (
        <span className="shrink-0 min-w-[1.25rem] h-5 px-1.5 rounded-full bg-(--color-primary) text-(--color-primary-foreground) text-xs font-semibold flex items-center justify-center">
          {unread_count}
        </span>
      )}
    </Link>
  );
}