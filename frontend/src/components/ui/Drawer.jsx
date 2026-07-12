import { useEffect } from "react";
import clsx from "clsx";

export default function Drawer({
    isOpen,
    onClose,
    children,
    position = "right",
    title,
    size = "md",
}) {
    // Intercept underlying viewport scrolling while active
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const positions = {
        left: {
            container: "left-0 top-0 bottom-0 h-full",
            open: "translate-x-0",
            close: "-translate-x-full"
        },
        right: {
            container: "right-0 top-0 bottom-0 h-full",
            open: "translate-x-0",
            close: "translate-x-full"
        },
        top: {
            container: "top-0 left-0 right-0 w-full",
            open: "translate-y-0",
            close: "-translate-y-full"
        },
        bottom: {
            container: "bottom-0 left-0 right-0 w-full",
            open: "translate-y-0",
            close: "translate-y-full"
        }
    };

    const sizes = {
        sm: position === "top" || position === "bottom" ? "h-64" : "w-64 max-w-[80vw]",
        md: position === "top" || position === "bottom" ? "h-80" : "w-80 max-w-[85vw]",
        lg: position === "top" || position === "bottom" ? "h-[400px]" : "w-[420px] max-w-[90vw]",
        xl: position === "top" || position === "bottom" ? "h-[550px]" : "w-[600px] max-w-[95vw]",
    };

    return (
        <div 
            className={clsx(
                "fixed inset-0 z-50 transition-opacity duration-300 pointer-events-none",
                isOpen ? "opacity-100 pointer-events-auto" : "opacity-0"
            )}
        >
            {/* Smooth Translucent Glassmorphic Overlay Backdrop */}
            <div
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
            />

            {/* Premium Animated Slidout Panel Body */}
            <div
                className={clsx(
                    "absolute bg-white shadow-2xl p-6 transition-transform duration-300 ease-out border-slate-100 flex flex-col",
                    "dark:bg-slate-900 dark:border-slate-800",
                    position === "left" && "border-r",
                    position === "right" && "border-l",
                    position === "top" && "border-b",
                    position === "bottom" && "border-t",
                    positions[position].container,
                    sizes[size],
                    isOpen ? positions[position].open : positions[position].close
                )}
            >
                {/* Drawer Interior Header */}
                <div className="flex items-center justify-between mb-6 gap-4 shrink-0">
                    {title && (
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 tracking-tight">
                            {title}
                        </h2>
                    )}

                    <button
                        onClick={onClose}
                        aria-label="Close panel"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 dark:text-slate-500 dark:hover:text-slate-300 dark:hover:bg-slate-800/60 transition-colors duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Content Area Container Panel */}
                <div className="flex-1 overflow-y-auto pr-1 -mr-1 custom-scrollbar-sync">
                    {children}
                </div>
            </div>
        </div>
    );
}