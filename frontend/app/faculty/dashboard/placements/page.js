"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { facultyApi } from "../../lib/api";

export default function PlacementTracking() {
    const [placements, setPlacements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("all");

    const router = useRouter();

    useEffect(() => {
        const fetchPlacements = async () => {
            try {
                const token = localStorage.getItem("facultyToken");
                if (!token) {
                    router.push("/faculty/login");
                    return;
                }

                const data = await facultyApi.getAllPlacements();
                setPlacements(data.data || []);
            } catch (err) {
                console.error("Failed to fetch placements:", err);
                if (err.message.includes("Unauthorized") || err.message.includes("token")) {
                    localStorage.removeItem("facultyToken");
                    router.push("/faculty/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPlacements();
    }, [router]);



    const filteredPlacements = placements.filter(p => {
        return filterStatus === "all" || p.status?.toLowerCase() === filterStatus;
    });

    const stats = {
        total: placements.length,
        placed: placements.filter(p => p.status?.toLowerCase() === "selected").length,
        unplaced: placements.filter(p => p.status?.toLowerCase() === "rejected").length,
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
                <div className="text-center">
                    <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 dark:border-indigo-900 dark:border-t-indigo-400"></div>
                    <p className="text-zinc-600 dark:text-zinc-400">Loading placements...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-2">
                    <Link href="/faculty/dashboard" className="group flex items-center gap-2 text-xs font-black text-[#3B82F6] uppercase tracking-widest hover:text-[#2563EB] transition-colors">
                        <div className="p-1.5 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        </div>
                        Back to Overview
                    </Link>
                </div>
                <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">Placement Analytics</h1>
                
            </header>

            <main className="space-y-8">
                {/* Statistics */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <div className="group rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:ring-4 hover:ring-slate-50">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Student Records</span>
                            <div className="p-2 rounded-xl bg-slate-50 text-[#64748B] group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                            </div>
                        </div>
                        <p className="text-3xl font-black text-[#0F172A] tracking-tighter">{stats.total}</p>
                    </div>

                    <div className="group rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:ring-4 hover:ring-emerald-50">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Offers Secured</span>
                            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                            </div>
                        </div>
                        <p className="text-3xl font-black text-emerald-600 tracking-tighter">{stats.placed}</p>
                    </div>

                    <div className="group rounded-3xl border border-orange-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:ring-4 hover:ring-orange-50">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Pending Evaluation</span>
                            <div className="p-2 rounded-xl bg-orange-50 text-orange-600 group-hover:scale-110 transition-transform shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                            </div>
                        </div>
                        <p className="text-3xl font-black text-orange-600 tracking-tighter">{stats.unplaced}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="space-y-4">
                    <div className="flex items-center gap-8 border-b border-[#E2E8F0]">
                        {[
                            { id: "all", label: "Records" },
                            { id: "selected", label: "Selected Talent" },
                            { id: "rejected", label: "Opportunity Seekers" }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setFilterStatus(tab.id)}
                                className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${filterStatus === tab.id
                                    ? "text-[#0F172A]"
                                    : "text-[#94A3B8] hover:text-[#64748B]"
                                    }`}
                            >
                                {tab.label}
                                {filterStatus === tab.id && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3B82F6] rounded-full animate-in slide-in-from-left-full duration-300"></span>
                                )}
                            </button>
                        ))}
                    </div>

                {/* Mobile Card View */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                    {filteredPlacements.length === 0 ? (
                        <div className="p-12 text-center text-[#64748B] italic">No matching records found.</div>
                    ) : (
                        filteredPlacements.map((placement) => (
                            <div key={placement.placement_id} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-xs font-black text-[#6366F1] uppercase tracking-widest">#{placement.roll_no}</div>
                                        <h3 className="text-lg font-bold text-[#0F172A]">{placement.name || "N/A"}</h3>
                                        <p className="text-xs font-medium text-[#64748B]">{placement.department}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${placement.status?.toLowerCase() === "selected"
                                        ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100"
                                        : "bg-orange-50 text-orange-600 ring-1 ring-orange-100"
                                        }`}>
                                        {placement.status || "Unknown"}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                                    <div>
                                        <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-tighter">Company</div>
                                        <div className="text-sm font-bold text-[#334155]">{placement.company_name || "N/A"}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-tighter">Package</div>
                                        <div className="text-sm font-black text-[#0F172A]">{placement.package ? `₹${placement.package} LPA` : "N/A"}</div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block rounded-3xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:ring-4 hover:ring-slate-50">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                                    <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-[#64748B]">Name</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-[#64748B]">Roll no</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-[#64748B]">Department</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-[#64748B]">Company</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-[#64748B]">Package</th>
                                    <th className="px-8 py-5 text-center text-[10px] font-black uppercase tracking-widest text-[#64748B]">Current Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F1F5F9]">
                                {filteredPlacements.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-16 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="p-4 rounded-full bg-slate-50 text-[#94A3B8]">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                                                </div>
                                                <p className="text-[#64748B] font-bold italic text-sm">No placement data matched current criteria</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPlacements.map((placement) => (
                                        <tr key={placement.placement_id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <p className="text-sm font-black text-[#0F172A]">{placement.name || "N/A"}</p>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <span className="text-xs font-black text-[#6366F1] px-2.5 py-1 bg-indigo-50 rounded-lg shadow-sm">
                                                    #{placement.roll_no}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <p className="text-xs font-bold text-[#475569]">{placement.department || "N/A"}</p>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-[#64748B]">
                                                        {placement.company_name?.substring(0, 1)}
                                                    </div>
                                                    <p className="text-sm font-black text-[#0F172A]">{placement.company_name || "N/A"}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <p className="text-sm font-black text-[#0F172A] tracking-tight">{placement.package ? `₹${placement.package} LPA` : "N/A"}</p>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap text-center">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${placement.status?.toLowerCase() === "selected"
                                                    ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100"
                                                    : "bg-orange-50 text-orange-600 ring-1 ring-orange-100"
                                                    }`}>
                                                    {placement.status || "Unknown"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                </div>

                <div className="flex items-center justify-between px-2 text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">
                    <p>Corporate Engagement Insights</p>
                    <p>Total Sync: {filteredPlacements.length} Records</p>
                </div>
            </main>
        </div>
    );
}
