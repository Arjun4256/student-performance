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
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
            <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <Link href="/faculty/dashboard" className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
                                ← Back to Dashboard
                            </Link>
                            <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">Faculty Profile</h1>
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
                    {/* Profile Header */}
                    <div className="mb-8 flex items-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                            <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                                {profile?.name?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="ml-6">
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{profile?.name}</h2>
                            <p className="mt-1 text-zinc-600 dark:text-zinc-400">{profile?.designation}</p>
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">Faculty Code</label>
                                <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-white">{profile?.faculty_code}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">Email</label>
                                <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-white">{profile?.email}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">Department</label>
                                <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-white">{profile?.department}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">Designation</label>
                                <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-white">{profile?.designation}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">Experience</label>
                                <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-white">
                                    {profile?.experience ? `${profile.experience} years` : "N/A"}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">Account Status</label>
                                <p className="mt-1">
                                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${profile?.is_active
                                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                        }`}>
                                        {profile?.is_active ? "Active" : "Inactive"}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-zinc-200 pt-6 dark:border-zinc-800">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">Account Created</label>
                                    <p className="mt-1 text-sm text-zinc-900 dark:text-white">
                                        {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">Last Updated</label>
                                    <p className="mt-1 text-sm text-zinc-900 dark:text-white">
                                        {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
