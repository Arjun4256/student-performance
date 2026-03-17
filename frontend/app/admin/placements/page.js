"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "../lib/api";
import Link from "next/link";

export default function PlacementsList() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("all"); // all, placed, unplaced
    const [placements, setPlacements] = useState([]);
    const [placedStudents, setPlacedStudents] = useState([]);
    const [unplacedStudents, setUnplacedStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Edit & Create States
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ company_name: "", package: "", status: "" });
    const [showAddModal, setShowAddModal] = useState(false);
    const [newPlacement, setNewPlacement] = useState({ student_id: "", company_name: "", package: "", status: "Applied" });
    const [departmentFilter, setDepartmentFilter] = useState("");


    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            router.push("/admin/login");
        } else {
            fetchAllData();
        }
    }, [router, departmentFilter]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const filters = departmentFilter ? { department: departmentFilter } : {};
            const [allData, pData, uData] = await Promise.all([
                adminApi.getAllPlacements(filters),
                adminApi.getPlacedStudents(filters),
                adminApi.getUnplacedStudents(filters)
            ]);
            setPlacements(allData);
            setPlacedStudents(pData);
            setUnplacedStudents(uData);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (placement) => {
        setEditingId(placement.placement_id);
        setEditForm({
            company_name: placement.company_name || "",
            package: placement.package || "",
            status: placement.status || "Applied"
        });
    };

    const handleEditSave = async (id) => {
        try {
            await adminApi.updatePlacement(id, editForm);
            setEditingId(null);
            fetchAllData();
        } catch (err) {
            console.error("Failed to update placement", err);
            alert("Failed to update: " + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this placement record?")) return;
        try {
            await adminApi.deletePlacement(id);
            fetchAllData();
        } catch (err) {
            console.error("Failed to delete", err);
            alert("Failed to delete: " + err.message);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await adminApi.createPlacement(newPlacement);
            setShowAddModal(false);
            setNewPlacement({ student_id: "", company_name: "", package: "", status: "Applied" });
            fetchAllData();
        } catch (err) {
            console.error("Failed to create placement", err);
            alert("Failed to create: " + err.message);
        }
    };

    const renderAllPlacements = () => (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#334155]">
                <thead className="bg-[#F8FAFC] text-xs uppercase text-[#64748B] border-b border-[#E2E8F0]">
                    <tr>
                        <th className="px-6 py-4 font-bold">Student Info</th>
                        <th className="px-6 py-4 font-bold">Company</th>
                        <th className="px-6 py-4 font-bold">Package</th>
                        <th className="px-6 py-4 font-bold">Status</th>
                        <th className="px-6 py-4 font-bold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                    {loading ? (
                        <tr><td colSpan="5" className="px-6 py-12 text-center text-[#64748B] italic">Loading...</td></tr>
                    ) : placements.length === 0 ? (
                        <tr><td colSpan="5" className="px-6 py-12 text-center text-[#64748B] italic">No placement records found.</td></tr>
                    ) : (
                        placements.map((p) => (
                            <tr key={p.placement_id} className="group hover:bg-[#F8FAFC] transition-colors">
                                <td className="px-6 py-4 font-bold text-[#0F172A]">
                                    <div>{p.roll_no}</div>
                                    <div className="text-[11px] font-medium text-[#64748B]">{p.email}</div>
                                </td>
                                <td className="px-6 py-4 font-semibold">
                                    {editingId === p.placement_id ? (
                                        <input type="text" value={editForm.company_name} onChange={(e) => setEditForm({ ...editForm, company_name: e.target.value })} className="w-full rounded-lg border border-[#E2E8F0] px-3 py-1 text-sm text-[#334155] focus:border-[#3B82F6] outline-none" />
                                    ) : (p.company_name)}
                                </td>
                                <td className="px-6 py-4 font-bold text-[#3B82F6]">
                                    {editingId === p.placement_id ? (
                                        <input type="text" value={editForm.package} onChange={(e) => setEditForm({ ...editForm, package: e.target.value })} className="w-full rounded-lg border border-[#E2E8F0] px-3 py-1 text-sm text-[#334155] focus:border-[#3B82F6] outline-none" />
                                    ) : (p.package ? `${p.package} LPA` : "-")}
                                </td>
                                <td className="px-6 py-4">
                                    {editingId === p.placement_id ? (
                                        <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} className="w-full rounded-lg border border-[#E2E8F0] px-2 py-1 text-sm text-[#334155] focus:border-[#3B82F6] outline-none">
                                            <option value="Applied">Applied</option>
                                            <option value="Interviewing">Interviewing</option>
                                            <option value="Selected">Selected</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    ) : (
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ${p.status?.toLowerCase() === "selected" ? "bg-[#F0FDF4] text-[#166534] border border-[#DCFCE7]" :
                                            p.status?.toLowerCase() === "rejected" ? "bg-[#FEF2F2] text-[#991B1B] border border-[#FEE2E2]" :
                                                "bg-[#FFFBEB] text-[#92400E] border border-[#FEF3C7]"
                                            }`}>
                                            <span className={`mr-1.5 h-1 w-1 rounded-full ${p.status?.toLowerCase() === "selected" ? "bg-[#22C55E]" : p.status?.toLowerCase() === "rejected" ? "bg-[#EF4444]" : "bg-[#F59E0B]"}`}></span>
                                            {p.status}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {editingId === p.placement_id ? (
                                        <div className="flex justify-end gap-3 text-xs font-bold">
                                            <button onClick={() => handleEditSave(p.placement_id)} className="text-[#10B981] hover:underline">Save</button>
                                            <button onClick={() => setEditingId(null)} className="text-[#64748B] hover:underline">Cancel</button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-end gap-4 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEditClick(p)} className="text-[#3B82F6] hover:underline">Edit</button>
                                            <button onClick={() => handleDelete(p.placement_id)} className="text-[#EF4444] hover:underline">Delete</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );

    const renderStudentList = (students, type) => (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#334155]">
                <thead className="bg-[#F8FAFC] text-xs uppercase text-[#64748B] border-b border-[#E2E8F0]">
                    <tr>
                        <th className="px-6 py-4 font-bold">Roll Number</th>
                        <th className="px-6 py-4 font-bold">FullName</th>
                        <th className="px-6 py-4 font-bold">Department</th>
                        <th className="px-6 py-4 font-bold">CGPA</th>
                        <th className="px-6 py-4 font-bold">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                    {loading ? (
                        <tr><td colSpan="5" className="px-6 py-12 text-center text-[#64748B] italic">Loading...</td></tr>
                    ) : students.length === 0 ? (
                        <tr><td colSpan="5" className="px-6 py-12 text-center text-[#64748B] italic">No students found.</td></tr>
                    ) : (
                        students.map((s) => (
                            <tr key={s.login_id} className="hover:bg-[#F8FAFC] transition-colors">
                                <td className="px-6 py-4 font-bold text-[#0F172A]">{s.roll_no || "-"}</td>
                                <td className="px-6 py-4 font-semibold text-[#334155]">{s.name || "Unknown"}</td>
                                <td className="px-6 py-4">
                                    <span className="font-medium text-[#64748B]">{s.department || "N/A"}</span>
                                    <span className="ml-1.5 text-[10px] font-bold text-[#94A3B8]">SEM {s.semester || "-"}</span>
                                </td>
                                <td className="px-6 py-4 font-bold text-[#0F172A]">{s.cgpa || "0.00"}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold ${type === 'placed'
                                        ? "bg-[#F0FDF4] text-[#166534] border border-[#DCFCE7]"
                                        : "bg-[#FEF2F2] text-[#991B1B] border border-[#FEE2E2]"
                                        }`}>
                                        <span className={`mr-1.5 h-1 w-1 rounded-full ${type === 'placed' ? "bg-[#22C55E]" : "bg-[#EF4444]"}`}></span>
                                        {type === 'placed' ? 'Placed' : 'Not Placed'}
                                    </span>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="space-y-6">
            <header className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">Placement Management</h1>
                    <p className="text-[#64748B] font-medium">Track and update student placement records.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="mt-4 md:mt-0 rounded-xl bg-[#3B82F6] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#3B82F6]/20 hover:bg-[#2563EB] active:scale-95 transition-all w-full md:w-auto"
                >
                    + Add Placement
                </button>
            </header>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 p-1.5 bg-white rounded-2xl w-full md:w-fit border border-[#E2E8F0] shadow-sm overflow-x-auto">
                {[
                    { id: 'all', label: 'All Drives', count: placements.length },
                    { id: 'placed', label: 'Placed', count: placedStudents.length },
                    { id: 'unplaced', label: 'Unplaced', count: unplacedStudents.length },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-1 md:flex-none ${activeTab === tab.id
                            ? "bg-slate-900 text-white shadow-md"
                            : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                            }`}
                    >
                        {tab.label} <span className="ml-1 opacity-60">({tab.count})</span>
                    </button>
                ))}
            </div>

            <div className="flex items-center gap-4">
                <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="w-full md:w-auto rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-bold text-[#334155] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none transition-all shadow-sm"
                >
                    <option value="">All Departments</option>
                    {["MCA", "AI", "CSE", "BCA", "MBA", "BCOM"].map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                    ))}
                </select>
            </div>

            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {loading ? (
                    <div className="p-12 text-center text-[#64748B]">Loading records...</div>
                ) : (
                    (activeTab === 'all' ? placements : activeTab === 'placed' ? placedStudents : unplacedStudents).length === 0 ? (
                        <div className="p-12 text-center text-[#64748B] italic">No records found.</div>
                    ) : (
                        (activeTab === 'all' ? placements : activeTab === 'placed' ? placedStudents : unplacedStudents).map((item) => (
                            <div key={item.placement_id || item.login_id} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-xs font-black text-[#6366F1] uppercase tracking-widest">{item.roll_no}</div>
                                        <h3 className="text-lg font-bold text-[#0F172A]">{item.name || item.company_name || "Record"}</h3>
                                        <p className="text-xs font-medium text-[#64748B]">{item.email || "Student Account"}</p>
                                    </div>
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold ${
                                        (item.status?.toLowerCase() === "selected" || activeTab === 'placed') ? "bg-[#F0FDF4] text-[#166534] border border-[#DCFCE7]" :
                                        (item.status?.toLowerCase() === "rejected" || activeTab === 'unplaced') ? "bg-[#FEF2F2] text-[#991B1B] border border-[#FEE2E2]" :
                                        "bg-[#FFFBEB] text-[#92400E] border border-[#FEF3C7]"
                                    }`}>
                                        {activeTab === 'placed' ? 'Placed' : activeTab === 'unplaced' ? 'Not Placed' : item.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                                    {activeTab === 'all' ? (
                                        <>
                                            <div>
                                                <div className="text-[10px] font-bold text-[#94A3B8] uppercase">Company</div>
                                                <div className="text-sm font-bold text-[#334155]">{item.company_name}</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-bold text-[#94A3B8] uppercase">Package</div>
                                                <div className="text-sm font-black text-[#3B82F6]">{item.package ? `${item.package} LPA` : "-"}</div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div>
                                                <div className="text-[10px] font-bold text-[#94A3B8] uppercase">Department</div>
                                                <div className="text-sm font-bold text-[#334155]">{item.department}</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-bold text-[#94A3B8] uppercase">CGPA</div>
                                                <div className="text-sm font-black text-[#0F172A]">{item.cgpa || "0.00"}</div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                
                                {activeTab === 'all' && (
                                    <div className="flex justify-end gap-3 pt-2">
                                        <button onClick={() => handleEditClick(item)} className="text-xs font-bold text-[#3B82F6] hover:underline">Edit</button>
                                        <button onClick={() => handleDelete(item.placement_id)} className="text-xs font-bold text-[#EF4444] hover:underline">Delete</button>
                                    </div>
                                )}
                            </div>
                        ))
                    )
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block rounded-2xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden text-sm">
                {activeTab === 'all' && renderAllPlacements()}
                {activeTab === 'placed' && renderStudentList(placedStudents, 'placed')}
                {activeTab === 'unplaced' && renderStudentList(unplacedStudents, 'unplaced')}
            </div>

            {/* Modals */}
            {showAddModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0F172A]/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-md rounded-3xl bg-white p-8 border border-[#E2E8F0] shadow-2xl animate-in zoom-in-95 duration-200">
                        <h2 className="text-2xl font-bold text-[#0F172A] mb-2">Create Placement Record</h2>
                        <p className="text-[#64748B] text-sm mb-8">Add a new career opportunity for a student.</p>

                        <form onSubmit={handleCreate} className="space-y-5">
                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B]">Student Login ID</label>
                                    <Link href="/admin/students" target="_blank" className="text-[10px] font-bold text-[#3B82F6] hover:underline">Find ID ↗</Link>
                                </div>
                                <input required type="text" value={newPlacement.student_id} onChange={(e) => setNewPlacement({ ...newPlacement, student_id: e.target.value })} className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 text-sm font-medium text-[#334155] focus:bg-white focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none transition-all" placeholder="Paste Student ID here" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5">Company Name</label>
                                <input required type="text" value={newPlacement.company_name} onChange={(e) => setNewPlacement({ ...newPlacement, company_name: e.target.value })} className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 text-sm font-medium text-[#334155] focus:bg-white focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none transition-all" placeholder="e.g. Google, Microsoft" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5">Package (LPA)</label>
                                    <input type="text" value={newPlacement.package} onChange={(e) => setNewPlacement({ ...newPlacement, package: e.target.value })} className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 text-sm font-medium text-[#334155] focus:bg-white focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none transition-all" placeholder="e.g. 12" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5">Current Status</label>
                                    <select value={newPlacement.status} onChange={(e) => setNewPlacement({ ...newPlacement, status: e.target.value })} className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 text-sm font-bold text-[#334155] focus:bg-white focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none transition-all">
                                        <option value="Applied">Applied</option>
                                        <option value="Interviewing">Interviewing</option>
                                        <option value="Selected">Selected</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-10 flex justify-end gap-3 pt-6 border-t border-[#E2E8F0]">
                                <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2.5 text-sm font-bold text-[#64748B] hover:text-[#0F172A] transition-colors">Cancel</button>
                                <button type="submit" className="rounded-xl bg-[#3B82F6] px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#3B82F6]/20 hover:bg-[#2563EB] active:scale-95 transition-all">Create Record</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
