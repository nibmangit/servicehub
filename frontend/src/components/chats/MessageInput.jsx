import React, { useState, useRef } from 'react';
import { Send } from 'lucide-react';

export default function MessageInput({ onSend, onTyping }) {
  const [content, setContent] = useState('');
  const typingTimeoutRef = useRef(null);

  const handleChange = (e) => {
    setContent(e.target.value);

    onTyping(true);
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => onTyping(false), 2000);
  };

  const handleSend = () => {
    const trimmed = content.trim();
    if (!trimmed) return;

    onSend(trimmed);
    setContent('');
    clearTimeout(typingTimeoutRef.current);
    onTyping(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2 p-3 border-t border-(--color-border) bg-(--color-card)">
      <textarea
        value={content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        rows={1}
        className="flex-1 resize-none px-3.5 py-2.5 rounded-(--radius-lg) bg-(--color-input) border border-(--color-border) text-(--color-foreground) text-sm focus:outline-none focus:ring-2 focus:ring-(--color-ring) max-h-32"
      />
      <button
        onClick={handleSend}
        disabled={!content.trim()}
        className="shrink-0 p-2.5 rounded-(--radius-lg) bg-(--color-primary) text-(--color-primary-foreground) hover:opacity-90 disabled:opacity-50 cursor-pointer transition-all"
      >
        <Send size={18} />
      </button>
    </div>
  );
}