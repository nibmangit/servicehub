import { Camera } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/Avatar";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";
import { Textarea } from "../components/ui/Textarea";
import { currentProfile, languages } from "../lib/mock-data";

export default function Profile() {
  const p = currentProfile;

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        How you appear to other users on ServiceHub.
      </p>

      <form
        className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]"
        onSubmit={(e) => {
          // Simulated — no network call
          e.preventDefault();
          toast.success("Profile updated");
        }}
      >
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="relative mx-auto w-fit">
            <Avatar className="h-28 w-28">
              <AvatarImage src={p.avatar} />
              <AvatarFallback>{p.full_name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <button
              type="button"
              className="absolute bottom-1 right-1 grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground shadow-elevated"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4 text-center">
            <div className="font-semibold">{p.full_name}</div>
            <div className="text-xs text-muted-foreground">{p.email}</div>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="space-y-1.5">
            <Label htmlFor="full_name">Full name</Label>
            <Input id="full_name" name="full_name" defaultValue={p.full_name} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" defaultValue={p.phone} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" defaultValue={p.city} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" name="bio" rows={4} defaultValue={p.bio} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Language</Label>
              <Select defaultValue="en">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((l) => (
                    <SelectItem key={l.code} value={l.code}>
                      {l.native}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Timezone</Label>
              <Select defaultValue="EAT">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EAT">EAT — Addis Ababa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button type="button" variant="ghost">
              Cancel
            </Button>
            <Button type="submit">Save changes</Button>
          </div>
        </div>
      </form>
    </div>
  );
}