import { Link } from "react-router-dom"; 
import { BadgeCheck, Clock, Heart, MapPin, Star } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatETB } from "@/lib/mock-data";

export function ServiceCard({ service }) {
  return (
    <Link
      to={`/services/${service.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevated"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={service._cover}
          alt={service.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 rounded-full bg-background/95 px-2.5 py-1 text-xs font-medium shadow-soft backdrop-blur">
          {service._categoryName}
        </div>
        <Button
          size="icon"
          variant="secondary"
          className="absolute right-3 top-3 h-9 w-9 rounded-full bg-background/95 shadow-soft backdrop-blur hover:bg-background"
          aria-label="Save"
          onClick={(e) => {
            e.preventDefault(); // Prevents clicking the card link
          }}
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src={service._providerAvatar} alt={service._providerName} />
            <AvatarFallback>{service._providerName.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <span className="truncate text-sm text-muted-foreground">
            {service._providerName}
          </span>
          {service._providerVerified && (
            <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />
          )}
        </div>

        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-foreground group-hover:text-primary">
          {service.title}
        </h3>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-warning text-warning" />
            <span className="font-medium text-foreground">{service.average_rating.toFixed(1)}</span>
            <span>({service.review_count})</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {service.duration}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {service._city}
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-border pt-3">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
              {service.price_type === "hourly"
                ? "Per hour"
                : service.price_type === "starting"
                ? "Starting from"
                : "Fixed price"}
            </div>
            <div className="text-lg font-semibold tracking-tight">
              {formatETB(service.price)}
            </div>
          </div>
          <span className="text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}