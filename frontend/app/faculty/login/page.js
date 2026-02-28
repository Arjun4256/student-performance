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
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-4 dark:from-zinc-950 dark:via-black dark:to-indigo-950">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl dark:bg-zinc-900">
                <div className="mb-8 text-center">
                    <div className="mb-4 flex justify-center">
                        <div className="rounded-full bg-indigo-100 p-4 dark:bg-indigo-900/30">
                            <svg className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Faculty Portal</h1>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-400">Sign in to manage student records</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Faculty Code</label>
                        <input
                            type="text"
                            name="faculty_code"
                            required
                            placeholder="Enter your faculty code"
                            className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
                            value={formData.faculty_code}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            placeholder="Enter your password"
                            className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
                    <Link href="/" className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
                        ← Back to Home
                    </Link>
                </p>
            </div>
        </div>
    );
}
