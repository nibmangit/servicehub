import React, { useState } from 'react';
import AdminCategories from './AdminCategories';
import AdminSkills from './AdminSkills';

export default function AdminCategoriesSkills() {
  const [tab, setTab] = useState('categories');

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-1 bg-(--color-muted) rounded-lg border border-(--color-border) w-fit">
        {['categories', 'skills'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-(--radius-md) capitalize transition-all cursor-pointer ${
              tab === t
                ? 'bg-(--color-primary) text-(--color-primary-foreground) shadow-soft'
                : 'text-(--color-muted-foreground) hover:text-(--color-foreground)'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'categories' ? <AdminCategories /> : <AdminSkills />}
    </div>
  );
}