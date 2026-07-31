import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: "up" | "down";
  trendValue?: string;
  color: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color,
}: StatsCardProps) {
  return (
    <div className="rounded-3xl border bg-white p-5 dark:bg-slate-900">
      <div className={`mb-4 inline-flex rounded-2xl p-3 text-white ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{title}</p>
      {trend ? (
        <p
          className={`mt-3 text-sm font-medium ${trend === "up" ? "text-emerald-500" : "text-red-500"}`}
        >
          {trend === "up" ? "↑" : "↓"} {trendValue}
        </p>
      ) : null}
    </div>
  );
}
