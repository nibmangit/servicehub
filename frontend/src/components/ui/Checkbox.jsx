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
                    "flex items-center gap-3 cursor-pointer",
                    className
                )}
            >
                <input
                    type="checkbox"
                    {...props}
                    className="
                        h-5 w-5
                        rounded
                        border-slate-300
                        text-blue-600
                        focus:ring-2
                        focus:ring-blue-200
                        cursor-pointer
                    "
                />

                {label && (
                    <span className="text-sm text-slate-700">
                        {label}
                    </span>
                )}
            </label>

            {error ? (
                <p className="text-sm text-red-600">
                    {error}
                </p>
            ) : helperText ? (
                <p className="text-sm text-slate-500">
                    {helperText}
                </p>
            ) : null}
        </div>
    );
}