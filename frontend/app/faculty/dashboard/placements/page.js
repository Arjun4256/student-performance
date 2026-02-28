"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { facultyApi } from "../../lib/api";

export default function PlacementTracking() {
    const [placements, setPlacements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("all");

    const router = useRouter();

    useEffect(() => {
        const fetchPlacements = async () => {
            try {
                const token = localStorage.getItem("facultyToken");
                if (!token) {
                    router.push("/faculty/login");
                    return;
                }

                const data = await facultyApi.getAllPlacements();
                setPlacements(data.data || []);
            } catch (err) {
                console.error("Failed to fetch placements:", err);
                if (err.message.includes("Unauthorized") || err.message.includes("token")) {
                    localStorage.removeItem("facultyToken");
                    router.push("/faculty/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPlacements();
    }, [router]);



    const filteredPlacements = placements.filter(p => {
        return filterStatus === "all" || p.status?.toLowerCase() === filterStatus;
    });

    const stats = {
        total: placements.length,
        placed: placements.filter(p => p.status?.toLowerCase() === "selected").length,
        unplaced: placements.filter(p => p.status?.toLowerCase() === "rejected").length,
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
                <div className="text-center">
                    <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 dark:border-indigo-900 dark:border-t-indigo-400"></div>
                    <p className="text-zinc-600 dark:text-zinc-400">Loading placements...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
            <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <Link href="/faculty/dashboard" className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">Placement Tracking</h1>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Monitor student placement records</p>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Statistics */}
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                        <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Records</div>
                        <div className="mt-1 text-3xl font-bold text-zinc-900 dark:text-white">{stats.total}</div>
                    </div>
                    <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-white p-4 dark:border-green-900/30 dark:from-green-950/20 dark:to-zinc-950">
                        <div className="text-sm font-medium text-green-700 dark:text-green-400">Placed</div>
                        <div className="mt-1 text-3xl font-bold text-green-900 dark:text-green-300">{stats.placed}</div>
                    </div>
                    <div className="rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-4 dark:border-orange-900/30 dark:from-orange-950/20 dark:to-zinc-950">
                        <div className="text-sm font-medium text-orange-700 dark:text-orange-400">Unplaced</div>
                        <div className="mt-1 text-3xl font-bold text-orange-900 dark:text-orange-300">{stats.unplaced}</div>
                    </div>
                </div>

                {/* Filter Controls */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Status Tabs */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilterStatus("all")}
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${filterStatus === "all"
                                ? "bg-indigo-600 text-white dark:bg-indigo-500"
                                : "bg-white text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilterStatus("selected")}
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${filterStatus === "selected"
                                ? "bg-indigo-600 text-white dark:bg-indigo-500"
                                : "bg-white text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                }`}
                        >
                            Placed
                        </button>
                        <button
                            onClick={() => setFilterStatus("rejected")}
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${filterStatus === "rejected"
                                ? "bg-indigo-600 text-white dark:bg-indigo-500"
                                : "bg-white text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                }`}
                        >
                            Unplaced
                        </button>
                    </div>


                </div>

                {/* Placements Table */}
                <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-zinc-50 dark:bg-zinc-900">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Student Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Roll No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Department</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Company</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Package</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                {filteredPlacements.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400">
                                            No placement records found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPlacements.map((placement) => (
                                        <tr key={placement.placement_id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-900 dark:text-white">
                                                {placement.name || "N/A"}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                                                {placement.roll_no}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                                                {placement.department || "N/A"}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-900 dark:text-white">
                                                {placement.company_name || "N/A"}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-zinc-900 dark:text-white">
                                                {placement.package ? `₹${placement.package} LPA` : "N/A"}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${placement.status?.toLowerCase() === "selected"
                                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                    : "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                                                    }`}>
                                                    {placement.status || "Unknown"}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                                                {placement.created_at ? new Date(placement.created_at).toLocaleDateString() : "N/A"}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                    Showing {filteredPlacements.length} of {placements.length} records
                </div>
            </main>
        </div>
    );
}
