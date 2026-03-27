import { getProjectById } from "@/lib/data";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Github, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { ImageGallery } from "@/components/ui/ImageGallery";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const p = await params;
  const project = await getProjectById(p.id);
  if (!project) return { title: "Project Not Found" };
  
  return {
    title: `${project.title} - Ahmed Azam`,
    description: project.description,
  };
}

function getTechIcon(tech: string): string {
  const lower = tech.toLowerCase();
  if (lower.includes("firebase")) return "local_fire_department";
  if (lower.includes("flutter")) return "flutter_dash";
  if (lower.includes("android")) return "android";
  if (lower.includes("ios")) return "phone_iphone";
  if (lower.includes("react") || lower.includes("next")) return "sync";
  if (lower.includes("ai") || lower.includes("ml") || lower.includes("python")) return "auto_awesome";
  return "code";
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const p = await params;
  const project = await getProjectById(p.id);

  if (!project) {
    notFound();
  }

  const links = project.links ?? {};

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Floating Top Navigation */}
      <div id="floating-top-nav" className="fixed top-0 inset-x-0 z-50 p-4 md:p-8 flex justify-between items-center pointer-events-none transition-opacity duration-300">
        <Link
          href="/#projects"
          className="pointer-events-auto group flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-slate-900/40 hover:bg-slate-900/60 dark:bg-slate-800/60 dark:hover:bg-slate-700/80 backdrop-blur-xl border border-white/10 text-white transition-all duration-300 hover:scale-105 shadow-2xl"
          aria-label="Back to projects"
        >
          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform" />
        </Link>
        
        {links.demo && (
          <a
            href={links.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-400 text-white text-sm font-semibold tracking-wide rounded-full shadow-lg shadow-brand-500/20 transition-all hover:scale-105"
          >
            Live Demo
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>

      {/* Hero Cover */}
      <div className="relative w-full h-[50vh] md:h-[65vh] bg-slate-800 overflow-hidden">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.title}
             // Using next/image or a normal img tag with a standard string (already configured in next.config.ts)
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-900 to-slate-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-900 via-slate-900/40 to-transparent" />
      </div>

      {/* Main Content Area (Overlapping the hero) */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 xl:px-0 -mt-32 relative z-10 pb-32">
        {/* Header Card */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-slate-200/50 dark:border-white/5 mb-16 animate-in slide-in-from-bottom-8 duration-700 fill-mode-both">
          {project.platform && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-500" />
              {project.platform}
            </div>
          )}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold text-slate-900 dark:text-white tracking-tight mb-6">
            {project.title}
          </h1>
          <p className="text-lg md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed font-light max-w-3xl">
            {project.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-10 pt-10 border-t border-slate-200 dark:border-slate-700/50">
            {links.github && (
              <a href={links.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors">
                <Github className="w-4 h-4" /> Source Code
              </a>
            )}
            {links.playStore && (
               <a href={links.playStore} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors">
                <i className="fab fa-google-play text-green-500" /> Play Store
              </a>
            )}
             {links.appStore && (
               <a href={links.appStore} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors">
                <i className="fab fa-apple text-slate-900 dark:text-white" /> App Store
              </a>
            )}
          </div>
        </div>

        {/* Content Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 animate-in slide-in-from-bottom-12 duration-700 delay-150 fill-mode-both">
          {/* Left: Challenge & Solution */}
          <div className="lg:col-span-8 space-y-16">
            {project.problem && (
              <section className="prose prose-lg dark:prose-invert prose-slate max-w-none">
                <h2 className="font-display font-semibold text-3xl">The Challenge</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{project.problem}</p>
              </section>
            )}
            
            {(project.solution || project.description) && (
              <section className="prose prose-lg dark:prose-invert prose-slate max-w-none">
                <h2 className="font-display font-semibold text-3xl">The Solution</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{project.solution || project.description}</p>
              </section>
            )}

            {/* Gallery */}
             {project.detailImages && project.detailImages.length > 0 && (
                <section>
                  <h2 className="font-display font-semibold text-3xl text-slate-900 dark:text-white mb-8">Gallery</h2>
                  <ImageGallery images={project.detailImages} />
                </section>
             )}
          </div>

          {/* Right: Sidebar */}
          <div className="lg:col-span-4 space-y-8 animate-in slide-in-from-right-8 duration-700 delay-300 fill-mode-both">
            {/* Tech Stack */}
            <div className="sticky top-8 bg-slate-100/50 dark:bg-slate-800/30 rounded-3xl p-8 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
              <h3 className="font-display font-semibold text-xl text-slate-900 dark:text-white mb-6">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {(project.technologies || []).map(tech => (
                  <div key={tech} className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-2 hover:-translate-y-0.5 transition-transform cursor-default">
                    <span className="material-icons text-brand-500 text-[18px]">{getTechIcon(tech)}</span>
                    {tech}
                  </div>
                ))}
                {(!project.technologies || project.technologies.length === 0) && (
                    <p className="text-slate-500 text-sm italic">No specific technologies listed.</p>
                )}
              </div>
            </div>

            {/* Features */}
            {project.features && project.features.length > 0 && (
               <div className="bg-slate-100/50 dark:bg-slate-800/30 rounded-3xl p-8 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
                  <h3 className="font-display font-semibold text-xl text-slate-900 dark:text-white mb-6">Key Features</h3>
                  <ul className="space-y-4">
                    {project.features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex gap-4 text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                        <span className="leading-relaxed text-sm md:text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
               </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
