export default function PropertySkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm dark:bg-slate-900">
      <div className="aspect-[4/3] animate-pulse bg-slate-200 dark:bg-slate-800" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-3 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
}
