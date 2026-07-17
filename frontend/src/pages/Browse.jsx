"use client";

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";
import { Slider } from "../components/ui/Slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../components/ui/Sheet";
import { ServiceCard } from "../components/ServiceCard";
import { categories, priceNumber, services } from "../lib/mock-data";
import { useI18n } from "../lib/i18n";
import { FilterSection } from "../components/browse/FilterSection";

export function Browse() {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [sort, setSort] = useState("recommended");
  const [price, setPrice] = useState([20000]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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

  const resetFilters = () => {
    setCat("all");
    setQ("");
    setPrice([20000]);
    setSort("recommended");
    setIsSheetOpen(false);
  };

  const filterProps = { t, cat, setCat, price, setPrice, services, resetFilters };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Mobile Filter Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle>{t("browse.filters")}</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterSection {...filterProps} />
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex flex-col gap-2">
        <nav className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">{t("browse.home")}</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Browse</span>
        </nav>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("browse.title")}</h1>
      </div>

      <div className="mt-6 grid gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft sm:grid-cols-[1fr_auto_auto]">
        <label className="flex items-center gap-2 rounded-xl bg-secondary/60 px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("browse.searchPlaceholder")} className="border-0 bg-transparent shadow-none focus-visible:ring-0" />
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
          </SelectContent>
        </Select>
        <Button variant="outline" className="sm:hidden" onClick={() => setIsSheetOpen(true)}>
          <SlidersHorizontal className="h-4 w-4" /> {t("browse.filters")}
        </Button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-5 shadow-soft">
            <FilterSection {...filterProps} />
          </div>
        </aside>

        <div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((s) => <ServiceCard key={s.id} service={s} />)}
          </div>
        </div>
      </div>
    </div>
  );
}