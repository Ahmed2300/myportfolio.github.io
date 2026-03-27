export default function ProjectsLoading() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="animate-pulse">
          <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg mb-2"></div>
          <div className="h-5 w-96 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
        </div>
        <div className="h-12 w-36 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
             <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <th className="p-4"><div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div></th>
                <th className="p-4"><div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div></th>
                <th className="p-4"><div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div></th>
                <th className="p-4 text-right"><div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded ml-auto"></div></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800"></div>
                      <div className="space-y-2">
                        <div className="h-5 w-48 bg-slate-200 dark:bg-slate-800 rounded"></div>
                        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4"><div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div></td>
                  <td className="p-4"><div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full"></div></td>
                  <td className="p-4"><div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded ml-auto"></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
