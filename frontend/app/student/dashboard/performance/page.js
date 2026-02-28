"use client";

import { useState, useEffect } from "react";
import { studentApi } from "../../lib/api";
import { TrendingUp, Award, BookOpen, Briefcase } from 'lucide-react';

export default function StudentPerformance() {
    const [performance, setPerformance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPerformance = async () => {
            try {
                const data = await studentApi.getPerformance();
                setPerformance(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPerformance();
    }, []);

    if (loading) return (
        <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900 dark:border-zinc-800 dark:border-t-white"></div>
        </div>
    );
    if (error) return <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{error}</div>;


    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Performance Analytics</h1>
                    <p className="mt-1 text-zinc-600 dark:text-zinc-400">Detailed insights into your academic progress</p>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-1.5 text-sm font-medium text-zinc-900 dark:bg-zinc-900 dark:text-white">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    Overall Rank: #{performance?.rank || "N/A"}
                </div>
            </header>


            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="mb-6 flex items-center gap-3">
                        <Award className="h-6 w-6 text-zinc-900 dark:text-white" />
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Core Indicators</h3>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <div className="mb-2 flex justify-between text-sm">
                                <span className="text-zinc-500">Latest CGPA</span>
                                <span className="font-medium text-zinc-900 dark:text-white">{performance?.academic?.cgpa || "0"} / 10.0</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
                                <div
                                    className="h-full rounded-full bg-zinc-900 dark:bg-white"
                                    style={{ width: `${(performance?.academic?.cgpa || 0) * 10}%` }}
                                ></div>
                            </div>
                        </div>
                        <div>
                            <div className="mb-2 flex justify-between text-sm">
                                <span className="text-zinc-500">Semester Progress</span>
                                <span className="font-medium text-zinc-900 dark:text-white">Semester {performance?.academic?.semester || "N/A"}</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
                                <div
                                    className="h-full rounded-full bg-blue-500"
                                    style={{ width: `${(performance?.academic?.semester || 0) * 12.5}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="mb-6 flex items-center gap-3">
                        <Briefcase className="h-6 w-6 text-zinc-900 dark:text-white" />
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Placement Insights</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900">
                            <div className="text-xs text-zinc-500 uppercase tracking-wider">Status</div>
                            <div className="mt-1 text-lg font-bold text-zinc-900 dark:text-white">
                                {performance?.placement?.status || "Not Applied"}
                            </div>
                        </div>
                        <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900">
                            <div className="text-xs text-zinc-500 uppercase tracking-wider">Company</div>
                            <div className="mt-1 text-lg font-bold text-zinc-900 dark:text-white truncate">
                                {performance?.placement?.company_name || "N/A"}
                            </div>
                        </div>
                    </div>
                    <div className="mt-6">
                        <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                            <BookOpen className="h-4 w-4" />
                            {performance?.academic?.cgpa >= 7.5 ? "You are eligible for most top companies!" : "Keep improving to reach the 7.5 CGPA threshold."}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
