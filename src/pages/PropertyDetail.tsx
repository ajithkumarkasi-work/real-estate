import {
  ArrowLeft,
  Bath,
  BedDouble,
  Copy,
  Heart,
  Home as HomeIcon,
  MapPin,
  SquareStack,
  Tag,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { DayPicker } from "react-day-picker";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import PropertyCard from "@/components/property/PropertyCard";
import PropertyGallery from "@/components/property/PropertyGallery";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { mockAgents } from "@/data/mockAgents";
import { useAuthStore } from "@/store/authStore";
import { useFavoritesStore } from "@/store/favoritesStore";
import { usePropertyStore } from "@/store/propertyStore";
import { formatINR, formatPriceWithUnitINR } from "@/lib/utils";

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

function getEarliestTimeForDate(date: Date): string | null {
  const now = new Date();

  for (const slot of TIME_SLOTS) {
    const slotDate = toSlotDate(date, slot);
    if (!slotDate) continue;

    if (!isSameDate(date, now) || slotDate.getTime() > now.getTime()) {
      return slot;
    }
  }

  return null;
}

function getEarliestDateTimeFromNow(): { date: Date; time: string } {
  const now = new Date();
  const todayTime = getEarliestTimeForDate(now);

  if (todayTime) {
    return { date: now, time: todayTime };
  }

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  return { date: tomorrow, time: TIME_SLOTS[0] };
}

const visitSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  message: z.string().min(5),
  time: z.string().min(1),
});

type VisitFormValues = z.infer<typeof visitSchema>;

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getById, updateProperty, properties } = usePropertyStore();
  const {
    isAuthenticated,
    user,
    setVisitRequestForProperty,
    removeVisitRequest,
  } = useAuthStore();
  const { toggle, isFavorite } = useFavoritesStore();
  const property = id ? getById(id) : undefined;
  const agent = mockAgents.find(
    (candidate) => candidate.id === property?.agentId,
  );
  const [expanded, setExpanded] = useState(false);
  const visitedRef = useRef(false);
  const [emiLoanAmount, setEmiLoanAmount] = useState(0);
  const [emiRate, setEmiRate] = useState(8.5);
  const [emiTenureYears, setEmiTenureYears] = useState(20);
  const [isEditingVisit, setIsEditingVisit] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    if (!property) return;
    if (visitedRef.current) return;
    visitedRef.current = true;
    updateProperty(property.id, { views: property.views + 1 });
  }, [property, updateProperty]);

  const similar = useMemo(
    () =>
      properties
        .filter(
          (candidate) =>
            candidate.id !== property?.id &&
            candidate.city === property?.city &&
            candidate.type === property?.type,
        )
        .slice(0, 3),
    [property, properties],
  );
  const initialSchedule = useMemo(() => getEarliestDateTimeFromNow(), []);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } =
    useForm<VisitFormValues>({
      resolver: zodResolver(visitSchema),
      mode: "onChange",
      reValidateMode: "onChange",
      defaultValues: {
        name: user?.name ?? "",
        email: user?.email ?? "",
        phone: "",
        message: "",
        time: initialSchedule.time,
      },
    });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialSchedule.date,
  );
  const selectedTime = watch("time");
  const getVisitInputClassName = (hasError: boolean) =>
    `w-full rounded-2xl border bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 transition-colors dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 ${
      hasError
        ? "border-red-500 focus:border-red-500 dark:border-red-400 dark:focus:border-red-400"
        : "border-slate-200 focus:border-brand dark:border-slate-700 dark:focus:border-brand"
    }`;

  const existingVisit = useMemo(() => {
    if (!user) return undefined;

    return [...user.visitRequests]
      .filter((entry) => entry.propertyId === property?.id)
      .sort(
        (left, right) =>
          new Date(right.createdAt).getTime() -
          new Date(left.createdAt).getTime(),
      )[0];
  }, [property?.id, user]);

  useEffect(() => {
    if (!property) return;
    setEmiLoanAmount(Math.round(property.price * 0.8));
  }, [property]);

  useEffect(() => {
    if (!existingVisit || isEditingVisit) return;
    const visitDate = new Date(existingVisit.date);
    setSelectedDate(visitDate);
    setValue("time", existingVisit.time, {
      shouldDirty: false,
      shouldValidate: true,
    });
    reset({
      name: existingVisit.name,
      email: existingVisit.email,
      phone: existingVisit.phone,
      message: existingVisit.message,
      time: existingVisit.time,
    });
  }, [existingVisit, isEditingVisit, reset, setValue]);

  useEffect(() => {
    if (existingVisit && !isEditingVisit) return;

    const fallback = getEarliestDateTimeFromNow();

    if (!selectedDate) {
      setSelectedDate(fallback.date);
      setValue("time", fallback.time, {
        shouldDirty: false,
        shouldValidate: true,
      });
      return;
    }

    const earliestForSelectedDate = getEarliestTimeForDate(selectedDate);
    if (!earliestForSelectedDate) {
      setSelectedDate(fallback.date);
      setValue("time", fallback.time, {
        shouldDirty: true,
        shouldValidate: true,
      });
      return;
    }

    const selectedSlotDate = selectedTime
      ? toSlotDate(selectedDate, selectedTime)
      : null;
    const hasValidSelectedTime =
      Boolean(selectedTime) &&
      Boolean(selectedSlotDate) &&
      selectedSlotDate!.getTime() > Date.now();

    if (!hasValidSelectedTime) {
      setValue("time", earliestForSelectedDate, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [existingVisit, isEditingVisit, selectedDate, selectedTime, setValue]);

  const isPastTimeForSelectedDate = (time: string) => {
    if (!selectedDate) return false;
    if (!isSameDate(selectedDate, new Date())) return false;
    const slotDate = toSlotDate(selectedDate, time);
    if (!slotDate) return false;
    return slotDate.getTime() <= Date.now();
  };

  const emiMonthly = useMemo(() => {
    const principal = Math.max(0, emiLoanAmount);
    const monthlyRate = Math.max(0, emiRate) / 100 / 12;
    const months = Math.max(1, emiTenureYears) * 12;

    if (!principal) return 0;
    if (!monthlyRate) return principal / months;

    const factor = Math.pow(1 + monthlyRate, months);
    return (principal * monthlyRate * factor) / (factor - 1);
  }, [emiLoanAmount, emiRate, emiTenureYears]);

  const priceHistory = useMemo(() => {
    if (!property) return [];

    const points = [
      { label: "6 mo ago", factor: 0.92 },
      { label: "5 mo ago", factor: 0.94 },
      { label: "4 mo ago", factor: 0.95 },
      { label: "3 mo ago", factor: 0.97 },
      { label: "2 mo ago", factor: 0.99 },
      { label: "Current", factor: 1 },
    ];

    return points.map((point) => ({
      label: point.label,
      value: Math.round(property.price * point.factor),
    }));
  }, [property]);

  if (!property) {
    return <Navigate to="/404" replace />;
  }

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/");
  };

  const submitVisit = (values: VisitFormValues) => {
    if (!isAuthenticated) {
      toast.error("Please login to schedule a visit");
      navigate("/login");
      return;
    }

    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    const slotDate = toSlotDate(selectedDate, values.time);
    if (!slotDate || slotDate.getTime() <= Date.now()) {
      toast.error("Please choose a future time slot");
      return;
    }

    setVisitRequestForProperty({
      id: existingVisit?.id ?? crypto.randomUUID(),
      propertyId: property.id,
      date: selectedDate.toISOString(),
      time: values.time,
      name: values.name,
      email: values.email,
      phone: values.phone,
      message: values.message,
      createdAt: existingVisit?.createdAt ?? new Date().toISOString(),
    });
    toast.success(existingVisit ? "Visit schedule updated" : "Visit scheduled");
    setIsEditingVisit(false);
    reset({
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: "",
      message: "",
      time: initialSchedule.time,
    });
    setSelectedDate(initialSchedule.date);
  };

  const description = expanded
    ? property.description
    : `${property.description.slice(0, 200)}${property.description.length > 200 ? "..." : ""}`;

  const locationThumbnailUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${property.coordinates.lat},${property.coordinates.lng}&zoom=14&size=1200x500&maptype=mapnik&markers=${property.coordinates.lat},${property.coordinates.lng},red`;

  const openFocusedMap = () => {
    navigate(
      `/map?focus=${encodeURIComponent(property.id)}&city=${encodeURIComponent(property.city)}&q=${encodeURIComponent(property.neighborhood)}`,
    );
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    const earliest = getEarliestTimeForDate(date);
    if (!earliest) {
      const fallback = getEarliestDateTimeFromNow();
      setSelectedDate(fallback.date);
      setValue("time", fallback.time, {
        shouldDirty: true,
        shouldValidate: true,
      });
      return;
    }

    setSelectedDate(date);
    setValue("time", earliest, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      <div className="space-y-6">
        <div className="flex  justify-between gap-3 items-center">
          <div className="min-w-0 text-sm text-slate-500">
            <p className="truncate">
              Home &gt; {property.city} &gt; {property.type} &gt;{" "}
              {property.title}
            </p>
          </div>
          <button
            type="button"
            onClick={goBack}
            aria-label="Go back"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-brand bg-brand px-3 text-sm font-semibold text-white hover:bg-blue-700 sm:px-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
        </div>
        <PropertyGallery images={property.images} title={property.title} />

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <main className="space-y-4">
            <section className="rounded-3xl border bg-white p-4 dark:bg-slate-900 sm:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-bold">{property.title}</h1>
                    <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand capitalize">
                      {property.status.replace("-", " ")}
                    </span>
                  </div>
                  <p className="mt-2 flex items-center gap-2 text-slate-500">
                    <MapPin className="h-4 w-4" />
                    {property.address}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      navigator.clipboard
                        .writeText(window.location.href)
                        .then(() => toast.success("Link copied"))
                    }
                    className="rounded-full border p-3"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => toggle(property.id)}
                    className="rounded-full border p-3"
                  >
                    <Heart
                      className={
                        isFavorite(property.id)
                          ? "h-4 w-4 fill-red-500 text-red-500"
                          : "h-4 w-4"
                      }
                    />
                  </button>
                </div>
              </div>
              <div className="mt-6 text-4xl font-black text-brand">
                {formatPriceWithUnitINR(property.price, property.priceUnit)}
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {[
                  [BedDouble, `${property.bedrooms} Bedrooms`],
                  [Bath, `${property.bathrooms} Bathrooms`],
                  [SquareStack, `${property.area} sqft`],
                  [Tag, `${property.yearBuilt}`],
                  [HomeIcon, property.type],
                ].map(([Icon, label]) => (
                  <div
                    key={String(label)}
                    className="rounded-2xl border p-3 sm:p-4"
                  >
                    <Icon className="h-5 w-5 text-brand" />
                    <p className="mt-2 text-sm text-slate-500">
                      {label as string}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <p className="break-words text-slate-600 dark:text-slate-300">
                  {description}
                </p>
                {property.description.length > 200 ? (
                  <button
                    onClick={() => setExpanded((value) => !value)}
                    className="mt-2 text-sm font-semibold text-brand"
                  >
                    {expanded ? "Show less" : "Show more"}
                  </button>
                ) : null}
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {property.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="rounded-full border px-3 py-1 text-sm capitalize"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border bg-white p-4 dark:bg-slate-900 sm:p-6">
              <h2 className="mb-4 text-2xl font-bold">Location</h2>
              <div className="mb-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border p-3 sm:p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Full Address
                  </p>
                  <p className="mt-1 flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    <span>{property.address}</span>
                  </p>
                </div>
                <div className="rounded-2xl border p-3 sm:p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Area Details
                  </p>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                    {property.neighborhood}, {property.city}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Lat: {property.coordinates.lat}, Lng:{" "}
                    {property.coordinates.lng}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={openFocusedMap}
                className="group w-full overflow-hidden rounded-2xl border text-left"
              >
                <img
                  src={locationThumbnailUrl}
                  alt={`Map preview of ${property.neighborhood}, ${property.city}`}
                  className="h-56 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = property.images[0];
                  }}
                />
                <div className="flex items-center justify-between bg-white px-4 py-3 text-sm font-medium text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  <span>Open this property on map</span>
                  <span className="rounded-full border border-brand px-3 py-1 text-xs font-semibold text-brand">
                    View
                  </span>
                </div>
              </button>
            </section>

            <section className="rounded-3xl border bg-white p-4 dark:bg-slate-900 sm:p-6">
              <h2 className="mb-4 text-2xl font-bold">Price History</h2>
              <div className="space-y-3">
                {priceHistory.map((point) => (
                  <div key={point.label} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">{point.label}</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-100">
                        {formatINR(point.value)}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full bg-brand"
                        style={{
                          width: `${Math.max(40, (point.value / property.price) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold">Similar Properties</h2>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {similar.map((item) => (
                  <PropertyCard
                    key={item.id}
                    property={item}
                    visitScheduled={Boolean(
                      user?.visitRequests.some(
                        (visit) => visit.propertyId === item.id,
                      ),
                    )}
                  />
                ))}
              </div>
            </section>
          </main>

          <aside className="space-y-6">
            <section className="rounded-3xl border bg-white p-4 dark:bg-slate-900 sm:p-6">
              <div className="flex items-center gap-4">
                <img
                  src={agent?.photo ?? property.images[0]}
                  alt={agent?.name ?? "Agent"}
                  className="h-16 w-16 rounded-2xl object-cover"
                />
                <div>
                  <h3 className="text-xl font-semibold">
                    {agent?.name ?? "EstateAI Agent"}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {agent?.title ?? "Property Specialist"}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
                {agent?.bio ??
                  "Reach out for more information, tours, or neighborhood details."}
              </p>
              <div className="mt-4 flex gap-2">
                <a
                  href={`tel:${agent?.phone ?? ""}`}
                  className="flex-1 rounded-full border border-brand bg-brand px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
                >
                  Call
                </a>
                <a
                  href={`mailto:${agent?.email ?? ""}`}
                  className="flex-1 rounded-full border border-brand bg-brand px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
                >
                  Email
                </a>
              </div>
            </section>

            <section className="rounded-3xl border bg-white p-4 dark:bg-slate-900 sm:p-6">
              <h3 className="mb-4 text-xl font-semibold">Schedule Visit</h3>
              {existingVisit && !isEditingVisit ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-3 dark:border-emerald-900/50 dark:bg-emerald-950/25 sm:p-4">
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">
                      You scheduled a visit on
                    </p>
                    <p className="mt-1 text-base font-semibold text-emerald-800 dark:text-emerald-200">
                      {format(new Date(existingVisit.date), "EEE, MMM d, yyyy")}{" "}
                      at {existingVisit.time}
                    </p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      {existingVisit.name} • {existingVisit.phone}
                    </p>
                    {existingVisit.message ? (
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                        {existingVisit.message}
                      </p>
                    ) : null}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingVisit(true)}
                      className="rounded-full border border-brand bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Change Visit
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteOpen(true)}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                      <Trash2 className="h-4 w-4" /> Delete Visit
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid gap-4">
                    <div className="min-w-0">
                      <div className="overflow-x-auto rounded-2xl border p-2 sm:p-3">
                        <DayPicker
                          mode="single"
                          selected={selectedDate}
                          onSelect={handleDateSelect}
                          disabled={{
                            before: new Date(new Date().setHours(0, 0, 0, 0)),
                          }}
                          className="w-full"
                        />
                      </div>
                      <p className="mt-3 text-sm text-slate-500">
                        Selected date:{" "}
                        <span className="font-medium text-slate-700 dark:text-slate-200">
                          {selectedDate
                            ? format(selectedDate, "EEE, MMM d, yyyy")
                            : "None"}
                        </span>
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                        Available Times
                      </p>
                      <div
                        className={`grid grid-cols-2 gap-2 rounded-2xl p-1 sm:grid-cols-3 ${
                          errors.time
                            ? "border border-red-500/60"
                            : "border border-transparent"
                        }`}
                      >
                        {TIME_SLOTS.map((time) => {
                          const disabled = isPastTimeForSelectedDate(time);
                          return (
                            <button
                              key={time}
                              type="button"
                              disabled={disabled}
                              onClick={() =>
                                setValue("time", time, {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                })
                              }
                              className={`rounded-2xl border px-2.5 py-2 text-xs transition sm:px-3 sm:text-sm ${selectedTime === time ? "border-brand bg-brand/10 text-brand" : "border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"} ${disabled ? "cursor-not-allowed opacity-45 hover:bg-transparent dark:hover:bg-transparent" : ""}`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                      {errors.time ? (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                          {errors.time.message}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <form
                    onSubmit={handleSubmit(submitVisit)}
                    className="mt-4 space-y-3"
                  >
                    <input
                      {...register("name")}
                      placeholder="Name"
                      aria-invalid={Boolean(errors.name)}
                      className={getVisitInputClassName(Boolean(errors.name))}
                    />
                    {errors.name ? (
                      <p className="-mt-1 text-xs text-red-600 dark:text-red-400">
                        {errors.name.message}
                      </p>
                    ) : null}
                    <input
                      {...register("email")}
                      placeholder="Email"
                      aria-invalid={Boolean(errors.email)}
                      className={getVisitInputClassName(Boolean(errors.email))}
                    />
                    {errors.email ? (
                      <p className="-mt-1 text-xs text-red-600 dark:text-red-400">
                        {errors.email.message}
                      </p>
                    ) : null}
                    <input
                      {...register("phone")}
                      placeholder="Phone"
                      aria-invalid={Boolean(errors.phone)}
                      className={getVisitInputClassName(Boolean(errors.phone))}
                    />
                    {errors.phone ? (
                      <p className="-mt-1 text-xs text-red-600 dark:text-red-400">
                        {errors.phone.message}
                      </p>
                    ) : null}
                    <textarea
                      {...register("message")}
                      placeholder="Message"
                      rows={3}
                      aria-invalid={Boolean(errors.message)}
                      className={getVisitInputClassName(Boolean(errors.message))}
                    />
                    {errors.message ? (
                      <p className="-mt-1 text-xs text-red-600 dark:text-red-400">
                        {errors.message.message}
                      </p>
                    ) : null}
                    <button
                      type="submit"
                      className="w-full rounded-full bg-brand px-4 py-3 font-semibold text-white"
                    >
                      {existingVisit ? "Update Visit" : "Book Visit"}
                    </button>
                    {existingVisit ? (
                      <button
                        type="button"
                        onClick={() => setIsEditingVisit(false)}
                        className="w-full rounded-full border px-4 py-3 text-sm font-medium"
                      >
                        Cancel
                      </button>
                    ) : null}
                  </form>
                </>
              )}

              <ConfirmModal
                open={confirmDeleteOpen}
                title="Cancel Scheduled Visit"
                message="Are you sure you want to cancel this scheduled visit?"
                confirmText="Cancel Visit"
                intent="danger"
                onCancel={() => setConfirmDeleteOpen(false)}
                onConfirm={() => {
                  if (!existingVisit) {
                    setConfirmDeleteOpen(false);
                    return;
                  }
                  removeVisitRequest(existingVisit.id);
                  toast.success("Scheduled visit deleted");
                  setIsEditingVisit(false);
                  const fallback = getEarliestDateTimeFromNow();
                  setSelectedDate(fallback.date);
                  setValue("time", fallback.time, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                  setConfirmDeleteOpen(false);
                }}
              />
            </section>

            <section className="rounded-3xl border bg-white p-4 dark:bg-slate-900 sm:p-6">
              <h3 className="mb-4 text-xl font-semibold">EMI Calculator</h3>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
                    Loan Amount
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={emiLoanAmount}
                    onChange={(event) =>
                      setEmiLoanAmount(Number(event.target.value) || 0)
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
                      Interest (% p.a.)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step="0.1"
                      value={emiRate}
                      onChange={(event) =>
                        setEmiRate(Number(event.target.value) || 0)
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
                      Tenure (Years)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={emiTenureYears}
                      onChange={(event) =>
                        setEmiTenureYears(
                          Math.max(1, Number(event.target.value) || 1),
                        )
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 rounded-2xl bg-brand/10 p-4">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Estimated Monthly EMI
                </p>
                <p className="mt-1 text-3xl font-black text-brand">
                  {formatINR(Math.round(emiMonthly))}
                </p>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
