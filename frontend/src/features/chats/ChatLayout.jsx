import React, { useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ConversationSidebar from '../../components/chats/ConversationSidebar';

export default function ChatLayout() {
  const { id } = useParams();
  const hasSelectedConversation = Boolean(id);

  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('chat_sidebar_collapsed') === 'true';
  });

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('chat_sidebar_collapsed', String(next));
      return next;
    });
  };

  return (
    <div className="-m-4 md:-m-8 h-[calc(100vh-4rem)] flex overflow-hidden relative">
      {/* Sidebar — normal flex item on mobile, floating overlay on md+ */}
      <aside
        className={`
          ${hasSelectedConversation ? 'hidden md:flex' : 'flex'}
          w-full
          md:absolute md:top-0 md:left-0 md:h-full md:z-20
          border-r border-(--color-border) bg-(--color-card)
          flex-col overflow-hidden
          transition-all duration-300 ease-in-out
          ${collapsed ? 'md:w-0 md:border-r-0' : 'md:w-64 lg:w-80 md:shadow-elevated'}
        `}
      >
        <div className="h-full w-full md:w-64 lg:w-80 shrink-0">
          <ConversationSidebar />
        </div>
      </aside>

      {/* Collapse/expand toggle — desktop only, always reachable at the sidebar's edge */}
      <button
        onClick={toggleCollapsed}
        className={`
          hidden md:flex items-center justify-center
          absolute top-1/2 -translate-y-1/2 z-30
          w-5 h-12 rounded-r-(--radius-md)
          bg-(--color-card) border border-l-0 border-(--color-border) shadow-soft
          text-(--color-muted-foreground) hover:text-(--color-primary) hover:bg-(--color-muted)
          transition-all duration-300 ease-in-out cursor-pointer
          ${collapsed ? 'left-0' : 'left-64 lg:left-80'}
        `}
        title={collapsed ? 'Show conversations' : 'Hide conversations'}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Detail pane — always full width on md+ since the sidebar no longer takes flex space */}
      <div
        className={`flex-1 min-w-0 flex-col overflow-hidden ${
          hasSelectedConversation ? 'flex' : 'hidden md:flex'
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
}