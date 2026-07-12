// src/components/ui/Checkbox.jsx
import clsx from "clsx";

export default function Checkbox({
    label,
    error,
    helperText,
    className = "",
    ...props
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label
                className={clsx(
                    "flex items-start gap-3 cursor-pointer select-none",
                    className
                )}
            >
                <div className="flex items-center h-5">
                    <input
                        type="checkbox"
                        {...props}
                        className={clsx(
                            "h-4 w-4 rounded-md border-slate-200 text-blue-600 bg-white",
                            "focus:ring-4 focus:ring-blue-500/10 focus:ring-offset-0 outline-none",
                            "transition-all duration-200 cursor-pointer",
                            
                            // Dark Mode Support
                            "dark:border-slate-700 dark:bg-slate-900 dark:checked:bg-blue-500",
                            "dark:focus:ring-blue-500/20",
                            
                            // Error State Support
                            error && "border-red-500 dark:border-red-500 focus:ring-red-500/10 dark:focus:ring-red-500/20",
                            props.disabled && "opacity-50 cursor-not-allowed"
                        )}
                    />
                </div>

                {label && (
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors duration-200 pt-0.5">
                        {label}
                    </span>
                )}
            </label>

            {error ? (
                <p className="text-sm text-red-600 dark:text-red-400 pl-7">{error}</p>
            ) : helperText ? (
                <p className="text-sm text-slate-500 dark:text-slate-400 pl-7">{helperText}</p>
            ) : null}
        </div>
    );
}