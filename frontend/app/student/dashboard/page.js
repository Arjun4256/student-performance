"use client";

import { useEffect, useState } from "react";
import { studentApi } from "../lib/api";

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
        return <div className="animate-pulse">Loading overview...</div>;
    }

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                    Welcome back, {profile?.name || "Student"}!
                </h1>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                    Roll Number: {profile?.roll_no} | Department: {profile?.department}
                </p>
            </header>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="mb-4 text-sm font-medium text-zinc-500">Current CGPA</div>
                    <div className="text-4xl font-bold text-zinc-900 dark:text-white">
                        {profile?.cgpa || "N/A"}
                    </div>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="mb-4 text-sm font-medium text-zinc-500">Current Semester</div>
                    <div className="text-4xl font-bold text-zinc-900 dark:text-white">
                        {profile?.semester || "N/A"}
                    </div>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="mb-4 text-sm font-medium text-zinc-500">Year</div>
                    <div className="text-4xl font-bold text-zinc-900 dark:text-white">
                        {profile?.year || "N/A"}
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
                <h2 className="mb-6 text-xl font-bold text-zinc-900 dark:text-white">Quick Actions</h2>
                <div className="flex flex-wrap gap-4">
                    <button className="rounded-lg bg-zinc-900 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">
                        View Grade Report
                    </button>
                    <button className="rounded-lg border border-zinc-200 px-6 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:text-white dark:hover:bg-zinc-900">
                        Placement Prep
                    </button>
                </div>
            </div>
        </div>
    );
}
