import { ProjectForm } from "@/components/admin/ProjectForm";
import { getProjectById } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Edit Project</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Make changes to "{project.title}".</p>
      </div>

      <ProjectForm initialData={project} />
    </div>
  );
}
