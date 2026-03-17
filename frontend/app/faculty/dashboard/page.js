"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import 'chart.js/auto';
import { Bar, Pie } from 'react-chartjs-2';

import { facultyApi } from "../lib/api";

export default function FacultyDashboardOverview() {
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState(null);
    const [placementStats, setPlacementStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileData, statsData, placementData] = await Promise.all([
                    facultyApi.getProfile(),
                    facultyApi.getDashboardStats(),
                    facultyApi.getFacultyPlacementRatio()
                ]);
                setProfile(profileData.data);
                setStats(statsData.data);
                setPlacementStats(placementData);
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="text-center group">
                    <div className="mb-6 h-14 w-14 animate-spin rounded-2xl border-4 border-blue-100 border-t-[#3B82F6] mx-auto shadow-sm"></div>
                    <p className="text-[#64748B] font-black tracking-widest uppercase text-xs animate-pulse">Initializing Portal...</p>
                </div>
            </div>
        );
    }

    const cgpaData = {
        labels: ['< 6', '6-7', '7-8', '8-9', '9-10'],
        datasets: [{
            label: 'Number of Students',
            data: [
                stats?.cgpa_distribution?.['<6'] || 0,
                stats?.cgpa_distribution?.['6-7'] || 0,
                stats?.cgpa_distribution?.['7-8'] || 0,
                stats?.cgpa_distribution?.['8-9'] || 0,
                stats?.cgpa_distribution?.['9-10'] || 0,
            ],
            backgroundColor: '#e41956',
            borderRadius: 6,
        }]
    };

    const placementPieData = {
        labels: ['Placed', 'Unplaced'],
        datasets: [{
            data: [
                parseInt(placementStats?.placed_students || 0),
                parseInt(placementStats?.unplaced_students || 0),
            ],
            backgroundColor: ['#10b981', '#ef4444'],
            borderColor: ['#059669', '#dc2626'],
            borderWidth: 1,
        }]
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col gap-1">
                <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">
                    Welcome back, {profile?.name ? `Prof. ${profile.name}` : "Faculty"}
                </h1>
                <p className="text-[#64748B] font-medium flex items-center gap-2">
                    <span className="p-1 bg-white rounded-md border border-[#E2E8F0] shadow-sm italic text-xs px-2 text-[#3B82F6]">{profile?.department} Dept</span>
                    <span>Monitoring student growth and academic outcomes.</span>
                </p>
            </header>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="group rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:ring-4 hover:ring-[#3B82F6]/10 cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Enrolled Students</span>
                        <div className="p-2 rounded-xl bg-blue-50 text-[#3B82F6] group-hover:scale-110 transition-transform shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                        </div>
                    </div>
                    <p className="text-3xl font-black text-[#0F172A] tracking-tighter">{stats?.total_students || 0}</p>
                </div>

                <div className="group rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:ring-4 hover:ring-[#6366F1]/10 cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Avg CGPA</span>
                        <div className="p-2 rounded-xl bg-indigo-50 text-[#6366F1] group-hover:scale-110 transition-transform shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4" /><path d="M3.34 19a10 10 0 1 1 17.32 0" /></svg>
                        </div>
                    </div>
                    <p className="text-3xl font-black text-[#0F172A] tracking-tighter">{stats?.average_cgpa || "N/A"}</p>
                </div>

                <div className="group rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:ring-4 hover:ring-[#10B981]/10 cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Career Ready</span>
                        <div className="p-2 rounded-xl bg-emerald-50 text-[#10B981] group-hover:scale-110 transition-transform shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-6M6 20V10M18 20V4" /></svg>
                        </div>
                    </div>
                    <p className="text-3xl font-black text-[#10B981] tracking-tighter">{stats?.placement_stats?.placed || 0}</p>
                </div>

                <div className="group rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:ring-4 hover:ring-[#EF4444]/10 cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Seeking Opportunities</span>
                        <div className="p-2 rounded-xl bg-red-50 text-[#EF4444] group-hover:scale-110 transition-transform shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
                        </div>
                    </div>
                    <p className="text-3xl font-black text-[#EF4444] tracking-tighter">{stats?.placement_stats?.rejected || 0}</p>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* CGPA Distribution */}
                <div className="rounded-3xl border border-[#E2E8F0] bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:ring-4 hover:ring-blue-100/50">
                    <h3 className="mb-8 text-sm font-black text-[#334155] uppercase tracking-widest flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-blue-50 text-[#3B82F6] shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></svg>
                        </div>
                        CGPA Distribution
                    </h3>
                    {cgpaData.datasets[0].data.some(v => v > 0) ? (
                        <div className="relative h-64 w-full">
                            <Bar
                                data={cgpaData}
                                options={{
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { display: false },
                                        tooltip: {
                                            backgroundColor: '#FFFFFF',
                                            titleColor: '#0F172A',
                                            bodyColor: '#334155',
                                            padding: 12,
                                            borderRadius: 12,
                                            boxPadding: 6,
                                            usePointStyle: true,
                                            borderColor: '#E2E8F0',
                                            borderWidth: 1,
                                            titleFont: { weight: '800' },
                                            bodyFont: { weight: '600' }
                                        }
                                    },
                                    scales: {
                                        y: { grid: { display: false }, border: { display: false }, ticks: { font: { weight: '700' }, color: '#94A3B8' } },
                                        x: { grid: { display: false }, border: { display: false }, ticks: { font: { weight: '700' }, color: '#94A3B8' } }
                                    }
                                }}
                            />
                        </div>
                    ) : (
                        <div className="flex h-64 w-full items-center justify-center text-[#94A3B8] font-bold italic">
                            No CGPA distribution data available
                        </div>
                    )}
                </div>

                {/* Placement Ratio Pie Chart */}
                <div className="rounded-3xl border border-[#E2E8F0] bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:ring-4 hover:ring-emerald-100/50">
                    <h3 className="mb-8 text-sm font-black text-[#334155] uppercase tracking-widest flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-emerald-50 text-[#10B981] shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2v10l4 2" /><path d="M12 22v-10" /><path d="M2 12h10" /></svg>
                        </div>
                        Placement Outcomes
                    </h3>
                    {(placementStats?.placed_students > 0 || placementStats?.unplaced_students > 0) ? (
                        <div className="relative h-64 w-full flex justify-center">
                            <Pie
                                data={placementPieData}
                                options={{
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'bottom',
                                            labels: { font: { weight: '700' }, color: '#64748B', padding: 20, usePointStyle: true }
                                        },
                                        tooltip: {
                                            backgroundColor: '#FFFFFF',
                                            padding: 12,
                                            borderRadius: 12,
                                            borderColor: '#E2E8F0',
                                            borderWidth: 1,
                                            titleColor: '#0F172A',
                                            bodyColor: '#334155',
                                            titleFont: { weight: '800' },
                                            bodyFont: { weight: '600' },
                                            callbacks: {
                                                label: function (context) {
                                                    let label = context.label || '';
                                                    let value = context.parsed;
                                                    let total = context.chart._metasets[context.datasetIndex].total;
                                                    let percentage = ((value / total) * 100).toFixed(1) + '%';
                                                    return ` ${label}: ${value} (${percentage})`;
                                                }
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>
                    ) : (
                        <div className="flex h-64 w-full items-center justify-center text-[#94A3B8] font-bold italic">
                            No placement data available
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
