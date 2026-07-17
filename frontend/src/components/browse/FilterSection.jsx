import { Slider } from "@radix-ui/react-slider";
import { categories } from "../../lib/mock-data";
import { Button } from "../ui/Button";

export function FilterSection({ t, cat, setCat, price, setPrice, services, resetFilters }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold">{t("browse.category")}</h3>
        <div className="mt-3 space-y-1">
          <button onClick={() => setCat("all")} className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm ${cat === "all" ? "bg-primary-soft text-primary" : "text-muted-foreground"}`}>
            {t("browse.allCategories")} <span>{services.length}</span>
          </button>
          {categories.slice(0, 8).map((c) => (
            <button key={c.slug} onClick={() => setCat(c.slug)} className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm ${cat === c.slug ? "bg-primary-soft text-primary" : "text-muted-foreground"}`}>
              {c.name} <span>{c._count}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="border-t border-border pt-5">
        <h3 className="text-sm font-semibold">{t("browse.maxPrice")}</h3>
        <Slider className="mt-4" value={price} onValueChange={(v) => setPrice([v[0]])} min={200} max={20000} step={200} />
        <p className="mt-3 text-xs text-muted-foreground">{t("browse.upTo", { n: price[0].toLocaleString() })}</p>
      </div>
      <Button variant="outline" className="w-full" onClick={resetFilters}>{t("browse.clear")}</Button>
    </div>
  );
}