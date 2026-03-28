
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Send, Phone, Mail, Facebook, Linkedin, Github } from "lucide-react";

export function ContactSection() {
  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-brand-50 dark:bg-brand-900/10 skew-y-3 transform origin-bottom-right -z-10" />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4">
            <Send className="w-4 h-4 mr-2" />
            Connect
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 font-outfit tracking-tight">
            Get in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-800 dark:from-brand-400 dark:to-brand-300">
              Touch
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden border border-slate-100 dark:border-slate-700">
          <div className="lg:col-span-2 bg-slate-900 p-10 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 to-brand-800/20 z-0" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-500/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

            <div className="relative z-10 h-full flex flex-col">
              <h3 className="text-2xl font-bold mb-6 font-outfit">
                Contact Information
              </h3>
              <p className="text-slate-300 mb-12 leading-relaxed">
                Ready to bring your app idea to life? With over 7 years of
                professional experience, I can help turn your concept into
                reality.
              </p>

              <div className="space-y-6 flex-grow">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-brand-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">
                      Phone / WhatsApp
                    </p>
                    <p className="font-medium">+201016693794</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-brand-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Email</p>
                    <a
                      href="mailto:ahmedazaki0125@gmail.com"
                      className="font-medium hover:text-brand-400 transition-colors"
                    >
                      ahmedazaki0125@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-12 pt-8 border-t border-white/10">
                <a
                  href="https://www.facebook.com/ahmed.azam.52"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all duration-300"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5 relative z-10" />
                </a>
                <a
                  href="https://linkedin.com/in/ahmed-azam-320a98200"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all duration-300"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5 relative z-10" />
                </a>
                <a
                  href="https://github.com/Ahmed2300"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all duration-300"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5 relative z-10" />
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 p-10">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="john@example.com"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="How can I help you today?"
                  rows={5}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none resize-none"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-auto px-8 py-6 rounded-xl font-bold tracking-wide transition-all shadow-lg hover:shadow-brand-500/30 flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
