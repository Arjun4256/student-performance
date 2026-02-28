"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { studentApi } from "../lib/api";

export default function StudentLogin() {
    const [formData, setFormData] = useState({ roll_no: "", password: "" });
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
            const data = await studentApi.login(formData);
            localStorage.setItem("studentToken", data.token);
            router.push("/student/dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-black">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-zinc-900">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Student Login</h1>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-400">Access your academic record</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Roll Number</label>
                        <input
                            type="text"
                            name="roll_no"
                            required
                            className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                            value={formData.roll_no}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-zinc-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
                    Don't have an account?{" "}
                    <Link href="/student/signup" className="font-semibold text-zinc-900 hover:underline dark:text-white">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
