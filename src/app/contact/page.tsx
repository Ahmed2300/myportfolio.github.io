import { ContactSection } from "@/components/sections/ContactSection";

export const metadata = {
  title: "Contact - Ahmed Azam",
  description: "Get in touch for building your next great mobile app.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16">
      <ContactSection />
    </main>
  );
}
