import SidebarContent from "./SidebarContent";

export function AppSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-card lg:block">
      <SidebarContent />
    </aside>
  );
}