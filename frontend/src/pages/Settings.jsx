import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Switch } from "../components/ui/Switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs";

export default function Settings() {
  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage account, notifications, and privacy.</p>

      <Tabs defaultValue="account" className="mt-6">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="danger">Danger zone</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="mt-6 space-y-6">
          <Card title="Change password">
            <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); toast.success("Password updated"); }}>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="cp">Current password</Label>
                <Input id="cp" type="password" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="np">New password</Label>
                <Input id="np" type="password" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cn">Confirm new</Label>
                <Input id="cn" type="password" />
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <Button type="submit">Update password</Button>
              </div>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card title="Notification preferences">
            <div className="divide-y divide-border">
              {[
                { label: "New booking requests", desc: "Get notified when a customer books your service." },
                { label: "Message alerts", desc: "Ping me when I receive a new chat message." },
                { label: "Review received", desc: "Notify me when a customer leaves a review." },
                { label: "Weekly summary", desc: "Email digest every Monday morning." },
                { label: "Marketing", desc: "Product updates and offers from ServiceHub." },
              ].map((n, i) => (
                <div key={n.label} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                  <div>
                    <div className="text-sm font-medium">{n.label}</div>
                    <div className="text-xs text-muted-foreground">{n.desc}</div>
                  </div>
                  <Switch defaultChecked={i < 3} />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="mt-6">
          <Card title="Privacy">
            <div className="divide-y divide-border">
              {[
                { label: "Show phone to booked customers", checked: true },
                { label: "Show my location on public profile", checked: true },
                { label: "Allow ServiceHub to use my reviews in marketing", checked: false },
              ].map((n) => (
                <div key={n.label} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                  <div className="text-sm font-medium">{n.label}</div>
                  <Switch defaultChecked={n.checked} />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="danger" className="mt-6">
          <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-6">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-destructive/15 text-destructive">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Delete account</h3>
                <p className="mt-1 text-sm text-muted-foreground">Permanently delete your ServiceHub account and all associated data. This cannot be undone.</p>
                <Button variant="destructive" className="mt-4">Delete my account</Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <h3 className="mb-4 text-base font-semibold">{title}</h3>
      {children}
    </section>
  );
}