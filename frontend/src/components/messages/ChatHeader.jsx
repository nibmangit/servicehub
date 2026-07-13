import { Menu } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { Button } from "../ui/Button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/Sheet";

import ChatSidebar from "./ChatSidebar";

export default function ChatHeader({
  active,
  conversations,
  activeId,
  setActiveId,
}) {
  return (
    <header className="flex items-center gap-3 border-b border-border bg-card px-5 py-3">

      {/* Mobile menu */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-80 p-0">
            <SheetHeader className="border-b p-4">
              <SheetTitle>Messages</SheetTitle>
            </SheetHeader>

            <ChatSidebar
              conversations={conversations}
              activeId={activeId}
              setActiveId={setActiveId} 
            />
          </SheetContent>
        </Sheet>
      </div>

      <div className="relative">
        <Avatar className="h-10 w-10">
          <AvatarImage src={active._avatar} alt={active._name} />
          <AvatarFallback>{active._name.slice(0, 1)}</AvatarFallback>
        </Avatar>

        {active._online && (
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-accent" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold">
          {active._name}
        </div>

        <div className="text-xs text-muted-foreground">
          {active._online ? (
            <span className="text-accent">Online</span>
          ) : (
            "Offline"
          )}{" "}
          · {active._role}
        </div>
      </div>

      <Button variant="outline" size="sm">
        View booking
      </Button>
    </header>
  );
}