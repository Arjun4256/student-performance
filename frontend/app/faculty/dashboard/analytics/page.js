"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { facultyApi } from "../../lib/api";

export default function FacultyAnalytics() {
    const [activeTab, setActiveTab] = useState("all");
    const [allStudents, setAllStudents] = useState([]);
    const [weakStudents, setWeakStudents] = useState([]);
    const [topStudents, setTopStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        department: "",
        semester: "",
        min_cgpa: "",
        max_cgpa: ""
    });
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("facultyToken");
                if (!token) {
                    router.push("/faculty/login");
                    return;
                }

                const [allData, weakData, topData] = await Promise.all([
                    facultyApi.getStudentList(),
                    facultyApi.getWeakStudents(),
                    facultyApi.getTopStudents()
                ]);

                setAllStudents(allData.students || []);
                setWeakStudents(weakData.students || []);
                setTopStudents(topData.students || []);
            } catch (err) {
                console.error("Failed to fetch analytics:", err);
                if (err.message.includes("Unauthorized") || err.message.includes("token")) {
                    localStorage.removeItem("facultyToken");
                    router.push("/faculty/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const applyFilters = async () => {
        setLoading(true);
        try {
            const cleanFilters = Object.fromEntries(
                Object.entries(filters).filter(([_, v]) => v !== "")
            );
            const data = await facultyApi.getStudentList(cleanFilters);
            setAllStudents(data.students || []);
        } catch (err) {
            console.error("Failed to apply filters:", err);
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = async () => {
        setFilters({ department: "", semester: "", min_cgpa: "", max_cgpa: "" });
        setLoading(true);
        try {
            const data = await facultyApi.getStudentList();
            setAllStudents(data.students || []);
        } catch (err) {
            console.error("Failed to clear filters:", err);
        } finally {
            setLoading(false);
        }
    };

    const renderStudentTable = (students, showCGPA = true) => (
        <div className="space-y-4">
            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {students.length === 0 ? (
                    <div className="p-12 text-center text-[#64748B] italic">No students found.</div>
                ) : (
                    students.map((student) => (
                        <div key={student.login_id} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-xs font-black text-[#6366F1] uppercase tracking-widest">#{student.roll_no}</div>
                                    <h3 className="text-lg font-bold text-[#0F172A]">{student.name || "N/A"}</h3>
                                    <p className="text-xs font-medium text-[#64748B]">{student.department}</p>
                                </div>
                                {showCGPA && (
                                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-widest shadow-sm ${student.cgpa >= 8.5
                                        ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100"
                                        : student.cgpa < 6.0
                                            ? "bg-rose-50 text-rose-600 ring-1 ring-rose-100"
                                            : "bg-blue-50 text-blue-600 ring-1 ring-blue-100"
                                        }`}>
                                        {student.cgpa || "N/A"}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-zinc-50 dark:bg-zinc-900">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Roll No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Department</th>
                                {showCGPA && (
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">CGPA</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                            {students.length === 0 ? (
                                <tr>
                                    <td colSpan={showCGPA ? "4" : "3"} className="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400">
                                        No students found
                                    </td>
                                </tr>
                            ) : (
                                students.map((student) => (
                                    <tr key={student.login_id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-900 dark:text-white">
                                            {student.roll_no}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-900 dark:text-white">
                                            {student.name || "N/A"}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                                            {student.department || "N/A"}
                                        </td>
                                        {showCGPA && (
                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${student.cgpa >= 8.5
                                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                    : student.cgpa < 6.0
                                                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                                    }`}>
                                                    {student.cgpa || "N/A"}
                                                </span>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    if (loading && activeTab === "all" && allStudents.length === 0) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
                <div className="text-center">
                    <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 dark:border-indigo-900 dark:border-t-indigo-400"></div>
                    <p className="text-zinc-600 dark:text-zinc-400">Loading analytics...</p>
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
                <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">Performance Analytics</h1>
                
            </header>

            <main className="space-y-6">
                {/* Tabs */}
                <div className="flex items-center gap-8 border-b border-[#E2E8F0]">
                    {[
                        { id: "all", label: "Registry Overview", count: allStudents.length },
                        { id: "weak", label: "Priority Support", count: weakStudents.length },
                        { id: "top", label: "Academic Excellence", count: topStudents.length }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === tab.id
                                ? "text-[#0F172A]"
                                : "text-[#94A3B8] hover:text-[#64748B]"
                                }`}
                        >
                            {tab.label} ({tab.count})
                            {activeTab === tab.id && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3B82F6] rounded-full animate-in slide-in-from-left-full duration-300"></span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Filters (only for All Students tab) */}
                {activeTab === "all" && (
                    <div className="rounded-3xl border border-[#E2E8F0] bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:ring-4 hover:ring-slate-50">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-2 rounded-xl bg-blue-50 text-[#3B82F6] shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
                            </div>
                            <h3 className="text-sm font-black text-[#0F172A] uppercase tracking-widest">Filters</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                            <div className="group">
                                <label className="block text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-1.5 ml-1 group-focus-within:text-[#3B82F6] transition-colors">Department</label>
                                <input
                                    type="text"
                                    placeholder="e.g., CSE"
                                    className="w-full px-4 py-3 bg-slate-50 border border-[#E2E8F0] rounded-xl text-sm font-bold text-[#0F172A] focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-[#3B82F6] outline-none transition-all shadow-inner"
                                    value={filters.department}
                                    onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                                />
                            </div>
                            <div className="group">
                                <label className="block text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-1.5 ml-1 group-focus-within:text-[#3B82F6] transition-colors">Term</label>
                                <input
                                    type="number"
                                    placeholder="e.g., 6"
                                    className="w-full px-4 py-3 bg-slate-50 border border-[#E2E8F0] rounded-xl text-sm font-bold text-[#0F172A] focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-[#3B82F6] outline-none transition-all shadow-inner"
                                    value={filters.semester}
                                    onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
                                />
                            </div>
                            <div className="group">
                                <label className="block text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-1.5 ml-1 group-focus-within:text-[#3B82F6] transition-colors">Min CGPA</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    placeholder="0.0"
                                    className="w-full px-4 py-3 bg-slate-50 border border-[#E2E8F0] rounded-xl text-sm font-bold text-[#0F172A] focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-[#3B82F6] outline-none transition-all shadow-inner"
                                    value={filters.min_cgpa}
                                    onChange={(e) => setFilters({ ...filters, min_cgpa: e.target.value })}
                                />
                            </div>
                            <div className="group">
                                <label className="block text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-1.5 ml-1 group-focus-within:text-[#3B82F6] transition-colors">Max CGPA</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    placeholder="10.0"
                                    className="w-full px-4 py-3 bg-slate-50 border border-[#E2E8F0] rounded-xl text-sm font-bold text-[#0F172A] focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-[#3B82F6] outline-none transition-all shadow-inner"
                                    value={filters.max_cgpa}
                                    onChange={(e) => setFilters({ ...filters, max_cgpa: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="mt-8 flex gap-3">
                            <button
                                onClick={applyFilters}
                                className="px-6 py-3 bg-[#0F172A] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#1E293B] transition-all active:scale-95 shadow-lg shadow-slate-200"
                            >
                                Apply Filters
                            </button>
                            <button
                                onClick={clearFilters}
                                className="px-6 py-3 bg-white border-2 border-[#E2E8F0] text-[#64748B] rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                )}

                {/* Content based on active tab */}
                {activeTab === "all" && (
                    <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-sm font-black text-[#0F172A] uppercase tracking-widest">Search Results</h2>
                            <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Registry Sync: {allStudents.length} Profiles</p>
                        </div>
                        {renderStudentTable(allStudents)}
                    </div>
                )}

                {activeTab === "weak" && (
                    <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="p-5 rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-4">
                            <div className="p-2 rounded-xl bg-white text-rose-500 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                            </div>
                            <p className="text-sm font-bold text-rose-700 italic">
                                Critical performance items: {weakStudents.length} students falling below institutional benchmark (6.00).
                            </p>
                        </div>
                        {renderStudentTable(weakStudents)}
                    </div>
                )}

                {activeTab === "top" && (
                    <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-4">
                            <div className="p-2 rounded-xl bg-white text-emerald-500 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
                            </div>
                            <p className="text-sm font-bold text-emerald-700 italic">
                                Academic distinction: {topStudents.length} students exceeding excellence benchmark (8.50).
                            </p>
                        </div>
                        {renderStudentTable(topStudents)}
                    </div>
                )}
            </main>
        </div>
    );
}
