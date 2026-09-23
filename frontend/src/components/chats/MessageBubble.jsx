import React from 'react';
import { Check, CheckCheck } from 'lucide-react';
import { formatDateTime } from '../../lib/format';

export default function MessageBubble({ message, isOwn }) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] sm:max-w-[60%] px-4 py-2.5 rounded-(--radius-xl) text-sm ${
          isOwn
            ? 'bg-(--color-primary) text-(--color-primary-foreground) rounded-br-sm'
            : 'bg-(--color-muted) text-(--color-foreground) rounded-bl-sm'
        }`}
      >
        <p className="whitespace-pre-line break-words">{message.content}</p>
        <div
          className={`flex items-center gap-1 mt-1 text-[11px] ${
            isOwn ? 'text-(--color-primary-foreground)/70' : 'text-(--color-muted-foreground)'
          }`}
        >
          <span>{formatDateTime(message.created_at)}</span>
          {isOwn && (message.is_read ? <CheckCheck size={13} /> : <Check size={13} />)}
        </div>
      </div>
    </div>
  );
}