import { Suspense } from "react";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ProjectsSkeleton } from "@/components/sections/ProjectsSkeleton";

export const metadata = {
  title: "Projects - Ahmed Azam",
  description: "Explore my portfolio of mobile applications and tools.",
};

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16">
      {/* 
        Reusing ProjectsSection here to ensure consistency.
        The top-padding ensures it clears the floating header nicely.
      */}
      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectsSection />
      </Suspense>
    </main>
  );
}
