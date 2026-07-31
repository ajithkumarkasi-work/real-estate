import { Building2, Heart, Home, Map, UserCircle2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { useChatStore } from "@/store/chatStore";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/search", label: "Properties", icon: Building2 },
  { to: "/map", label: "Map", icon: Map },
  { to: "/favorites", label: "Favorites", icon: Heart },
  { to: "/dashboard", label: "Profile", icon: UserCircle2 },
];

const LAST_ACTIVE_TAB_KEY = "mobile-nav-last-active-tab";

export default function MobileNav() {
  const location = useLocation();
  const { isOpen, messages } = useChatStore();
  const unread = !isOpen && messages.length > 0;
  const isPropertyRoute = location.pathname.startsWith("/property/");

  useEffect(() => {
    const isKnownTab = items.some((item) => item.to === location.pathname);
    if (!isKnownTab) return;
    window.sessionStorage.setItem(LAST_ACTIVE_TAB_KEY, location.pathname);
  }, [location.pathname]);

  const stickyActivePath = useMemo(() => {
    if (!isPropertyRoute) return null;

    const state = location.state as
      | { backgroundLocation?: { pathname?: string } }
      | undefined;
    const backgroundPath = state?.backgroundLocation?.pathname;
    if (backgroundPath && items.some((item) => item.to === backgroundPath)) {
      return backgroundPath;
    }

    const stored = window.sessionStorage.getItem(LAST_ACTIVE_TAB_KEY);
    if (stored && items.some((item) => item.to === stored)) {
      return stored;
    }

    return "/";
  }, [isPropertyRoute, location.state]);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-[1200] border-t bg-white/95 px-2 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] backdrop-blur dark:bg-slate-950/95 lg:hidden">
      <div className="grid grid-cols-5 gap-1">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "relative flex flex-col items-center justify-center gap-1 rounded-2xl py-2 text-xs",
                isActive || stickyActivePath === to
                  ? "bg-brand/10 text-brand"
                  : "text-slate-500",
              )
            }
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
            {label === "Profile" && unread ? (
              <span className="absolute right-4 top-2 h-2 w-2 rounded-full bg-accent" />
            ) : null}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
