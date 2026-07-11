import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

export default function Dropdown({
    trigger,
    children,
    position = "right",
    className = "",
}) {
    const [open, setOpen] = useState(false);

    const dropdownRef = useRef(null);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);


    const positions = {
        left: "left-0",
        right: "right-0",
    };


    return (
        <div
            ref={dropdownRef}
            className="relative inline-block"
        >

            <div
                onClick={() => setOpen(!open)}
                className="cursor-pointer"
            >
                {trigger}
            </div>


            {open && (
                <div
                    className={clsx(
                        "absolute mt-2 z-50",
                        positions[position],
                        "min-w-48",
                        "rounded-xl",
                        "border border-slate-200",
                        "bg-white",
                        "shadow-lg",
                        "p-2",
                        className
                    )}
                >
                    {children}
                </div>
            )}

        </div>
    );
}