import { Calendar, MapPin } from "lucide-react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/Dialog";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/Textarea";
import { toast } from "sonner";
import { formatETB } from "../lib/mock-data";

export function RequestServiceModal({
  service,
  open,
  onOpenChange,
}) {
  const [submitting, setSubmitting] = useState(false);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Request this service</DialogTitle>
          <DialogDescription>
            Share a few details and {service._providerName} will get back to you shortly.
          </DialogDescription>
        </DialogHeader>

        <div className="my-2 flex items-center gap-3 rounded-xl border border-border bg-secondary/40 p-3">
          <div className="h-12 w-12 overflow-hidden rounded-lg bg-muted">
            <img src={service._cover} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">{service.title}</div>
            <div className="text-xs text-muted-foreground">
              {service._categoryName} · {formatETB(service.price)}
            </div>
          </div>
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitting(true);
            setTimeout(() => {
              setSubmitting(false);
              onOpenChange(false);
              toast.success("Request sent", 
                {
                description: `${service._providerName} will respond shortly.`,
              });
            }, 700);
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="description">What do you need?</Label>
            <Textarea id="description" name="description" required placeholder="Describe the job in a few sentences…" rows={4} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="preferred_date">Preferred date</Label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="preferred_date" name="preferred_date" type="datetime-local" className="pl-9" required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="address">Address</Label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="address" name="address" placeholder="Neighborhood, city" className="pl-9" required />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Sending…" : "Send request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}