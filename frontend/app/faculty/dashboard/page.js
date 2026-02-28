"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import 'chart.js/auto';
import { Bar, Pie } from 'react-chartjs-2';

import { facultyApi } from "../lib/api";

export default function FacultyDashboardOverview() {
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState(null);
    const [placementStats, setPlacementStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileData, statsData, placementData] = await Promise.all([
                    facultyApi.getProfile(),
                    facultyApi.getDashboardStats(),
                    facultyApi.getFacultyPlacementRatio()
                ]);
                setProfile(profileData.data);
                setStats(statsData.data);
                setPlacementStats(placementData);
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 dark:border-indigo-900 dark:border-t-indigo-400 mx-auto"></div>
                    <p className="text-zinc-600 dark:text-zinc-400">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    const cgpaData = {
        labels: ['< 6', '6-7', '7-8', '8-9', '9-10'],
        datasets: [{
            label: 'Number of Students',
            data: [
                stats?.cgpa_distribution?.['<6'] || 0,
                stats?.cgpa_distribution?.['6-7'] || 0,
                stats?.cgpa_distribution?.['7-8'] || 0,
                stats?.cgpa_distribution?.['8-9'] || 0,
                stats?.cgpa_distribution?.['9-10'] || 0,
            ],
            backgroundColor: '#e41956',
            borderRadius: 6,
        }]
    };

    const placementPieData = {
        labels: ['Placed', 'Unplaced'],
        datasets: [{
            data: [
                parseInt(placementStats?.placed_students || 0),
                parseInt(placementStats?.unplaced_students || 0),
            ],
            backgroundColor: ['#10b981', '#ef4444'],
            borderColor: ['#059669', '#dc2626'],
            borderWidth: 1,
        }]
    };

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                    Welcome back, {profile?.name ? `Prof. ${profile.name}` : "Faculty"}!
                </h1>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                    {profile?.department} Department | {profile?.designation}
                </p>
            </header>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Students</p>
                    <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">{stats?.total_students || 0}</p>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Average CGPA</p>
                    <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">{stats?.average_cgpa || "N/A"}</p>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Placed</p>
                    <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">{stats?.placement_stats?.placed || 0}</p>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Unplaced</p>
                    <p className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">{stats?.placement_stats?.rejected || 0}</p>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* CGPA Distribution */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                    <h3 className="mb-6 text-lg font-semibold text-zinc-900 dark:text-white">CGPA Distribution</h3>
                    {cgpaData.datasets[0].data.some(v => v > 0) ? (
                        <div className="relative h-64 w-full">
                            <Bar data={cgpaData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                        </div>
                    ) : (
                        <div className="flex h-64 w-full items-center justify-center text-zinc-500">
                            No CGPA distribution data available
                        </div>
                    )}
                </div>

                {/* Placement Ratio Pie Chart */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                    <h3 className="mb-6 text-lg font-semibold text-zinc-900 dark:text-white">Placement Ratio</h3>
                    {(placementStats?.placed_students > 0 || placementStats?.unplaced_students > 0) ? (
                        <div className="relative h-64 w-full flex justify-center">
                            <Pie
                                data={placementPieData}
                                options={{
                                    maintainAspectRatio: false,
                                    plugins: {
                                        tooltip: {
                                            callbacks: {
                                                label: function (context) {
                                                    let label = context.label || '';
                                                    if (label) {
                                                        label += ': ';
                                                    }
                                                    let value = context.parsed;
                                                    let total = context.chart._metasets[context.datasetIndex].total;
                                                    let percentage = ((value / total) * 100).toFixed(1) + '%';
                                                    return label + value + ' (' + percentage + ')';
                                                }
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>
                    ) : (
                        <div className="flex h-64 w-full items-center justify-center text-zinc-500">
                            No placement data available
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
