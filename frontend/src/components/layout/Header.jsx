import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";

import MobileMenu from "./MobileMenu";
import Logo from "../shared/Logo";
import Button from "../ui/Button";
import Avatar from "../ui/Avatar";
import Input from "../ui/Input";

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { t } = useLanguage();

    return (
        <header
            className="
                sticky
                top-0
                z-40
                w-full
                bg-white/80
                backdrop-blur-md
                border-b
                border-slate-100
                transition-colors
                duration-200
                dark:bg-slate-950/80
                dark:border-slate-900
            "
        >
            <div
                className="
                    max-w-7xl
                    mx-auto
                    px-4
                    sm:px-6
                    h-16
                    flex
                    items-center
                    justify-between
                    gap-4
                "
            >
                {/* Brand Logo Wrapper */}
                <Link to="/" className="focus:outline-none shrink-0">
                    <Logo />
                </Link>

                {/* Main Unified Query Search Bar Component */}
                <div className="hidden md:flex flex-1 max-w-md mx-6">
                    <Input
                        type="text"
                        placeholder={t("search_services") || "Search services..."}
                        className="!py-2"
                        leftIcon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                            </svg>
                        }
                    />
                </div>

                {/* Actions & Session Profile Panel Row */}
                <div className="flex items-center gap-3 sm:gap-4">
                    <Link
                        to="/become-provider"
                        className="
                            hidden
                            lg:block
                            text-sm
                            font-medium
                            text-slate-600
                            hover:text-slate-900
                            dark:text-slate-400
                            dark:hover:text-slate-200
                            transition-colors
                            duration-150
                        "
                    >
                        {t("become_provider") || "Become Provider"}
                    </Link>

                    <Button
                        variant="outline"
                        size="sm"
                        className="hidden sm:inline-flex"
                    >
                        {t("login") || "Login"}
                    </Button>

                    <Avatar
                        name="Nibretu Mengaw"
                        size="sm"
                        online={true}
                        className="cursor-pointer"
                    />

                    {/* Mobile Menu Action Icon Trigger */}
                    <button
                        type="button"
                        onClick={() => setMobileOpen(true)}
                        aria-label="Open menu"
                        className="
                            md:hidden
                            p-1.5
                            rounded-lg
                            text-slate-500
                            hover:bg-slate-50
                            dark:text-slate-400
                            dark:hover:bg-slate-900
                            transition-colors
                        "
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile View Sidebar Drawer Overlay Component */}
            <MobileMenu
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
            />
        </header>
    );
}