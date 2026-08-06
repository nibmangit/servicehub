import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowRight, CheckCircle2, Sparkles, Copy, Check } from "lucide-react";
import { toast } from "sonner";

import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { identityApi } from "../api/identityApi";

export default function VerifyFayda() {
  const navigate = useNavigate();
  const [fin, setFin] = useState("");
  const [sampleFin, setSampleFin] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  // Fetch a sample random FIN from the backend for simulation convenience
  useEffect(() => {
    const fetchSampleFin = async () => {
      try {
        const data = await identityApi.getRandomTestFin();
        if (data?.fin) {
          setSampleFin(data.fin);
        }
      } catch (err) {
        console.error("Could not fetch test FIN:", err);
      }
    };
    fetchSampleFin();
  }, []);

  const handleCopySample = () => {
    if (sampleFin) {
      navigator.clipboard.writeText(sampleFin);
      setCopied(true);
      toast.success("Sample FIN copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await identityApi.verifyFayda(fin.trim());
      toast.success("Identity verified successfully via Fayda!");
      // Redirect to the provider application page
      navigate("/become-provider");
    } catch (err) {
      const errData = err.response?.data;
      if (errData) {
        const firstKey = Object.keys(errData)[0];
        const serverError = Array.isArray(errData[firstKey])
          ? errData[firstKey][0]
          : errData[firstKey];
        setError(serverError || "Verification failed. Check your FIN number.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary mb-3">
          <ShieldCheck className="h-3.5 w-3.5" /> National ID Gateway
        </span>
        <h1 className="text-2xl font-bold tracking-tight">Fayda Identity Verification</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Verify your identity to unlock ServiceHub professional provider features.
        </p>
      </div>

      {/* Simulation Helper Box */}
      {sampleFin && (
        <div className="mb-6 p-4 rounded-2xl border border-primary/20 bg-primary/5 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-4 w-4" /> Simulation Test Helper
          </div>
          <p className="text-xs text-muted-foreground">
            Since this is a simulation, you can use this active test FIN from your database:
          </p>
          <div className="flex items-center justify-between bg-card border border-border rounded-xl px-3 py-2">
            <span className="font-mono text-sm font-bold tracking-wider">{sampleFin}</span>
            <Button type="button" variant="ghost" size="sm" onClick={handleCopySample} className="h-7 px-2 text-xs">
              {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
              <span className="ml-1">{copied ? "Copied" : "Copy"}</span>
            </Button>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-3 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-xl">
          {error}
        </div>
      )}

      {/* Verification Form */}
      <form onSubmit={handleVerify} className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="fin">Fayda Identification Number (FIN) *</Label>
          <Input
            id="fin"
            type="text"
            required
            placeholder="e.g. ETH-1234-5678"
            value={fin}
            onChange={(e) => setFin(e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full mt-2" size="lg" disabled={loading}>
          {loading ? "Verifying with Fayda..." : "Verify Identity"} <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </form>
    </div>
  );
}