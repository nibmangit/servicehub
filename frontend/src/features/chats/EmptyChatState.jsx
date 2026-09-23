import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function EmptyChatState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center p-8">
      <MessageSquare size={40} className="text-(--color-muted-foreground)/40" />
      <p className="text-base font-semibold text-(--color-foreground)">Select a conversation</p>
      <p className="text-xs text-(--color-muted-foreground)">Choose a chat from the list to start messaging.</p>
    </div>
  );
}