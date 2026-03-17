"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, LayoutDashboard, Users, UserSquare2, Briefcase, LogOut } from "lucide-react";
import { adminApi } from "./lib/api";
import BackButton from "../components/BackButton";

export default function AdminLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (pathname === "/admin/login") return;
        
        const token = localStorage.getItem("adminToken");
        if (!token) {
            router.push("/admin/login");
        }
    }, [pathname, router]);

    // Close sidebar when route changes
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    if (!mounted) return null;

    // Don't show sidebar/nav on login page
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    const navItems = [
        { name: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
        { name: "Students", href: "/admin/students", icon: <Users size={20} /> },
        { name: "Faculty", href: "/admin/faculty", icon: <UserSquare2 size={20} /> },
        { name: "Placements", href: "/admin/placements", icon: <Briefcase size={20} /> },
    ];

    const handleLogout = async () => {
        try {
            await adminApi.logout();
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            localStorage.removeItem("adminToken");
            router.push("/admin/login");
        }
    };

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            {/* Mobile Top Navbar */}
            <div className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between border-b border-[#E2E8F0] bg-white px-6 shadow-sm md:hidden">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F172A] text-white shadow-md shadow-slate-200">
                        <span className="text-lg font-black italic">A</span>
                    </div>
                    <span className="text-sm font-black text-[#0F172A] uppercase tracking-tighter">Admin Portal</span>
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
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0F172A] text-white shadow-lg shadow-slate-100">
                            <span className="text-2xl font-black italic">A</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-black text-[#0F172A] leading-tight">Admin</span>
                            <span className="text-[10px] font-black text-[#10B981] uppercase tracking-widest">Dashboard</span>
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
                            className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold transition-all duration-200 group ${pathname.startsWith(item.href)
                                ? "bg-slate-900 text-white shadow-md shadow-slate-200"
                                : "text-[#475569] hover:bg-slate-50 hover:text-[#0F172A]"
                                }`}
                        >
                            <span className={`transition-transform duration-200 group-hover:scale-110 ${pathname.startsWith(item.href) ? "text-white" : "text-[#94A3B8] group-hover:text-[#10B981]"}`}>{item.icon}</span>
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-8 left-6 right-6">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white border border-[#E2E8F0] px-4 py-3.5 text-sm font-bold text-[#EF4444] shadow-sm hover:bg-red-50 hover:border-red-100 transition-all active:scale-95 group"
                    >
                        <LogOut size={18} className="transition-transform group-hover:-translate-x-1" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 md:ml-64 mt-16 md:mt-0 overflow-x-hidden">
                <div className="max-w-7xl mx-auto space-y-6">
                    <BackButton />
                    {children}
                </div>
            </main>
        </div>
    );
}
