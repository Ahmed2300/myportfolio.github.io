import { getProjects } from "@/lib/data";
import { ProjectCards } from "./ProjectCards";

export async function ProjectsSection() {
  const projects = await getProjects();

  return (
    <>
      {/* Wave Divider: Languages → Projects */}
      <div className="relative">
        <div className="wave-divider bottom text-white dark:text-slate-900">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              className="wave-fill"
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V120H0Z"
            ></path>
          </svg>
        </div>
      </div>

      <section id="projects" className="py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-50/50 dark:from-brand-900/10 to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-sm font-semibold tracking-wide mb-4">
              <span className="material-icons text-sm">apps</span>
              Portfolio
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 font-display tracking-tight">
              Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-800 dark:from-brand-400 dark:to-brand-300">Projects</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Here are some of my highlighted App Inventor and Kodular projects with over 7 years of professional development experience.
            </p>
          </div>

          <ProjectCards projects={projects} />
        </div>
      </section>
    </>
  );
}
