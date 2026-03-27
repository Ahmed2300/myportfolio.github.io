import { getProjects } from "@/lib/data";
import Link from "next/link";
import { Plus, Edit2, ExternalLink } from "lucide-react";
import { DeleteProjectButton } from "@/components/admin/DeleteProjectButton";

export const dynamic = 'force-dynamic';

export default async function AdminProjects() {
  const projects = await getProjects();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 fill-mode-both">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Manage Projects</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Add, edit, or remove portfolio projects directly from the database.</p>
        </div>
        <Link 
          href="/admin/projects/new"
          className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all shadow-sm active:scale-95 shrink-0"
        >
          <Plus className="w-5 h-5" />
          Add Project
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <th className="p-4 font-medium text-slate-500 dark:text-slate-400">Project</th>
                <th className="p-4 font-medium text-slate-500 dark:text-slate-400">Platform</th>
                <th className="p-4 font-medium text-slate-500 dark:text-slate-400">Status</th>
                <th className="p-4 font-medium text-slate-500 dark:text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {projects.map((project, i) => (
                <tr 
                  key={project.id} 
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors animate-in fade-in slide-in-from-bottom-2 fill-mode-both"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      {project.imageUrl ? (
                        <img 
                          src={project.imageUrl} 
                          alt={project.title} 
                          className="w-12 h-12 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 shadow-sm" 
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 text-xs shadow-sm">
                          No IMG
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">{project.title}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 max-w-sm" title={project.description}>
                          {project.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-700 dark:text-slate-300">
                    <div className="inline-flex items-center gap-1.5 font-medium text-sm">
                       {project.platform || <span className="text-slate-400 opacity-50">N/A</span>}
                    </div>
                  </td>
                  <td className="p-4">
                    {project.featured ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
                        Featured
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400">
                        Standard
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link 
                        href={`/projects/${project.id}`}
                        target="_blank"
                        className="p-2 text-slate-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-lg transition-colors group relative"
                        aria-label="View Public Page"
                      >
                        <ExternalLink className="w-5 h-5" />
                        {/* Tooltip */}
                        <span className="absolute -top-8 -left-3 whitespace-nowrap px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          View Public
                        </span>
                      </Link>
                      <Link 
                        href={`/admin/projects/${project.id}/edit`}
                        className="p-2 text-slate-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-lg transition-colors group relative"
                        aria-label="Edit Project"
                      >
                        <Edit2 className="w-5 h-5" />
                         <span className="absolute -top-8 -left-2 whitespace-nowrap px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          Edit
                        </span>
                      </Link>
                      <DeleteProjectButton id={project.id} title={project.title} />
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-16 text-center text-slate-500 dark:text-slate-400">
                    No projects found. Create your first one to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
