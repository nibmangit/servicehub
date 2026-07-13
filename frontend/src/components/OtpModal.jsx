import { KeyRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export function OtpModal({
  action,
  open,
  onOpenChange,
  onConfirm,
}) {
  const [code, setCode] = useState("");
  const title = action === "start" ? "Enter start OTP" : "Enter completion OTP";
  const desc =
    action === "start"
      ? "Ask the customer for the 4-digit start code to begin the job."
      : "Ask the customer for the 4-digit completion code to mark this job as done.";

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) setCode("");
        onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <div className="mx-auto mb-2 grid h-12 w-12 place-items-center rounded-full bg-primary-soft text-primary">
            <KeyRound className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">{desc}</DialogDescription>
        </DialogHeader>

        <form
          className="mt-2 space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (code.length !== 4) {
              toast.error("Please enter the 4-digit code");
              return;
            }
            onConfirm?.(code);
            onOpenChange(false);
            setCode("");
            toast.success(
              action === "start" ? "Job started" : "Job marked complete",
            );
          }}
        >
          <div className="flex justify-center">
            <InputOTP maxLength={4} value={code} onChange={setCode}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={code.length !== 4}>
              Confirm
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}