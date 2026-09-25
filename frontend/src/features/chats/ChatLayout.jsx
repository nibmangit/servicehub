import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ConversationSidebar from '../../components/chats/ConversationSidebar';

export default function ChatLayout() {
  const { id } = useParams();
  const hasSelectedConversation = Boolean(id);
  const sidebarRef = useRef(null);

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

  // Close sidebar on desktop when selecting a conversation route
  useEffect(() => {
    if (id) {
      setCollapsed(true);
      localStorage.setItem('chat_sidebar_collapsed', 'true');
    }
  }, [id]);

  // Handle outside click detection (Desktop overlay only)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !collapsed &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setCollapsed(true);
        localStorage.setItem('chat_sidebar_collapsed', 'true');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [collapsed]);

  return (
    <div className="-m-4 md:-m-8 h-[calc(100vh-4rem)] flex overflow-hidden relative">
      {/* Sidebar Wrapper */}
      <div 
        ref={sidebarRef} 
        className={`${
          hasSelectedConversation ? 'hidden md:block' : 'block'
        } w-full md:w-auto h-full`}
      >
        {/* Sidebar element */}
        <aside
          className={`
            w-full h-full flex flex-col overflow-hidden bg-(--color-card)
            md:absolute md:top-0 md:left-0 md:z-20 md:border-r md:border-(--color-border)
            transition-all duration-300 ease-in-out
            ${collapsed ? 'md:w-0 md:border-r-0' : 'md:w-64 lg:w-80 md:shadow-elevated'}
          `}
        >
          <div className="h-full w-full flex-1 min-h-0 overflow-y-auto">
            <ConversationSidebar />
          </div>
        </aside>

        {/* Desktop Toggle Button */}
        <button
          onClick={toggleCollapsed}
          className={`
            hidden md:flex items-center justify-center
            absolute top-1/2 -translate-y-1/2 z-30
            w-7 h-12 rounded-r-xl
            bg-(--color-card) border border-l-0 border-(--color-border) shadow-elevated
            text-(--color-muted-foreground) hover:text-(--color-primary) hover:bg-(--color-muted)
            transition-all duration-300 ease-in-out cursor-pointer
            ${collapsed ? 'left-0' : 'left-64 lg:left-80'}
          `}
          title={collapsed ? 'Open Conversations Sidebar' : 'Hide Conversations Sidebar'}
          aria-label={collapsed ? 'Open Conversations Sidebar' : 'Hide Conversations Sidebar'}
        >
          {collapsed ? (
            <ChevronRight size={18} className="shrink-0" />
          ) : (
            <ChevronLeft size={18} className="shrink-0" />
          )}
        </button>
      </div>

      {/* Main Chat Detail Pane */}
      <div
        className={`flex-1 min-w-0 flex flex-col h-full overflow-hidden ${
          hasSelectedConversation ? 'flex' : 'hidden md:flex'
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
}