"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "../lib/api";
import Link from "next/link";

export default function StudentList() {
    const router = useRouter();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Filters
    const [filters, setFilters] = useState({
        semester: "",
        search: ""
    });


    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            try {
                // Determine if we need to pass filters. 
                // For now, let's fetch all and filter in UI or pass to API if backend supports it.
                // The backend supports search, department, year, semester.
                const data = await adminApi.getAllStudents(filters);
                setStudents(data);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch students");
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchStudents();
        }, 300); // Debounce for search

        return () => clearTimeout(timeoutId);
    }, [filters]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
            <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center gap-4">
                    <Link href="/admin/dashboard" className="text-sm font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Student Management</h1>
                </div>
            </header>

            <main className="flex-1 p-6">
                <div className="mb-6 flex flex-col gap-4 md:flex-row">
                    <input
                        type="text"
                        name="search"
                        placeholder="Search by Name or Roll No..."
                        value={filters.search}
                        onChange={handleFilterChange}
                        className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-500 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
                    />
                    <select
                        name="semester"
                        value={filters.semester}
                        onChange={handleFilterChange}
                        className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    >
                        <option value="">All Semesters</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                            <option key={sem} value={sem}>Sem {sem}</option>
                        ))}
                    </select>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-400">
                            <thead className="bg-zinc-50 text-xs uppercase text-zinc-500 dark:bg-zinc-900/50 dark:text-zinc-400">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Roll No</th>
                                    <th className="px-6 py-4 font-medium">Name</th>
                                    <th className="px-6 py-4 font-medium">Department</th>
                                    <th className="px-6 py-4 font-medium">Sem</th>
                                    <th className="px-6 py-4 font-medium">CGPA</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-8 text-center">Loading students...</td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-8 text-center text-red-500">{error}</td>
                                    </tr>
                                ) : students.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-8 text-center">No students found.</td>
                                    </tr>
                                ) : (
                                    students.map((student) => (
                                        <tr key={student.login_id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">{student.roll_no}</td>
                                            <td className="px-6 py-4 text-zinc-900 dark:text-white">{student.name || "-"}</td>
                                            <td className="px-6 py-4">{student.department || "-"}</td>
                                            <td className="px-6 py-4">{student.semester ? `Sem ${student.semester}` : "-"}</td>
                                            <td className="px-6 py-4 font-mono">{student.cgpa || "-"}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${student.is_active
                                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                                    }`}>
                                                    {student.is_active ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link
                                                    href={`/admin/students/${student.login_id}`}
                                                    className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                                                >
                                                    View Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
