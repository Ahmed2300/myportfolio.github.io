"use client";

import { Project } from "@/schemas/project.schema";
import Link from "next/link";

interface ProjectCardsProps {
  projects: Project[];
}

export function ProjectCards({ projects }: ProjectCardsProps) {
  return (
    <>
      <div className="app-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((app) => (
          <div
            key={app.id}
            className="app-item relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-brand-500/50 dark:hover:border-brand-500/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden group flex flex-col"
          >
            <div className="relative overflow-hidden">
              <img
                src={app.imageUrl || app.image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' fill='%23cbd5e1'%3E%3Crect width='400' height='200' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%2394a3b8'%3ENo Image%3C/text%3E%3C/svg%3E"}
                alt={`${app.title} Screenshot`}
                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                <Link
                  href={`/projects/${app.id}`}
                  className="btn-details bg-brand-500 hover:bg-brand-600 text-white px-6 py-2 rounded-full font-medium tracking-wide flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                >
                  <span className="material-icons text-sm">visibility</span>
                  View Details
                </Link>
              </div>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{app.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                {app.description}
              </p>
              {(app.technologies?.length || app.tags?.length) ? (
                <div className="flex flex-wrap gap-2 mt-auto">
                  {(app.technologies || app.tags || []).map((tech: string) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold rounded-full border border-slate-200 dark:border-slate-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
