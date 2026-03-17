"use client";

import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
    const router = useRouter();
    const pathname = usePathname();

    // Do not show back button on root dashboard pages or login pages
    const hiddenPaths = [
        "/admin/login",
        "/admin/dashboard",
        "/faculty/login",
        "/faculty/dashboard",
        "/student/login",
        "/student/signup",
        "/student/dashboard"
    ];

    if (hiddenPaths.includes(pathname)) {
        return null; // Don't render anything
    }

    return (
        <button
            onClick={() => router.back()}
            className="group mb-6 flex items-center gap-2 rounded-xl bg-white border border-[#E2E8F0] px-4 py-2 text-sm font-bold text-[#475569] shadow-sm transition-all duration-300 hover:-translate-x-1 hover:bg-slate-50 hover:text-[#0F172A] hover:shadow-md active:scale-95"
            aria-label="Go back"
        >
            <ArrowLeft size={18} className="text-[#94A3B8] transition-colors group-hover:text-[#0F172A]" />
            Back
        </button>
    );
}
