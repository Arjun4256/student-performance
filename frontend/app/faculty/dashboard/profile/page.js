"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { facultyApi } from "../../lib/api";

export default function FacultyProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("facultyToken");
                if (!token) {
                    router.push("/faculty/login");
                    return;
                }

                const data = await facultyApi.getProfile();
                setProfile(data.data);
            } catch (err) {
                console.error("Failed to fetch profile:", err);
                if (err.message.includes("Unauthorized") || err.message.includes("token")) {
                    localStorage.removeItem("facultyToken");
                    router.push("/faculty/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
                <div className="text-center">
                    <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 dark:border-indigo-900 dark:border-t-indigo-400"></div>
                    <p className="text-zinc-600 dark:text-zinc-400">Loading profile...</p>
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
                <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">Institutional Profile</h1>
                
            </header>

            <main className="max-w-4xl space-y-6">
                <div className="rounded-[2.5rem] border border-[#E2E8F0] bg-white p-6 md:p-12 shadow-sm transition-all duration-300 hover:shadow-2xl hover:ring-4 hover:ring-slate-50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-50 -mr-32 -mt-32"></div>

                    {/* Profile Header */}
                    <div className="relative mb-12 flex flex-col md:flex-row items-center gap-6 md:gap-8 text-center md:text-left">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                            <div className="relative flex h-24 w-24 md:h-28 md:w-28 items-center justify-center rounded-full bg-white border-4 border-white shadow-xl overflow-hidden">
                                <span className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600">
                                    {profile?.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <div>
                            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 mb-1">
                                <h2 className="text-2xl md:text-3xl font-black text-[#0F172A] tracking-tight">{profile?.name}</h2>
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-emerald-100 shadow-sm">Verified</span>
                            </div>
                            <p className="text-[#64748B] font-bold text-base md:text-lg">{profile?.designation}</p>
                        </div>
                    </div>

                    {/* Profile Details Grid */}
                    <div className="grid grid-cols-1 gap-6 md:gap-10 md:grid-cols-2 relative">
                        <div className="group">
                            <label className="block text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-1 ml-1 group-hover:text-[#3B82F6] transition-colors">Faculty Identifier</label>
                            <p className="text-base md:text-lg font-black text-[#0F172A] px-4 py-3 bg-slate-50 rounded-2xl border border-[#E2E8F0] shadow-sm">{profile?.faculty_code}</p>
                        </div>
                        <div className="group">
                            <label className="block text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-1 ml-1 group-hover:text-[#3B82F6] transition-colors">Institutional Email</label>
                            <p className="text-base md:text-lg font-black text-[#0F172A] px-4 py-3 bg-slate-50 rounded-2xl border border-[#E2E8F0] shadow-sm break-all">{profile?.email}</p>
                        </div>
                        <div className="group">
                            <label className="block text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-1 ml-1 group-hover:text-[#3B82F6] transition-colors">Academic Unit</label>
                            <p className="text-base md:text-lg font-black text-[#0F172A] px-4 py-3 bg-slate-50 rounded-2xl border border-[#E2E8F0] shadow-sm">{profile?.department}</p>
                        </div>
                        <div className="group">
                            <label className="block text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-1 ml-1 group-hover:text-[#3B82F6] transition-colors">Professional Tenure</label>
                            <p className="text-base md:text-lg font-black text-[#0F172A] px-4 py-3 bg-slate-50 rounded-2xl border border-[#E2E8F0] shadow-sm">
                                {profile?.experience ? `${profile.experience} Academic Years` : "Not Specified"}
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 pt-10 border-t border-[#F1F5F9] grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-2">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#3B82F6]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Registry Admission</label>
                                <p className="text-xs md:text-sm font-bold text-[#475569]">Joined {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "N/A"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Record Sync</label>
                                <p className="text-xs md:text-sm font-bold text-[#475569]">Modified {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : "N/A"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
