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
                <label className="text-sm font-medium text-slate-700">
                    {label}
                </label>
            )}

            <div className="relative">
                {leftIcon && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        {leftIcon}
                    </span>
                )}

                <input
                    {...props}
                    className={clsx(
                        "w-full rounded-xl border border-slate-300 bg-white",
                        "px-4 py-2.5",
                        "text-slate-900 placeholder:text-slate-400",
                        "outline-none transition-all duration-200",
                        "focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
                        "disabled:bg-slate-100 disabled:cursor-not-allowed",
                        leftIcon && "pl-10",
                        rightIcon && "pr-10",
                        error &&
                            "border-red-500 focus:border-red-500 focus:ring-red-200",
                        className
                    )}
                />

                {rightIcon && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                        {rightIcon}
                    </span>
                )}
            </div>

            {error ? (
                <p className="text-sm text-red-600">{error}</p>
            ) : helperText ? (
                <p className="text-sm text-slate-500">{helperText}</p>
            ) : null}
        </div>
    );
}