import { ReactNode } from "react";

import { useAuthStore } from "@/store/authStore";

interface AdminLayoutProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
  children: ReactNode;
}

const tabs = ["Overview", "Properties", "Agents"];

export default function AdminLayout({
  activeTab,
  onChangeTab,
  children,
}: AdminLayoutProps) {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 lg:px-6">
        <aside className="hidden w-60 shrink-0 rounded-3xl border bg-white p-4 lg:block dark:bg-slate-900">
          <h2 className="mb-4 text-lg font-semibold">Admin</h2>
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => onChangeTab(tab)}
                className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-medium ${activeTab === tab ? "bg-brand/10 text-brand" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mb-4 flex flex-col gap-3 rounded-3xl border bg-white p-4 dark:bg-slate-900 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-slate-500">Admin panel</p>
              <h1 className="text-2xl font-bold">{activeTab}</h1>
            </div>
            <div className="text-sm text-slate-500">{user?.name}</div>
          </div>
          <div className="mb-4 flex gap-2 lg:hidden">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => onChangeTab(tab)}
                className={`flex-1 rounded-2xl px-3 py-2 text-sm font-medium ${activeTab === tab ? "bg-brand/10 text-brand" : "bg-white dark:bg-slate-900"}`}
              >
                {tab}
              </button>
            ))}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
