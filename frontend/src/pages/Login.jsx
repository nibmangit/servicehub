import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Checkbox } from "../components/ui/Checkbox";
import { useI18n } from "../lib/i18n";

export default function Login() {
  const { t } = useI18n();

  return (
    <AuthShell
      title={t("auth.welcome")}
      subtitle={t("auth.welcomeSub")}
      footer={
        <>
          {t("auth.noAccount")}{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            {t("auth.createOne")}
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-1.5">
          <Label htmlFor="email">{t("auth.email")}</Label>
          <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t("auth.password")}</Label>
            <Link to="/login" className="text-xs font-medium text-primary hover:underline">
              {t("auth.forgot")}
            </Link>
          </div>
          <Input id="password" type="password" placeholder="••••••••" autoComplete="current-password" />
        </div>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <Checkbox id="remember" /> {t("auth.remember")}
        </label>
        <Button type="submit" className="w-full" size="lg">{t("auth.login")}</Button>
        <div className="relative py-2 text-center text-xs uppercase tracking-wide text-muted-foreground">
          <span className="relative z-10 bg-card px-3">{t("auth.or")}</span>
          <span aria-hidden className="absolute inset-x-0 top-1/2 h-px bg-border" />
        </div>
        <Button type="button" variant="outline" className="w-full" size="lg">
          <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
            <path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.7h3.5c2-1.9 3.3-4.7 3.3-8Z"/>
            <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.5-2.7c-1 .7-2.2 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2v2.9A11 11 0 0 0 12 23Z"/>
            <path fill="#FBBC05" d="M5.7 14.1a6.6 6.6 0 0 1 0-4.2V7H2a11 11 0 0 0 0 10l3.7-2.9Z"/>
            <path fill="#EA4335" d="M12 5.4c1.6 0 3 .6 4.1 1.6L19.2 4A11 11 0 0 0 2 7l3.7 2.9C6.6 7.3 9.1 5.4 12 5.4Z"/>
          </svg>
          {t("auth.google")}
        </Button>
      </form>
    </AuthShell>
  );
}

export function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
            {children}
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
        </div>
      </div>

      <aside className="relative hidden overflow-hidden bg-primary lg:block">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,theme(colors.accent/40),transparent_50%)]"
        />
        <div className="relative flex h-full flex-col justify-between p-12 text-primary-foreground">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-foreground/15 backdrop-blur">
              <ShieldCheck className="h-5 w-5" strokeWidth={2.4} />
            </span>
            ServiceHub
          </div>
          <div>
            <p className="text-2xl font-semibold leading-snug sm:text-3xl">
              "ServiceHub doubled my monthly jobs in three months."
            </p>
            <p className="mt-4 text-primary-foreground/80">
              Dawit Tesfaye · Plumber · Addis Ababa
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm text-primary-foreground/85">
            <div>
              <div className="text-2xl font-bold">12.4k+</div>
              <div className="text-xs">Providers</div>
            </div>
            <div>
              <div className="text-2xl font-bold">184k</div>
              <div className="text-xs">Jobs done</div>
            </div>
            <div>
              <div className="text-2xl font-bold">4.9★</div>
              <div className="text-xs">Avg rating</div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}