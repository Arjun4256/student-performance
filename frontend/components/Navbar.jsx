"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('button[aria-label="Toggle Menu"]')) {
          setMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full bg-white border-b border-[#E2E8F0] px-6 py-4 fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-xl font-black text-[#0F172A] tracking-tighter flex items-center gap-2">
           <div className="p-1.5 bg-emerald-50 rounded-lg shadow-sm border border-emerald-100">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#10B981]"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
           </div>
          CampusTrack<span className="text-[#10B981]">Analytics</span>
        </div>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-[#64748B]">
          <Link href="#home" className="hover:text-[#10B981] transition-colors relative group">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#10B981] transition-all group-hover:w-full"></span>
          </Link>
          <Link href="#features" className="hover:text-[#10B981] transition-colors relative group">
            Features
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#10B981] transition-all group-hover:w-full"></span>
          </Link>
          <Link href="#about" className="hover:text-[#10B981] transition-colors relative group">
            About Us
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#10B981] transition-all group-hover:w-full"></span>
          </Link>
          <Link href="#contact" className="hover:text-[#10B981] transition-colors relative group">
            Contact
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#10B981] transition-all group-hover:w-full"></span>
          </Link>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#10B981] to-[#0D9488] hover:from-[#059669] hover:to-[#0F766E] text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-emerald-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              Portal Login
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl py-2 z-50 overflow-hidden transform opacity-100 scale-100 transition-all duration-200 origin-top-right">
                <Link
                  href="/admin/login"
                  className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-[#334155] hover:bg-emerald-50 hover:text-[#10B981] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></svg>
                  Admin Portal
                </Link>
                <Link
                  href="/faculty/login"
                  className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-[#334155] hover:bg-emerald-50 hover:text-[#10B981] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                  Faculty Portal
                </Link>
                <Link
                  href="/student/login"
                  className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-[#334155] hover:bg-emerald-50 hover:text-[#10B981] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                  Student Portal
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
            <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="text-[#0F172A] hover:text-[#10B981] focus:outline-none transition-colors p-2"
                aria-label="Toggle Menu"
            >
                {mobileMenuOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                )}
            </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
          <div ref={mobileMenuRef} className="md:hidden absolute top-full left-0 w-full bg-white border-b border-[#E2E8F0] shadow-xl py-4 px-6 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
             <Link href="#home" onClick={() => setMobileMenuOpen(false)} className="text-[#334155] font-bold text-lg hover:text-[#10B981] transition-colors">Home</Link>
             <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="text-[#334155] font-bold text-lg hover:text-[#10B981] transition-colors">Features</Link>
             <Link href="#about" onClick={() => setMobileMenuOpen(false)} className="text-[#334155] font-bold text-lg hover:text-[#10B981] transition-colors">About Us</Link>
             <Link href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-[#334155] font-bold text-lg hover:text-[#10B981] transition-colors">Contact</Link>
             
             <div className="h-px w-full bg-[#E2E8F0] my-2"></div>
             
             <div className="flex flex-col gap-3">
                 <span className="text-xs font-black text-[#94A3B8] uppercase tracking-widest">Portals</span>
                 <Link href="/admin/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-[#334155] font-bold hover:text-[#10B981] transition-colors p-2 rounded-xl hover:bg-emerald-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></svg>
                    Admin Login
                 </Link>
                 <Link href="/faculty/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-[#334155] font-bold hover:text-[#10B981] transition-colors p-2 rounded-xl hover:bg-emerald-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                    Faculty Login
                 </Link>
                 <Link href="/student/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-[#334155] font-bold hover:text-[#10B981] transition-colors p-2 rounded-xl hover:bg-emerald-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                    Student Login
                 </Link>
             </div>
          </div>
      )}
    </nav>
  );
}
