import clsx from "clsx";

export default function Button({
    children,
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    className = "",
    type = "button",
    ...props
}) {
    const base =
        "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-sm";

    const variants = {
        primary:
            "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600",

        secondary:
            "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",

        outline:
            "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",

        ghost:
            "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 shadow-none",

        danger:
            "bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm gap-1.5",
        md: "px-4 py-2.5 text-base gap-2",
        lg: "px-6 py-3 text-lg gap-2.5",
    };

    return (
        <button
            type={type}
            disabled={disabled || loading}
            className={clsx(
                base,
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {loading && (
                <svg 
                    className="animate-spin h-4 w-4 text-current" 
                    fill="none" 
                    viewBox="0 0 24 24"
                >
                    <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                    />
                    <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            )}
            {children}
        </button>
    );
}