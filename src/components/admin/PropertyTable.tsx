import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Edit2, Search, Trash2 } from "lucide-react";

import { formatPriceWithUnitINR } from "@/lib/utils";
import { usePropertyStore } from "@/store/propertyStore";
import type { Property } from "@/types/property";
import PropertyForm from "./PropertyForm";

export default function PropertyTable() {
  const { properties, deleteProperty } = usePropertyStore();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Property | undefined>();
  const filtered = useMemo(
    () =>
      properties.filter((property) =>
        [property.title, property.city, property.type, property.status].some(
          (value) => value.toLowerCase().includes(query.toLowerCase()),
        ),
      ),
    [properties, query],
  );
  const pageSize = 10;
  const current = filtered.slice((page - 1) * pageSize, page * pageSize);

  if (editing) {
    return (
      <PropertyForm
        property={editing}
        onSave={() => setEditing(undefined)}
        onCancel={() => setEditing(undefined)}
      />
    );
  }

  return (
    <div className="space-y-4 rounded-3xl border bg-white p-5 dark:bg-slate-900">
      <div className="flex items-center gap-2 rounded-2xl border bg-slate-50 px-3 py-2 dark:bg-slate-950">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search properties"
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="py-3 pr-3">Thumbnail</th>
              <th className="py-3 pr-3">Title</th>
              <th className="py-3 pr-3">City</th>
              <th className="py-3 pr-3">Type</th>
              <th className="py-3 pr-3">Price</th>
              <th className="py-3 pr-3">Status</th>
              <th className="py-3 pr-3">Created</th>
              <th className="py-3 pr-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {current.map((property) => (
              <tr key={property.id} className="border-t">
                <td className="py-3 pr-3">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="h-14 w-20 rounded-xl object-cover"
                  />
                </td>
                <td className="py-3 pr-3 font-medium">{property.title}</td>
                <td className="py-3 pr-3">{property.city}</td>
                <td className="py-3 pr-3 capitalize">{property.type}</td>
                <td className="py-3 pr-3">
                  {formatPriceWithUnitINR(property.price, property.priceUnit)}
                </td>
                <td className="py-3 pr-3 capitalize">
                  {property.status.replace("-", " ")}
                </td>
                <td className="py-3 pr-3">
                  {format(new Date(property.createdAt), "MMM d, yyyy")}
                </td>
                <td className="py-3 pr-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditing(property)}
                      className="rounded-full border px-3 py-1 text-xs"
                    >
                      <Edit2 className="inline h-3 w-3" /> Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Delete this property?"))
                          deleteProperty(property.id);
                      }}
                      className="rounded-full border px-3 py-1 text-xs text-red-500"
                    >
                      <Trash2 className="inline h-3 w-3" /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between">
        <button
          disabled={page === 1}
          onClick={() => setPage((value) => value - 1)}
          className="rounded-full border px-4 py-2 text-sm disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm text-slate-500">Page {page}</span>
        <button
          disabled={page * pageSize >= filtered.length}
          onClick={() => setPage((value) => value + 1)}
          className="rounded-full border px-4 py-2 text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
