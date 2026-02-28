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

    if (loading) return <div className="animate-pulse">Loading profile...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

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
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">My Profile</h1>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">View and manage your academic profile information</p>
            </header>

            <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                <div className="grid grid-cols-1 divide-y divide-zinc-100 dark:divide-zinc-800 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                    <div className="p-8">
                        <div className="mb-6 flex items-center justify-center">
                            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-zinc-100 text-4xl text-zinc-400 dark:bg-zinc-900">
                                👤
                            </div>
                        </div>
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{profile?.name}</h2>
                            <p className="text-sm text-zinc-500">{profile?.roll_no}</p>
                        </div>
                    </div>

                    <div className="p-8">
                        <h3 className="mb-6 text-lg font-semibold text-zinc-900 dark:text-white">Student Details</h3>
                        <dl className="space-y-4">
                            {profileFields.map((field) => (
                                <div key={field.label} className="flex justify-between text-sm">
                                    <dt className="text-zinc-500">{field.label}</dt>
                                    <dd className="font-medium text-zinc-900 dark:text-white">{field.value || "Not provided"}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}
