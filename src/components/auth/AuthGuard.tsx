import type { ReactNode } from "react";

import { Navigate } from "react-router-dom";

import { useAuthStore } from "@/store/authStore";

interface AuthGuardProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export default function AuthGuard({
  children,
  requireAdmin = false,
}: AuthGuardProps) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requireAdmin && user?.role !== "admin")
    return <Navigate to="/" replace />;
  return children;
}
