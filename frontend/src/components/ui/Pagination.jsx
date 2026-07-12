// src/components/ui/Pagination.jsx
import React from "react";
import clsx from "clsx";
import { useLanguage } from "../../hooks/useLanguage";

export default function Pagination({
    page,
    totalPages,
    onChange,
    className = "",
}) {
    const { t, language } = useLanguage();

    // Utility formatter to safely parse string variables without structure breakage
    const renderPageInfo = () => {
        const template = t("page_info") || "Page {current} of {total}";
        return template
            .replace("{current}", page)
            .replace("{total}", totalPages);
    };

    if (totalPages <= 1) return null;

    return (
        <div className={clsx("flex items-center justify-between sm:justify-start gap-4 select-none w-full sm:w-auto", className)}>
            {/* Previous Navigation Button */}
            <button
                type="button"
                disabled={page === 1}
                onClick={() => onChange(page - 1)}
                className={clsx(
                    "inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 transition-all duration-200 shadow-xs",
                    "hover:bg-slate-50 active:scale-[0.98]",
                    "disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:bg-white",
                    
                    // Dark Mode Support
                    "dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:disabled:hover:bg-slate-900"
                )}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6"/>
                </svg>
                <span className="hidden sm:inline">{t("previous")}</span>
            </button>

            {/* Pagination Information Status Indicator */}
            <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 tabular-nums">
                {renderPageInfo()}
            </span>

            {/* Next Navigation Button */}
            <button
                type="button"
                disabled={page === totalPages}
                onClick={() => onChange(page + 1)}
                className={clsx(
                    "inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 transition-all duration-200 shadow-xs",
                    "hover:bg-slate-50 active:scale-[0.98]",
                    "disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:bg-white",
                    
                    // Dark Mode Support
                    "dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:disabled:hover:bg-slate-900"
                )}
            >
                <span className="hidden sm:inline">{t("next")}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6"/>
                </svg>
            </button>
        </div>
    );
}