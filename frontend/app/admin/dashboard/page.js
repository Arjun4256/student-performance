"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "../lib/api";
import Link from "next/link";

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [stats, setStats] = useState({
        total_students: 0,
        eligible_students: 0,
        placed_students: 0,
        placement_percentage: 0
    });
    const [originalStats, setOriginalStats] = useState({ placed: 0, unplaced: 0 });

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem("adminToken");
            if (!token) {
                router.push("/admin/login");
                return;
            }
            try {
                const [overviewStats, placedData, unplacedData] = await Promise.all([
                    adminApi.getOverviewStats(),
                    adminApi.getPlacedStudents(),
                    adminApi.getUnplacedStudents()
                ]);
                setStats(overviewStats);
                setOriginalStats({
                    placed: placedData.length,
                    unplaced: unplacedData.length
                });
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [router]);

    const handleLogout = async () => {
        try {
            await adminApi.logout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem("adminToken");
            router.push("/admin/login");
        }
    };

    const handleDownloadEligibleList = async () => {
        try {
            setDownloading(true);
            await adminApi.downloadEligibleList();
        } catch (err) {
            alert(err.message || "Failed to download eligible list");
        } finally {
            setDownloading(false);
        }
    };

    const handleDownloadPerformanceSummary = async () => {
        try {
            setDownloading(true);
            await adminApi.downloadPerformanceSummary();
        } catch (err) {
            alert(err.message || "Failed to download performance summary");
        } finally {
            setDownloading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-black">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                    <p className="text-zinc-600 dark:text-zinc-400 font-medium">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
            {/* Premium Header */}
            <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900 sticky top-0 z-10 backdrop-blur-md bg-white/80 dark:bg-zinc-900/80">
                <div>
                    <h1 className="text-xl font-bold text-zinc-900 dark:text-white leading-tight">Admin Console</h1>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider">System Overview & Control</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-lg bg-zinc-100 px-4 py-2 text-sm font-bold text-zinc-700 hover:bg-red-50 hover:text-red-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all active:scale-95"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                    Logout
                </button>
            </header>

            <main className="flex-1 p-6 space-y-8 max-w-7xl mx-auto w-full">
                {/* Welcome Message */}
                <div className="flex flex-col gap-1">
                    <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">Admin Dashboard</h2>
                    <p className="text-zinc-500 dark:text-zinc-400">Welcome back. Monitoring student performance and faculty engagement.</p>
                </div>

                {/* Key Statistics Cards */}
                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 transition-all hover:shadow-md">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-tight">Total Students</span>
                            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-black text-zinc-900 dark:text-white leading-none">{stats.total_students}</h3>
                        </div>
                    </div>

                    <div className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 transition-all hover:shadow-md">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-tight">Placement Ratio</span>
                            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-6M6 20V10M18 20V4" /></svg>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-black text-zinc-900 dark:text-white leading-none">{stats.placement_percentage}%</h3>
                            <span className="text-xs font-bold text-green-600 dark:text-green-400">Target 100%</span>
                        </div>
                    </div>

                    <div className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 transition-all hover:shadow-md">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-tight">Eligible Count</span>
                            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-black text-zinc-900 dark:text-white leading-none">{stats.eligible_students}</h3>
                            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">CGPA ≥ 7.0</span>
                        </div>
                    </div>

                    <div className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 transition-all hover:shadow-md">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-tight">Active Faculty</span>
                            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <Link href="/admin/faculty" className="text-xl font-bold text-purple-600 hover:underline dark:text-purple-400 leading-none">Manage Members →</Link>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* Management Sections Grid */}
                    <div className="lg:col-span-8 space-y-4">
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
                            System Management
                        </h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Link href="/admin/students" className="group p-6 rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 hover:border-blue-500 dark:hover:border-blue-500 transition-all shadow-sm">
                                <div className="flex flex-col gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-zinc-900 dark:text-white">Student Records</h4>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Verify accounts, update academic marks, and track CGPA progress.</p>
                                    </div>
                                </div>
                            </Link>

                            <Link href="/admin/placements" className="group p-6 rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 hover:border-green-500 dark:hover:border-green-500 transition-all shadow-sm">
                                <div className="flex flex-col gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-zinc-900 dark:text-white">Placement Drives</h4>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Manage recruitment records, update selection status, and company packages.</p>
                                    </div>
                                </div>
                            </Link>
                        </div>

                    </div>

                    {/* Reports & Exports Panel */}
                    <aside className="lg:col-span-4 space-y-4">
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                            Reports & Data Exports
                        </h3>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleDownloadEligibleList}
                                disabled={downloading}
                                className="w-full text-left p-4 rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 hover:border-blue-500 dark:hover:border-blue-500 transition-all group disabled:opacity-50"
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">Eligibility Report</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 group-hover:translate-y-0.5 transition-transform"><path d="M7 10l5 5 5-5M12 15V3" /></svg>
                                </div>
                                <p className="text-xs text-zinc-500">Ready list for companies (CGPA ≥ 7.0)</p>
                            </button>

                            <button
                                onClick={handleDownloadPerformanceSummary}
                                disabled={downloading}
                                className="w-full text-left p-4 rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 hover:border-purple-500 dark:hover:border-purple-500 transition-all group disabled:opacity-50"
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">Performance Matrix</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 group-hover:translate-y-0.5 transition-transform"><path d="M7 10l5 5 5-5M12 15V3" /></svg>
                                </div>
                                <p className="text-xs text-zinc-500">Department-wise academic breakdown</p>
                            </button>
                        </div>

                        {downloading && (
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 animate-pulse">
                                <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin"></div>
                                <span className="text-xs font-bold">Exporting CSV...</span>
                            </div>
                        )}

                    </aside>
                </div>
            </main>
        </div>
    );
}
