import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { identityApi } from "../../../api/identityApi";

export default function ProviderRouteGuard() {
  const { user } = useAuth();
  const [checking, setChecking] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const checkVerification = async () => {
      if (!user) {
        setChecking(false);
        return;
      }

      // If user is already registered as a provider, let them through
      if (user.is_provider) {
        setIsVerified(true);
        setChecking(false);
        return;
      }

      try {
        const data = await identityApi.checkStatus();
        // If status is verified, allow access
        if (data && data.status === "verified") {
          setIsVerified(true);
        }
      } catch (err) {
        console.error("Verification status check failed:", err);
      } finally {
        setChecking(false);
      }
    };

    checkVerification();
  }, [user]);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-sm text-muted-foreground animate-pulse">Checking identity verification status...</p>
      </div>
    );
  }

  // If not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If verified or already a provider, render the child component (BecomeProvider)
  if (isVerified || user.is_provider) {
    return <Outlet />;
  }

  // Otherwise, redirect to the Fayda simulation page
  return <Navigate to="/verify-identity" replace />;
}