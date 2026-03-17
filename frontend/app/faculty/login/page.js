"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { facultyApi } from "../lib/api";

export default function FacultyLogin() {
    const [formData, setFormData] = useState({ faculty_code: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = await facultyApi.login(formData);
            localStorage.setItem("facultyToken", data.token);
            router.push("/faculty/dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F1F5F9] px-4 font-sans">
            {/* Background animated elements */}
            <div className="absolute -left-[10%] -top-[10%] h-[40rem] w-[40rem] rounded-full bg-indigo-400/20 mix-blend-multiply blur-[128px]"></div>
            <div className="absolute -bottom-[10%] -right-[10%] h-[40rem] w-[40rem] rounded-full bg-blue-400/20 mix-blend-multiply blur-[128px]"></div>
            <div className="absolute top-[20%] left-[60%] h-[30rem] w-[30rem] rounded-full bg-violet-400/20 mix-blend-multiply blur-[128px] animate-pulse"></div>

            <div className="group relative z-10 w-full max-w-md">
                {/* Glowing ring effect */}
                <div className="absolute -inset-0.5 rounded-[2.2rem] bg-gradient-to-r from-indigo-500 via-blue-500 to-violet-500 opacity-20 blur transition duration-500 group-hover:opacity-75 animate-pulse"></div>

                <div className="relative rounded-[2rem] border border-white/50 bg-white/80 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl sm:p-10">
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-500/20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>
                        </div>
                        <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">Faculty Portal</h1>
                        <p className="mt-2 text-sm font-medium text-[#64748B]">Manage academic evaluations</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100 flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                                {error}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-[#334155]">Faculty Code</label>
                            <input
                                type="text"
                                name="faculty_code"
                                required
                                className="block w-full rounded-xl border border-[#E2E8F0] bg-white/50 px-4 py-3 text-[#0F172A] text-sm font-medium placeholder-[#94A3B8] outline-none transition-all placeholder:font-normal focus:border-[#6366F1] focus:bg-white focus:ring-4 focus:ring-[#6366F1]/10"
                                placeholder="Enter your faculty code"
                                value={formData.faculty_code}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-[#334155]">Password</label>
                            <input
                                type="password"
                                name="password"
                                required
                                className="block w-full rounded-xl border border-[#E2E8F0] bg-white/50 px-4 py-3 text-[#0F172A] text-sm font-medium placeholder-[#94A3B8] outline-none transition-all placeholder:font-normal focus:border-[#6366F1] focus:bg-white focus:ring-4 focus:ring-[#6366F1]/10"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 py-3.5 text-sm font-bold text-white shadow-md shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-300/50 disabled:opacity-70 disabled:hover:translate-y-0"
                        >
                            {loading ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                    <span>Signing in...</span>
                                </>
                            ) : "Sign In"}
                        </button>
                    </form>

                    <div className="mt-8 text-center space-y-4">
                        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#94A3B8] transition-colors hover:text-[#64748B]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><polyline points="12 19 5 12 12 5" /></svg>
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
