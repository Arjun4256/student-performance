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

    if (loading) return (
        <div className="flex h-screen flex-col items-center justify-center bg-[#F1F5F9] gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#3B82F6] border-t-transparent shadow-sm"></div>
            <p className="text-sm font-bold text-[#64748B] animate-pulse">Loading Student Profile...</p>
        </div>
    );

    if (error) return (
        <div className="flex h-screen items-center justify-center bg-[#F1F5F9] p-6 text-center">
            <div className="max-w-md rounded-2xl bg-white p-8 shadow-sm border border-[#E2E8F0]">
                <div className="text-red-500 mb-4 inline-flex items-center justify-center w-12 h-12 bg-red-50 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                </div>
                <h2 className="text-xl font-bold text-[#0F172A] mb-2">Error Occurred</h2>
                <p className="text-[#64748B] font-medium mb-6">{error}</p>
                <Link href="/admin/students" className="px-6 py-2.5 bg-[#3B82F6] text-white rounded-xl font-bold shadow-lg shadow-[#3B82F6]/20 hover:bg-[#2563EB] transition-all">
                    Return to Student List
                </Link>
            </div>
        </div>
    );

    if (!student) return (
        <div className="flex h-screen items-center justify-center bg-[#F1F5F9]">
            <div className="text-center">
                <p className="text-lg font-bold text-[#64748B]">Student profile not found</p>
                <Link href="/admin/students" className="text-[#3B82F6] font-bold hover:underline mt-4 inline-block">Back to Students</Link>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen flex-col bg-[#F1F5F9]">
            <header className="flex items-center justify-between border-b border-[#E2E8F0] bg-white px-6 py-4 sticky top-0 z-10 backdrop-blur-md bg-white/80">
                <div className="flex items-center gap-4">
                    <Link href="/admin/students" className="rounded-xl p-2.5 hover:bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] transition-all group">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#64748B] group-hover:text-[#0F172A] transition-colors"><path d="m15 18-6-6 6-6" /></svg>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-[#0F172A] leading-tight">Student Profile</h1>
                        <p className="text-xs font-medium text-[#64748B]">Detailed academic and account information</p>
                    </div>
                </div>
                <button
                    onClick={handleDelete}
                    className="rounded-xl px-5 py-2.5 text-sm font-bold text-[#EF4444] hover:bg-red-50 hover:text-red-700 transition-all border border-transparent hover:border-red-100"
                >
                    Delete Permanently
                </button>
            </header>

            <main className="w-full max-w-7xl mx-auto p-6 space-y-6">
                {/* Header Card */}
                <div className="rounded-3xl border border-[#E2E8F0] bg-white p-8 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#6366F1] flex items-center justify-center text-white text-3xl font-extrabold shadow-lg shadow-blue-200">
                                {student.name ? student.name.charAt(0).toUpperCase() : "S"}
                            </div>
                            <div>
                                <h2 className="text-3xl font-extrabold text-[#0F172A]">
                                    {student.name || "Unnamed Student"}
                                </h2>
                                <div className="mt-1 flex items-center gap-3">
                                    <span className="text-[#64748B] font-bold text-sm tracking-wide">ROLL NO: {student.roll_no}</span>
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#E2E8F0]"></span>
                                    <span className="text-[#64748B] font-bold text-sm tracking-wide">UID: {id.slice(0, 8)}...</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                            <span className={`inline-flex items-center rounded-full px-4 py-1.5 text-xs font-extrabold border ${student.is_verified
                                ? "bg-[#F0FDF4] text-[#166534] border-[#DCFCE7]"
                                : "bg-[#FFFBEB] text-[#92400E] border-[#FEF3C7]"
                                }`}>
                                <span className={`mr-2 h-2 w-2 rounded-full ${student.is_verified ? "bg-[#22C55E]" : "bg-[#F59E0B]"}`}></span>
                                {student.is_verified ? "VERIFIED PROFILE" : "VERIFICATION PENDING"}
                            </span>
                            {!student.is_verified && (
                                <button
                                    onClick={handleVerify}
                                    className="text-xs font-bold text-[#3B82F6] hover:text-[#2563EB] bg-blue-50 px-3 py-1.5 rounded-lg transition-all"
                                >
                                    Verify student account →
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-4 pt-10 border-t border-[#F1F5F9]">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-widest text-[#94A3B8]">Department</label>
                            <p className="text-lg font-bold text-[#0F172A]">{student.department || "No Dept Assign"}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-widest text-[#94A3B8]">Academic Year</label>
                            <p className="text-lg font-bold text-[#0F172A]">{student.year ? `Year ${student.year}` : "No Year Info"}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-widest text-[#94A3B8]">Semester</label>
                            <p className="text-lg font-bold text-[#0F172A]">{student.semester ? `Sem ${student.semester}` : "No Sem Info"}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-widest text-[#94A3B8]">Academic CGPA</label>
                            <div className="flex items-baseline gap-1">
                                <p className="text-3xl font-black text-[#3B82F6]">{student.cgpa || "0.00"}</p>
                                <span className="text-xs font-bold text-[#94A3B8]">/ 10.0</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Contact Info */}
                    <div className="md:col-span-2 rounded-3xl border border-[#E2E8F0] bg-white p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-[#F1F5F9] rounded-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#3B82F6]"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                            </div>
                            <h3 className="text-xl font-extrabold text-[#0F172A]">Contact Details</h3>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-[#94A3B8] block mb-1">Email Address</label>
                                <p className="text-lg font-bold text-[#334155]">{student.email}</p>
                            </div>
                            <div className="pt-4 border-t border-[#F8FAFC]">
                                <label className="text-xs font-bold uppercase tracking-widest text-[#94A3B8] block mb-1">Account Creation Date</label>
                                <p className="text-sm font-bold text-[#64748B]">Updated on {new Date().toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Management Actions */}
                    <div className="rounded-3xl border border-[#E2E8F0] bg-white p-8 shadow-sm flex flex-col">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-[#F1F5F9] rounded-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#3B82F6]"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
                            </div>
                            <h3 className="text-xl font-extrabold text-[#0F172A]">Management</h3>
                        </div>
                        <div className="flex-1 space-y-4">
                            <button
                                onClick={openAcademicModal}
                                className="w-full rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] px-6 py-4 text-sm font-bold text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white hover:border-[#3B82F6] transition-all shadow-sm group"
                            >
                                <span className="flex items-center justify-between">
                                    {student.department ? "Update Academics" : "Initialize Academics"}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                </span>
                            </button>
                            <button
                                onClick={toggleStatus}
                                className={`w-full rounded-2xl border px-6 py-4 text-sm font-bold transition-all shadow-sm ${student.is_active
                                    ? "bg-red-50 border-red-100 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600"
                                    : "bg-green-50 border-green-100 text-green-600 hover:bg-green-600 hover:text-white hover:border-green-600"
                                    }`}
                            >
                                <span className="flex items-center justify-between">
                                    {student.is_active ? "Deactivate Access" : "Restore Access"}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
                                </span>
                            </button>
                        </div>
                        <p className="mt-8 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest text-center">Admin Privilege Required</p>
                    </div>
                </div>
            </main>

            {/* Academic Info Modal */}
            {isAcademicModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0F172A]/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200 border border-[#E2E8F0]">
                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-extrabold text-[#0F172A]">Record Management</h3>
                                <p className="text-sm font-medium text-[#64748B]">Update official student credentials</p>
                            </div>
                            <button onClick={() => setIsAcademicModalOpen(false)} className="rounded-full p-2 text-[#94A3B8] hover:bg-[#F8FAFC] transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={saveAcademicInfo} className="space-y-6">
                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#64748B]">Legal Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={academicFormData.name}
                                    onChange={(e) => setAcademicFormData({ ...academicFormData, name: e.target.value })}
                                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm font-medium text-[#334155] focus:bg-white focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#64748B]">Department Code</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. CSE"
                                        value={academicFormData.department}
                                        onChange={(e) => setAcademicFormData({ ...academicFormData, department: e.target.value })}
                                        className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm font-medium text-[#334155] focus:bg-white focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#64748B]">Study Year</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="4"
                                        value={academicFormData.year}
                                        onChange={(e) => setAcademicFormData({ ...academicFormData, year: parseInt(e.target.value) })}
                                        className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm font-medium text-[#334155] focus:bg-white focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#64748B]">Semester</label>
                                    <select
                                        value={academicFormData.semester}
                                        onChange={(e) => setAcademicFormData({ ...academicFormData, semester: parseInt(e.target.value) })}
                                        className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm font-bold text-[#334155] focus:bg-white focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none transition-all"
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#64748B]">Aggregate CGPA</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="10"
                                        value={academicFormData.cgpa}
                                        onChange={(e) => setAcademicFormData({ ...academicFormData, cgpa: e.target.value })}
                                        className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm font-bold text-[#3B82F6] focus:bg-white focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="mt-10 flex justify-end gap-3 pt-6 border-t border-[#E2E8F0]">
                                <button
                                    type="button"
                                    onClick={() => setIsAcademicModalOpen(false)}
                                    className="px-6 py-2.5 text-sm font-bold text-[#64748B] hover:text-[#0F172A] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-[#3B82F6] px-8 py-2.5 text-sm font-bold text-white hover:bg-[#2563EB] shadow-lg shadow-[#3B82F6]/20 active:scale-95 transition-all"
                                >
                                    Commit Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
