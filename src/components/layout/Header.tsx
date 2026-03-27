"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Briefcase, Code, Mail, Menu, X, Github, Linkedin, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Projects", href: "/projects", icon: Briefcase },
  { name: "Skills", href: "/skills", icon: Code },
  { name: "Contact", href: "/contact", icon: Mail },
];

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (pathname.startsWith("/projects/")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2 text-brand-600">
            <Smartphone className="h-6 w-6" />
            <span className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Ahmed
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-2 text-sm font-medium transition-colors hover:text-brand-600 dark:hover:text-brand-400",
                  isActive ? "text-brand-600 dark:text-brand-400" : "text-slate-600 dark:text-slate-300"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute -bottom-5 left-0 right-0 h-0.5 bg-brand-600 dark:bg-brand-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Socials */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="https://github.com/Ahmed2300" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link href="https://linkedin.com/in/ahmed-azam-320a98200" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            <Linkedin className="h-5 w-5" />
            <span className="sr-only">LinkedIn</span>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden flex items-center justify-center p-2 text-slate-600 hover:text-slate-900 focus:outline-none dark:text-slate-300 dark:hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="sr-only">Open main menu</span>
          {isOpen ? (
            <X className="block h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="block h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b bg-background"
          >
            <div className="space-y-1 px-4 pb-3 pt-2 sm:px-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-3 text-base font-medium transition-colors",
                      isActive
                        ? "bg-brand-50 text-brand-600 dark:bg-slate-800 dark:text-brand-400"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-white"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
              <div className="mt-4 flex items-center justify-center gap-6 border-t pt-4">
                 <Link href="https://github.com/Ahmed2300" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <Github className="h-6 w-6" />
                    <span className="sr-only">GitHub</span>
                  </Link>
                  <Link href="https://linkedin.com/in/ahmed-azam-320a98200" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <Linkedin className="h-6 w-6" />
                    <span className="sr-only">LinkedIn</span>
                  </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
