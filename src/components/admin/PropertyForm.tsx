import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { usePropertyStore } from "@/store/propertyStore";
import type { Property, PropertyType } from "@/types/property";

interface PropertyFormProps {
  property?: Property;
  onSave: () => void;
  onCancel: () => void;
}

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(20),
  type: z.enum([
    "apartment",
    "house",
    "villa",
    "studio",
    "penthouse",
    "townhouse",
  ]),
  status: z.enum(["for-sale", "for-rent", "sold", "rented"]),
  price: z.coerce.number().positive(),
  priceUnit: z.enum(["month", "total"]),
  bedrooms: z.coerce.number().int().min(0),
  bathrooms: z.coerce.number().int().min(0),
  area: z.coerce.number().positive(),
  yearBuilt: z.coerce.number().int().min(1800),
  address: z.string().min(3),
  city: z.string().min(2),
  neighborhood: z.string().min(2),
  image1: z.string().url(),
  image2: z.string().url(),
  image3: z.string().url(),
  amenities: z.array(z.string()).min(1),
  agentId: z.string().min(1),
  featured: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

const amenityOptions = [
  "parking",
  "gym",
  "pool",
  "doorman",
  "pet-friendly",
  "garden",
  "balcony",
  "fireplace",
  "elevator",
  "concierge",
  "rooftop",
  "storage",
];
const cities = ["Delhi", "Mumbai", "Bengaluru", "Hyderabad", "Pune", "Chennai"];
const agentIds = [
  "agent-001",
  "agent-002",
  "agent-003",
  "agent-004",
  "agent-005",
  "agent-006",
];

export default function PropertyForm({
  property,
  onSave,
  onCancel,
}: PropertyFormProps) {
  const { addProperty, updateProperty } = usePropertyStore();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: property
      ? {
          title: property.title,
          description: property.description,
          type: property.type,
          status: property.status,
          price: property.price,
          priceUnit: property.priceUnit,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          area: property.area,
          yearBuilt: property.yearBuilt,
          address: property.address,
          city: property.city,
          neighborhood: property.neighborhood,
          image1: property.images[0] ?? "",
          image2: property.images[1] ?? "",
          image3: property.images[2] ?? "",
          amenities: property.amenities,
          agentId: property.agentId,
          featured: property.featured,
        }
      : {
          title: "",
          description: "",
          type: "apartment",
          status: "for-rent",
          price: 2500,
          priceUnit: "month",
          bedrooms: 2,
          bathrooms: 2,
          area: 1100,
          yearBuilt: 2020,
          address: "",
          city: "Delhi",
          neighborhood: "",
          image1:
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
          image2:
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
          image3:
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
          amenities: ["parking"],
          agentId: "agent-001",
          featured: false,
        },
  });

  useEffect(() => {
    reset(
      property
        ? {
            title: property.title,
            description: property.description,
            type: property.type,
            status: property.status,
            price: property.price,
            priceUnit: property.priceUnit,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            area: property.area,
            yearBuilt: property.yearBuilt,
            address: property.address,
            city: property.city,
            neighborhood: property.neighborhood,
            image1: property.images[0] ?? "",
            image2: property.images[1] ?? "",
            image3: property.images[2] ?? "",
            amenities: property.amenities,
            agentId: property.agentId,
            featured: property.featured,
          }
        : undefined,
    );
  }, [property, reset]);

  const amenityValues = watch("amenities");

  const submit = (values: FormValues) => {
    const payload: Property = {
      id: property?.id ?? `property-${crypto.randomUUID()}`,
      title: values.title,
      description: values.description,
      type: values.type as PropertyType,
      status: values.status,
      price: values.price,
      priceUnit: values.priceUnit,
      bedrooms: values.bedrooms,
      bathrooms: values.bathrooms,
      area: values.area,
      yearBuilt: values.yearBuilt,
      images: [values.image1, values.image2, values.image3],
      address: values.address,
      city: values.city,
      neighborhood: values.neighborhood,
      coordinates: property?.coordinates ?? { lat: 40.75, lng: -73.98 },
      amenities: values.amenities,
      agentId: values.agentId,
      featured: values.featured,
      createdAt: property?.createdAt ?? new Date().toISOString(),
      views: property?.views ?? 0,
    };

    if (property) updateProperty(property.id, payload);
    else addProperty(payload);
    toast.success(property ? "Property updated" : "Property created");
    onSave();
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="space-y-4 rounded-3xl border bg-white p-5 dark:bg-slate-900"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm">Title</label>
          <input
            {...register("title")}
            className="w-full rounded-2xl border px-3 py-2"
          />
          {errors.title ? (
            <p className="text-xs text-red-500">{errors.title.message}</p>
          ) : null}
        </div>
        <div>
          <label className="mb-1 block text-sm">Type</label>
          <select
            {...register("type")}
            className="w-full rounded-2xl border px-3 py-2"
          >
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="villa">Villa</option>
            <option value="studio">Studio</option>
            <option value="penthouse">Penthouse</option>
            <option value="townhouse">Townhouse</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm">Description</label>
          <textarea
            {...register("description")}
            rows={4}
            className="w-full rounded-2xl border px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm">Status</label>
          <select
            {...register("status")}
            className="w-full rounded-2xl border px-3 py-2"
          >
            <option value="for-sale">For Sale</option>
            <option value="for-rent">For Rent</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm">Price Unit</label>
          <select
            {...register("priceUnit")}
            className="w-full rounded-2xl border px-3 py-2"
          >
            <option value="month">Month</option>
            <option value="total">Total</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm">Price</label>
          <input
            type="number"
            {...register("price")}
            className="w-full rounded-2xl border px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm">Bedrooms</label>
          <input
            type="number"
            {...register("bedrooms")}
            className="w-full rounded-2xl border px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm">Bathrooms</label>
          <input
            type="number"
            {...register("bathrooms")}
            className="w-full rounded-2xl border px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm">Area</label>
          <input
            type="number"
            {...register("area")}
            className="w-full rounded-2xl border px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm">Year Built</label>
          <input
            type="number"
            {...register("yearBuilt")}
            className="w-full rounded-2xl border px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm">Address</label>
          <input
            {...register("address")}
            className="w-full rounded-2xl border px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm">City</label>
          <select
            {...register("city")}
            className="w-full rounded-2xl border px-3 py-2"
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm">Neighborhood</label>
          <input
            {...register("neighborhood")}
            className="w-full rounded-2xl border px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm">Agent</label>
          <select
            {...register("agentId")}
            className="w-full rounded-2xl border px-3 py-2"
          >
            {agentIds.map((agentId) => (
              <option key={agentId} value={agentId}>
                {agentId}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {["image1", "image2", "image3"].map((field) => (
          <div key={field}>
            <label className="mb-1 block text-sm">{field.toUpperCase()}</label>
            <input
              {...register(field as keyof FormValues)}
              className="w-full rounded-2xl border px-3 py-2"
            />
          </div>
        ))}
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">Amenities</p>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {amenityOptions.map((amenity) => (
            <label
              key={amenity}
              className="flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm capitalize"
            >
              <input
                type="checkbox"
                checked={amenityValues.includes(amenity)}
                onChange={(event) => {
                  const next = event.target.checked
                    ? [...amenityValues, amenity]
                    : amenityValues.filter((value) => value !== amenity);
                  setValue("amenities", next, { shouldValidate: true });
                }}
              />
              {amenity}
            </label>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-3 rounded-2xl border px-3 py-2 text-sm">
        <input type="checkbox" {...register("featured")} /> Featured property
      </label>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full px-4 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          Cancel
        </button>
        <button
          disabled={isSubmitting}
          type="submit"
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white"
        >
          {isSubmitting ? "Saving..." : "Save Property"}
        </button>
      </div>
    </form>
  );
}
