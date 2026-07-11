import { useEffect } from "react";
import clsx from "clsx";

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = "md",
    className = "",
}) {

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener(
                "keydown",
                handleEscape
            );
        }

        return () => {
            document.removeEventListener(
                "keydown",
                handleEscape
            );
        };
    }, [isOpen, onClose]);


    if (!isOpen) return null;


    const sizes = {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
    };


    return (
        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/40
                px-4
            "
            onClick={onClose}
        >

            <div
                onClick={(e) => e.stopPropagation()}
                className={clsx(
                    "w-full",
                    sizes[size],
                    "rounded-2xl",
                    "bg-white",
                    "shadow-xl",
                    "p-6",
                    className
                )}
            >

                <div className="flex items-center justify-between mb-5">

                    {title && (
                        <h2 className="text-xl font-semibold text-slate-900">
                            {title}
                        </h2>
                    )}

                    <button
                        onClick={onClose}
                        className="
                            text-slate-500
                            hover:text-slate-900
                            text-xl
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