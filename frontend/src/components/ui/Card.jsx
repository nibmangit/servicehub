import clsx from "clsx";

export default function Card({
    children,
    className = "",
    padding = true,
    hover = false,
    clickable = false,
    onClick,
}) {
    return (
        <div
            onClick={onClick}
            className={clsx(
                "rounded-2xl bg-white border border-slate-200",
                "shadow-sm",

                padding && "p-5",

                hover &&
                    "transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",

                clickable &&
                    "cursor-pointer",

                className
            )}
        >
            {children}
        </div>
    );
}