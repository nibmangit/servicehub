import clsx from "clsx";

export default function Card({
    children,
    className = "",
    padding = true,
    hover = false,
    clickable = false,
    onClick,
    ...props
}) {
    return (
        <div
            onClick={onClick}
            role={clickable ? "button" : undefined}
            tabIndex={clickable ? 0 : undefined}
            onKeyDown={clickable ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick?.(e);
                }
            } : undefined}
            className={clsx(
                "rounded-xl bg-white border border-slate-100 shadow-sm transition-all duration-200",
                "dark:bg-slate-900 dark:border-slate-800/80",
                
                padding && "p-5 md:p-6",

                hover && [
                    "hover:shadow-md hover:-translate-y-0.5",
                    "hover:border-slate-200 dark:hover:border-slate-700/60"
                ],

                clickable && [
                    "cursor-pointer active:scale-[0.99]",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                ],

                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}