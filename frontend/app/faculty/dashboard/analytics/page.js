"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { facultyApi } from "../../lib/api";

export default function FacultyAnalytics() {
    const [activeTab, setActiveTab] = useState("all");
    const [allStudents, setAllStudents] = useState([]);
    const [weakStudents, setWeakStudents] = useState([]);
    const [topStudents, setTopStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        department: "",
        semester: "",
        min_cgpa: "",
        max_cgpa: ""
    });
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("facultyToken");
                if (!token) {
                    router.push("/faculty/login");
                    return;
                }

                const [allData, weakData, topData] = await Promise.all([
                    facultyApi.getStudentList(),
                    facultyApi.getWeakStudents(),
                    facultyApi.getTopStudents()
                ]);

                setAllStudents(allData.students || []);
                setWeakStudents(weakData.students || []);
                setTopStudents(topData.students || []);
            } catch (err) {
                console.error("Failed to fetch analytics:", err);
                if (err.message.includes("Unauthorized") || err.message.includes("token")) {
                    localStorage.removeItem("facultyToken");
                    router.push("/faculty/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const applyFilters = async () => {
        setLoading(true);
        try {
            const cleanFilters = Object.fromEntries(
                Object.entries(filters).filter(([_, v]) => v !== "")
            );
            const data = await facultyApi.getStudentList(cleanFilters);
            setAllStudents(data.students || []);
        } catch (err) {
            console.error("Failed to apply filters:", err);
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = async () => {
        setFilters({ department: "", semester: "", min_cgpa: "", max_cgpa: "" });
        setLoading(true);
        try {
            const data = await facultyApi.getStudentList();
            setAllStudents(data.students || []);
        } catch (err) {
            console.error("Failed to clear filters:", err);
        } finally {
            setLoading(false);
        }
    };

    const renderStudentTable = (students, showCGPA = true) => (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-zinc-50 dark:bg-zinc-900">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Roll No</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Department</th>
                            {showCGPA && (
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">CGPA</th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {students.length === 0 ? (
                            <tr>
                                <td colSpan={showCGPA ? "4" : "3"} className="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400">
                                    No students found
                                </td>
                            </tr>
                        ) : (
                            students.map((student) => (
                                <tr key={student.login_id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-900 dark:text-white">
                                        {student.roll_no}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-900 dark:text-white">
                                        {student.name || "N/A"}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                                        {student.department || "N/A"}
                                    </td>
                                    {showCGPA && (
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${student.cgpa >= 8.5
                                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                    : student.cgpa < 6.0
                                                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                                }`}>
                                                {student.cgpa || "N/A"}
                                            </span>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    if (loading && activeTab === "all" && allStudents.length === 0) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
                <div className="text-center">
                    <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 dark:border-indigo-900 dark:border-t-indigo-400"></div>
                    <p className="text-zinc-600 dark:text-zinc-400">Loading analytics...</p>
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
                    <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">Student Analytics</h1>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Analyze student performance data</p>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Tabs */}
                <div className="mb-6 flex gap-2 border-b border-zinc-200 dark:border-zinc-800">
                    <button
                        onClick={() => setActiveTab("all")}
                        className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${activeTab === "all"
                                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                                : "border-transparent text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                            }`}
                    >
                        All Students ({allStudents.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("weak")}
                        className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${activeTab === "weak"
                                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                                : "border-transparent text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                            }`}
                    >
                        Weak Students ({weakStudents.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("top")}
                        className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${activeTab === "top"
                                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                                : "border-transparent text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                            }`}
                    >
                        Top Performers ({topStudents.length})
                    </button>
                </div>

                {/* Filters (only for All Students tab) */}
                {activeTab === "all" && (
                    <div className="mb-6 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Filters</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Department</label>
                                <input
                                    type="text"
                                    placeholder="e.g., CSE"
                                    className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
                                    value={filters.department}
                                    onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Semester</label>
                                <input
                                    type="number"
                                    placeholder="e.g., 6"
                                    className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
                                    value={filters.semester}
                                    onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Min CGPA</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    placeholder="e.g., 6.0"
                                    className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
                                    value={filters.min_cgpa}
                                    onChange={(e) => setFilters({ ...filters, min_cgpa: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Max CGPA</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    placeholder="e.g., 9.0"
                                    className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
                                    value={filters.max_cgpa}
                                    onChange={(e) => setFilters({ ...filters, max_cgpa: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <button
                                onClick={applyFilters}
                                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                            >
                                Apply Filters
                            </button>
                            <button
                                onClick={clearFilters}
                                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                )}

                {/* Content based on active tab */}
                {activeTab === "all" && (
                    <div>
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">All Students</h2>
                            <span className="text-sm text-zinc-600 dark:text-zinc-400">{allStudents.length} students</span>
                        </div>
                        {renderStudentTable(allStudents)}
                    </div>
                )}

                {activeTab === "weak" && (
                    <div>
                        <div className="mb-4 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                            <p className="text-sm text-red-800 dark:text-red-400">
                                Students with CGPA below 6.0 require attention and support
                            </p>
                        </div>
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Weak Students</h2>
                            <span className="text-sm text-zinc-600 dark:text-zinc-400">{weakStudents.length} students</span>
                        </div>
                        {renderStudentTable(weakStudents)}
                    </div>
                )}

                {activeTab === "top" && (
                    <div>
                        <div className="mb-4 rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                            <p className="text-sm text-green-800 dark:text-green-400">
                                Top performing students with CGPA above 8.5
                            </p>
                        </div>
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Top Performers</h2>
                            <span className="text-sm text-zinc-600 dark:text-zinc-400">{topStudents.length} students</span>
                        </div>
                        {renderStudentTable(topStudents)}
                    </div>
                )}
            </main>
        </div>
    );
}
