import { Link } from "react-router-dom";
import { Edit3, Eye, MoreVertical, Plus, Trash2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/Avatar";
import { Button } from "../components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/DropdownMenu";
import { Switch } from "../components/ui/Switch";
import { services, formatETB } from "../lib/mock-data";

export default function MyServices() {
  const mine = services.slice(0, 5);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My services</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage listings, pricing, and availability.
          </p>
        </div>
        <Button asChild>
          <Link to="/services/new">
            <Plus className="h-4 w-4" />
            New service
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Active listings", value: "5" },
          { label: "Total bookings", value: "184" },
          { label: "Avg. rating", value: "4.9 ★" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className="mt-1 text-2xl font-bold">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-4 text-left font-semibold">Service</th>
              <th className="p-4 text-left font-semibold">Category</th>
              <th className="p-4 text-left font-semibold">Price</th>
              <th className="p-4 text-left font-semibold">Reviews</th>
              <th className="p-4 text-left font-semibold">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mine.map((s) => (
              <tr key={s.id} className="hover:bg-secondary/30">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <img src={s._cover} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <Link
                        to={`/services/${s.id}`}
                        className="line-clamp-1 font-medium hover:text-primary"
                      >
                        {s.title}
                      </Link>
                      <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={s._providerAvatar} />
                          <AvatarFallback>{s._providerName[0]}</AvatarFallback>
                        </Avatar>
                        {s._providerName}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground">{s._categoryName}</td>
                <td className="p-4 font-semibold">{formatETB(s.price)}</td>
                <td className="p-4 text-muted-foreground">
                  {s.review_count} · {s.average_rating}★
                </td>
                <td className="p-4">
                  <Switch defaultChecked={s.is_active} />
                </td>
                <td className="p-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Actions">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/browse/${s.id}`}>
                          <Eye className="h-4 w-4" />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}