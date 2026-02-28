"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "../../lib/api";
import Link from "next/link";

export default function StudentDetail({ params }) {
    const { id } = use(params);
    const router = useRouter();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Academic Modal State
    const [isAcademicModalOpen, setIsAcademicModalOpen] = useState(false);
    const [academicFormData, setAcademicFormData] = useState({
        name: "",
        department: "",
        year: 1,
        semester: 1,
        cgpa: "",
    });

    const fetchStudent = async () => {
        try {
            const data = await adminApi.getStudentById(id);
            setStudent(data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch student details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchStudent();
    }, [id]);


    const handleVerify = async () => {
        try {
            await adminApi.verifyStudent(id);
            alert("Student Verified Successfully!");
            fetchStudent();
        } catch (err) {
            alert(err.message);
        }
    };

    const toggleStatus = async () => {
        try {
            const newStatus = !student.is_active;
            await adminApi.updateStudentStatus(id, newStatus);
            fetchStudent();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this student permanently?")) return;
        try {
            await adminApi.deleteStudent(id);
            alert("Student Removed");
            router.push("/admin/students");
        } catch (err) {
            alert(err.message);
        }
    };

    const openAcademicModal = () => {
        setAcademicFormData({
            name: student.name || "",
            department: student.department || "CSE",
            year: student.year || 1,
            semester: student.semester || 1,
            cgpa: student.cgpa || "",
        });
        setIsAcademicModalOpen(true);
    };

    const saveAcademicInfo = async (e) => {
        e.preventDefault();
        try {
            // If department is present on the student object, we assume an academic record exists -> UPDATE
            // Otherwise -> CREATE
            if (student.department) {
                await adminApi.updateStudentAcademic(id, academicFormData);
                alert("Academic Info Updated");
            } else {
                await adminApi.createStudentAcademic(id, academicFormData);
                alert("Academic Info Created");
            }
            setIsAcademicModalOpen(false);
            fetchStudent();
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center dark:bg-black dark:text-white">Loading...</div>;
    if (error) return <div className="flex h-screen items-center justify-center text-red-500 dark:bg-black">{error}</div>;
    if (!student) return <div className="flex h-screen items-center justify-center dark:bg-black dark:text-white">Student not found</div>;

    return (
        <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
            <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center gap-4">
                    <Link href="/admin/students" className="text-sm font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
                        ← Back to List
                    </Link>
                    <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Student Profile</h1>
                </div>
                <button
                    onClick={handleDelete}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                    Delete Student
                </button>
            </header>

            <main className="mx-auto w-full max-w-4xl p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Main Info Card */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                                        {student.name || "No Name Provided"}
                                    </h2>
                                    <p className="text-zinc-500 dark:text-zinc-400">Roll No: {student.roll_no}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${student.is_verified
                                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                        }`}>
                                        {student.is_verified ? "Verified" : "Unverified"}
                                    </span>
                                    {!student.is_verified && (
                                        <button
                                            onClick={handleVerify}
                                            className="text-xs text-blue-600 underline hover:text-blue-500"
                                        >
                                            Verify Now
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8 grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Department</label>
                                    <p className="font-semibold text-zinc-900 dark:text-white">{student.department || "-"}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Year</label>
                                    <p className="font-semibold text-zinc-900 dark:text-white">{student.year || "-"}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Semester</label>
                                    <p className="font-semibold text-zinc-900 dark:text-white">{student.semester ? `Sem ${student.semester}` : "-"}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Current CGPA</label>
                                    <p className="font-mono text-xl font-bold text-blue-600 dark:text-blue-400">{student.cgpa || "N/A"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Contact Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Email Address</label>
                                    <p className="text-zinc-900 dark:text-white">{student.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Actions */}
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Actions</h3>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={openAcademicModal}
                                    className="w-full rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                >
                                    {student.department ? "Edit Academic Info" : "Add Academic Info"}
                                </button>
                                <button
                                    onClick={toggleStatus}
                                    className={`w-full rounded-lg border px-4 py-2 text-sm font-medium ${student.is_active
                                        ? "border-red-200 text-red-700 hover:bg-red-50 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/10"
                                        : "border-green-200 text-green-700 hover:bg-green-50 dark:border-green-900/30 dark:text-green-400 dark:hover:bg-green-900/10"
                                        }`}
                                >
                                    {student.is_active ? "Deactivate Student" : "Activate Student"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Academic Info Modal */}
            {isAcademicModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Academic Information</h3>
                            <button onClick={() => setIsAcademicModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                                ✕
                            </button>
                        </div>
                        <form onSubmit={saveAcademicInfo} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={academicFormData.name}
                                    onChange={(e) => setAcademicFormData({ ...academicFormData, name: e.target.value })}
                                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Department</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. CSE"
                                        value={academicFormData.department}
                                        onChange={(e) => setAcademicFormData({ ...academicFormData, department: e.target.value })}
                                        className="w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Year</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="4"
                                        value={academicFormData.year}
                                        onChange={(e) => setAcademicFormData({ ...academicFormData, year: parseInt(e.target.value) })}
                                        className="w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Semester</label>
                                    <select
                                        value={academicFormData.semester}
                                        onChange={(e) => setAcademicFormData({ ...academicFormData, semester: parseInt(e.target.value) })}
                                        className="w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">CGPA</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="10"
                                        value={academicFormData.cgpa}
                                        onChange={(e) => setAcademicFormData({ ...academicFormData, cgpa: e.target.value })}
                                        className="w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAcademicModalOpen(false)}
                                    className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
