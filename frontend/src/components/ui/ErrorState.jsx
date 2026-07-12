import clsx from "clsx";
import { useLanguage } from "../../hooks/useLanguage";

export default function ErrorState({
    title,
    message,
    retry,
    className = ""
}) {
    const { t } = useLanguage();

    // Default fallbacks utilizing our unified translation layer
    const displayTitle = title || t("something_went_wrong") || "Something went wrong";
    const displayRetryLabel = t("try_again") || "Try Again";

    return (
        <div
            className={clsx(
                "flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto select-none animate-fadeIn",
                className
            )}
        >
            {/* Warning Triangle Icon Asset */}
            <div className="mb-4 text-red-500 dark:text-red-400 p-3 rounded-full bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
            </div>

            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50 tracking-tight">
                {displayTitle}
            </h3>

            {message && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {message}
                </p>
            )}

            {retry && (
                <button
                    type="button"
                    onClick={retry}
                    className="
                        mt-5
                        inline-flex
                        items-center
                        justify-center
                        rounded-xl
                        font-medium
                        text-sm
                        px-4
                        py-2.5
                        bg-red-600
                        text-white
                        transition-all
                        duration-200
                        hover:bg-red-700
                        active:scale-[0.98]
                        focus:outline-none
                        focus:ring-4
                        focus:ring-red-500/10
                        shadow-sm
                        dark:bg-red-500
                        dark:hover:bg-red-600
                        dark:focus:ring-red-500/20
                    "
                >
                    {displayRetryLabel}
                </button>
            )}
        </div>
    );
}