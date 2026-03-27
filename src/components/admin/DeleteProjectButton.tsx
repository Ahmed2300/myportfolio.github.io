"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteProject } from "@/actions/admin.actions";

export function DeleteProjectButton({ id, title }: { id: string, title: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      startTransition(async () => {
        try {
          await deleteProject(id);
        } catch (e) {
          console.error(e);
          alert("Failed to delete project");
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors group relative disabled:opacity-50 flex items-center justify-center"
      aria-label="Delete Project"
    >
      {isPending ? (
        <Loader2 className="w-5 h-5 animate-spin text-red-500" />
      ) : (
        <Trash2 className="w-5 h-5" />
      )}
      <span className="absolute -top-8 -left-3 whitespace-nowrap px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        Delete
      </span>
    </button>
  );
}
