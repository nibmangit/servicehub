import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { AuthShell } from "./Login";
import { useI18n } from "../lib/i18n";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { t } = useI18n();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password_confirm: "",
  });

  const handleChange =  (e) =>{
    setFormData({
      ...formData, [e.target.name]: e.target.value
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError("");

    if (formData.password !== formData.password_confirm){
      setError(t("Passwords don't match, please try again.")); 
      return;
    }
    setLoading(true);
    try {
      await register(formData);
      navigate("/login", {
        state: { message: t("Registration successful! Please log in.") },
      });
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData) {
        const firstKey = Object.keys(errorData)[0];
        const serverError = Array.isArray(errorData[firstKey])
          ? errorData[firstKey][0]
          : errorData[firstKey];
        setError(serverError || "Registration failed. Please try again. ");

      }else {
        setError("Unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
      }
    }

  return (
    <AuthShell
      title={t("auth.createTitle")}
      subtitle={t("auth.createSub")}
      footer={
        <>
          {t("auth.haveAccount")}{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            {t("auth.login")}
          </Link>
        </>
      }
      layout="right"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Error Message Alert */}
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="email">{t("auth.email")}</Label>
          <Input id="email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">{t("auth.password")}</Label>
          <Input id="password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="At least 8 characters" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirm">{t("auth.confirm")}</Label>
          <Input id="confirm" type="password" name="password_confirm" value={formData.password_confirm} onChange={handleChange} placeholder="Re-enter password" />
        </div>

        <p className="text-xs text-muted-foreground">
          {t("auth.terms")}
        </p>

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Creating account..." : t("auth.create")}
        </Button>

        <div className="relative py-2 text-center text-xs uppercase tracking-wide text-muted-foreground">
          <span className="relative z-10 bg-card px-3">{t("auth.or")}</span>
          <span aria-hidden className="absolute inset-x-0 top-1/2 h-px bg-border" />
        </div>

        <Button type="button" variant="outline" className="w-full" size="lg">
          <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
            <path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.7h3.5c2-1.9 3.3-4.7 3.3-8Z"/>
            <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.5-2.7c-1 .7-2.2 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2v2.9A11 11 0 0 0 12 23Z"/>
            <path fill="#FBBC05" d="M5.7 14.1a6.6 6.6 0 0 1 0-4.2V7H2a11 11 0 0 0 0 10l3.7-2.9Z"/>
            <path fill="#EA4335" d="M12 5.4c1.6 0 3 .6 4.1 1.6L19.2 4A11 11 0 0 0 2 7l3.7 2.9C6.6 7.3 9.1 5.4 12 5.4Z"/>
          </svg>
          {t("auth.google")}
        </Button>
      </form>
    </AuthShell>
  );
} 