import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { User, VisitRequest } from "@/types/user";

const createDefaultVisit = (): VisitRequest => {
  const date = new Date();
  date.setDate(date.getDate() + 2);
  date.setHours(11, 0, 0, 0);

  return {
    id: "visit-default-001",
    propertyId: "property-001",
    date: date.toISOString(),
    time: "11:00 AM",
    name: "Alex Johnson",
    email: "user@demo.com",
    phone: "+91 98765 43210",
    message: "Please confirm parking availability during the visit.",
    createdAt: new Date().toISOString(),
  };
};

const MOCK_USERS: User[] = [
  {
    id: "user-1",
    name: "Alex Johnson",
    email: "user@demo.com",
    password: "demo123",
    role: "user",
    visitRequests: [createDefaultVisit()],
  },
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@demo.com",
    password: "demo123",
    role: "admin",
    visitRequests: [],
  },
];

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  addVisitRequest: (req: VisitRequest) => void;
  setVisitRequestForProperty: (req: VisitRequest) => void;
  updateVisitRequest: (visitId: string, updates: Partial<VisitRequest>) => void;
  removeVisitRequest: (visitId: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: (email, password) => {
        const found = MOCK_USERS.find(
          (candidate) =>
            candidate.email === email && candidate.password === password,
        );
        if (!found) return false;
        set({ user: found, isAuthenticated: true });
        return true;
      },
      logout: () => set({ user: null, isAuthenticated: false }),
      updateProfile: (data) => {
        const current = get().user;
        if (!current) return;
        set({ user: { ...current, ...data } });
      },
      addVisitRequest: (req) => {
        const current = get().user;
        if (!current) return;
        set({
          user: { ...current, visitRequests: [...current.visitRequests, req] },
        });
      },
      setVisitRequestForProperty: (req) => {
        const current = get().user;
        if (!current) return;
        const remaining = current.visitRequests.filter(
          (entry) => entry.propertyId !== req.propertyId,
        );
        set({
          user: { ...current, visitRequests: [...remaining, req] },
        });
      },
      updateVisitRequest: (visitId, updates) => {
        const current = get().user;
        if (!current) return;
        set({
          user: {
            ...current,
            visitRequests: current.visitRequests.map((entry) =>
              entry.id === visitId ? { ...entry, ...updates } : entry,
            ),
          },
        });
      },
      removeVisitRequest: (visitId) => {
        const current = get().user;
        if (!current) return;
        set({
          user: {
            ...current,
            visitRequests: current.visitRequests.filter(
              (entry) => entry.id !== visitId,
            ),
          },
        });
      },
    }),
    {
      name: "auth",
    },
  ),
);
