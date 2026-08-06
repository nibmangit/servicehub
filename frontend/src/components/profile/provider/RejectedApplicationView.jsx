import { Link } from "react-router-dom";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "../../ui/Button";

export default function RejectedApplicationView({ rejectionReason, onReapply }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center animate-fadeIn">
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-destructive/10 text-destructive">
        <AlertCircle className="h-10 w-10" />
      </div>

      <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
        Application Not Approved
      </span>

      <h1 className="mt-4 text-2xl font-bold tracking-tight">Application Update</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Your provider application was reviewed and could not be approved at this time.
      </p>

      {rejectionReason && (
        <div className="mt-6 p-4 rounded-xl bg-destructive/5 border border-destructive/15 text-left shadow-soft">
          <p className="text-xs font-semibold text-destructive uppercase tracking-wider">Reason provided:</p>
          <p className="mt-1 text-sm text-foreground/90">{rejectionReason}</p>
        </div>
      )}

      <div className="mt-8 flex justify-center gap-3">
        <Button onClick={onReapply} size="lg">
          <RefreshCw className="h-4 w-4 mr-2" /> Edit & Re-apply
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/profile">Back to Profile</Link>
        </Button>
      </div>
    </div>
  );
}