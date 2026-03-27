"use client";

import { SKILLS } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2, Smartphone, TerminalSquare, Database, LayoutTemplate, Layers, Cloud } from "lucide-react";
import { SiFlutter, SiKotlin, SiFirebase } from "react-icons/si";
import { FaJava } from "react-icons/fa6";
import { motion } from "framer-motion";

// Helper to map string icon names to Lucide icons
const getIcon = (iconName: string, iconUrl?: string) => {
  if (iconUrl) {
     return <img src={iconUrl} alt={iconName} className="w-6 h-6 object-contain" />;
  }
  
  switch (iconName) {
    case "SiFlutter": return <SiFlutter className="w-6 h-6 text-[#02569B]" />;
    case "SiKotlin": return <SiKotlin className="w-6 h-6 text-[#7F52FF]" />;
    case "FaJava": return <FaJava className="w-6 h-6 text-[#f89820]" />;
    case "SiFirebase": return <SiFirebase className="w-6 h-6 text-[#FFCA28]" />;
    case "Smartphone": return <Smartphone className="w-6 h-6 text-blue-500" />;
    case "Code2": return <Code2 className="w-6 h-6 text-green-500" />;
    case "TerminalSquare": return <TerminalSquare className="w-6 h-6 text-slate-500" />;
    case "Database": return <Database className="w-6 h-6 text-purple-500" />;
    case "LayoutTemplate": return <LayoutTemplate className="w-6 h-6 text-orange-500" />;
    case "Layers": return <Layers className="w-6 h-6 text-indigo-500" />;
    case "Cloud": return <Cloud className="w-6 h-6 text-cyan-500" />;
    default: return <Code2 className="w-6 h-6" />;
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function SkillsSection() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50" id="skills">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-16">
          <Badge variant="outline" className="mb-4 text-brand-600 dark:text-brand-400 border-brand-200 dark:border-brand-800">
            Technical Arsenal
          </Badge>
          <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Platforms & Environments
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            A comprehensive overview of the tools, languages, and frameworks I leverage to build robust digital products.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {SKILLS.map((skillGroup, groupIdx) => (
            <motion.div key={groupIdx} variants={itemVariants}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-xl">{skillGroup.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {skillGroup.items.map((skill, idx) => (
                      <div key={idx} className="flex flex-col gap-2 p-4 rounded-lg bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white dark:bg-slate-900 rounded-md shadow-sm">
                            {getIcon("icon" in skill ? skill.icon : "", "image" in skill ? skill.image : undefined)}
                          </div>
                          <span className="font-medium text-slate-900 dark:text-slate-100">{skill.name}</span>
                        </div>
                        {skill.level && (
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-2 overflow-hidden">
                            <motion.div 
                              className="bg-brand-500 h-1.5 rounded-full" 
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              viewport={{ once: true }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
