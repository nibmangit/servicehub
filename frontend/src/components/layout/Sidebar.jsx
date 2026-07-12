import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { useLanguage } from "../../hooks/useLanguage";

const links = [
    {
        key: "dashboard",
        label: "Dashboard",
        path: "/dashboard",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
        )
    },
    {
        key: "my_services",
        label: "My Services",
        path: "/dashboard/services",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
        )
    },
    {
        key: "requests",
        label: "Requests",
        path: "/dashboard/requests",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        )
    },
    {
        key: "messages",
        label: "Messages",
        path: "/dashboard/messages",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        )
    },
    {
        key: "notifications",
        label: "Notifications",
        path: "/dashboard/notifications",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
        )
    },
    {
        key: "profile",
        label: "Profile",
        path: "/profile",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        )
    },
    {
        key: "settings",
        label: "Settings",
        path: "/settings",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        )
    }
];

export default function Sidebar() {
    const { t } = useLanguage();

    return (
        <aside
            className="
                hidden
                md:flex
                w-64
                min-h-screen
                border-r
                border-slate-100
                bg-white
                p-5
                flex-col
                shrink-0
                transition-colors
                duration-200
                dark:bg-slate-950
                dark:border-slate-900
            "
        >
            {/* Platform Branding Heading */}
            <div className="flex items-center gap-2 mb-8 px-2">
                <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-xs">S</div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                    ServiceHub
                </h2>
            </div>

            {/* Sidebar Navigation Links Group */}
            <nav className="space-y-1 flex-1">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        end={link.path === "/dashboard"}
                        className={({ isActive }) =>
                            clsx(
                                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 select-none",
                                isActive
                                    ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 font-semibold shadow-xs"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-900/60"
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <span className={clsx(
                                    "transition-colors duration-150",
                                    isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"
                                )}>
                                    {link.icon}
                                </span>
                                <span>{t(link.key) || link.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}