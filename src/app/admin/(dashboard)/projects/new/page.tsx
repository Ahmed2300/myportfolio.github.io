import { ProjectForm } from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">New Project</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Add a new project to your portfolio.</p>
      </div>

      <ProjectForm />
    </div>
  );
}
