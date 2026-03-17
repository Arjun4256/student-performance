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
    const [copiedId, setCopiedId] = useState(null);

    // Filters
    const [filters, setFilters] = useState({
        semester: "",
        department: "",
        search: ""
    });


    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            try {
                // Determine if we need to pass filters. 
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

    const handleCopyLogin = (id) => {
        if (typeof window !== "undefined" && navigator.clipboard) {
            navigator.clipboard.writeText(id);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        }
    };

    return (
        <div className="space-y-6">
            <header className="flex flex-col gap-1">
                <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">Student Management</h1>
                <p className="text-[#64748B] font-medium">View and manage all student accounts across departments.</p>
            </header>

            <div className="flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                    <input
                        type="text"
                        name="search"
                        placeholder="Search by Name or Roll No..."
                        value={filters.search}
                        onChange={handleFilterChange}
                        className="w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-[#334155] placeholder-[#94A3B8] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none transition-all shadow-sm"
                    />
                </div>
                <div className="flex gap-4">
                    <select
                        name="semester"
                        value={filters.semester}
                        onChange={handleFilterChange}
                        className="flex-1 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-[#334155] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none transition-all shadow-sm font-medium"
                    >
                        <option value="">All Semesters</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                            <option key={sem} value={sem}>Semester {sem}</option>
                        ))}
                    </select>
                    <select
                        name="department"
                        value={filters.department}
                        onChange={handleFilterChange}
                        className="flex-1 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-[#334155] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none transition-all shadow-sm font-medium"
                    >
                        <option value="">All Departments</option>
                        {["MCA", "AI", "CSE", "BCA", "MBA", "BCOM"].map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {loading ? (
                    <div className="p-12 text-center text-[#64748B]">
                        <div className="flex flex-col items-center gap-2">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#3B82F6] border-t-transparent"></div>
                            Loading students...
                        </div>
                    </div>
                ) : students.length === 0 ? (
                    <div className="p-12 text-center text-[#64748B] italic">No matching students found.</div>
                ) : (
                    students.map((student) => (
                        <div key={student.login_id} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-xs font-black text-[#6366F1] uppercase tracking-widest">#{student.roll_no}</div>
                                    <h3 className="text-lg font-bold text-[#0F172A]">{student.name || "N/A"}</h3>
                                </div>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold ${student.is_active
                                    ? "bg-[#F0FDF4] text-[#166534] border border-[#DCFCE7]"
                                    : "bg-[#FEF2F2] text-[#991B1B] border border-[#FEE2E2]"
                                    }`}>
                                    {student.is_active ? "Active" : "Inactive"}
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                                <div>
                                    <div className="text-[10px] font-bold text-[#94A3B8] uppercase">Department</div>
                                    <div className="text-sm font-bold text-[#334155]">{student.department || "N/A"}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-[#94A3B8] uppercase">Semester</div>
                                    <div className="text-sm font-bold text-[#334155]">Sem {student.semester}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-[#94A3B8] uppercase">CGPA</div>
                                    <div className="text-sm font-black text-[#0F172A]">{student.cgpa || "0.00"}</div>
                                </div>
                                <div className="flex items-end justify-end">
                                    <Link
                                        href={`/admin/students/${student.login_id}`}
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white transition-all shadow-sm"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block rounded-2xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:ring-4 hover:ring-slate-50">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-[#334155]">
                        <thead className="bg-[#F8FAFC] text-xs uppercase text-[#64748B] border-b border-[#E2E8F0]">
                            <tr>
                                <th className="px-6 py-4 font-black tracking-widest">Roll Number</th>
                                <th className="px-6 py-4 font-black tracking-widest">Full Name</th>
                                <th className="px-6 py-4 font-black tracking-widest">Department</th>
                                <th className="px-6 py-4 font-black tracking-widest">Semester</th>
                                <th className="px-6 py-4 font-black tracking-widest">CGPA</th>
                                <th className="px-6 py-4 font-black tracking-widest">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2E8F0]">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-[#64748B]">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#3B82F6] border-t-transparent"></div>
                                            Loading student records...
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-red-500 font-medium">{error}</td>
                                </tr>
                            ) : students.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-[#64748B] font-medium italic">No matching students found in the registry.</td>
                                </tr>
                            ) : (
                                students.map((student) => (
                                    <tr key={student.login_id} className="group hover:bg-[#F8FAFC] transition-colors">
                                        <td className="px-6 py-4 font-bold text-[#0F172A] flex items-center gap-2">
                                            <span className="text-xs font-black text-[#6366F1] px-2 py-1 bg-indigo-50 rounded-lg shadow-sm">#{student.roll_no}</span>
                                            <button
                                                onClick={() => handleCopyLogin(student.login_id)}
                                                className={`opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-white border border-transparent hover:border-[#E2E8F0] shadow-sm text-[#94A3B8] hover:text-[#3B82F6] ${copiedId === student.login_id ? "opacity-100 text-[#10B981]" : ""}`}
                                                title="Copy Login ID"
                                            >
                                                {copiedId === student.login_id ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 font-black text-[#0F172A]">{student.name || "-"}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                                <span className="text-xs font-bold text-[#475569]">{student.department || "N/A"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-[#64748B]">Sem {student.semester || "-"}</td>
                                        <td className="px-6 py-4 font-black text-[#0F172A]">{student.cgpa || "0.00"}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm ${student.is_active
                                                ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100"
                                                : "bg-rose-50 text-rose-600 ring-1 ring-rose-100"
                                                }`}>
                                                <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${student.is_active ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                                                {student.is_active ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/admin/students/${student.login_id}`}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black text-[#3B82F6] bg-blue-50 hover:bg-[#3B82F6] hover:text-white transition-all shadow-sm"
                                            >
                                                View
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
