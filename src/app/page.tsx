import { HeroSection } from "@/components/sections/HeroSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectsSkeleton } from "@/components/sections/ProjectsSkeleton";

export default function Page() {
  return (
    <>
      <HeroSection />

      {/* About Prelude Section */}
      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="outline" className="text-brand-600 dark:text-brand-400 border-brand-200 dark:border-brand-800">
                About Me
              </Badge>
              <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                Transforming ideas into polished applications
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                With extensive experience in building robust mobile architectures using Flutter and natively on Android, I specialize in crafting apps that perform brilliantly while feeling completely native.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                My approach blends "Modern Minimalist" design aesthetics with solid "Hard Mode" engineering principles.
              </p>
              <div className="pt-4">
                <Button variant="outline" className="gap-2" asChild>
                  <Link href="/about">
                    Learn more about me <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SkillsSection />

      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectsSection />
      </Suspense>

      <ContactSection />
    </>
  );
}
