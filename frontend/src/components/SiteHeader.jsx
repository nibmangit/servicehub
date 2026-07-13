import { Link } from "react-router-dom"; 
import { Bell, Globe, LayoutDashboard, Menu, Search, ShieldCheck } from "lucide-react";

import { Button } from "./ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { LANGS, useI18n } from "../lib/i18n";

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 shrink-0">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft">
        <ShieldCheck className="h-5 w-5" strokeWidth={2.4} />
      </span>
      <span className="text-lg font-semibold tracking-tight">
        Service<span className="text-primary">Hub</span>
      </span>
    </Link>
  );
}

function LanguageMenu() {
  const { lang, setLang } = useI18n();
  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{current.native}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {LANGS.map((l) => (
          <DropdownMenuItem key={l.code} onClick={() => setLang(l.code)}>
            <span className="flex-1">{l.native}</span>
            <span className="text-xs text-muted-foreground">{l.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SiteHeader() {
  const { t } = useI18n();
  const nav = [
    { to: "/browse", label: t("nav.browse") },
    { to: "/browse", label: t("nav.categories") },
    { to: "/browse", label: t("nav.how") },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.label}
              to={n.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <Link
            to="/browse"
            className="hidden md:inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-sm text-muted-foreground shadow-soft transition-colors hover:text-foreground w-56"
          >
            <Search className="h-4 w-4" />
            <span>{t("nav.searchPlaceholder")}</span>
          </Link>

          <Button asChild variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label={t("nav.notifications")}>
            <Link to="/notifications"><Bell className="h-5 w-5" /></Link>
          </Button>

          <ThemeToggle />
          <LanguageMenu />

          <Button asChild variant="ghost" size="icon" className="hidden lg:inline-flex" aria-label={t("nav.dashboard")}>
            <Link to="/dashboard"><LayoutDashboard className="h-5 w-5" /></Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link to="/login">{t("nav.login")}</Link>
          </Button>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to="/become-provider">{t("nav.becomeProvider")}</Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label={t("nav.menu")}>
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>{t("nav.menu")}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-1">
                {nav.map((n) => (
                  <Link
                    key={n.label}
                    to={n.to}
                    className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-secondary"
                  >
                    {n.label}
                  </Link>
                ))}
                <div className="my-3 h-px bg-border" />
                <Button asChild variant="outline" className="w-full justify-center">
                  <Link to="/login">{t("nav.login")}</Link>
                </Button>
                <Button asChild className="mt-2 w-full justify-center">
                  <Link to="/become-provider">{t("nav.becomeProvider")}</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}