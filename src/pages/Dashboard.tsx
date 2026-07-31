import { format } from "date-fns";
import {
  CalendarRange,
  Heart,
  LogOut,
  Trash2,
  UserCircle2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [tab, setTab] = useState<"Overview" | "Scheduled Visits">("Overview");
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      <div className="mb-6 flex gap-2">
        {["Overview", "Scheduled Visits"].map((item) => (
          <button
            key={item}
            onClick={() => setTab(item as typeof tab)}
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
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: Heart, value: favorites, label: "Saved properties" },
              {
                icon: CalendarRange,
                value: visits.length,
                label: "Upcoming visits",
              },
              {
                icon: Trash2,
                value: properties.length,
                label: "Available listings",
              },
            ].map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="rounded-3xl border bg-white p-5 dark:bg-slate-900"
              >
                <Icon className="h-6 w-6 text-brand" />
                <p className="mt-4 text-3xl font-bold">{value}</p>
                <p className="text-slate-500">{label}</p>
              </div>
            ))}
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
                className="rounded-3xl border bg-white p-4 dark:bg-slate-900"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <img
                      src={property?.images[0]}
                      alt={property?.title}
                      className="h-24 w-36 rounded-2xl object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">
                        {property?.title ?? "Property visit"}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {format(new Date(visit.date), "MMM d, yyyy")} at{" "}
                        {visit.time}
                      </p>
                      <p className="text-sm text-slate-500">{visit.message}</p>
                    </div>
                  </div>

                  <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:w-auto lg:flex-wrap lg:items-center lg:gap-3">
                    {property ? (
                      <button
                        onClick={() => navigate(`/property/${property.id}`)}
                        className={`${actionButtonClass} border-brand bg-brand text-white hover:bg-blue-700 dark:border-brand dark:bg-brand dark:text-white`}
                      >
                        View Property
                      </button>
                    ) : null}
                    <span
                      className={`inline-flex h-10 w-full items-center justify-center rounded-full px-4 text-sm font-medium lg:w-auto lg:min-w-32 ${isFuture ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}
                    >
                      {isFuture ? "Upcoming" : "Past"}
                    </span>
                    {isFuture ? (
                      <button
                        onClick={() =>
                          startReschedule(visit.id, visit.date, visit.time)
                        }
                        className={`${actionButtonClass} border-brand bg-brand text-white hover:bg-blue-700 dark:border-brand dark:bg-brand dark:text-white`}
                      >
                        Reschedule
                      </button>
                    ) : null}
                    {isFuture ? (
                      <button
                        onClick={() =>
                          setPendingAction({
                            type: "cancel-visit",
                            visitId: visit.id,
                          })
                        }
                        className={`${actionButtonClass} border-red-600 bg-red-600 text-white hover:bg-red-700 dark:border-red-500 dark:bg-red-500 dark:hover:bg-red-600`}
                      >
                        Cancel
                      </button>
                    ) : null}
                  </div>
                </div>

                {editingVisitId === visit.id ? (
                  <div className="mt-4 rounded-2xl border bg-slate-50 p-4 dark:bg-slate-950">
                    <p className="mb-3 text-sm font-semibold">
                      Reschedule Visit
                    </p>
                    <div className="grid gap-3 lg:grid-cols-[220px_1fr]">
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
                    </div>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:flex">
                      <button
                        type="button"
                        onClick={saveReschedule}
                        className={`${actionButtonClass} border-brand bg-brand text-white`}
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingVisitId(null)}
                        className={`${actionButtonClass} border-red-600 bg-red-600 text-white hover:bg-red-700 dark:border-red-500 dark:bg-red-500 dark:hover:bg-red-600`}
                      >
                        Cancel
                      </button>
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
