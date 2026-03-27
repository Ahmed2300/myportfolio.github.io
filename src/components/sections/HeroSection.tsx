"use client";

import { motion } from "framer-motion";
import { Code2, Smartphone, TerminalSquare } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Graphic Meshes */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-100/40 via-background to-background dark:from-brand-900/20" />
      <div className="gradient-mesh" />
      <div className="noise-overlay" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Text Content */}
          <div className="flex flex-col gap-6 text-center lg:text-left order-2 lg:order-1 pt-10 lg:pt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium w-fit mx-auto lg:mx-0">
                <span className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
                  </span>
                  Available for new projects
                </span>
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-balance font-display text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]"
            >
              Crafting{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-brand-800 dark:from-brand-400 dark:to-brand-600">
                Digital
              </span>
              <br />
              Experiences
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light"
            >
              Hi, I&apos;m{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                Ahmed Azam
              </span>
              . Professional developer &amp; Physics Teacher with +7 years of
              experience building innovative mobile applications and AI-driven
              solutions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mt-4"
            >
              <Button size="lg" className="w-full sm:w-auto gap-2 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all" asChild>
                <a href="#projects">
                  <span className="material-icons text-sm">rocket_launch</span>
                  View My Work
                </a>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 rounded-xl shadow-md hover:shadow-lg transition-all" asChild>
                <a href="#contact">
                  <span className="material-icons text-sm">mail</span>
                  Contact Me
                </a>
              </Button>
            </motion.div>
          </div>

          {/* Profile Image / Graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, type: "spring", stiffness: 100 }}
            className="order-1 lg:order-2 flex justify-center lg:justify-end relative"
          >
            <div className="relative w-72 h-72 sm:w-96 sm:h-96">
              {/* Decor ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 animate-[spin_30s_linear_infinite]" />

              {/* Glow circle */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-brand-100 to-brand-50 dark:from-brand-900/20 dark:to-brand-900/20 blur-xl" />

              {/* Profile picture */}
              <div className="relative w-full h-full rounded-full border-4 border-white dark:border-slate-800 overflow-hidden shadow-2xl z-10 bg-slate-100 dark:bg-slate-800">
                <Image
                  src="/images/developer-profile.jpg"
                  alt="Ahmed Azam - Professional Developer"
                  width={800}
                  height={800}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>

              {/* Floating badge — Flutter Expert */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="absolute -right-4 top-10 bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-xl z-20 flex items-center gap-2 border border-slate-100 dark:border-slate-700 backdrop-blur-md"
              >
                <Image
                  src="/images/icons8-flutter-48.png"
                  alt="Flutter"
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain"
                />
                <div className="hidden sm:block">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Flutter</p>
                  <p className="text-[10px] text-slate-500">Expert</p>
                </div>
              </motion.div>

              {/* Floating badge — AI APIs */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="absolute -left-4 bottom-16 bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-xl z-20 flex items-center gap-2 border border-slate-100 dark:border-slate-700 backdrop-blur-md"
              >
                <span className="material-icons text-brand-500 text-2xl">auto_awesome</span>
                <div className="hidden sm:block">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">AI APIs</p>
                  <p className="text-[10px] text-slate-500">Integrated</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Key Tech Stack */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-20 pt-10 border-t border-border/60 w-full max-w-4xl mx-auto"
        >
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6 uppercase tracking-widest text-center">
            Core Technologies
          </p>
          <div className="flex flex-wrap justify-center gap-8 opacity-70 grayscale transition-all hover:grayscale-0">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
              <Smartphone className="h-6 w-6 text-blue-500" /> Flutter
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
              <TerminalSquare className="h-6 w-6 text-green-500" /> Android (Kotlin/Java)
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
              <Code2 className="h-6 w-6 text-brand-500" /> Firebase
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
