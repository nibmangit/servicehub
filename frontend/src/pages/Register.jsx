import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { AuthShell } from "./Login";
import { useI18n } from "../lib/i18n";

export default function Register() {
  const { t } = useI18n();

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
    >
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="first">{t("auth.firstName")}</Label>
            <Input id="first" placeholder="Selam" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="last">{t("auth.lastName")}</Label>
            <Input id="last" placeholder="Bekele" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">{t("auth.email")}</Label>
          <Input id="email" type="email" placeholder="you@example.com" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">{t("auth.password")}</Label>
          <Input id="password" type="password" placeholder="At least 8 characters" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirm">{t("auth.confirm")}</Label>
          <Input id="confirm" type="password" placeholder="Re-enter password" />
        </div>
        <p className="text-xs text-muted-foreground">
          {t("auth.terms")}
        </p>
        <Button type="submit" className="w-full" size="lg">{t("auth.create")}</Button>
      </form>
    </AuthShell>
  );
}