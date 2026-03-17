"use client";

import { useEffect, useState } from "react";
import { studentApi } from "../../lib/api";

export default function StudentProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await studentApi.getProfile();
                setProfile(data.profile);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#3B82F6] border-t-transparent shadow-sm"></div>
                    <p className="text-[#334155] font-bold animate-pulse">Loading Profile...</p>
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

    const profileFields = [
        { label: "Full Name", value: profile?.name },
        { label: "Roll Number", value: profile?.roll_no },
        { label: "Email Address", value: profile?.email },
        { label: "Department", value: profile?.department },
        { label: "Year", value: profile?.year },
        { label: "Semester", value: profile?.semester },
        { label: "CGPA", value: profile?.cgpa },

    ];

    return (
        <div className="space-y-8 max-w-4xl">
            <header className="flex flex-col gap-1">
                <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">My Profile</h1>
                <p className="text-[#64748B] font-medium">View and manage your academic profile information</p>
            </header>

            <div className="group relative w-full">
                {/* Glowing ring effect */}
                <div className="absolute -inset-0.5 rounded-[1.6rem] bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 opacity-0 blur transition duration-500 group-hover:opacity-20 animate-pulse"></div>

                <div className="relative rounded-3xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden transition-all duration-300 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] group-hover:-translate-y-1">
                    <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#E2E8F0]">
                        <div className="p-10 md:col-span-4 bg-[#F8FAFC] flex flex-col items-center justify-center text-center">
                            <div className="mb-6 relative group/avatar">
                                <div className="absolute -inset-0.5 bg-gradient-to-tr from-[#3B82F6] to-[#10B981] rounded-full blur opacity-40 transition duration-500 group-hover/avatar:opacity-75 animate-pulse"></div>
                                <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-white border-4 border-white shadow-lg text-5xl">
                                    👤
                                </div>
                            </div>
                            <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">{profile?.name || "Student"}</h2>
                            <span className="mt-2 inline-flex items-center gap-1.5 rounded-xl px-3 py-1 bg-blue-50 text-xs font-black uppercase tracking-widest text-[#3B82F6]">
                                {profile?.roll_no || "N/A"}
                            </span>
                        </div>

                        <div className="p-10 md:col-span-8 bg-white">
                            <h3 className="mb-8 text-lg font-black text-[#0F172A] flex items-center gap-2 uppercase tracking-wide">
                                <div className="p-1.5 bg-blue-50 rounded-lg text-[#3B82F6]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                                </div>
                                Academic Details
                            </h3>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6">
                                {profileFields.map((field) => (
                                    <div key={field.label} className="bg-[#F8FAFC] rounded-2xl p-4 border border-[#F1F5F9] transition-colors hover:bg-white hover:border-[#E2E8F0] hover:shadow-sm">
                                        <dt className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-1.5">{field.label}</dt>
                                        <dd className="text-sm font-bold text-[#0F172A]">{field.value || <span className="text-[#CBD5E1] font-medium italic">Not provided</span>}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
