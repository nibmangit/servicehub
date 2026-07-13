import { Outlet } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import Toaster from "../components/ui/Toaster";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <Outlet />
      </main>

      <SiteFooter />
      <Toaster />
    </div>
  );
}