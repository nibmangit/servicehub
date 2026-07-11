import clsx from "clsx";

export default function Badge({
    children,
    variant = "default",
    size = "md",
    className = "",
}) {
    const variants = {
        default:
            "bg-slate-100 text-slate-700",

        primary:
            "bg-blue-100 text-blue-700",

        success:
            "bg-green-100 text-green-700",

        warning:
            "bg-yellow-100 text-yellow-700",

        danger:
            "bg-red-100 text-red-700",

        purple:
            "bg-purple-100 text-purple-700",

        orange:
            "bg-orange-100 text-orange-700",
    };


    const sizes = {
        sm:
            "px-2 py-0.5 text-xs",

        md:
            "px-3 py-1 text-sm",

        lg:
            "px-4 py-1.5 text-base",
    };


    return (
        <span
            className={clsx(
                "inline-flex items-center rounded-full font-medium",
                variants[variant],
                sizes[size],
                className
            )}
        >
            {children}
        </span>
    );
}