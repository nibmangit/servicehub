import { Outlet } from "react-router-dom";
import { AppSidebar } from "../components/app-sidebar";

export default function AppLayout() {
  return (
    <div className="mx-auto flex max-w-[1400px]">
      <AppSidebar />
      <div className="min-w-0 flex-1">
        {/* React Router DOM renders child components right here */}
        <Outlet />
      </div>
    </div>
  );
}