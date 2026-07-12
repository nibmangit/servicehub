import { Link } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";
import Drawer from "../ui/Drawer";
import Button from "../ui/Button";

export default function MobileMenu({ open, onClose }) {
    const { t } = useLanguage();

    const menuLinks = [
        {
            key: "home",
            label: "Home",
            path: "/",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            )
        },
        {
            key: "services",
            label: "Services",
            path: "/services",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 16-4-4 4-4M3 8h14v8H3z"/></svg>
            )
        },
        {
            key: "become_provider",
            label: "Become Provider",
            path: "/provider",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 10h-6M19 7v6"/></svg>
            )
        }
    ];

    return (
        <Drawer
            isOpen={open}
            onClose={onClose}
            title={t("menu") || "Menu"}
            position="left"
            size="sm"
        >
            <div className="flex flex-col h-full justify-between pb-6">
                {/* Navigation Links Group */}
                <nav className="flex flex-col gap-1.5 mt-2">
                    {menuLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={onClose}
                            className="
                                flex
                                items-center
                                gap-3
                                px-3
                                py-3
                                rounded-xl
                                text-sm
                                font-medium
                                text-slate-600
                                hover:text-blue-600
                                hover:bg-slate-50
                                transition-all
                                duration-200
                                dark:text-slate-300
                                dark:hover:text-blue-400
                                dark:hover:bg-slate-900/50
                            "
                        >
                            <span className="text-slate-400 dark:text-slate-500">
                                {link.icon}
                            </span>
                            <span>{t(link.key) || link.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Bottom Actions Session Wrapper Panel */}
                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/80">
                    <Link to="/auth/login" onClick={onClose} className="block w-full focus:outline-none">
                        <Button className="w-full shadow-sm">
                            {t("login") || "Login"}
                        </Button>
                    </Link>
                </div>
            </div>
        </Drawer>
    );
}