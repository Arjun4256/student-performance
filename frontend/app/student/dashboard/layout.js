"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { studentApi } from "../lib/api";

export default function StudentDashboardLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const token = localStorage.getItem("studentToken");
        if (!token && !pathname.includes("/login") && !pathname.includes("/signup")) {
            router.push("/student/login");
        }
    }, [pathname, router]);

    if (!mounted) return null;

    const navItems = [
        { name: "Overview", href: "/student/dashboard", icon: "📊" },
        { name: "My Profile", href: "/student/dashboard/profile", icon: "👤" },
        { name: "Placements", href: "/student/dashboard/placements", icon: "💼" },
        { name: "Performance", href: "/student/dashboard/performance", icon: "📈" },
    ];

    const handleLogout = async () => {
        try {
            await studentApi.logout();
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            localStorage.removeItem("studentToken");
            router.push("/student/login");
        }
    };

    return (
        <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 border-r border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                <div className="mb-10 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
                        <span className="text-xl font-bold">S</span>
                    </div>
                    <span className="text-xl font-bold text-zinc-900 dark:text-white">Portal</span>
                </div>

                <nav className="space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${pathname === item.href
                                ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-white"
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
