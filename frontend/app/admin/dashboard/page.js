"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "../lib/api";
import Link from "next/link";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from "recharts";

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

    // Chart data states
    const [placementStatus, setPlacementStatus] = useState([]);
    const [topCompanies, setTopCompanies] = useState([]);
    const [placementsByCompany, setPlacementsByCompany] = useState([]);
    const [departmentCGPA, setDepartmentCGPA] = useState([]);
    const [cgpaDistribution, setCGPADistribution] = useState([]);
    const [averagePackage, setAveragePackage] = useState([]);
    const [eligibilityData, setEligibilityData] = useState([]);

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

                // Fetch chart data
                const [statusData, companiesData, pByCData, deptData, cgpaDist, avgPkg, eligibility] = await Promise.all([
                    adminApi.getPlacementStatusStats().catch(() => []),
                    adminApi.getTopCompaniesByPackage().catch(() => []),
                    adminApi.getPlacementsByCompany().catch(() => []),
                    adminApi.getDepartmentWiseCGPA().catch(() => []),
                    adminApi.getCGPADistribution().catch(() => []),
                    adminApi.getAveragePackage().catch(() => ({ average_package: 0 })),
                    adminApi.getPlacementEligibility().catch(() => [])
                ]);

                setPlacementStatus(Array.isArray(statusData) ? statusData.map(d => ({ ...d, count: Number(d.count) })) : []);
                setTopCompanies(Array.isArray(companiesData) ? companiesData.map(d => ({ ...d, avg_package: Number(d.avg_package) })) : []);
                setPlacementsByCompany(Array.isArray(pByCData) ? pByCData.map(d => ({ ...d, total_students: Number(d.total_students) })) : []);
                setDepartmentCGPA(Array.isArray(deptData) ? deptData.map(d => ({ ...d, avg_cgpa: Number(d.avg_cgpa) })) : []);
                setCGPADistribution(Array.isArray(cgpaDist) ? cgpaDist.map(d => ({ ...d, student_count: Number(d.student_count) })) : []);

                // Average package is a single value, not an array of departments
                setAveragePackage(avgPkg.average_package ? [{ department: 'Overall', avg_package: Number(avgPkg.average_package) }] : []);

                // Eligibility data mapping (calculate percentage for Gauge)
                const total = Array.isArray(eligibility) ? eligibility.reduce((acc, curr) => acc + Number(curr.count), 0) : 0;
                const eligible = Array.isArray(eligibility) ? (eligibility.find(d => d.eligibility === 'Eligible')?.count || 0) : 0;
                const percent = total > 0 ? Math.round((Number(eligible) / total) * 100) : 100; // Default to 100 if no data

                setEligibilityData([{ name: 'Eligible', value: percent }, { name: 'Total', value: 100 - percent }]);
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

    const PIE_COLORS = ["#10B981", "#2DD4BF", "#0D9488", "#EF4444", "#475569", "#EC4899"];

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#F1F5F9]">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#10B981] border-t-transparent shadow-sm"></div>
                    <p className="text-[#1E293B] font-black tracking-widest animate-pulse uppercase text-xs">Initializing Portal</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Welcome Message */}
            <div className="flex flex-col gap-1">
                    <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">Admin Dashboard</h2>
                    <p className="text-[#64748B] font-medium">Welcome back. Monitoring student performance and faculty engagement.</p>
                </div>

                {/* Key Statistics Cards */}
                <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="group relative">
                        <div className="absolute -inset-0.5 rounded-[1.6rem] bg-gradient-to-r from-[#10B981] to-[#34D399] opacity-0 blur transition duration-500 group-hover:opacity-30 animate-pulse"></div>
                        <div className="relative rounded-3xl border border-[#E2E8F0] bg-white p-7 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 cursor-pointer h-full">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-black text-[#94A3B8] uppercase tracking-widest">Total Students</span>
                                <div className="p-2.5 rounded-xl bg-emerald-50 text-[#10B981] group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-4xl font-black text-[#0F172A] tracking-tighter">{stats.total_students}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="group relative">
                        <div className="absolute -inset-0.5 rounded-[1.6rem] bg-gradient-to-r from-[#10B981] to-[#34D399] opacity-0 blur transition duration-500 group-hover:opacity-30 animate-pulse"></div>
                        <div className="relative rounded-3xl border border-[#E2E8F0] bg-white p-7 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 cursor-pointer h-full">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-black text-[#94A3B8] uppercase tracking-widest">Placement Ratio</span>
                                <div className="p-2.5 rounded-xl bg-emerald-50 text-[#10B981] group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-6M6 20V10M18 20V4" /></svg>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-4xl font-black text-[#0F172A] tracking-tighter">{stats.placement_percentage}%</h3>
                                <span className="text-xs font-black text-[#10B981] uppercase">Success</span>
                            </div>
                        </div>
                    </div>

                    <div className="group relative">
                        <div className="absolute -inset-0.5 rounded-[1.6rem] bg-gradient-to-r from-[#0D9488] to-[#2DD4BF] opacity-0 blur transition duration-500 group-hover:opacity-30 animate-pulse"></div>
                        <div className="relative rounded-3xl border border-[#E2E8F0] bg-white p-7 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 cursor-pointer h-full">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-black text-[#94A3B8] uppercase tracking-widest">Eligible Count</span>
                                <div className="p-2.5 rounded-xl bg-teal-50 text-[#0D9488] group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-4xl font-black text-[#0F172A] tracking-tighter">{stats.eligible_students}</h3>
                                <span className="text-xs font-black text-[#0D9488] uppercase tracking-tight">CGPA ≥ 7.0</span>
                            </div>
                        </div>
                    </div>

                    <div className="group relative">
                        <div className="absolute -inset-0.5 rounded-[1.6rem] bg-gradient-to-r from-[#475569] to-[#64748B] opacity-0 blur transition duration-500 group-hover:opacity-30 animate-pulse"></div>
                        <div className="relative rounded-3xl border border-[#E2E8F0] bg-white p-7 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 cursor-pointer h-full">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-black text-[#94A3B8] uppercase tracking-widest">Active Faculty</span>
                                <div className="p-2.5 rounded-xl bg-slate-50 text-[#475569] group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <Link href="/admin/faculty" className="text-lg font-black text-[#475569] hover:underline uppercase tracking-tight">View Members →</Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Charts Section */}
                <section className="space-y-6">
                    <h3 className="text-xl font-black text-[#0F172A] flex items-center gap-2">
                        <div className="p-1.5 bg-white rounded-lg shadow-sm border border-[#E2E8F0]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#10B981]"><path d="M12 20v-6M6 20V10M18 20V4" /></svg>
                        </div>
                        Insights & Analytics
                    </h3>

                    {/* Row 1: Placement Outcomes + Placements by Company */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-6">
                        {/* Placement Outcomes Pie */}
                        <div className="group relative">
                            <div className="absolute -inset-0.5 rounded-[1.6rem] bg-gradient-to-r from-[#10B981] to-[#34D399] opacity-0 blur transition duration-500 group-hover:opacity-30 animate-pulse"></div>
                            <div className="relative rounded-3xl border border-[#E2E8F0] bg-white p-7 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 h-full">
                                <h4 className="text-sm font-black text-[#334155] mb-8 flex items-center gap-2 uppercase tracking-widest">
                                    <div className="p-2 rounded-xl bg-emerald-50 text-[#10B981] shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2v10l4 2" /><path d="M12 22v-10" /><path d="M2 12h10" /></svg>
                                    </div>
                                    Placement Outcomes
                                </h4>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={placementStatus}
                                            dataKey="count"
                                            nameKey="status"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={75}
                                            outerRadius={105}
                                            paddingAngle={6}
                                            stroke="none"
                                        >
                                            {placementStatus.map((entry, index) => {
                                                const colors = {
                                                    'Selected': '#10B981',
                                                    'Applied': '#F59E0B',
                                                    'Interviewing': '#10B981',
                                                    'Rejected': '#EF4444'
                                                };
                                                return <Cell key={`cell-${index}`} fill={colors[entry.status] || '#94A3B8'} />;
                                            })}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: 'none', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }} itemStyle={{ fontWeight: '800', fontSize: '12px' }} />
                                        <Legend
                                            verticalAlign="bottom"
                                            align="center"
                                            iconType="circle"
                                            iconSize={10}
                                            formatter={(value, entry) => {
                                                const { payload } = entry;
                                                return <span className="text-[12px] font-black text-[#64748B] ml-2 tracking-wide uppercase">{value}: {payload.count}</span>;
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Placements by Company (Horizontal Bar) */}
                        <div className="group relative">
                            <div className="absolute -inset-0.5 rounded-[1.6rem] bg-gradient-to-r from-[#10B981] to-[#34D399] opacity-0 blur transition duration-500 group-hover:opacity-30 animate-pulse"></div>
                            <div className="relative rounded-3xl border border-[#E2E8F0] bg-white p-7 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 h-full">
                                <h4 className="text-sm font-black text-[#334155] mb-8 flex items-center gap-2 uppercase tracking-widest">
                                    <div className="p-2 rounded-xl bg-emerald-50 text-[#10B981] shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
                                    </div>
                                    Placements by Company
                                </h4>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={placementsByCompany} layout="vertical" margin={{ left: 20, right: 30 }}>
                                        <CartesianGrid strokeDasharray="4 4" stroke="#F1F5F9" vertical={false} horizontal={true} />
                                        <XAxis type="number" hide />
                                        <YAxis
                                            dataKey="company_name"
                                            type="category"
                                            tick={{ fill: '#64748B', fontSize: 11, fontWeight: 700 }}
                                            width={90}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ backgroundColor: '#FFFFFF', border: 'none', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} itemStyle={{ fontWeight: '800' }} />
                                        <Bar dataKey="total_students" radius={[0, 8, 8, 0]} barSize={20}>
                                            {placementsByCompany.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10B981' : '#0D9488'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Dashboard Grid (2x2) */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Top Packages by Company */}
                        <div className="group relative">
                            <div className="absolute -inset-0.5 rounded-[1.6rem] bg-gradient-to-r from-[#10B981] to-[#34D399] opacity-0 blur transition duration-500 group-hover:opacity-30 animate-pulse"></div>
                            <div className="relative rounded-3xl border border-[#E2E8F0] bg-white p-7 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 h-full">
                                <h4 className="text-sm font-black text-[#334155] mb-8 flex items-center gap-2 uppercase tracking-widest">
                                    <div className="p-2 rounded-xl bg-emerald-50 text-[#10B981] shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                                    </div>
                                    Top Packages (LPA)
                                </h4>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={topCompanies}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                        <XAxis dataKey="company_name" tick={{ fill: '#64748B', fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fill: '#64748B', fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                                        <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ backgroundColor: '#FFFFFF', border: 'none', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} itemStyle={{ fontWeight: '800' }} />
                                        <Bar dataKey="avg_package" fill="#10B981" radius={[6, 6, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Department-wise Average CGPA */}
                        <div className="group relative">
                            <div className="absolute -inset-0.5 rounded-[1.6rem] bg-gradient-to-r from-[#10B981] to-[#34D399] opacity-0 blur transition duration-500 group-hover:opacity-30 animate-pulse"></div>
                            <div className="relative rounded-3xl border border-[#E2E8F0] bg-white p-7 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 h-full">
                                <h4 className="text-sm font-black text-[#334155] mb-8 flex items-center gap-2 uppercase tracking-widest">
                                    <div className="p-2 rounded-xl bg-emerald-50 text-[#10B981] shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                                    </div>
                                    Average CGPA by Dept
                                </h4>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={departmentCGPA}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                        <XAxis dataKey="department" tick={{ fill: '#64748B', fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                                        <YAxis domain={[0, 10]} tick={{ fill: '#64748B', fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                                        <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ backgroundColor: '#FFFFFF', border: 'none', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} itemStyle={{ fontWeight: '800' }} />
                                        <Bar dataKey="avg_cgpa" fill="#10B981" radius={[6, 6, 0, 0]} barSize={30} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Grade Distribution */}
                        <div className="group relative">
                            <div className="absolute -inset-0.5 rounded-[1.6rem] bg-gradient-to-r from-[#475569] to-[#64748B] opacity-0 blur transition duration-500 group-hover:opacity-30 animate-pulse"></div>
                            <div className="relative rounded-3xl border border-[#E2E8F0] bg-white p-7 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 h-full">
                                <h4 className="text-sm font-black text-[#334155] mb-8 flex items-center gap-2 uppercase tracking-widest">
                                    <div className="p-2 rounded-xl bg-slate-100 text-[#475569] shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></svg>
                                    </div>
                                    Grade Distribution
                                </h4>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={cgpaDistribution}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                        <XAxis dataKey="cgpa_range" tick={{ fill: '#64748B', fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fill: '#64748B', fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                                        <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ backgroundColor: '#FFFFFF', border: 'none', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} itemStyle={{ fontWeight: '800' }} />
                                        <Bar dataKey="student_count" fill="#475569" radius={[6, 6, 0, 0]} barSize={55} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Placement Eligibility Gauge */}
                        <div className="group relative">
                            <div className="absolute -inset-0.5 rounded-[1.6rem] bg-gradient-to-r from-[#10B981] to-[#34D399] opacity-0 blur transition duration-500 group-hover:opacity-30 animate-pulse"></div>
                            <div className="relative rounded-3xl border border-[#E2E8F0] bg-white p-7 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 h-full">
                                <h4 className="text-sm font-black text-[#334155] mb-8 flex items-center gap-2 uppercase tracking-widest">
                                    <div className="p-2 rounded-xl bg-emerald-50 text-[#10B981] shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                    </div>
                                    Placement Eligibility
                                </h4>
                                <div className="relative flex justify-center items-center h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={eligibilityData}
                                                cx="50%"
                                                cy="70%"
                                                startAngle={180}
                                                endAngle={0}
                                                innerRadius={85}
                                                outerRadius={115}
                                                paddingAngle={0}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                <Cell key="cell-0" fill="#10B981" shadow="0 10px 15px -3px rgb(16 185 129 / 0.3)" />
                                                <Cell key="cell-1" fill="#F1F5F9" />
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute top-[62%] left-1/2 -translate-x-1/2 text-center">
                                        <div className="text-5xl font-black text-[#0F172A] tracking-tighter">{eligibilityData[0]?.value || 0}%</div>
                                        <div className="text-[10px] font-black text-[#94A3B8] tracking-widest mt-2 uppercase">Eligible Students</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* Management Sections Grid */}
                    <div className="lg:col-span-8 space-y-6">
                        <h3 className="text-xl font-black text-[#0F172A] flex items-center gap-2">
                            <div className="p-1.5 bg-white rounded-lg shadow-sm border border-[#E2E8F0]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#10B981]"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
                            </div>
                            Management Systems
                        </h3>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <Link href="/admin/students" className="group p-8 rounded-3xl border border-[#E2E8F0] bg-white hover:border-[#10B981] transition-all duration-300 shadow-sm hover:shadow-2xl hover:-translate-y-2 hover:ring-4 hover:ring-[#10B981]/20">
                                <div className="flex flex-col gap-5">
                                    <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-[#10B981] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#10B981] group-hover:text-white transition-all duration-300 shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#0F172A]">Student Management</h4>
                                        <p className="text-sm text-[#64748B]">Verify accounts, update academic marks, and track CGPA progress.</p>
                                    </div>
                                    <div className="pt-2">
                                        <span className="text-xs font-black text-[#10B981] border-b-2 border-[#10B981] pb-0.5 tracking-widest uppercase group-hover:pr-2 transition-all">Manage Students →</span>
                                    </div>
                                </div>
                            </Link>

                            <Link href="/admin/placements" className="group p-8 rounded-3xl border border-[#E2E8F0] bg-white hover:border-[#10B981] transition-all duration-300 shadow-sm hover:shadow-2xl hover:-translate-y-2 hover:ring-4 hover:ring-[#10B981]/20">
                                <div className="flex flex-col gap-5">
                                    <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-[#10B981] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#10B981] group-hover:text-white transition-all duration-300 shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#0F172A]">Placement Management</h4>
                                        <p className="text-sm text-[#64748B]">Host career drives, update selection statuses, and manage corporate relations.</p>
                                    </div>
                                    <div className="pt-2">
                                        <span className="text-xs font-black text-[#10B981] border-b-2 border-[#10B981] pb-0.5 tracking-widest uppercase group-hover:pr-2 transition-all">Manage Placements →</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Reports & Exports Panel */}
                    <aside className="lg:col-span-4 space-y-6">
                        <h3 className="text-xl font-black text-[#0F172A] flex items-center gap-2">
                            <div className="p-1.5 bg-white rounded-lg shadow-sm border border-[#E2E8F0]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#10B981]"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                            </div>
                            Data Exports
                        </h3>
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={handleDownloadEligibleList}
                                disabled={downloading}
                                className="w-full text-left p-6 rounded-3xl border border-[#E2E8F0] bg-white transition-all duration-300 group disabled:opacity-50 hover:border-[#10B981] hover:shadow-xl hover:-translate-x-1 hover:ring-4 hover:ring-[#10B981]/10"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-black text-[#0F172A] tracking-tight uppercase group-hover:text-[#10B981]">Eligible Students</span>
                                    <div className="p-2 bg-[#F8FAFC] rounded-xl group-hover:bg-[#10B981] group-hover:text-white transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-y-0.5 transition-transform"><path d="M7 10l5 5 5-5M12 15V3" /></svg>
                                    </div>
                                </div>
                                <p className="text-xs font-bold text-[#94A3B8] leading-tight">Export verified list for recruitment drives (CGPA ≥ 7.0).</p>
                            </button>

                            <button
                                onClick={handleDownloadPerformanceSummary}
                                disabled={downloading}
                                className="w-full text-left p-6 rounded-3xl border border-[#E2E8F0] bg-white transition-all duration-300 group disabled:opacity-50 hover:border-[#475569] hover:shadow-xl hover:-translate-x-1 hover:ring-4 hover:ring-[#475569]/10"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-black text-[#0F172A] tracking-tight uppercase group-hover:text-[#475569]">Academic Performance</span>
                                    <div className="p-2 bg-[#F8FAFC] rounded-xl group-hover:bg-[#475569] group-hover:text-white transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-y-0.5 transition-transform"><path d="M7 10l5 5 5-5M12 15V3" /></svg>
                                    </div>
                                </div>
                                <p className="text-xs font-bold text-[#94A3B8] leading-tight">Generate full department-wise performance breakdown.</p>
                            </button>
                        </div>

                        {downloading && (
                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 text-[#10B981] border border-emerald-100 shadow-sm animate-pulse">
                                <div className="h-5 w-5 rounded-full border-4 border-current border-t-transparent animate-spin"></div>
                                <span className="text-xs font-black uppercase tracking-widest">Processing Export...</span>
                            </div>
                        )}

                    </aside>
                </div>
        </div>
    );
}
