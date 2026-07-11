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
        <div className="relative inline-block">
            {src ? (
                <img
                    src={src}
                    alt={name}
                    className={clsx(
                        "rounded-full object-cover",
                        sizes[size],
                        className
                    )}
                />
            ) : (
                <div
                    className={clsx(
                        "flex items-center justify-center",
                        "rounded-full",
                        "bg-blue-100 text-blue-700",
                        "font-semibold",
                        sizes[size],
                        className
                    )}
                >
                    {getInitials()}
                </div>
            )}

            {online && (
                <span
                    className="
                        absolute
                        bottom-0
                        right-0
                        h-3
                        w-3
                        rounded-full
                        bg-green-500
                        border-2
                        border-white
                    "
                />
            )}
        </div>
    );
}