import clsx from "clsx";

export default function Textarea({
    label,
    error,
    helperText,
    rows = 5,
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

            <textarea
                rows={rows}
                {...props}
                className={clsx(
                    "w-full rounded-xl border border-slate-300 bg-white",
                    "px-4 py-3",
                    "text-slate-900 placeholder:text-slate-400",
                    "outline-none transition-all duration-200 resize-none",
                    "focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
                    "disabled:bg-slate-100 disabled:cursor-not-allowed",
                    error &&
                        "border-red-500 focus:border-red-500 focus:ring-red-200",
                    className
                )}
            />

            {error ? (
                <p className="text-sm text-red-600">{error}</p>
            ) : helperText ? (
                <p className="text-sm text-slate-500">{helperText}</p>
            ) : null}
        </div>
    );
}