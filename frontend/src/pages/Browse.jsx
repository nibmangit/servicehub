import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";
import { Slider } from "../components/ui/Slider";
import { ServiceCard } from "../components/ServiceCard";
import { categories, priceNumber, services } from "../lib/mock-data";
import { useI18n } from "../lib/i18n";

export function Browse() {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [sort, setSort] = useState("recommended");
  const [price, setPrice] = useState([20000]);

  const filtered = useMemo(() => {
    let list = services.filter((s) => {
      if (q && !s.title.toLowerCase().includes(q.toLowerCase())) return false;
      if (cat !== "all" && s._categorySlug !== cat) return false;
      if (priceNumber(s.price) > price[0]) return false;
      return true;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => priceNumber(a.price) - priceNumber(b.price));
    if (sort === "price-desc") list = [...list].sort((a, b) => priceNumber(b.price) - priceNumber(a.price));
    if (sort === "rating") list = [...list].sort((a, b) => b.average_rating - a.average_rating);
    return list;
  }, [q, cat, sort, price]);

  const activeCategory = categories.find((c) => c.slug === cat);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2">
        <nav className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">{t("browse.home")}</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Browse</span>
          {activeCategory && (
            <>
              <span className="mx-2">/</span>
              <span className="text-foreground">{activeCategory.name}</span>
            </>
          )}
        </nav>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {activeCategory ? activeCategory.name : t("browse.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("browse.count", { n: filtered.length })}
        </p>
      </div>

      <div className="mt-6 grid gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft sm:grid-cols-[1fr_auto_auto]">
        <label className="flex items-center gap-2 rounded-xl bg-secondary/60 px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("browse.searchPlaceholder")}
            className="border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
          {q && (
            <button
              onClick={() => setQ("")}
              className="rounded-md p-1 text-muted-foreground hover:bg-background hover:text-foreground"
              aria-label="Clear"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </label>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="min-w-[180px]">
            <SlidersHorizontal className="h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recommended">{t("browse.sort.rec")}</SelectItem>
            <SelectItem value="price-asc">{t("browse.sort.pAsc")}</SelectItem>
            <SelectItem value="price-desc">{t("browse.sort.pDesc")}</SelectItem>
            <SelectItem value="rating">{t("browse.sort.rating")}</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="sm:hidden">
          <SlidersHorizontal className="h-4 w-4" /> {t("browse.filters")}
        </Button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6 rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div>
              <h3 className="text-sm font-semibold">{t("browse.category")}</h3>
              <div className="mt-3 space-y-1">
                <button
                  onClick={() => setCat("all")}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm transition-colors ${
                    cat === "all"
                      ? "bg-primary-soft text-primary font-medium"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <span>{t("browse.allCategories")}</span>
                  <span className="text-xs">{services.length}</span>
                </button>
                {categories.slice(0, 8).map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => setCat(c.slug)}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm transition-colors ${
                      cat === c.slug
                        ? "bg-primary-soft text-primary font-medium"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <c._icon className="h-4 w-4" />
                      {c.name}
                    </span>
                    <span className="text-xs">{c._count}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-5">
              <h3 className="text-sm font-semibold">{t("browse.maxPrice")}</h3>
              <div className="mt-4">
                <Slider
                  value={price}
                  onValueChange={(v) => setPrice([v[0]])}
                  min={200}
                  max={20000}
                  step={200}
                />
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>ETB 200</span>
                  <span className="font-medium text-foreground">
                    {t("browse.upTo", { n: price[0].toLocaleString() })}
                  </span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setCat("all");
                setQ("");
                setPrice([20000]);
                setSort("recommended");
              }}
            >
              {t("browse.clear")}
            </Button>
          </div>
        </aside>

        <div>
          {filtered.length === 0 ? (
            <EmptyState onReset={() => { setCat("all"); setQ(""); setPrice([20000]); }} />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
          )}

          {filtered.length > 0 && (
            <div className="mt-10 flex items-center justify-between border-t border-border pt-6 text-sm text-muted-foreground">
              <span>{t("browse.showing", { a: filtered.length, b: services.length })}</span>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" disabled>{t("browse.prev")}</Button>
                <Button variant="outline" size="sm">{t("browse.next")}</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onReset }) {
  const { t } = useI18n();
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-border bg-card px-6 py-20 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary-soft text-primary">
        <Search className="h-7 w-7" />
      </div>
      <h3 className="mt-5 text-lg font-semibold">{t("browse.empty.t")}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {t("browse.empty.b")}
      </p>
      <Button className="mt-6" onClick={onReset}>{t("browse.clear")}</Button>
    </div>
  );
}