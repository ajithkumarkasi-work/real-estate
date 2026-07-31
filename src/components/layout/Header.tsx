import { useState } from "react";

import {
  Building2,
  MoonStar,
  Search,
  Sparkles,
  SunMedium,
  UserCircle2,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Properties", to: "/search" },
  { label: "Map", to: "/map" },
  { label: "Favorites", to: "/favorites" },
];

export default function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [query, setQuery] = useState("");
  const [dark, setDark] = useState(
    document.documentElement.classList.contains("dark"),
  );

  const handleSearch = () => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const toggleTheme = () => {
    const root = document.documentElement;
    root.classList.toggle("dark");
    setDark(root.classList.contains("dark"));
  };

  return (
    <header className="sticky top-0 z-[1200] border-b border-black/10 bg-white/95 backdrop-blur dark:border-white/10 dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-4 lg:px-6">
        <Link
          to="/"
          className="flex items-center gap-2.5 text-slate-950 dark:text-white"
        >
          <span className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1B4FFF] to-sky-500 text-white shadow-[0_10px_24px_rgba(14,56,179,0.35)]">
            <Building2 className="h-5 w-5" />
            <Sparkles className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-white p-[2px] text-[#1B4FFF]" />
          </span>
          <span className="inline-flex items-baseline gap-1.5 text-[17px] font-semibold tracking-[0.04em] text-[#171717] dark:text-white">
            <span>Estate AI</span>
            <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-[#1B4FFF] dark:text-sky-400">
              Homes
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "relative px-0.5 py-1 text-[15px] font-medium tracking-[0.03em] transition",
                  isActive
                    ? "text-[#111111] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:rounded-full after:bg-[#C9A227] dark:text-white"
                    : "text-[#525252] hover:text-[#1f1f1f] dark:text-slate-300 dark:hover:text-white",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden flex-1 lg:flex">
          <div className="flex w-full max-w-2xl items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-2.5 dark:border-white/15 dark:bg-slate-900">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              aria-label="Global search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && handleSearch()}
              placeholder="Search city, neighborhood, or address"
              className="w-full bg-transparent text-[15px] font-medium tracking-[0.02em] text-[#1f1f1f] outline-none placeholder:text-slate-400 dark:text-white"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2.5">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-full border border-black/10 p-2 text-slate-600 transition hover:border-[#C9A227] hover:text-[#1f1f1f] dark:border-white/15 dark:text-slate-300 dark:hover:text-[#E1C16E]"
          >
            {dark ? (
              <SunMedium className="h-4 w-4" />
            ) : (
              <MoonStar className="h-4 w-4" />
            )}
          </button>

          {isAuthenticated ? (
            <button
              onClick={() => navigate("/dashboard")}
              aria-label="Go to profile"
              className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-2 text-[14px] font-medium tracking-[0.02em] text-[#202020] dark:border-white/15 dark:text-white"
            >
              <UserCircle2 className="h-5 w-5" />
              <span className="hidden lg:inline">{user?.name}</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="inline-flex rounded-full bg-[#171717] px-3.5 py-2 text-[14px] font-semibold tracking-[0.03em] text-[#F4E2A0] transition hover:bg-black"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
