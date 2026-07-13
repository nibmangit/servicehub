import { Link } from "react-router-dom"; 
import { ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useI18n();
  const columns = [
    {
      title: t("foot.marketplace"),
      links: [
        { label: t("nav.browse"), to: "/browse" },
        { label: "Top providers", to: "/browse" },
        { label: t("nav.categories"), to: "/browse" },
        { label: t("nav.becomeProvider"), to: "/register" },
      ],
    },
    {
      title: t("foot.company"),
      links: [
        { label: "About", to: "/" },
        { label: "Careers", to: "/" },
        { label: "Press", to: "/" },
        { label: "Contact", to: "/" },
      ],
    },
    {
      title: t("foot.support"),
      links: [
        { label: "Help center", to: "/" },
        { label: "Trust & safety", to: "/" },
        { label: "Terms", to: "/" },
        { label: "Privacy", to: "/" },
      ],
    },
  ];

  return (
    <footer className="border-t border-border/70 bg-card mt-24">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
                <ShieldCheck className="h-5 w-5" strokeWidth={2.4} />
              </span>
              <span className="text-lg font-semibold tracking-tight">
                Service<span className="text-primary">Hub</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t("foot.tagline")}
            </p>
          </div>

          {columns.map((c) => (
            <div key={c.title}>
              <h4 className="text-sm font-semibold">{c.title}</h4>
              <ul className="mt-4 space-y-3">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>{t("foot.rights", { y: new Date().getFullYear() })}</p>
          <p className="flex flex-wrap gap-x-3 gap-y-1">
            <span>English</span>
            <span>·</span>
            <span>አማርኛ</span>
            <span>·</span>
            <span>Afaan Oromoo</span>
            <span>·</span>
            <span>ትግርኛ</span>
          </p>
        </div>
      </div>
    </footer>
  );
}