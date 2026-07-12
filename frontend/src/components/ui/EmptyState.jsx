import clsx from "clsx";

export default function EmptyState({
    title,
    description,
    action,
    icon,
    className = ""
}) {
    return (
        <div
            className={clsx(
                "flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto select-none",
                className
            )}
        >
            {/* Structural Icon Container Layer */}
            {icon ? (
                <div className="mb-4 text-slate-400 dark:text-slate-500 flex items-center justify-center">
                    {icon}
                </div>
            ) : (
                // Default Minimalist Box Icon Outline if no specific asset is passed
                <div className="mb-4 text-slate-300 dark:text-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                        <path d="m3.3 7 8.7 5 8.7-5"/>
                        <path d="M12 22V12"/>
                    </svg>
                </div>
            )}

            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50 tracking-tight">
                {title}
            </h3>

            {description && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                    {description}
                </p>
            )}

            {action && (
                <div className="mt-5 active:scale-[0.99] transition-transform">
                    {action}
                </div>
            )}
        </div>
    );
}