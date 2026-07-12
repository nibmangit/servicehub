import clsx from "clsx";

export default function Input({
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    className = "",
    ...props
}) {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {label}
                </label>
            )}

            <div className="relative">
                {leftIcon && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 flex items-center justify-center">
                        {leftIcon}
                    </span>
                )}

                <input
                    {...props}
                    className={clsx(
                        "w-full rounded-xl border border-slate-200 bg-white",
                        "px-4 py-2.5",
                        "text-slate-900 placeholder:text-slate-400",
                        "outline-none transition-all duration-200",
                        "focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",
                        "disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed",
                        
                        // Dark Mode Variant Support
                        "dark:border-slate-700 dark:bg-slate-900",
                        "dark:text-slate-100 dark:placeholder:text-slate-500",
                        "dark:focus:border-blue-500 dark:focus:ring-blue-500/20",
                        "dark:disabled:bg-slate-800/50 dark:disabled:text-slate-500",
                        
                        leftIcon && "pl-10",
                        rightIcon && "pr-10",
                        error && "border-red-500 focus:border-red-500 focus:ring-red-500/10 dark:border-red-500 dark:focus:border-red-500 dark:focus:ring-red-500/20",
                        className
                    )}
                />

                {rightIcon && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 flex items-center justify-center">
                        {rightIcon}
                    </span>
                )}
            </div>

            {error ? (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            ) : helperText ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">{helperText}</p>
            ) : null}
        </div>
    );
}