import { Menu } from "lucide-react";

import { Button } from "../ui/Button";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../ui/Sheet";

import SidebarContent from "../SidebarContent";


export default function DashboardHeader() {
  return (
    <header className="flex h-10 items-center border-b border-border bg-background px-4 lg:hidden">

      <Sheet>

        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>


        <SheetContent
          side="left"
          className="w-64 p-0"
        >
          <SidebarContent />
        </SheetContent>


      </Sheet>

    </header>
  );
}