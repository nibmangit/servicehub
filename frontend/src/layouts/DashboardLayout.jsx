import { Outlet } from "react-router-dom";

import { AppSidebar } from "../components/AppSidebar";
import DashboardHeader from "../components/DashboardHeader";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen">

      <DashboardHeader />

      <div className="mx-auto flex w-full max-w-[1400px]">

        {/* Desktop Sidebar */}
        <AppSidebar />

        {/* Page Content */}
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>

      </div>

    </div>
  );
}