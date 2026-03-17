"use client";

import { useEffect, useState } from "react";
import { studentApi } from "../../lib/api";

export default function StudentPlacements() {
    const [placements, setPlacements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPlacements = async () => {
            try {
                const data = await studentApi.getPlacements();
                setPlacements(data.placements || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPlacements();
    }, []);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#3B82F6] border-t-transparent shadow-sm"></div>
                    <p className="text-[#334155] font-bold animate-pulse">Loading Placements...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl bg-red-50 p-6 text-sm font-bold text-red-600 border border-red-100 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <header className="flex flex-col gap-1">
                <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">Placement Records</h1>
                <p className="text-[#64748B] font-medium">Track your recruitment status and offers</p>
            </header>

            {placements.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-[#CBD5E1] bg-white p-16 text-center shadow-sm">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#F8FAFC] text-[#94A3B8]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                    </div>
                    <h3 className="text-xl font-black text-[#0F172A]">No placement records found</h3>
                    <p className="mt-2 text-[#64748B] font-medium">Your placement history will appear here once updated by the faculty.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white shadow-sm transition-all hover:shadow-md">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                                        <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-[#64748B]">Company</th>
                                        <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-[#64748B]">Package (LPA)</th>
                                        <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-[#64748B]">Status</th>
                                        <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-[#64748B]">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E2E8F0]">
                                    {placements.map((record, index) => (
                                        <tr key={index} className="transition-colors hover:bg-[#F8FAFC] group">
                                            <td className="px-6 py-5">
                                                <div className="font-bold text-[#0F172A] flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-lg bg-blue-50 text-[#3B82F6] flex items-center justify-center font-black text-xs transition-transform group-hover:scale-110">
                                                        {record.company_name.charAt(0)}
                                                    </div>
                                                    {record.company_name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 font-bold text-[#475569]">{record.package}</td>
                                            <td className="px-6 py-5">
                                                <span className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-black uppercase tracking-wide border ${record.status === 'Placed' || record.status === 'Hired' || record.status === 'Selected'
                                                    ? 'bg-emerald-50 text-[#10B981] border-emerald-100'
                                                    : 'bg-slate-50 text-[#64748B] border-slate-200'
                                                    }`}>
                                                    {record.status === 'Placed' || record.status === 'Hired' || record.status === 'Selected' ? (
                                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                                    ) : (
                                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                                                    )}
                                                    {record.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-sm font-medium text-[#64748B]">
                                                {new Date(record.created_at).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {placements.map((record, index) => (
                            <div key={index} className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition-all active:scale-[0.98]">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#3B82F6] flex items-center justify-center font-black text-sm">
                                            {record.company_name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-[#0F172A] tracking-tight">{record.company_name}</h3>
                                            <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider">{new Date(record.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                        </div>
                                    </div>
                                    <span className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-[10px] font-black uppercase tracking-wide border ${record.status === 'Placed' || record.status === 'Hired' || record.status === 'Selected'
                                        ? 'bg-emerald-50 text-[#10B981] border-emerald-100'
                                        : 'bg-slate-50 text-[#64748B] border-slate-200'
                                        }`}>
                                        {record.status}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-[#F1F5F9]">
                                    <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest">Package Offered</span>
                                    <span className="text-lg font-black text-[#3B82F6] tracking-tighter">{record.package} <span className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-widest ml-0.5">LPA</span></span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
