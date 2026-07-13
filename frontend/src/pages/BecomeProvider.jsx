import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BadgeCheck, CheckCircle2, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Textarea } from "../components/ui/Textarea";

export default function BecomeProvider() {
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-accent-soft text-accent">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="mt-6 text-2xl font-bold tracking-tight">Application received!</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account has been upgraded to Service Provider. Complete your profile so customers can find you.
        </p>
        <div className="mt-8 flex justify-center gap-2">
          <Button asChild>
            <Link to="/dashboard">Go to dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/profile">Complete profile</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
          <BadgeCheck className="h-3.5 w-3.5" /> For professionals
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Become a ServiceHub provider
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Reach thousands of customers across Ethiopia. It's free to join.
        </p>
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        {[
          { icon: Users, title: "12,400+ pros", desc: "Join the largest network of Ethiopian professionals." },
          { icon: TrendingUp, title: "2× more jobs", desc: "Providers on ServiceHub earn 2× more on average." },
          { icon: BadgeCheck, title: "Free verification", desc: "Get your verified badge in 24 hours." },
        ].map((p) => (
          <div key={p.title} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
              <p.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-semibold">{p.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
          </div>
        ))}
      </div>

      <form
        className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          setDone(true);
          toast.success("Account upgraded to Service Provider");
        }}
      >
        <h2 className="text-lg font-semibold">Tell us about yourself</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Share your skills and experience so customers know what you can do.
        </p>
        <div className="mt-6 grid gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="skills">Skills</Label>
            <Input id="skills" name="skills" required placeholder="e.g. React, Python, Design" />
            <p className="text-xs text-muted-foreground">Comma-separated list of specialties.</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="experience">Experience</Label>
            <Textarea
              id="experience"
              name="experience"
              required
              rows={5}
              placeholder="Certifications, past work, years of experience…"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">By continuing you agree to our provider terms.</p>
          <Button type="submit" size="lg">
            Submit application <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}