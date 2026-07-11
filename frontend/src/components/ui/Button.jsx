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
        "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary:
            "bg-blue-600 text-white hover:bg-blue-700",

        secondary:
            "bg-slate-200 text-slate-900 hover:bg-slate-300",

        outline:
            "border border-slate-300 bg-white text-slate-900 hover:bg-slate-100",

        ghost:
            "text-slate-700 hover:bg-slate-100",

        danger:
            "bg-red-600 text-white hover:bg-red-700",
    };

    const sizes = {
        sm: "px-3 py-2 text-sm",
        md: "px-4 py-2.5 text-base",
        lg: "px-6 py-3 text-lg",
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
            {loading ? "Loading..." : children}
        </button>
    );
}
