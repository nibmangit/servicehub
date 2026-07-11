import clsx from "clsx";

export default function Drawer({
    isOpen,
    onClose,
    children,
    position = "right",
    title,
    size = "md",
}) {

    if (!isOpen) return null;


    const positions = {
        left: "left-0",
        right: "right-0",
        top: "top-0",
        bottom: "bottom-0",
    };


    const sizes = {
        sm: "w-64",
        md: "w-80",
        lg: "w-[420px]",
        xl: "w-[600px]",
    };


    return (
        <div className="fixed inset-0 z-50">

            {/* Overlay */}
            <div
                onClick={onClose}
                className="
                    absolute
                    inset-0
                    bg-black/40
                "
            />


            {/* Drawer */}
            <div
                className={clsx(
                    "absolute",
                    positions[position],
                    sizes[size],
                    "h-full",
                    "bg-white",
                    "shadow-xl",
                    "p-6",
                    "transition-transform"
                )}
            >

                <div className="flex items-center justify-between mb-6">

                    {title && (
                        <h2 className="text-xl font-semibold text-slate-900">
                            {title}
                        </h2>
                    )}


                    <button
                        onClick={onClose}
                        className="
                            text-xl
                            text-slate-500
                            hover:text-slate-900
                        "
                    >
                        ×
                    </button>

                </div>


                {children}

            </div>

        </div>
    );
}