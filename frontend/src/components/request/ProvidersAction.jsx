import { Button } from "../ui/Button";

export function ProviderActions({ request, onOtp }) {
  switch (request.status) {
    case "PENDING":
      return (
        <>
          <Button size="sm" variant="outline">Reject</Button>
          <Button size="sm">Accept</Button>
        </>
      );
    case "ACCEPTED":
      return <Button size="sm" onClick={() => onOtp("start")}><KeyRound className="h-4 w-4" />Start job</Button>;
    case "IN_PROGRESS":
      return <Button size="sm" onClick={() => onOtp("complete")}><KeyRound className="h-4 w-4" />Mark complete</Button>;
    default:
      return null;
  }
}