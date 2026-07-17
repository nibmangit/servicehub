import { Link } from "react-router-dom";
import { useI18n } from "../../lib/i18n";
import { ServiceCard } from "../ServiceCard";
import { ArrowRight } from "lucide-react";


export function Featured({featured}){
    const { t } = useI18n()
    return(
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between gap-4">
                    <div>
                    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        {t("sec.featured")}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {t("sec.featuredSub")}
                    </p>
                    </div>
                    <Link
                    to="/browse"
                    className="hidden shrink-0 text-sm font-medium text-primary hover:underline sm:inline-flex sm:items-center sm:gap-1"
                    >
                    {t("sec.viewAll")} <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
        
                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {featured.map((s) => (
                    <ServiceCard key={s.id} service={s} />
                    ))}
            </div>
        </section>
    );
}