import clsx from "clsx";

export default function Skeleton({
    className = "",
    variant = "text" // 'text', 'avatar', 'card' for helper configurations if needed
}) {
    const variants = {
        text: "rounded-md h-4 w-full",
        avatar: "rounded-full shrink-0",
        card: "rounded-xl w-full",
        none: ""
    };

    return (
        <div
            className={clsx(
                "animate-pulse bg-slate-200 dark:bg-slate-800/80",
                variants[variant],
                className
            )}
            aria-hidden="true"
        />
    );
}