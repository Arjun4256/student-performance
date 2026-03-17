"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { facultyApi } from "../lib/api";
import BackButton from "../../components/BackButton";

export default function FacultyDashboardLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        const token = localStorage.getItem("facultyToken");
        if (!token && !pathname.includes("/login")) {
            router.push("/faculty/login");
        }
    }, [pathname, router]);

    // Close sidebar when route changes
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

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
        <div className="flex min-h-screen bg-[#F1F5F9]">
            {/* Mobile Top Navbar */}
            <div className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between border-b border-[#E2E8F0] bg-white px-6 shadow-sm md:hidden">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3B82F6] text-white shadow-md shadow-blue-100">
                        <span className="text-lg font-black">F</span>
                    </div>
                    <span className="text-sm font-black text-[#0F172A] uppercase tracking-tighter">Faculty Portal</span>
                </div>
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-[#475569] hover:bg-slate-100 transition-colors active:scale-95"
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed left-0 top-0 z-50 h-full w-64 border-r border-[#E2E8F0] bg-white p-6 shadow-sm transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
                <div className="mb-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#3B82F6] text-white shadow-lg shadow-blue-100">
                            <span className="text-2xl font-black">F</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-black text-[#0F172A] leading-tight">Faculty</span>
                            <span className="text-[10px] font-black text-[#6366F1] uppercase tracking-widest">Dashboard</span>
                        </div>
                    </div>
                    {/* Close button for mobile */}
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-[#475569] md:hidden"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="space-y-1.5">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold transition-all duration-200 group ${pathname === item.href
                                ? "bg-blue-50 text-[#3B82F6] shadow-sm shadow-blue-50 ring-1 ring-blue-100"
                                : "text-[#475569] hover:bg-slate-50 hover:text-[#0F172A]"
                                }`}
                        >
                            <span className={`text-lg transition-transform duration-200 group-hover:scale-110 ${pathname === item.href ? "filter-none" : "grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100"}`}>{item.icon}</span>
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-8 left-6 right-6">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-red-600 px-4 py-4 text-sm font-black text-white shadow-lg shadow-red-100 hover:bg-red-700 transition-all active:scale-95"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-8 md:ml-64 mt-16 md:mt-0">
                <div className="mx-auto max-w-6xl">
                    <BackButton />
                    {children}
                </div>
            </main>
        </div>
    );
}
