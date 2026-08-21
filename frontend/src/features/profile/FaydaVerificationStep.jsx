import React, { useState } from 'react';
import { ShieldCheck, RefreshCw, ArrowRight } from 'lucide-react';
import { profileApi } from '../../services/profileApi';

export default function FaydaVerificationStep({ onVerified }) {
  const [fin, setFin] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingFin, setFetchingFin] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false); // Track if FIN was already fetched
  const [error, setError] = useState('');
 
  const handleFetchTestFin = async () => {
    setFetchingFin(true);
    setError('');
    try {  
      const res = await profileApi.getRandomFin(); 
      setFin(res.fin);
      setHasGenerated(true); // Disable the button after successful generation
    } catch (err) {
      console.error("Failed to fetch test FIN", err);
      setError('Could not retrieve test FIN. Please try again.');
    } finally {
      setFetchingFin(false);
    }
  };

  const handleVerifyFayda = async (e) => {
    e.preventDefault();
    if (!fin.trim()) {
      setError('Please provide a FIN to verify.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await profileApi.verifyFayda({ fin });
      onVerified(); // Move to the application form
    } catch (err) {
      console.error("Fayda verification failed", err);
      setError(err.response?.data?.detail || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-(--color-card) p-8 rounded-(--radius-2xl) border border-(--color-border) shadow-elevated space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-(--color-primary)/10 text-(--color-primary) flex items-center justify-center mx-auto mb-4">
          <ShieldCheck size={24} />
        </div>
        <h2 className="text-2xl font-bold text-(--color-foreground)">Fayda ID Verification</h2>
        <p className="text-sm text-(--color-muted-foreground)">
          To become a service provider, you must first verify your identity using the national Fayda simulation system.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-(--radius-md) bg-(--color-destructive)/10 text-(--color-destructive) text-sm border border-(--color-destructive)/20">
          {error}
        </div>
      )}

      <form onSubmit={handleVerifyFayda} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-(--color-foreground)">
            Fayda Identification Number (FIN)
          </label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={fin}
              onChange={(e) => setFin(e.target.value)}
              placeholder="e.g. ET100004"
              className="flex-1 px-4 py-2.5 rounded-(--radius-md) bg-(--color-input) border border-(--color-border) text-(--color-foreground) text-sm focus:outline-none focus:ring-2 focus:ring-(--color-ring)"
            />
            <button
              type="button"
              onClick={handleFetchTestFin}
              disabled={fetchingFin || hasGenerated}
              className="px-4 py-2 bg-(--color-secondary) text-(--color-foreground) rounded-(--radius-md) font-medium text-sm hover:bg-(--color-muted) transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={14} className={fetchingFin ? 'animate-spin' : ''} />
              {fetchingFin ? 'Loading...' : hasGenerated ? 'FIN Generated' : 'Get Test FIN'}
            </button>
          </div>
          <span className="text-xs text-(--color-muted-foreground) mt-1.5 block">
            {hasGenerated ? 'Test FIN generated successfully.' : 'Click "Get Test FIN" to auto-fill a simulation identification number.'}
          </span>
        </div>

        <button 
          type="submit"
          disabled={loading || !fin}
          className="w-full mt-4 px-6 py-3 bg-(--color-primary) text-(--color-primary-foreground) rounded-(--radius-md) font-medium text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-soft disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'Verify & Continue'} <ArrowRight size={16} />
        </button>
      </form>
    </div>
  );
}