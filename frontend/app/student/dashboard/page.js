"use client";

import { useEffect, useState } from "react";
import { studentApi } from "../lib/api";
import Link from "next/link";

export default function StudentDashboardOverview() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await studentApi.getProfile();
                setProfile(data.profile);
            } catch (err) {
                console.error("Failed to fetch profile:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#F1F5F9]">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#3B82F6] border-t-transparent shadow-sm"></div>
                    <p className="text-[#334155] font-bold animate-pulse">Loading Overview...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <header className="flex flex-col gap-1">
                <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">
                    Welcome back, {profile?.name || "Student"}
                </h1>
                <p className="text-[#64748B] font-medium">
                    Roll Number: {profile?.roll_no} | Department: {profile?.department}
                </p>
            </header>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mr-0">
                <div className="group rounded-3xl border border-[#E2E8F0] bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:ring-4 hover:ring-[#3B82F6]/20 cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-black text-[#94A3B8] uppercase tracking-widest">Current CGPA</span>
                        <div className="p-2.5 rounded-xl bg-blue-50 text-[#3B82F6] group-hover:scale-110 transition-transform duration-300 shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-4xl font-black text-[#0F172A] tracking-tighter">{profile?.cgpa || "N/A"}</h3>
                    </div>
                </div>

                <div className="group rounded-3xl border border-[#E2E8F0] bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:ring-4 hover:ring-[#10B981]/20 cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-black text-[#94A3B8] uppercase tracking-widest">Current Semester</span>
                        <div className="p-2.5 rounded-xl bg-emerald-50 text-[#10B981] group-hover:scale-110 transition-transform duration-300 shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-4xl font-black text-[#0F172A] tracking-tighter">{profile?.semester || "N/A"}</h3>
                    </div>
                </div>

                <div className="group rounded-3xl border border-[#E2E8F0] bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:ring-4 hover:ring-[#F59E0B]/20 cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-black text-[#94A3B8] uppercase tracking-widest">Year</span>
                        <div className="p-2.5 rounded-xl bg-amber-50 text-[#F59E0B] group-hover:scale-110 transition-transform duration-300 shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-4xl font-black text-[#0F172A] tracking-tighter">{profile?.year || "N/A"}</h3>
                    </div>
                </div>
            </div>

            <div className="rounded-3xl border border-[#E2E8F0] bg-white p-8 shadow-sm">
                <h2 className="mb-6 text-xl font-black text-[#0F172A] flex items-center gap-2">
                    <div className="p-1.5 bg-white rounded-lg shadow-sm border border-[#E2E8F0]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#3B82F6]"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                    </div>
                    Quick Actions
                </h2>
                <div className="flex flex-wrap gap-4">
                    <Link href="/student/dashboard/performance" className="rounded-xl bg-[#3B82F6] px-6 py-3 text-sm font-bold text-white shadow-md shadow-blue-200 transition-all hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-300">
                        View Grade Report
                    </Link>
                    <Link href="/student/dashboard/placements" className="rounded-xl border border-[#E2E8F0] bg-white px-6 py-3 text-sm font-bold text-[#475569] shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:text-[#0F172A] hover:shadow-md">
                        Placement Preparation
                    </Link>
                </div>
            </div>
        </div>
    );
}
