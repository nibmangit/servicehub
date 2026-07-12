import { useState } from "react";
import Button from "../ui/Button";
import OtpCard from "./OtpCard";

export default function ProviderActions() {
  const [accepted, setAccepted] = useState(false);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startOtp, setStartOtp] = useState("");
  const [finishOtp, setFinishOtp] = useState("");

  if (!accepted) {
    return (
      <div className="flex gap-4">
        <Button onClick={() => setAccepted(true)}>Accept</Button>
        <Button variant="danger">Reject</Button>
      </div>
    );
  }

  if (!started) {
    return (
      <OtpCard
        title="Verify Start OTP"
        buttonText="Start Service"
        value={startOtp}
        onChange={(e) => setStartOtp(e.target.value)}
        onSubmit={() => setStarted(true)}
      />
    );
  }

  if (!finished) {
    return (
      <OtpCard
        title="Verify Completion OTP"
        buttonText="Finish Service"
        value={finishOtp}
        onChange={(e) => setFinishOtp(e.target.value)}
        onSubmit={() => setFinished(true)}
      />
    );
  }

  return (
    <div className="rounded-2xl bg-green-100 text-green-700 p-6 font-semibold text-center">
      ✅ Service Completed Successfully
    </div>
  );
}