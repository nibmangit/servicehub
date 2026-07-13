import { Outlet } from "react-router-dom";
import { SidebarProvider } from "../components/ui/Sidebar";
import { AppSidebar } from "../components/AppSidebar";

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="mx-auto flex w-full max-w-[1400px]">
        <AppSidebar />

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}