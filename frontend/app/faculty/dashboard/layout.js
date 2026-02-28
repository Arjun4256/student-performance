"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { facultyApi } from "../lib/api";

export default function FacultyDashboardLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const token = localStorage.getItem("facultyToken");
        if (!token && !pathname.includes("/login")) {
            router.push("/faculty/login");
        }
    }, [pathname, router]);

    if (!mounted) return null;

    const navItems = [
        { name: "Overview", href: "/faculty/dashboard", icon: "📊" },
        { name: "My Profile", href: "/faculty/dashboard/profile", icon: "👤" },
        { name: "Students", href: "/faculty/dashboard/students", icon: "👥" },
        { name: "Analytics", href: "/faculty/dashboard/analytics", icon: "📈" },
        { name: "Placements", href: "/faculty/dashboard/placements", icon: "💼" },
    ];

    const handleLogout = async () => {
        try {
            await facultyApi.logout();
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            localStorage.removeItem("facultyToken");
            router.push("/faculty/login");
        }
    };

    return (
        <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 border-r border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                <div className="mb-10 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                        <span className="text-xl font-bold">F</span>
                    </div>
                    <span className="text-xl font-bold text-zinc-900 dark:text-white">Faculty Portal</span>
                </div>

                <nav className="space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${pathname === item.href
                                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                                : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
                                }`}
                        >
                            <span>{item.icon}</span>
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-8 left-6 right-6">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                        <span>🚪</span>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1 p-10">
                <div className="mx-auto max-w-5xl">{children}</div>
            </main>
        </div>
    );
}
