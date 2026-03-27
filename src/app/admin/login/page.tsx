"use client";

import { useActionState } from "react";
import { login } from "@/actions/auth.actions";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700/50 p-8 sm:p-12 overflow-hidden relative"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-brand-500/10 blur-[60px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          <div className="w-16 h-16 bg-brand-500/10 rounded-2xl flex items-center justify-center mb-8">
            <Lock className="w-8 h-8 text-brand-500" />
          </div>
          
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">
            Admin Access
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Sign in to manage your portfolio projects.
          </p>

          <form action={formAction} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  required
                  defaultValue="admin@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none text-slate-900 dark:text-white transition-all"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  required
                  defaultValue="password"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none text-slate-900 dark:text-white transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {state?.error && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-red-500 text-sm font-medium"
              >
                {state.error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white py-3.5 rounded-2xl font-semibold transition-all active:scale-[0.98] disabled:opacity-70 mt-4 group"
            >
              {pending ? "Authenticating..." : "Login to Dashboard"}
              {!pending && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        </div>
      </motion.div>
    </main>
  );
}
