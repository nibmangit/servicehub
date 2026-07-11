import clsx from "clsx";

export default function Tabs({
    tabs,
    active,
    onChange,
}) {

    return (
        <div>

            <div
                className="
                    flex
                    gap-6
                    border-b
                    border-slate-200
                "
            >

                {tabs.map((tab) => (

                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        className={clsx(
                            "pb-3 text-sm font-medium",
                            active === tab.id
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-slate-500 hover:text-slate-800"
                        )}
                    >
                        {tab.label}
                    </button>

                ))}

            </div>

        </div>
    );
}