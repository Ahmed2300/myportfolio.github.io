import { SkillsSection } from "@/components/sections/SkillsSection";

export const metadata = {
  title: "Skills - Ahmed Azam",
  description: "A comprehensive overview of the tools, languages, and frameworks I leverage.",
};

export default function SkillsPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16">
      <SkillsSection />
    </main>
  );
}
