import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { chatApi } from '../../services/chatApi';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { buildWsUrl } from '../../lib/ws';
import MessageBubble from '../../components/chats/MessageBubble';
import TypingIndicator from '../../components/chats/TypingIndicator';
import PresenceDot from '../../components/chats/PresenceDot';
import MessageInput from '../../components/chats/MessageInput';

export default function ConversationDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { markConversationRead, bumpConversation } = useChat();

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasOlder, setHasOlder] = useState(false);
  const [nextPage, setNextPage] = useState(2); // page 1 loads on mount; loadOlder starts from page 2
  const [otherOnline, setOtherOnline] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);

  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const bottomRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const skipAutoScrollRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    Promise.all([chatApi.getConversation(id), chatApi.getMessages(id, 1)])
      .then(([convData, msgData]) => {
        if (cancelled) return;
        setConversation(convData);
        const results = msgData.results || msgData;
        setMessages([...results].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)));
        setHasOlder(Boolean(msgData.next));
        setNextPage(2);
        markConversationRead(Number(id));
      })
      .catch(() => { if (!cancelled) setError('Could not load this conversation.'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token || !user) return;

    let cancelled = false;

    const connect = () => {
      if (cancelled) return;
      const socket = new WebSocket(buildWsUrl(`ws/chat/${id}/`, { token }));
      socketRef.current = socket;

      socket.onmessage = (event) => {
        const parsed = JSON.parse(event.data);

        switch (parsed.type) {
          case 'message': {
            const incoming = parsed.data;
            setMessages((prev) => {
              if (prev.some((m) => m.id === incoming.id)) return prev;
              return [...prev, incoming];
            });

            bumpConversation(Number(id), {
              content: incoming.content,
              sender: incoming.sender_email,
              created_at: incoming.created_at,
            });

            if (incoming.sender_id !== user.id) {
              markConversationRead(Number(id));
            }
            break;
          }
          case 'typing': {
            if (parsed.user_id !== user.id) setOtherTyping(parsed.is_typing);
            break;
          }
          case 'presence': {
            if (parsed.user_id === conversation?.other_participant_id) {
              setOtherOnline(parsed.is_online);
            }
            break;
          }
          case 'messages_read': {
            setMessages((prev) =>
              prev.map((m) => (m.sender_id === user.id ? { ...m, is_read: true } : m))
            );
            break;
          }
          default:
            break;
        }
      };

      socket.onclose = (e) => {
        if (cancelled || e.code === 1000) return;
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      };

      socket.onerror = () => socket.close();
    };

    connect();

    return () => {
      cancelled = true;
      clearTimeout(reconnectTimeoutRef.current);
      socketRef.current?.close(1000);
    };
  }, [id, user, conversation?.other_participant_id]);

  // Auto-scroll to bottom on genuinely new content (sent/received messages,
  // typing indicator) — but NOT when older history was just prepended,
  // which is handled separately by loadOlder's own scroll-position logic.
  useEffect(() => {
    if (skipAutoScrollRef.current) {
      skipAutoScrollRef.current = false;
      return;
    }
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, otherTyping]);

  const handleSend = useCallback((content) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ content }));
    }
  }, []);

  const handleTyping = useCallback((isTyping) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'typing', is_typing: isTyping }));
    }
  }, []);

  const loadOlder = async () => {
    const container = scrollContainerRef.current;
    const prevScrollHeight = container?.scrollHeight ?? 0;
    const prevScrollTop = container?.scrollTop ?? 0;

    try {
      const data = await chatApi.getMessages(id, nextPage);
      const older = [...(data.results || [])].sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );

      skipAutoScrollRef.current = true;
      setMessages((prev) => [...older, ...prev]);
      setHasOlder(Boolean(data.next));
      setNextPage((p) => p + 1);

      // Restore the user's exact visual position — the new content was
      // added above what they were looking at, so without this the whole
      // view would otherwise jump.
      requestAnimationFrame(() => {
        if (container) {
          const newScrollHeight = container.scrollHeight;
          container.scrollTop = newScrollHeight - prevScrollHeight + prevScrollTop;
        }
      });
    } catch {
      // silently ignore — not critical
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-10 w-10 rounded-full border-3 border-(--color-border) border-t-(--color-primary) animate-spin" />
          <p className="text-xs text-(--color-muted-foreground) font-medium">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="p-4 rounded-lg bg-(--color-destructive)/10 text-(--color-destructive) text-sm border border-(--color-destructive)/20">
          {error || 'Conversation not found.'}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 border-b border-(--color-border) bg-(--color-card) shrink-0">
        <Link to="/chats" className="md:hidden text-(--color-muted-foreground) hover:text-(--color-primary)">
          <ArrowLeft size={18} />
        </Link>
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-(--color-primary-soft) flex items-center justify-center text-sm font-semibold text-(--color-primary)">
            {(conversation.other_participant_name || conversation.other_participant_email || '?')[0].toUpperCase()}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5">
            <PresenceDot online={otherOnline} />
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-(--color-foreground) truncate">
            {conversation.other_participant_name || conversation.other_participant_email}
          </p>
          <p className="text-xs text-(--color-muted-foreground) truncate">{conversation.service_title}</p>
        </div>
      </div>

      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {hasOlder && (
          <button
            onClick={loadOlder}
            className="w-full text-xs font-medium text-(--color-primary) hover:underline py-2"
          >
            Load older messages
          </button>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} isOwn={msg.sender_id === user.id} />
        ))}

        {otherTyping && <TypingIndicator name={conversation.other_participant_name} />}

        <div ref={bottomRef} />
      </div>

      <MessageInput onSend={handleSend} onTyping={handleTyping} />
    </div>
  );
}