

export function ProjectsSkeleton() {
  return (
    <>
      <div className="relative">
        <div className="wave-divider bottom text-white dark:text-slate-900">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              className="wave-fill"
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V120H0Z"
            ></path>
          </svg>
        </div>
      </div>

      <section className="py-24 relative overflow-hidden bg-white dark:bg-slate-900">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-50/50 dark:from-brand-900/10 to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 animate-pulse">
            <div className="inline-flex items-center justify-center w-24 h-8 rounded-full bg-brand-50 dark:bg-brand-900/30 mb-4"></div>
            <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4 mx-auto mb-6"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full mx-auto mb-2"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col min-h-[400px]"
              >
                <div className="w-full h-48 bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
                <div className="p-6 flex flex-col flex-1 gap-4">
                  <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4 animate-pulse"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6 animate-pulse"></div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <div className="w-16 h-6 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse"></div>
                    <div className="w-20 h-6 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse"></div>
                    <div className="w-14 h-6 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
