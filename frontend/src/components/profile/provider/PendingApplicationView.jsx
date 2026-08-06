import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { Button } from "../../ui/Button";

export default function PendingApplicationView() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center animate-fadeIn">
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-warning/10 text-warning">
        <Clock className="h-10 w-10" />
      </div>
      <h1 className="mt-6 text-2xl font-bold tracking-tight">Application received!</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Your provider application is currently pending admin review. Once approved, your status will update automatically.
      </p>
      <div className="mt-8 flex justify-center gap-2">
        <Button asChild>
          <Link to="/dashboard">Go to dashboard</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/profile">View profile</Link>
        </Button>
      </div>
    </div>
  );
}