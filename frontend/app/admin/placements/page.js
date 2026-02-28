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


    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            router.push("/admin/login");
        } else {
            fetchAllData();
        }
    }, [router]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [allData, pData, uData] = await Promise.all([
                adminApi.getAllPlacements(),
                adminApi.getPlacedStudents(),
                adminApi.getUnplacedStudents()
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
            <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-400">
                <thead className="bg-zinc-50 text-xs uppercase text-zinc-500 dark:bg-zinc-900/50 dark:text-zinc-400">
                    <tr>
                        <th className="px-6 py-4 font-medium">Roll No</th>
                        <th className="px-6 py-4 font-medium">Company</th>
                        <th className="px-6 py-4 font-medium">Package</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {loading ? (
                        <tr><td colSpan="5" className="px-6 py-8 text-center">Loading...</td></tr>
                    ) : placements.length === 0 ? (
                        <tr><td colSpan="5" className="px-6 py-8 text-center">No records.</td></tr>
                    ) : (
                        placements.map((p) => (
                            <tr key={p.placement_id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">
                                    <div>{p.roll_no}</div>
                                    <div className="text-xs text-zinc-500">{p.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    {editingId === p.placement_id ? (
                                        <input type="text" value={editForm.company_name} onChange={(e) => setEditForm({ ...editForm, company_name: e.target.value })} className="w-full rounded border border-zinc-300 px-2 py-1 dark:bg-zinc-800" />
                                    ) : (p.company_name)}
                                </td>
                                <td className="px-6 py-4">
                                    {editingId === p.placement_id ? (
                                        <input type="text" value={editForm.package} onChange={(e) => setEditForm({ ...editForm, package: e.target.value })} className="w-full rounded border border-zinc-300 px-2 py-1 dark:bg-zinc-800" />
                                    ) : (p.package ? `${p.package} LPA` : "-")}
                                </td>
                                <td className="px-6 py-4">
                                    {editingId === p.placement_id ? (
                                        <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} className="w-full rounded border border-zinc-300 px-2 py-1 dark:bg-zinc-800">
                                            <option value="Applied">Applied</option>
                                            <option value="Interviewing">Interviewing</option>
                                            <option value="Selected">Selected</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    ) : (
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.status?.toLowerCase() === "selected" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                                            p.status?.toLowerCase() === "rejected" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
                                                "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                            }`}>{p.status}</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {editingId === p.placement_id ? (
                                        <div className="flex justify-end gap-2 text-xs">
                                            <button onClick={() => handleEditSave(p.placement_id)} className="text-green-600 hover:underline">Save</button>
                                            <button onClick={() => setEditingId(null)} className="text-zinc-500">Cancel</button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-end gap-3 text-xs">
                                            <button onClick={() => handleEditClick(p)} className="text-blue-600 hover:underline">Edit</button>
                                            <button onClick={() => handleDelete(p.placement_id)} className="text-red-600 hover:underline">Delete</button>
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
            <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-400">
                <thead className="bg-zinc-50 text-xs uppercase text-zinc-500 dark:bg-zinc-900/50 dark:text-zinc-400">
                    <tr>
                        <th className="px-6 py-4 font-medium">Roll No</th>
                        <th className="px-6 py-4 font-medium">Name</th>
                        <th className="px-6 py-4 font-medium">Dept</th>
                        <th className="px-6 py-4 font-medium">CGPA</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {loading ? (
                        <tr><td colSpan="5" className="px-6 py-8 text-center">Loading...</td></tr>
                    ) : students.length === 0 ? (
                        <tr><td colSpan="5" className="px-6 py-8 text-center">No students found.</td></tr>
                    ) : (
                        students.map((s) => (
                            <tr key={s.login_id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">{s.roll_no || "-"}</td>
                                <td className="px-6 py-4">{s.name || "Unknown"}</td>
                                <td className="px-6 py-4 text-xs">{s.department || "N/A"} (Sem {s.semester || "-"})</td>
                                <td className="px-6 py-4 font-mono">{s.cgpa || "0.00"}</td>
                                <td className="px-6 py-4">
                                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${type === 'placed' ? "bg-green-100 text-green-800 dark:bg-green-900/30" : "bg-red-100 text-red-800 dark:bg-red-900/30"
                                        }`}>{type === 'placed' ? 'Placed' : 'Not Placed'}</span>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
            <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
                <div className="flex items-center gap-4">
                    <Link href="/admin/dashboard" className="text-sm font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                        ← Dashboard
                    </Link>
                    <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Placements</h1>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition-all"
                >
                    + Add Drive
                </button>
            </header>

            <main className="flex-1 p-6 space-y-6">
                {/* Tab Navigation */}
                <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl w-fit">
                    {[
                        { id: 'all', label: 'All Drives', count: placements.length },
                        { id: 'placed', label: 'Placed Students', count: placedStudents.length },
                        { id: 'unplaced', label: 'Unplaced Students', count: unplacedStudents.length },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
                                }`}
                        >
                            {tab.label} <span className="ml-1 opacity-50 text-xs">({tab.count})</span>
                        </button>
                    ))}
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
                    {activeTab === 'all' && renderAllPlacements()}
                    {activeTab === 'placed' && renderStudentList(placedStudents, 'placed')}
                    {activeTab === 'unplaced' && renderStudentList(unplacedStudents, 'unplaced')}
                </div>

                {/* Modals */}
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <div className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Create Placement Record</h2>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-zinc-500 dark:text-zinc-400 mb-1">Student UUID</label>
                                    <input required type="text" value={newPlacement.student_id} onChange={(e) => setNewPlacement({ ...newPlacement, student_id: e.target.value })} className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-white" placeholder="Student's Login ID" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-zinc-500 dark:text-zinc-400 mb-1">Company</label>
                                    <input required type="text" value={newPlacement.company_name} onChange={(e) => setNewPlacement({ ...newPlacement, company_name: e.target.value })} className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-white" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-zinc-500 dark:text-zinc-400 mb-1">Package (LPA)</label>
                                        <input type="text" value={newPlacement.package} onChange={(e) => setNewPlacement({ ...newPlacement, package: e.target.value })} className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-zinc-500 dark:text-zinc-400 mb-1">Status</label>
                                        <select value={newPlacement.status} onChange={(e) => setNewPlacement({ ...newPlacement, status: e.target.value })} className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-white">
                                            <option value="Applied">Applied</option>
                                            <option value="Interviewing">Interviewing</option>
                                            <option value="Selected">Selected</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mt-8 flex justify-end gap-3 pt-4 border-t dark:border-zinc-800">
                                    <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white">Cancel</button>
                                    <button type="submit" className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700">Create</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
