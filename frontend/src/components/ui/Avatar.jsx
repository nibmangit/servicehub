import clsx from "clsx";

export default function Avatar({
    src,
    name = "",
    size = "md",
    online = false,
    className = "",
}) {
    const sizes = {
        sm: "h-8 w-8 text-xs",
        md: "h-12 w-12 text-sm",
        lg: "h-16 w-16 text-lg",
        xl: "h-24 w-24 text-2xl",
    };

    // Dynamically adjust online indicator scale based on avatar size
    const badgeSizes = {
        sm: "h-2.5 w-2.5 border",
        md: "h-3.5 w-3.5 border-2",
        lg: "h-4 w-4 border-2",
        xl: "h-5.5 w-5.5 border-2",
    };

    const getInitials = () => {
        if (!name) return "?";
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    };

    return (
        <div className="relative inline-block select-none">
            {src ? (
                <img
                    src={src}
                    alt={name}
                    className={clsx(
                        "rounded-full object-cover ring-1 ring-slate-100 dark:ring-slate-800",
                        sizes[size],
                        className
                    )}
                />
            ) : (
                <div
                    className={clsx(
                        "flex items-center justify-center rounded-full font-semibold transition-colors duration-200",
                        "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
                        "border border-blue-100 dark:border-blue-900/30",
                        sizes[size],
                        className
                    )}
                >
                    {getInitials()}
                </div>
            )}

            {online && (
                <span className="absolute bottom-0 right-0 flex h-fit w-fit">
                    {/* Pulsing indicator ring */}
                    <span className={clsx(
                        "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                    )} />
                    {/* Solid indicator dot */}
                    <span
                        className={clsx(
                            "relative inline-flex rounded-full bg-emerald-500 border-white dark:border-slate-900",
                            badgeSizes[size]
                        )}
                    />
                </span>
            )}
        </div>
    );
}