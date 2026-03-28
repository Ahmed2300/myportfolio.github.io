
import {
  Facebook,
  Linkedin,
  Github,
  ChevronRight,
  Mail,
  Heart,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900/10 to-brand-900/10 z-0" />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Branding */}
          <div className="md:col-span-12 lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-800 flex items-center justify-center text-white font-bold text-xl font-outfit shadow-lg shadow-brand-500/20">
                A
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 font-outfit tracking-tight">
                Ahmed Azam
              </span>
            </div>
            <p className="text-slate-400 text-lg max-w-md leading-relaxed">
              App Inventor, Flutter & AI Expert. Crafting digital experiences
              that merge beautiful design with powerful engineering.
            </p>
            <div className="flex gap-4 pt-4">
              <a
                href="https://www.facebook.com/ahmed.azam.52"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Profile"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-brand-500 hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-md"
              >
                <Facebook className="w-5 h-5 fill-current" />
              </a>
              <a
                href="https://linkedin.com/in/ahmed-azam-320a98200"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-brand-500 hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-md"
              >
                <Linkedin className="w-5 h-5 fill-current" />
              </a>
              <a
                href="https://github.com/Ahmed2300"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-brand-500 hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-md"
              >
                <Github className="w-5 h-5 fill-current" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="md:col-span-6 lg:col-span-3 lg:col-start-7">
            <h4 className="text-white font-semibold mb-6 flex items-center gap-2 font-outfit text-lg">
              <span className="w-2 h-2 rounded-full bg-brand-500" />
              Navigation
            </h4>
            <ul className="space-y-4">
              {[
                { label: "Home", href: "#home" },
                { label: "Projects", href: "#projects" },
                { label: "About", href: "#about" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-brand-400 transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all text-brand-500" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-6 lg:col-span-3">
            <h4 className="text-white font-semibold mb-6 flex items-center gap-2 font-outfit text-lg">
              <span className="w-2 h-2 rounded-full bg-brand-500" />
              Contact
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:ahmedazaki0125@gmail.com"
                  className="text-slate-400 hover:text-brand-400 transition-colors flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-brand-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="truncate">Email Me</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/201016693794"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-brand-400 transition-colors flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-[#25D366]">
                    <FaWhatsapp className="w-5 h-5" />
                  </div>
                  <span>WhatsApp</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} Ahmed Azam. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span>Designed & Built with</span>
            <Heart className="w-4 h-4 text-red-500 animate-pulse fill-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}
