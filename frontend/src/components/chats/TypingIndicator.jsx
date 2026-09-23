import React from 'react';

export default function TypingIndicator({ name }) {
  return (
    <div className="flex items-center gap-2 px-1 text-xs text-(--color-muted-foreground)">
      <span className="flex gap-0.5">
        <span className="w-1.5 h-1.5 rounded-full bg-(--color-muted-foreground)/60 animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-(--color-muted-foreground)/60 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-(--color-muted-foreground)/60 animate-bounce" />
      </span>
      <span>{name || 'Someone'} is typing...</span>
    </div>
  );
}