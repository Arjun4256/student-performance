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
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-2">
                    <Link href="/faculty/dashboard" className="group flex items-center gap-2 text-xs font-black text-[#3B82F6] uppercase tracking-widest hover:text-[#2563EB] transition-colors">
                        <div className="p-1.5 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        </div>
                        Back to Overview
                    </Link>
                </div>
                <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">Student Management</h1>
                
            </header>

            <main className="space-y-6">
                {/* Search Bar */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-[#94A3B8] group-focus-within:text-[#3B82F6] transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search student by roll number, name, or department..."
                        className="w-full pl-14 pr-6 py-5 bg-white border border-[#E2E8F0] rounded-[2rem] text-[#0F172A] font-bold shadow-sm focus:ring-4 focus:ring-blue-100 focus:border-[#3B82F6] transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Mobile Card View */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                    {filteredStudents.length === 0 ? (
                        <div className="p-12 text-center text-[#64748B] italic">No matching records found.</div>
                    ) : (
                        filteredStudents.map((student) => (
                            <div key={student.login_id} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-xs font-black text-[#6366F1] uppercase tracking-widest">#{student.roll_no}</div>
                                        <h3 className="text-lg font-bold text-[#0F172A]">{student.name || "N/A"}</h3>
                                        <p className="text-xs font-medium text-[#64748B]">{student.department}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-lg font-black ${parseFloat(student.cgpa) >= 8 ? 'text-emerald-600' :
                                            parseFloat(student.cgpa) >= 6 ? 'text-blue-600' : 'text-rose-600'
                                            }`}>
                                            {parseFloat(student.cgpa).toFixed(2)}
                                        </div>
                                        <div className="text-[10px] font-bold text-[#94A3B8] uppercase">CGPA</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                                    <div>
                                        <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-tighter">Academic Progress</div>
                                        <div className="text-sm font-bold text-[#334155]">Year {student.year} | Sem {student.semester}</div>
                                    </div>
                                    <div className="flex justify-end items-center">
                                        <button
                                            onClick={() => handleEdit(student)}
                                            className="h-10 px-4 rounded-xl bg-blue-50 text-[#3B82F6] text-xs font-black hover:bg-[#3B82F6] hover:text-white transition-all active:scale-95"
                                        >
                                            Update Grade
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block rounded-3xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:ring-4 hover:ring-slate-50">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                                    <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-[#64748B]">Roll no</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-[#64748B]">Full Name</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-[#64748B]">Department</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-[#64748B]">Year/Sem</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-[#64748B]">Performance</th>
                                    <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-[#64748B]">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F1F5F9]">
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-16 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="p-4 rounded-full bg-slate-50 text-[#94A3B8]">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                                                </div>
                                                <p className="text-[#64748B] font-bold italic text-sm">No matching records found in registry</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((student) => (
                                        <tr key={student.login_id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <span className="text-xs font-black text-[#6366F1] px-2.5 py-1 bg-indigo-50 rounded-lg shadow-sm">
                                                    #{student.roll_no}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <p className="text-sm font-black text-[#0F172A]">{student.name || "N/A"}</p>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                                    <p className="text-xs font-bold text-[#475569]">{student.department || "N/A"}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <p className="text-xs font-bold text-[#64748B]">Y{student.year} | S{student.semester}</p>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-sm font-black ${parseFloat(student.cgpa) >= 8 ? 'text-emerald-600' :
                                                        parseFloat(student.cgpa) >= 6 ? 'text-blue-600' : 'text-rose-600'
                                                        }`}>
                                                        {parseFloat(student.cgpa).toFixed(2)}
                                                    </span>
                                                    <div className="flex-1 h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${parseFloat(student.cgpa) >= 8 ? 'bg-emerald-500' :
                                                                parseFloat(student.cgpa) >= 6 ? 'bg-blue-500' : 'bg-rose-500'
                                                                }`}
                                                            style={{ width: `${(parseFloat(student.cgpa) / 10) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap text-right">
                                                <button
                                                    onClick={() => handleEdit(student)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-[#3B82F6] bg-blue-50 hover:bg-[#3B82F6] hover:text-white transition-all shadow-sm active:scale-95"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
                                                    Update Grade
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex items-center justify-between px-2 text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">
                    <p>Academic Registry Insights</p>
                    <p>Total Sync: {filteredStudents.length} Students</p>
                </div>
            </main>

            {/* Edit Modal */}
            {editingStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-lg rounded-[2.5rem] bg-white p-10 shadow-2xl border border-[#E2E8F0] animate-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 rounded-2xl bg-blue-50 text-[#3B82F6] shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-[#0F172A] tracking-tight">Grade Submission</h2>
                                <p className="text-xs font-bold text-[#64748B]">Update institutional record for {editingStudent.name}</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="group">
                                <label className="block text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-1.5 ml-1 group-focus-within:text-[#3B82F6] transition-colors"> Name</label>
                                <input
                                    type="text"
                                    className="w-full px-5 py-4 bg-slate-50 border border-[#E2E8F0] rounded-2xl text-sm font-bold text-[#0F172A] focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-[#3B82F6] outline-none transition-all shadow-inner"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="group">
                                <label className="block text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-1.5 ml-1 group-focus-within:text-[#3B82F6] transition-colors">Department</label>
                                <input
                                    type="text"
                                    className="w-full px-5 py-4 bg-slate-50 border border-[#E2E8F0] rounded-2xl text-sm font-bold text-[#0F172A] focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-[#3B82F6] outline-none transition-all shadow-inner"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="group">
                                    <label className="block text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-1.5 ml-1 group-focus-within:text-[#3B82F6] transition-colors">Year</label>
                                    <input
                                        type="number"
                                        className="w-full px-5 py-4 bg-slate-50 border border-[#E2E8F0] rounded-2xl text-sm font-bold text-[#0F172A] focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-[#3B82F6] outline-none transition-all shadow-inner"
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                    />
                                </div>
                                <div className="group">
                                    <label className="block text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-1.5 ml-1 group-focus-within:text-[#3B82F6] transition-colors">Semester</label>
                                    <input
                                        type="number"
                                        className="w-full px-5 py-4 bg-slate-50 border border-[#E2E8F0] rounded-2xl text-sm font-bold text-[#0F172A] focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-[#3B82F6] outline-none transition-all shadow-inner"
                                        value={formData.semester}
                                        onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="p-6 rounded-3xl bg-blue-50/50 border border-blue-100 group">
                                <label className="block text-[10px] font-black text-[#3B82F6] uppercase tracking-widest mb-2 text-center group-focus-within:scale-110 transition-transform">Grade Point Average (CGPA)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="w-full px-5 py-5 bg-white border-2 border-blue-200 rounded-2xl text-2xl font-black text-[#3B82F6] text-center focus:ring-8 focus:ring-blue-100 focus:border-[#3B82F6] outline-none transition-all shadow-lg"
                                    value={formData.cgpa}
                                    onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                                />
                                <p className="mt-3 text-[10px] font-bold text-[#64748B] text-center italic">Institutional threshold for excellence is 8.00+</p>
                            </div>
                        </div>

                        <div className="mt-10 flex gap-4">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-[2] rounded-2xl bg-[#0F172A] py-4 text-sm font-black text-white shadow-xl shadow-slate-200 hover:bg-[#1E293B] hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {saving ? "Publishing..." : "Finalize & Save Record"}
                            </button>
                            <button
                                onClick={() => {
                                    setEditingStudent(null);
                                    setFormData({});
                                }}
                                disabled={saving}
                                className="flex-1 rounded-2xl border-2 border-[#E2E8F0] py-4 text-sm font-black text-[#64748B] hover:bg-slate-50 transition-all font-black active:scale-95 disabled:opacity-50"
                            >
                                Discard
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
