import { Link, useLocation } from "react-router-dom";
import {
  Bell,
  Briefcase,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Search,
  Settings,
  ShieldCheck,
  Star,
  User,
  Wrench,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { useI18n } from "../lib/i18n";

function NavItem({ item, active }) {
  return (
    <Link
      to={item.to}
      className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
        active
          ? "bg-primary-soft font-medium text-primary"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}
    >
      <item.icon className="h-4 w-4 shrink-0" />

      <span className="flex-1 truncate">{item.label}</span>

      {item.badge && (
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

function Section({ label, children }) {
  return (
    <div className="mb-6">
      <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>

      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

export default function SidebarContent() {
  const { pathname } = useLocation();
  const { t } = useI18n();

  const isActive = (to) =>
    pathname === to || pathname.startsWith(to + "/");

  const primary = [
    { to: "/dashboard", label: t("side.dashboard"), icon: LayoutDashboard },
    { to: "/browse", label: t("side.browse"), icon: Search },
    { to: "/requests", label: t("side.requests"), icon: Briefcase, badge: 3 },
    { to: "/messages", label: t("side.messages"), icon: MessageCircle, badge: 2 },
    { to: "/notifications", label: t("side.notifications"), icon: Bell, badge: 3 },
  ];

  const provider = [
    { to: "/services", label: t("side.services"), icon: Wrench },
    { to: "/reviews", label: t("side.reviews"), icon: Star },
  ];

  const account = [
    { to: "/profile", label: t("side.profile"), icon: User },
    { to: "/settings", label: t("side.settings"), icon: Settings },
  ];

  return (
    <div className="sticky top-0 flex h-[calc(100vh-4rem)] overflow-y-auto flex-col p-4">

      <Section label={t("side.menu")}>
        {primary.map((item) => (
          <NavItem
            key={item.to}
            item={item}
            active={isActive(item.to)}
          />
        ))}
      </Section>

      <Section label={t("side.provider")}>
        {provider.map((item) => (
          <NavItem
            key={item.to}
            item={item}
            active={isActive(item.to)}
          />
        ))}
      </Section>

      <Section label={t("side.account")}>
        {account.map((item) => (
          <NavItem
            key={item.to}
            item={item}
            active={isActive(item.to)}
          />
        ))}
      </Section>

      <div className="mt-auto rounded-xl border border-border bg-secondary/40 p-3">
        <div className="flex items-center gap-3">

          <Avatar className="h-9 w-9">
            <AvatarImage
              src="https://i.pravatar.cc/120?u=me"
              alt="Me"
            />
            <AvatarFallback>SB</AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 text-sm font-semibold">
              Selam B.
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            </div>

            <div className="truncate text-xs text-muted-foreground">
              Addis Ababa
            </div>
          </div>

          <Link
            to="/"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-background hover:text-foreground"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" />
          </Link>

        </div>
      </div>

    </div>
  );
}