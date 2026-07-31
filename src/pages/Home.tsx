import {
  ArrowRight,
  Award,
  Building2,
  ChevronDown,
  Compass,
  Home as HomeIcon,
  LucideIcon,
  MapPin,
  Search,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { usePropertyStore } from "@/store/propertyStore";
import { useChatStore } from "@/store/chatStore";
import PropertyCard from "@/components/property/PropertyCard";

const propertyTypes: Array<{ label: string; type: string; icon: LucideIcon }> =
  [
    { label: "Apartment", type: "apartment", icon: Building2 },
    { label: "House", type: "house", icon: HomeIcon },
    { label: "Villa", type: "villa", icon: Compass },
    { label: "Studio", type: "studio", icon: Sparkles },
    { label: "Penthouse", type: "penthouse", icon: Award },
  ];

const cities = [
  {
    name: "Delhi",
    image:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200",
  },
  {
    name: "Mumbai",
    image:
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200",
  },
  {
    name: "Bengaluru",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
  },
  {
    name: "Hyderabad",
    image:
      "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=1200",
  },
  {
    name: "Pune",
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=1200",
  },
  {
    name: "Chennai",
    image:
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200",
  },
];

const testimonials = [
  {
    name: "Priya K",
    quote:
      "The AI search saved me hours and surfaced exactly the neighborhoods I needed.",
    rating: 5,
  },
  {
    name: "James R",
    quote:
      "Beautiful interface and a strong property map experience. Easy to compare options.",
    rating: 5,
  },
  {
    name: "Elena M",
    quote:
      "The visit scheduling flow was smooth and the AI assistant was surprisingly useful.",
    rating: 5,
  },
];

export default function Home() {
  const navigate = useNavigate();
  const openChat = useChatStore((state) => state.open);
  const properties = usePropertyStore((state) => state.properties);
  const featured = properties
    .filter((property) => property.featured)
    .slice(0, 6);
  const total = properties.length;
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location.trim()) params.set("q", location.trim());
    if (type) params.set("type", type);
    if (status) params.set("status", status);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="space-y-16 pb-10">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(27,79,255,0.55),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(255,180,0,0.25),_transparent_32%)]" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=1600')] bg-cover bg-center opacity-35" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur">
              <Sparkles className="h-4 w-4" /> Smart real estate discovery
            </p>
            <h1 className="mt-6 text-5xl font-black tracking-tight md:text-7xl">
              Find Your Dream Home
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-200 md:text-xl">
              Search premium rentals and homes across six major cities with
              smart filters, map exploration, and a property assistant that
              understands what you need.
            </p>

            <div className="mt-8 rounded-[2rem] border border-white/15 bg-white/10 p-3 backdrop-blur">
              <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr_auto]">
                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-[15px] leading-5 outline-none placeholder:text-slate-300 md:text-base"
                  placeholder="Location or keyword"
                />
                <div className="relative">
                  <select
                    value={type}
                    onChange={(event) => setType(event.target.value)}
                    className="h-full w-full appearance-none rounded-2xl border border-white/15 bg-white/10 px-4 py-3 pr-10 text-[15px] leading-5 text-white outline-none transition focus:border-white/35 focus:bg-white/15 md:text-base"
                  >
                    <option value="" className="text-slate-900">
                      Type
                    </option>
                    <option value="apartment" className="text-slate-900">
                      Apartment
                    </option>
                    <option value="house" className="text-slate-900">
                      House
                    </option>
                    <option value="villa" className="text-slate-900">
                      Villa
                    </option>
                    <option value="studio" className="text-slate-900">
                      Studio
                    </option>
                    <option value="penthouse" className="text-slate-900">
                      Penthouse
                    </option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-200" />
                </div>
                <div className="relative">
                  <select
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    className="h-full w-full appearance-none rounded-2xl border border-white/15 bg-white/10 px-4 py-3 pr-10 text-[15px] leading-5 text-white outline-none transition focus:border-white/35 focus:bg-white/15 md:text-base"
                  >
                    <option value="" className="text-slate-900">
                      Status
                    </option>
                    <option value="for-sale" className="text-slate-900">
                      For Sale
                    </option>
                    <option value="for-rent" className="text-slate-900">
                      For Rent
                    </option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-200" />
                </div>
                <button
                  onClick={handleSearch}
                  className="rounded-2xl bg-brand px-5 py-3 font-semibold text-white"
                >
                  Search
                </button>
              </div>
              <div className="mt-4 text-sm text-slate-200">
                Browse {total}+ properties
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 lg:px-6">
        <h2 className="mb-6 text-3xl font-bold">Property Types</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {propertyTypes.map(({ label, type, icon: Icon }) => {
            const count = properties.filter(
              (property) => property.type === type,
            ).length;
            return (
              <button
                key={type}
                onClick={() => navigate(`/search?type=${type}`)}
                className="min-w-44 rounded-3xl border bg-white p-5 text-left dark:bg-slate-900"
              >
                <Icon className="h-6 w-6 text-brand" />
                <p className="mt-4 text-lg font-semibold">{label}</p>
                <p className="text-sm text-slate-500">{count} listings</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 lg:px-6">
        <h2 className="mb-6 text-3xl font-bold">City Highlights</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cities.map((city) => {
            const count = properties.filter(
              (property) => property.city === city.name,
            ).length;
            return (
              <button
                key={city.name}
                onClick={() =>
                  navigate(`/search?city=${encodeURIComponent(city.name)}`)
                }
                className="group relative overflow-hidden rounded-3xl text-left text-white"
              >
                <img
                  src={city.image}
                  alt={city.name}
                  className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-2xl font-bold">{city.name}</p>
                  <p className="text-sm text-slate-200">{count} properties</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 lg:grid-cols-3 lg:px-6">
        {[
          {
            title: "Search",
            description:
              "Use smart filters or ask the property assistant to narrow options fast.",
            icon: Search,
          },
          {
            title: "Tour",
            description:
              "Inspect the map, compare listings, and schedule a visit from the detail page.",
            icon: MapPin,
          },
          {
            title: "Move In",
            description:
              "Save favorites, coordinate with an agent, and move with confidence.",
            icon: HomeIcon,
          },
        ].map(({ title, description, icon: Icon }) => (
          <div
            key={title}
            className="rounded-3xl border bg-white p-6 dark:bg-slate-900"
          >
            <Icon className="h-8 w-8 text-brand" />
            <h3 className="mt-4 text-xl font-semibold">{title}</h3>
            <p className="mt-2 text-slate-500">{description}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 lg:px-6">
        <h2 className="mb-6 text-3xl font-bold">Testimonials</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="rounded-3xl border bg-white p-6 dark:bg-slate-900"
            >
              <div className="mb-3 flex gap-1 text-amber-500">
                {Array.from({ length: testimonial.rating }).map((_, index) => (
                  <span key={index}>★</span>
                ))}
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                “{testimonial.quote}”
              </p>
              <p className="mt-4 font-semibold">{testimonial.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="rounded-[2rem] bg-gradient-to-r from-brand to-blue-700 p-8 text-white md:p-10">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-3xl font-bold">
                Ready to find your perfect home?
              </h2>
              <p className="mt-2 text-white/80">
                Start searching or ask the property assistant for tailored property
                recommendations.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row">
              <Link
                to="/search"
                className="inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 font-semibold text-brand lg:w-auto"
              >
                Start Searching
              </Link>
              <button
                type="button"
                onClick={openChat}
                className="inline-flex w-full items-center justify-center rounded-full border border-white/30 bg-white/10 px-5 py-3 font-semibold text-white hover:bg-white/20 lg:w-auto"
              >
                Talk to an Agent
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
