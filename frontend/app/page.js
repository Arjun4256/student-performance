import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-4">
      <main className="w-full max-w-4xl text-center">
        <div className="mb-16">
          <h1 className="text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6">
            CampusTrackAnalytics
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            A comprehensive portal for tracking academics, placements, and performance analytics for both students and faculty.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Student Portal Card */}
          <Link href="/student/login" className="group relative block p-8 rounded-3xl bg-white border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 transition-all hover:shadow-2xl hover:scale-[1.02]">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 mb-6 mx-auto group-hover:rotate-6 transition-transform">
              <span className="text-3xl font-bold">S</span>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Student Portal</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              View your academic records, track placement status, and monitor your CGPA progress.
            </p>
            <div className="mt-8 text-zinc-900 dark:text-white font-semibold flex items-center justify-center gap-2">
              Login to Student Portal <span>→</span>
            </div>
          </Link>

          {/* Faculty Portal Card */}
          <Link href="/faculty/login" className="group relative block p-8 rounded-3xl bg-white border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 transition-all hover:shadow-2xl hover:scale-[1.02]">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white mb-6 mx-auto group-hover:-rotate-6 transition-transform">
              <span className="text-3xl font-bold">F</span>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Faculty Portal</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Manage student marks, analyze performance trends, and identify top performers.
            </p>
            <div className="mt-8 text-indigo-600 dark:text-indigo-400 font-semibold flex items-center justify-center gap-2">
              Login as Faculty <span>→</span>
            </div>
          </Link>

          {/* Admin Portal Card */}
          <Link href="/admin/login" className="group relative block p-8 rounded-3xl bg-white border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 transition-all hover:shadow-2xl hover:scale-[1.02]">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600 text-white mb-6 mx-auto group-hover:rotate-6 transition-transform">
              <span className="text-3xl font-bold">A</span>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Admin Portal</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              System administration, user management, and global configuration.
            </p>
            <div className="mt-8 text-red-600 dark:text-red-400 font-semibold flex items-center justify-center gap-2">
              Login as Admin <span>→</span>
            </div>
          </Link>
        </div>

        <footer className="mt-20 text-zinc-400 text-sm">
          © 2026 Student Performance Management System
        </footer>
      </main>
    </div>
  );
}
