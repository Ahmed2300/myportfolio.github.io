export default function EditProjectLoading() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg mb-2"></div>
        <div className="h-5 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
      </div>

      <div className="space-y-8 pb-32">
        <div className="flex items-center justify-between animate-pulse">
          <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
          <div className="h-10 w-32 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-8 shadow-sm">
          <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg pb-4 border-b border-slate-100 dark:border-slate-800 animate-pulse"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            <div className="space-y-2">
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
              <div className="h-11 w-full bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
              <div className="h-11 w-full bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
              <div className="h-24 w-full bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
              <div className="h-11 w-full bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            </div>
             <div className="space-y-2">
              <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
              <div className="h-11 w-full bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
