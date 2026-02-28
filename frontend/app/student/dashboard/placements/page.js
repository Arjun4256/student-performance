"use client";

import { useEffect, useState } from "react";
import { studentApi } from "../../lib/api";

export default function StudentPlacements() {
    const [placements, setPlacements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPlacements = async () => {
            try {
                const data = await studentApi.getPlacements();
                setPlacements(data.placements || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPlacements();
    }, []);

    if (loading) return <div className="animate-pulse">Loading placements...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Placement Records</h1>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">Track your recruitment status and offers</p>
            </header>

            {placements.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
                    <div className="mb-4 text-4xl">💼</div>
                    <h3 className="text-lg font-medium text-zinc-900 dark:text-white">No placement records found</h3>
                    <p className="mt-1 text-zinc-500">Your placement history will appear here once updated.</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-zinc-100 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/50">
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Company</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Package (LPA)</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {placements.map((record, index) => (
                                <tr key={index} className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50">
                                    <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">{record.company_name}</td>
                                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{record.package}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${record.status === 'Placed' || record.status === 'Hired'
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                                            }`}>
                                            {record.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-zinc-500">
                                        {new Date(record.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
