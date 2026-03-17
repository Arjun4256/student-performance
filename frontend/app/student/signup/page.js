"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { studentApi } from "../lib/api";

export default function StudentSignup() {
    const [formData, setFormData] = useState({ roll_no: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
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
            await studentApi.signup(formData);
            setSuccess(true);
            setTimeout(() => router.push("/student/login"), 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F1F5F9] px-4 font-sans">
            {/* Background decorative elements */}
            <div className="absolute -left-[10%] -top-[10%] h-[40rem] w-[40rem] rounded-full bg-emerald-400/20 mix-blend-multiply blur-[128px]"></div>
            <div className="absolute -bottom-[10%] -right-[10%] h-[40rem] w-[40rem] rounded-full bg-blue-400/20 mix-blend-multiply blur-[128px]"></div>
            <div className="absolute top-[20%] left-[60%] h-[30rem] w-[30rem] rounded-full bg-teal-400/20 mix-blend-multiply blur-[128px] animate-pulse"></div>

            <div className="group relative z-10 w-full max-w-md">
                {/* Glowing ring effect */}
                <div className="absolute -inset-0.5 rounded-[2.2rem] bg-gradient-to-r from-[#10B981] via-teal-500 to-blue-500 opacity-20 blur transition duration-500 group-hover:opacity-75 animate-pulse"></div>

                <div className="relative rounded-[2rem] border border-white/50 bg-white/80 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl sm:p-10">
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#10B981] to-teal-600 text-white shadow-lg shadow-emerald-500/20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5c-1.1 0-2 .9-2 2v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>
                        </div>
                        <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">Student Signup</h1>
                        <p className="mt-2 text-sm font-medium text-[#64748B]">Create your account to track performance</p>
                    </div>

                    {success ? (
                        <div className="text-center animate-in fade-in zoom-in duration-500">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-[#10B981] shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                            </div>
                            <div className="rounded-xl bg-emerald-50 p-4 text-sm font-bold text-[#10B981] border border-emerald-100">
                                Registration successful! Redirecting to login...
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100 flex items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                                    {error}
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="block text-sm font-bold text-[#334155]">Roll Number</label>
                                <input
                                    type="text"
                                    name="roll_no"
                                    required
                                    className="block w-full rounded-xl border border-[#E2E8F0] bg-white/50 px-4 py-3 text-[#0F172A] text-sm font-medium placeholder-[#94A3B8] outline-none transition-all placeholder:font-normal focus:border-[#10B981] focus:bg-white focus:ring-4 focus:ring-[#10B981]/10"
                                    placeholder="Enter your roll number"
                                    value={formData.roll_no}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-sm font-bold text-[#334155]">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="block w-full rounded-xl border border-[#E2E8F0] bg-white/50 px-4 py-3 text-[#0F172A] text-sm font-medium placeholder-[#94A3B8] outline-none transition-all placeholder:font-normal focus:border-[#10B981] focus:bg-white focus:ring-4 focus:ring-[#10B981]/10"
                                    placeholder="student@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-sm font-bold text-[#334155]">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    className="block w-full rounded-xl border border-[#E2E8F0] bg-white/50 px-4 py-3 text-[#0F172A] text-sm font-medium placeholder-[#94A3B8] outline-none transition-all placeholder:font-normal focus:border-[#10B981] focus:bg-white focus:ring-4 focus:ring-[#10B981]/10"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#10B981] to-teal-500 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-200 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-300/50 disabled:opacity-70 disabled:hover:translate-y-0"
                            >
                                {loading ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                        <span>Creating Account...</span>
                                    </>
                                ) : "Sign Up"}
                            </button>
                        </form>
                    )}

                    <div className="mt-8 text-center space-y-4">
                        <p className="text-sm font-medium text-[#64748B]">
                            Already have an account?{" "}
                            <Link href="/student/login" className="font-bold text-[#10B981] transition-colors hover:text-emerald-700 hover:underline">
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
