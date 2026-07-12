import { useEffect } from "react";
import clsx from "clsx";

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = "md",
    className = "",
}) {
    // Escape key listener & Body scroll locking
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizes = {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={clsx(
                    "w-full rounded-xl bg-white shadow-xl p-6 transition-transform duration-300 border border-slate-100",
                    "dark:bg-slate-900 dark:border-slate-800 dark:shadow-2xl",
                    sizes[size],
                    className
                )}
            >
                {/* Header Container Row */}
                <div className="flex items-center justify-between mb-5 gap-4">
                    {title && (
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 tracking-tight">
                            {title}
                        </h2>
                    )}

                    <button
                        onClick={onClose}
                        aria-label="Close modal"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 dark:text-slate-500 dark:hover:text-slate-300 dark:hover:bg-slate-800/60 transition-colors duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Main Content Layout Slot */}
                <div className="text-slate-600 dark:text-slate-300 text-sm md:text-base">
                    {children}
                </div>
            </div>
        </div>
    );
}