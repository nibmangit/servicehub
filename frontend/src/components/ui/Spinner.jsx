import clsx from "clsx";

export default function Spinner({
    size = "md",
    className = "",
}) {
    const sizes = {
        sm: "h-4 w-4 border-2",
        md: "h-8 w-8 border-[3px]",
        lg: "h-12 w-12 border-4"
    };

    return (
        <div
            className={clsx(
                "animate-spin rounded-full border-slate-200/40 border-t-blue-600 dark:border-slate-800/60 dark:border-t-blue-500",
                sizes[size],
                className
            )}
            role="status"
            aria-label="Loading"
        />
    );
}