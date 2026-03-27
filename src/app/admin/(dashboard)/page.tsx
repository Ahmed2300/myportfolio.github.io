import { getProjects } from "@/lib/data";

// Explicitly set dynamic to avoid static generation if auth/cookies change
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const projects = await getProjects();
  
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 fill-mode-both">
      <div>
        <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Welcome to your portfolio administration area.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center py-10 transition-transform hover:-translate-y-1">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Projects</h3>
          <p className="text-5xl font-display font-bold text-slate-900 dark:text-white mt-4">{projects.length}</p>
        </div>
        <div className="bg-brand-50  dark:bg-slate-900 border border-brand-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center py-10 transition-transform hover:-translate-y-1">
          <h3 className="text-sm font-medium text-brand-600 dark:text-brand-400/80">Featured Projects</h3>
          <p className="text-5xl font-display font-bold text-brand-600 dark:text-brand-400 mt-4">{projects.filter(p => p.featured).length}</p>
        </div>
      </div>
    </div>
  );
}
