import clsx from "clsx";

export default function Badge({
    children,
    variant = "default",
    size = "md",
    className = "",
}) {
    const variants = {
        default:
            "bg-slate-100 text-slate-700 border-slate-200/60 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700/50",

        primary:
            "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/30",

        success:
            "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/30",

        warning:
            "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/30",

        danger:
            "bg-red-50 text-red-700 border-red-100 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/30",

        purple:
            "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/30",

        orange:
            "bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-900/30",
    };

    const sizes = {
        sm: "px-2 py-0.5 text-xs font-semibold tracking-wide",
        md: "px-2.5 py-1 text-xs font-semibold tracking-wide",
        lg: "px-3 py-1.5 text-sm font-medium",
    };

    return (
        <span
            className={clsx(
                "inline-flex items-center rounded-md border font-medium transition-colors duration-200 select-none",
                variants[variant],
                sizes[size],
                className
            )}
        >
            {children}
        </span>
    );
}