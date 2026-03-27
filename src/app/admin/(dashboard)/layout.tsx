import { ReactNode } from "react";
import Link from "next/link";
import { LayoutDashboard, FolderKanban, LogOut } from "lucide-react";
import { logout } from "@/actions/auth.actions";

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row">
      {/* Sidebar Desktop */}
      <aside className="md:flex flex-col w-full md:w-64 bg-white dark:bg-slate-900 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 shrink-0">
        <div className="p-4 md:p-6 flex items-center justify-between md:block">
          <Link href="/" className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white pb-0.5">
              P
            </div>
            Admin Hub
          </Link>
          <div className="md:hidden">
            <form action={logout}>
              <button className="p-2 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10">
                <LogOut className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
        
        <nav className="flex flex-row md:flex-col flex-1 px-4 md:py-4 gap-1 overflow-x-auto pb-4 md:pb-0">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link href="/admin/projects" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0">
            <FolderKanban className="w-5 h-5" />
            <span className="font-medium">Manage Projects</span>
          </Link>
        </nav>

        <div className="hidden md:block p-4 border-t border-slate-200 dark:border-slate-800 mt-auto">
          <form action={logout}>
            <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
