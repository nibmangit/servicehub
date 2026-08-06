import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Button } from "../../ui/Button";

export default function ApprovedApplicationView() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center animate-fadeIn">
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-accent-soft text-accent">
        <CheckCircle2 className="h-10 w-10" />
      </div>
      <h1 className="mt-6 text-2xl font-bold tracking-tight">You are a Verified Provider!</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Your provider application has already been approved. You can manage your jobs and settings from your dashboard.
      </p>
      <div className="mt-8 flex justify-center gap-2">
        <Button asChild>
          <Link to="/dashboard">Go to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}