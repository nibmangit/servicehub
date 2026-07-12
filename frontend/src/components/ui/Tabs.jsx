import clsx from "clsx";
import { useLanguage } from "../../hooks/useLanguage";

export default function Tabs({
    tabs = [],
    active,
    onChange,
    className = "",
}) {
    const { t } = useLanguage();

    return (
        <div className={clsx("w-full overflow-x-auto no-scrollbar", className)}>
            <div
                className="
                    flex
                    gap-6
                    border-b
                    border-slate-100
                    dark:border-slate-800/80
                    min-w-max
                    px-1
                "
            >
                {tabs.map((tab) => {
                    const isActive = active === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => onChange(tab.id)}
                            className={clsx(
                                "pb-3 text-sm font-medium transition-all duration-200 relative outline-none whitespace-nowrap",
                                isActive
                                    ? "text-blue-600 dark:text-blue-500 font-semibold"
                                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                            )}
                        >
                            {/* Try translating the label first; fallback to raw label text */}
                            {t(tab.label?.toLowerCase().replace(/\s+/g, '_')) || tab.label}

                            {/* Premium Slider Visual Accent instead of standard harsh native border-b */}
                            {isActive && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-500 rounded-full" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}