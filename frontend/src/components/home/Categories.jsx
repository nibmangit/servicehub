import { Link } from "react-router-dom";
import { useI18n } from "../../lib/i18n";
import { ArrowRight } from "lucide-react";
import { categories } from "../../lib/mock-data";


export function Categories(){
    const { t } = useI18n()

    return(
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {t("sec.categories")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("sec.categoriesSub")}
            </p>
          </div>
          <Link
            to="/browse"
            className="hidden shrink-0 text-sm font-medium text-primary hover:underline sm:inline-flex sm:items-center sm:gap-1"
          >
            {t("sec.viewAll")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/browse"
              className="group flex flex-col items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elevated"
            >
              <span className={`grid h-11 w-11 place-items-center rounded-xl ${c._tint}`}>
                <c._icon className="h-5 w-5" />
              </span>
              <div>
                <div className="text-sm font-semibold group-hover:text-primary">
                  {c.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {c._count} services
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    );
}