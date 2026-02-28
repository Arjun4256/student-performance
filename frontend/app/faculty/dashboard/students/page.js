"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { facultyApi } from "../../lib/api";

export default function StudentManagement() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingStudent, setEditingStudent] = useState(null);
    const [formData, setFormData] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const token = localStorage.getItem("facultyToken");
                if (!token) {
                    router.push("/faculty/login");
                    return;
                }

                const data = await facultyApi.getAllStudents();
                setStudents(data.data || []);
            } catch (err) {
                console.error("Failed to fetch students:", err);
                if (err.message.includes("Unauthorized") || err.message.includes("token")) {
                    localStorage.removeItem("facultyToken");
                    router.push("/faculty/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [router]);

    const handleEdit = (student) => {
        setEditingStudent(student);
        setFormData({
            name: student.name || "",
            department: student.department || "",
            year: student.year || "",
            semester: student.semester || "",
            cgpa: student.cgpa || ""
        });
    };

    const handleSave = async () => {
        if (!editingStudent) return;

        setSaving(true);
        try {
            await facultyApi.updateStudentMarks(editingStudent.login_id, formData);

            // Update local state
            setStudents(students.map(s =>
                s.login_id === editingStudent.login_id
                    ? { ...s, ...formData }
                    : s
            ));

            setEditingStudent(null);
            setFormData({});
        } catch (err) {
            console.error("Failed to update student:", err);
            alert(err.message);
        } finally {
            setSaving(false);
        }
    };

    const filteredStudents = students.filter(student =>
        student.roll_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
                <div className="text-center">
                    <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 dark:border-indigo-900 dark:border-t-indigo-400"></div>
                    <p className="text-zinc-600 dark:text-zinc-400">Loading students...</p>
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
                    <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">Student Management</h1>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">View and update student academic records</p>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Search Bar */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search by roll number, name, or department..."
                        className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Students Table */}
                <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-zinc-50 dark:bg-zinc-900">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Roll No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Department</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Year</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Semester</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">CGPA</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400">
                                            No students found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((student) => (
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
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                                                {student.year || "N/A"}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                                                {student.semester || "N/A"}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-zinc-900 dark:text-white">
                                                {student.cgpa || "N/A"}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                <button
                                                    onClick={() => handleEdit(student)}
                                                    className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                    Showing {filteredStudents.length} of {students.length} students
                </div>
            </main>

            {/* Edit Modal */}
            {editingStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-8 dark:bg-zinc-900">
                        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white">Edit Student Record</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Name</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Department</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Year</label>
                                    <input
                                        type="number"
                                        className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Semester</label>
                                    <input
                                        type="number"
                                        className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                        value={formData.semester}
                                        onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">CGPA</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                    value={formData.cgpa}
                                    onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex gap-4">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                            <button
                                onClick={() => {
                                    setEditingStudent(null);
                                    setFormData({});
                                }}
                                disabled={saving}
                                className="flex-1 rounded-lg border border-zinc-300 py-2.5 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
