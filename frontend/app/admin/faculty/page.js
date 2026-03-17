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
        <div className="space-y-6">
            <header className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">Faculty Dashboard</h1>
                    <p className="text-[#64748B] font-medium">Manage academic staff and accounts</p>
                </div>
                <div className="flex items-center gap-3 mt-4 md:mt-0">
                    <button
                        onClick={fetchFaculty}
                        className="p-2.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] shadow-sm transition-all"
                        title="Refresh data"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`${loading ? "animate-spin" : ""} text-[#64748B]`}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" /></svg>
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex-1 md:flex-none rounded-xl bg-[#3B82F6] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#2563EB] shadow-lg shadow-[#3B82F6]/20 transition-all active:scale-95"
                    >
                        + Add Faculty
                    </button>
                </div>
            </header>

            {/* Stats Section */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Total Faculty</p>
                    <p className="mt-2 text-3xl font-extrabold text-[#0F172A]">{stats.total}</p>
                </div>
                <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Active Members</p>
                    <p className="mt-2 text-3xl font-extrabold text-[#10B981]">{stats.active}</p>
                </div>
                <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Departments</p>
                    <p className="mt-2 text-3xl font-extrabold text-[#6366F1]">{stats.departments}</p>
                </div>
            </div>

            {/* Filters Section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white px-5 py-4 rounded-2xl border border-[#E2E8F0] shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder="Search by Name, Code or Email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] pl-10 pr-4 py-2.5 text-sm font-medium text-[#334155] placeholder-[#94A3B8] focus:bg-white focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none transition-all"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {loading ? (
                    <div className="p-12 text-center text-[#64748B]">Loading faculty...</div>
                ) : filteredFaculty.length === 0 ? (
                    <div className="p-12 text-center text-[#64748B] italic">No matching faculty found.</div>
                ) : (
                    filteredFaculty.map((faculty) => (
                        <div key={faculty.login_id} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-xs font-black text-[#64748B] uppercase tracking-tighter">ID: {faculty.faculty_code}</div>
                                    <h3 className="text-lg font-bold text-[#0F172A]">{faculty.name}</h3>
                                    <p className="text-sm font-medium text-[#64748B]">{faculty.email}</p>
                                </div>
                                <button
                                    onClick={() => handleStatusToggle(faculty.login_id, faculty.is_active)}
                                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold ${faculty.is_active
                                        ? "bg-[#F0FDF4] text-[#166534] border border-[#DCFCE7]"
                                        : "bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]"
                                        }`}
                                >
                                    {faculty.is_active ? "Active" : "Inactive"}
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                                <div>
                                    <div className="text-[10px] font-bold text-[#94A3B8] uppercase">Department</div>
                                    <div className="text-sm font-bold text-[#334155]">{faculty.department}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-[#94A3B8] uppercase">Designation</div>
                                    <div className="text-sm font-bold text-[#334155]">{faculty.designation}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-[#94A3B8] uppercase">Experience</div>
                                    <div className="text-sm font-black text-[#0F172A]">{faculty.experience} Years</div>
                                </div>
                                <div className="flex items-end justify-end gap-2">
                                    <button
                                        onClick={() => handleDeleteFaculty(faculty.login_id)}
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-[#EF4444] hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Desktop Table Section */}
            <div className="hidden md:block rounded-2xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-[#334155]">
                        <thead className="bg-[#F8FAFC] text-xs font-bold uppercase text-[#64748B] border-b border-[#E2E8F0]">
                            <tr>
                                <th className="px-6 py-4">Faculty Member</th>
                                <th className="px-6 py-4">Contact Details</th>
                                <th className="px-6 py-4">Department</th>
                                <th className="px-6 py-4">Designation</th>
                                <th className="px-6 py-4 text-center">Experience</th>
                                <th className="px-6 py-4 text-center">Account Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2E8F0]">
                            {loading ? (
                                <tr><td colSpan="7" className="px-6 py-16 text-center text-[#64748B]">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3B82F6] border-t-transparent"></div>
                                        <p className="font-medium">Loading faculty directory...</p>
                                    </div>
                                </td></tr>
                            ) : error ? (
                                <tr><td colSpan="7" className="px-6 py-16 text-center text-red-500 font-bold">{error}</td></tr>
                            ) : filteredFaculty.length === 0 ? (
                                <tr><td colSpan="7" className="px-6 py-16 text-center text-[#64748B] font-medium italic">No faculty members found matching your search.</td></tr>
                            ) : (
                                filteredFaculty.map((faculty) => (
                                    <tr key={faculty.login_id} className="hover:bg-[#F8FAFC] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-[#0F172A]">{faculty.name}</span>
                                                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-tighter">ID: {faculty.faculty_code}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-[#334155]">{faculty.email}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex rounded-lg bg-[#6366F1]/10 px-2.5 py-1 text-xs font-bold text-[#6366F1] border border-[#6366F1]/20">
                                                {faculty.department}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-[#475569]">{faculty.designation}</td>
                                        <td className="px-6 py-4 text-center font-bold text-[#0F172A]">{faculty.experience}y</td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleStatusToggle(faculty.login_id, faculty.is_active)}
                                                className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold transition-all border ${faculty.is_active
                                                    ? "bg-[#F0FDF4] text-[#166534] border-[#DCFCE7]"
                                                    : "bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]"
                                                    }`}
                                            >
                                                <span className={`mr-2 h-1.5 w-1.5 rounded-full ${faculty.is_active ? "bg-[#22C55E]" : "bg-[#94A3B8]"}`}></span>
                                                {faculty.is_active ? "Active" : "Inactive"}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDeleteFaculty(faculty.login_id)}
                                                className="p-2.5 text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEF2F2] rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                                title="Remove Faculty"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Faculty Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0F172A]/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200 border border-[#E2E8F0]">
                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-[#0F172A]">Add New Faculty Member</h3>
                                <p className="text-sm font-medium text-[#64748B]">Create a professional profile for staff accounts</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="rounded-full p-2 text-[#94A3B8] hover:bg-[#F8FAFC] transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleCreateFaculty} className="space-y-6">
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#64748B]">Faculty Employee Code</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. F001"
                                        value={formData.faculty_code}
                                        onChange={(e) => setFormData({ ...formData, faculty_code: e.target.value })}
                                        className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm font-medium text-[#334155] focus:bg-white focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#64748B]">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Enter legal name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm font-medium text-[#334155] focus:bg-white focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#64748B]">Institutional Email</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="faculty@college.edu"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm font-medium text-[#334155] focus:bg-white focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#64748B]">Temporary Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm font-medium text-[#334155] focus:bg-white focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-5">
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#64748B]">Department</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. CSE"
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm font-medium text-[#334155] focus:bg-white focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#64748B]">Designation</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Professor"
                                        value={formData.designation}
                                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                        className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm font-medium text-[#334155] focus:bg-white focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#64748B]">Exp (Years)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.experience}
                                        onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                                        className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm font-medium text-[#334155] focus:bg-white focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="mt-10 flex justify-end gap-3 pt-6 border-t border-[#E2E8F0]">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2.5 text-sm font-bold text-[#64748B] hover:text-[#0F172A] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-[#3B82F6] px-8 py-2.5 text-sm font-bold text-white hover:bg-[#2563EB] shadow-lg shadow-[#3B82F6]/20 active:scale-95 transition-all"
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
