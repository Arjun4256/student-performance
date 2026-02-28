"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "../lib/api";
import Link from "next/link";

export default function FacultyManagement() {
    const router = useRouter();
    const [facultyList, setFacultyList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const [formData, setFormData] = useState({
        faculty_code: "",
        email: "",
        password: "",
        name: "",
        department: "",
        designation: "Assistant Professor",
        experience: 0
    });

    useEffect(() => {
        fetchFaculty();
    }, []);


    const fetchFaculty = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getAllFaculty();
            setFacultyList(data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch faculty list");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateFaculty = async (e) => {
        e.preventDefault();
        try {
            await adminApi.createFaculty(formData);
            alert("Faculty Created Successfully!");
            setIsModalOpen(false);
            setFormData({
                faculty_code: "",
                email: "",
                password: "",
                name: "",
                department: "",
                designation: "Assistant Professor",
                experience: 0
            });
            fetchFaculty();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDeleteFaculty = async (id) => {
        if (!confirm("Are you sure you want to delete this faculty member?")) return;
        try {
            await adminApi.deleteFaculty(id);
            alert("Faculty Deleted");
            fetchFaculty();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleStatusToggle = async (id, currentStatus) => {
        try {
            const newStatus = !currentStatus;
            await adminApi.updateFacultyStatus(id, newStatus);
            fetchFaculty(); // Refresh the list
        } catch (err) {
            alert(err.message || "Failed to update faculty status");
        }
    };

    const filteredFaculty = useMemo(() => {
        return facultyList.filter(faculty => {
            const matchesSearch =
                faculty.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                faculty.faculty_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                faculty.email?.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesSearch;
        });
    }, [facultyList, searchTerm]);

    const stats = useMemo(() => {
        const total = facultyList.length;
        const active = facultyList.filter(f => f.is_active).length;
        const departments = [...new Set(facultyList.map(f => f.department))].length;
        return { total, active, departments };
    }, [facultyList]);

    return (
        <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
            <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900 sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <Link href="/admin/dashboard" className="rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500"><path d="m15 18-6-6 6-6" /></svg>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 dark:text-white leading-tight">Faculty Dashboard</h1>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">View and manage all faculty accounts</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchFaculty}
                        className="p-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 transition-colors"
                        title="Refresh data"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={loading ? "animate-spin" : ""}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" /></svg>
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-all shadow-sm shadow-blue-500/20"
                    >
                        + Add Faculty
                    </button>
                </div>
            </header>

            <main className="flex-1 p-6 space-y-6">
                {/* Stats Section */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Faculty</p>
                        <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">{stats.total}</p>
                    </div>
                    <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Active Members</p>
                        <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">{stats.active}</p>
                    </div>
                    <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Departments</p>
                        <p className="mt-2 text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.departments}</p>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <div className="relative flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="Search by Name, Code or Email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border border-zinc-300 bg-white pl-10 pr-4 py-2 text-sm text-zinc-900 placeholder-zinc-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white transition-all"
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                    </div>
                </div>

                {/* Table Section */}
                <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-400">
                            <thead className="bg-zinc-50 text-xs font-semibold uppercase text-zinc-500 dark:bg-zinc-900/50 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
                                <tr>
                                    <th className="px-6 py-4">Faculty Info</th>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4">Department</th>
                                    <th className="px-6 py-4">Designation</th>
                                    <th className="px-6 py-4 text-center">Experience</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                {loading ? (
                                    <tr><td colSpan="7" className="px-6 py-12 text-center text-zinc-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                                            Loading faculty members...
                                        </div>
                                    </td></tr>
                                ) : error ? (
                                    <tr><td colSpan="7" className="px-6 py-12 text-center text-red-500">{error}</td></tr>
                                ) : filteredFaculty.length === 0 ? (
                                    <tr><td colSpan="7" className="px-6 py-12 text-center text-zinc-500">No faculty members found match your criteria.</td></tr>
                                ) : (
                                    filteredFaculty.map((faculty) => (
                                        <tr key={faculty.login_id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-zinc-900 dark:text-white">{faculty.name}</span>
                                                    <span className="text-xs text-zinc-500 dark:text-zinc-400">ID: {faculty.faculty_code}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-zinc-600 dark:text-zinc-400">{faculty.email}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex rounded-md bg-zinc-100 px-2 py-1 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                                                    {faculty.department}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-zinc-700 dark:text-zinc-300">{faculty.designation}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-zinc-700 dark:text-zinc-300 font-medium">{faculty.experience}y</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => handleStatusToggle(faculty.login_id, faculty.is_active)}
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold transition-all ${faculty.is_active
                                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                        : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-500"
                                                        }`}
                                                >
                                                    <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${faculty.is_active ? "bg-green-600" : "bg-zinc-400"}`}></span>
                                                    {faculty.is_active ? "Active" : "Inactive"}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDeleteFaculty(faculty.login_id)}
                                                    className="p-2 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Delete Faculty"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Create Faculty Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900 animate-in zoom-in-95 duration-200">
                        <div className="mb-6 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
                            <div>
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Add New Faculty</h3>
                                <p className="text-sm text-zinc-500">Create a new faculty account and profile</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleCreateFaculty} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Faculty Code</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. F001"
                                        value={formData.faculty_code}
                                        onChange={(e) => setFormData({ ...formData, faculty_code: e.target.value })}
                                        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="faculty@college.edu"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Temporary Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Department</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Computer Science"
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Designation</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Professor"
                                        value={formData.designation}
                                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Experience</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.experience}
                                        onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                                        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-bold text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20 active:scale-95 transition-all"
                                >
                                    Create Account
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
