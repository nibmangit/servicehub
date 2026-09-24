import React, { useState } from 'react';
import {
  LayoutDashboard, Users, FileCheck, Wrench, ClipboardList, Star, Tags, IdCard,
} from 'lucide-react';
import AdminOverview from './sections/AdminOverview';
import AdminApplications from './sections/AdminApplications';

const SECTIONS = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'applications', label: 'Provider Applications', icon: FileCheck },
  { key: 'users', label: 'Users', icon: Users },
  { key: 'services', label: 'Services', icon: Wrench },
  { key: 'requests', label: 'Requests', icon: ClipboardList },
  { key: 'reviews', label: 'Reviews', icon: Star },
  { key: 'categories', label: 'Categories & Skills', icon: Tags },
  { key: 'identity', label: 'Identity Verifications', icon: IdCard },
];

export default function AdminPage() {
  const [active, setActive] = useState('overview');

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-2xl font-bold text-(--color-foreground)">Admin</h1>
        <p className="text-(--color-muted-foreground) mt-1">Platform management and moderation.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 border-b border-(--color-border)">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.key}
              onClick={() => setActive(s.key)}
              className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
                active === s.key
                  ? 'border-(--color-primary) text-(--color-primary)'
                  : 'border-transparent text-(--color-muted-foreground) hover:text-(--color-foreground)'
              }`}
            >
              <Icon size={16} /> {s.label}
            </button>
          );
        })}
      </div>

      <div>
        {active === 'overview' && <AdminOverview />}
        {active === 'applications' && <AdminApplications />}
        {/* Remaining sections wired in as we build each module */}
      </div>
    </div>
  );
}