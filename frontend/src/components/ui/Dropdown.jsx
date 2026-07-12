import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

export default function Dropdown({
    trigger,
    children,
    position = "right",
    className = "",
}) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") setOpen(false);
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [open]);

    const positions = {
        left: "left-0 origin-top-left",
        right: "right-0 origin-top-right",
    };

    return (
        <div ref={dropdownRef} className="relative inline-block text-left">
            {/* Trigger Container Wrapper Slot */}
            <div
                onClick={() => setOpen(!open)}
                role="button"
                tabIndex={0}
                aria-haspopup="true"
                aria-expanded={open}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setOpen(!open);
                    }
                }}
                className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-lg"
            >
                {trigger}
            </div>

            {/* Menu Panel Container Layer */}
            <div
                className={clsx(
                    "absolute mt-2 z-50 min-w-52 rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl transition-all duration-200 ease-out",
                    "dark:bg-slate-950 dark:border-slate-800/80 dark:shadow-2xl",
                    positions[position],
                    open 
                        ? "opacity-100 scale-100 pointer-events-auto" 
                        : "opacity-0 scale-95 pointer-events-none transform -translate-y-1",
                    className
                )}
            >
                {/* Automatically handle sub-menu element configurations cleanly */}
                <div 
                    className="flex flex-col gap-0.5 text-sm text-slate-700 dark:text-slate-300"
                    onClick={() => setOpen(false)}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}