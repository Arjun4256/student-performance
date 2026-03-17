"use client";

import { useState, useEffect } from "react";
import { studentApi } from "../../lib/api";
import { TrendingUp, Award, BookOpen, Briefcase } from 'lucide-react';

export default function StudentPerformance() {
    const [performance, setPerformance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPerformance = async () => {
            try {
                const data = await studentApi.getPerformance();
                setPerformance(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPerformance();
    }, []);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#3B82F6] border-t-transparent shadow-sm"></div>
                    <p className="text-[#334155] font-bold animate-pulse">Loading Analytics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl bg-red-50 p-6 text-sm font-bold text-red-600 border border-red-100 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">Performance Analytics</h1>
                    <p className="text-[#64748B] font-medium mt-1">Detailed insights into your academic progress</p>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white border border-[#E2E8F0] px-5 py-2.5 text-sm font-bold text-[#0F172A] shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
                    <div className="p-1 rounded-md bg-emerald-50 text-[#10B981]">
                        <TrendingUp className="h-4 w-4" strokeWidth={3} />
                    </div>
                    Overall Rank: <span className="text-[#10B981]">#{performance?.rank || "N/A"}</span>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="group rounded-3xl border border-[#E2E8F0] bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:ring-4 hover:ring-[#3B82F6]/10">
                    <div className="mb-8 flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-50 text-[#3B82F6] shadow-sm">
                            <Award className="h-6 w-6" strokeWidth={2.5} />
                        </div>
                        <h3 className="text-lg font-black text-[#0F172A] uppercase tracking-wide">Core Indicators</h3>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <div className="mb-3 flex justify-between text-sm font-bold">
                                <span className="text-[#64748B] uppercase tracking-wider text-xs">Latest CGPA</span>
                                <span className="text-[#0F172A]">{performance?.academic?.cgpa || "0"} <span className="text-[#94A3B8]">/ 10.0</span></span>
                            </div>
                            <div className="h-2.5 w-full rounded-full bg-[#F1F5F9] overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-[#3B82F6] shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-1000"
                                    style={{ width: `${(performance?.academic?.cgpa || 0) * 10}%` }}
                                ></div>
                            </div>
                        </div>

                        <div>
                            <div className="mb-3 flex justify-between text-sm font-bold">
                                <span className="text-[#64748B] uppercase tracking-wider text-xs">Semester Progress</span>
                                <span className="text-[#0F172A]">Semester {performance?.academic?.semester || "N/A"}</span>
                            </div>
                            <div className="h-2.5 w-full rounded-full bg-[#F1F5F9] overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-[#10B981] shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000"
                                    style={{ width: `${(performance?.academic?.semester || 0) * 12.5}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="group rounded-3xl border border-[#E2E8F0] bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:ring-4 hover:ring-[#6366F1]/10">
                    <div className="mb-8 flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-indigo-50 text-[#6366F1] shadow-sm">
                            <Briefcase className="h-6 w-6" strokeWidth={2.5} />
                        </div>
                        <h3 className="text-lg font-black text-[#0F172A] uppercase tracking-wide">Placement Insights</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-5 transition-colors group-hover:bg-white group-hover:border-[#6366F1]/30">
                            <div className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-2">Status</div>
                            <div className="text-xl font-black text-[#0F172A]">
                                {performance?.placement?.status || "Not Applied"}
                            </div>
                        </div>
                        <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-5 transition-colors group-hover:bg-white group-hover:border-[#6366F1]/30">
                            <div className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-2">Company</div>
                            <div className="text-xl font-black text-[#0F172A] truncate" title={performance?.placement?.company_name || "N/A"}>
                                {performance?.placement?.company_name || "N/A"}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className={`flex items-center gap-3 rounded-2xl p-4 text-sm font-bold border transition-colors ${performance?.academic?.cgpa >= 7.5
                                ? "bg-emerald-50 text-[#10B981] border-emerald-100"
                                : "bg-blue-50 text-[#3B82F6] border-blue-100"
                            }`}>
                            <BookOpen className="h-5 w-5 shrink-0" strokeWidth={2.5} />
                            <span>
                                {performance?.academic?.cgpa >= 7.5
                                    ? "You are eligible for most top companies!"
                                    : "Keep improving to reach the 7.5 CGPA threshold."}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
