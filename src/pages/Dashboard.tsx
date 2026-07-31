import { format } from "date-fns";
import {
  CalendarRange,
  Check,
  Heart,
  LogOut,
  PlusCircle,
  RefreshCw,
  Trash2,
  UserCircle2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import ConfirmModal from "@/components/ui/ConfirmModal";
import { useAuthStore } from "@/store/authStore";
import { useFavoritesStore } from "@/store/favoritesStore";
import { usePropertyStore } from "@/store/propertyStore";

const TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

function toSlotDate(baseDate: Date, slot: string): Date | null {
  const match = slot.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;

  const rawHour = Number(match[1]);
  const minute = Number(match[2]);
  const meridiem = match[3].toUpperCase();
  let hour = rawHour % 12;
  if (meridiem === "PM") hour += 12;

  const value = new Date(baseDate);
  value.setHours(hour, minute, 0, 0);
  return value;
}

function isSameDate(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState<"Overview" | "Scheduled Visits">(
    searchParams.get("tab") === "visits" ? "Scheduled Visits" : "Overview",
  );
  const [editingVisitId, setEditingVisitId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("10:00 AM");
  const [pendingAction, setPendingAction] = useState<
    null | { type: "logout" } | { type: "cancel-visit"; visitId: string }
  >(null);
  const navigate = useNavigate();
  const { user, updateVisitRequest, removeVisitRequest, logout } =
    useAuthStore();
  const favorites = useFavoritesStore((state) => state.ids.length);
  const properties = usePropertyStore((state) => state.properties);

  if (!user) return null;

  const visits = [...user.visitRequests].sort(
    (left, right) =>
      new Date(right.date).getTime() - new Date(left.date).getTime(),
  );

  const startReschedule = (visitId: string, dateIso: string, time: string) => {
    setEditingVisitId(visitId);
    setEditDate(format(new Date(dateIso), "yyyy-MM-dd"));
    setEditTime(time);
  };

  const isPastTimeForEditDate = (time: string) => {
    if (!editDate) return false;
    const selected = new Date(`${editDate}T00:00:00`);
    if (!isSameDate(selected, new Date())) return false;
    const slotDate = toSlotDate(selected, time);
    if (!slotDate) return false;
    return slotDate.getTime() <= Date.now();
  };

  const saveReschedule = () => {
    if (!editingVisitId) return;
    if (!editDate) {
      toast.error("Please select a date");
      return;
    }

    const selected = new Date(`${editDate}T00:00:00`);
    const slotDate = toSlotDate(selected, editTime);
    if (!slotDate || slotDate.getTime() <= Date.now()) {
      toast.error("Please choose a future time slot");
      return;
    }

    updateVisitRequest(editingVisitId, {
      date: selected.toISOString(),
      time: editTime,
    });
    toast.success("Visit rescheduled");
    setEditingVisitId(null);
  };

  const confirmPendingAction = () => {
    if (!pendingAction) return;

    if (pendingAction.type === "logout") {
      logout();
      navigate("/login");
      setPendingAction(null);
      return;
    }

    if (editingVisitId === pendingAction.visitId) {
      setEditingVisitId(null);
    }
    removeVisitRequest(pendingAction.visitId);
    setPendingAction(null);
  };

  const actionButtonClass =
    "inline-flex h-10 w-full items-center justify-center rounded-full border px-4 text-sm font-medium lg:w-auto lg:min-w-32";

  useEffect(() => {
    const expectedTab =
      searchParams.get("tab") === "visits" ? "Scheduled Visits" : "Overview";
    if (tab !== expectedTab) {
      setTab(expectedTab);
    }
  }, [searchParams, tab]);

  const handleTabChange = (nextTab: "Overview" | "Scheduled Visits") => {
    setTab(nextTab);
    const nextParams = new URLSearchParams(searchParams);
    if (nextTab === "Scheduled Visits") {
      nextParams.set("tab", "visits");
    } else {
      nextParams.delete("tab");
    }
    setSearchParams(nextParams, { replace: true });

    if (typeof window === "undefined") return;
    if (window.innerWidth > 1024) return;
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const openVisitProperty = (propertyId?: string) => {
    if (!propertyId) return;
    navigate(`/property/${propertyId}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      <div className="mb-6 flex gap-2">
        {["Overview", "Scheduled Visits"].map((item) => (
          <button
            key={item}
            onClick={() => handleTabChange(item as typeof tab)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${tab === item ? "bg-brand/10 text-brand" : "border"}`}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === "Overview" ? (
        <div className="space-y-6">
          <div className="rounded-3xl border bg-white p-6 dark:bg-slate-900">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <UserCircle2 className="h-14 w-14 text-brand" />
                <div>
                  <p className="text-slate-500">Welcome back</p>
                  <h1 className="text-2xl font-bold sm:text-3xl">
                    {user.name}
                  </h1>
                </div>
              </div>
              <button
                onClick={() => setPendingAction({ type: "logout" })}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-red-600 bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700 sm:w-auto dark:border-red-500 dark:bg-red-500 dark:hover:bg-red-600"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <button
              type="button"
              onClick={() => navigate("/favorites")}
              className="rounded-3xl border bg-white p-5 text-left transition hover:border-brand/40 hover:bg-brand/5 dark:bg-slate-900 dark:hover:bg-brand/10"
            >
              <Heart className="h-6 w-6 text-brand" />
              <p className="mt-4 text-3xl font-bold">{favorites}</p>
              <p className="text-slate-500">Saved properties</p>
              <p className="mt-2 text-xs font-medium text-brand">
                Open Favorites
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("Scheduled Visits")}
              className="rounded-3xl border bg-white p-5 text-left transition hover:border-brand/40 hover:bg-brand/5 dark:bg-slate-900 dark:hover:bg-brand/10"
            >
              <CalendarRange className="h-6 w-6 text-brand" />
              <p className="mt-4 text-3xl font-bold">{visits.length}</p>
              <p className="text-slate-500">Upcoming visits</p>
              <p className="mt-2 text-xs font-medium text-brand">
                Open Scheduled Visits
              </p>
            </button>
          </div>

          <div className="rounded-3xl border bg-white p-5 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Quick Actions
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/search")}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-brand bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <PlusCircle className="h-4 w-4" />
                Schedule New Visit
              </button>
              <button
                type="button"
                onClick={() => handleTabChange("Scheduled Visits")}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Manage Visits
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {visits.map((visit) => {
            const property = properties.find(
              (item) => item.id === visit.propertyId,
            );
            const isFuture = new Date(visit.date).getTime() > Date.now();

            return (
              <div
                key={visit.id}
                className={`overflow-hidden rounded-3xl border bg-white transition dark:bg-slate-900 ${property ? "cursor-pointer hover:border-brand/40 hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)] dark:hover:shadow-[0_10px_24px_rgba(2,6,23,0.45)]" : ""}`}
                onClick={() => openVisitProperty(property?.id)}
                onKeyDown={(event) => {
                  if (!property) return;
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openVisitProperty(property.id);
                  }
                }}
                role={property ? "button" : undefined}
                tabIndex={property ? 0 : -1}
              >
                <div className="border-b bg-slate-50/80 px-4 py-3 dark:bg-slate-900/80 sm:px-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Visit Schedule
                    </span>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${isFuture ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200"}`}
                    >
                      {isFuture ? "Upcoming" : "Past"}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 flex-1 flex-col gap-4 md:flex-row md:items-start">
                      <img
                        src={property?.images[0]}
                        alt={property?.title}
                        className="h-28 w-full rounded-2xl object-cover md:h-24 md:w-36"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">
                          {property?.title ?? "Property visit"}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                          {format(new Date(visit.date), "MMM d, yyyy")} at{" "}
                          {visit.time}
                        </p>
                        <p className="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
                          {visit.message || "No additional notes."}
                        </p>
                        {property ? (
                          <p className="mt-2 text-xs font-medium text-brand">
                            Tap card to view property details
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="grid w-full grid-cols-1 gap-2 lg:w-auto lg:min-w-[280px] lg:self-start">
                      {isFuture ? (
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            startReschedule(visit.id, visit.date, visit.time);
                          }}
                          className={`${actionButtonClass} border-brand bg-brand/10 text-brand hover:bg-brand/20 dark:border-brand dark:bg-brand/20 dark:text-sky-200`}
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Reschedule
                        </button>
                      ) : null}
                      {isFuture ? (
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            setPendingAction({
                              type: "cancel-visit",
                              visitId: visit.id,
                            });
                          }}
                          className={`${actionButtonClass} border-red-600 bg-red-600 text-white hover:bg-red-700 dark:border-red-500 dark:bg-red-500 dark:hover:bg-red-600`}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Cancel
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>

                {editingVisitId === visit.id ? (
                  <div
                    className="mx-4 mb-4 rounded-2xl border border-brand/25 bg-gradient-to-br from-brand/5 to-blue-500/5 p-4 dark:border-brand/35 dark:from-brand/20 dark:to-slate-900"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Reschedule Visit
                    </p>
                    <div className="grid gap-3 lg:grid-cols-[220px_1fr_auto] lg:items-start">
                      <input
                        type="date"
                        value={editDate}
                        min={format(new Date(), "yyyy-MM-dd")}
                        onChange={(event) => setEditDate(event.target.value)}
                        className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      />
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
                        {TIME_SLOTS.map((slot) => {
                          const disabled = isPastTimeForEditDate(slot);
                          return (
                            <button
                              key={slot}
                              type="button"
                              disabled={disabled}
                              onClick={() => setEditTime(slot)}
                              className={`rounded-xl border px-2 py-2 text-xs transition ${editTime === slot ? "border-brand bg-brand/10 text-brand" : "border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"} ${disabled ? "cursor-not-allowed opacity-45 hover:bg-transparent dark:hover:bg-transparent" : ""}`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                      <div className="grid gap-2 lg:self-start">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            saveReschedule();
                          }}
                          className={`${actionButtonClass} border-brand bg-brand text-white shadow-sm`}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setEditingVisitId(null);
                          }}
                          className={`${actionButtonClass} border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800`}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
          {!visits.length ? (
            <p className="text-sm text-slate-500">No scheduled visits yet.</p>
          ) : null}
        </div>
      )}

      <ConfirmModal
        open={Boolean(pendingAction)}
        title={
          pendingAction?.type === "logout"
            ? "Confirm Logout"
            : "Cancel Scheduled Visit"
        }
        message={
          pendingAction?.type === "logout"
            ? "Are you sure you want to log out?"
            : "Are you sure you want to cancel this visit?"
        }
        confirmText={
          pendingAction?.type === "logout" ? "Logout" : "Cancel Visit"
        }
        intent="danger"
        onCancel={() => setPendingAction(null)}
        onConfirm={confirmPendingAction}
      />
    </div>
  );
}
