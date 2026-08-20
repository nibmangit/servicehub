import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-(--color-background)">
      <Header variant="public" />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <footer className="border-t border-(--color-border) bg-(--color-card) py-8 mt-auto">
        <div className="max-w-[1600px] mx-auto px-4 text-center text-sm text-(--color-muted-foreground)">
          © {new Date().getFullYear()} ServiceHub. All rights reserved.
        </div>
      </footer>
    </div>
  );
}