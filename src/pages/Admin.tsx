import { useState } from "react";
import { Building2, Home, MapPin, Plus } from "lucide-react";

import AdminLayout from "@/components/admin/AdminLayout";
import PropertyForm from "@/components/admin/PropertyForm";
import PropertyTable from "@/components/admin/PropertyTable";
import StatsCard from "@/components/admin/StatsCard";
import { mockAgents } from "@/data/mockAgents";
import { usePropertyStore } from "@/store/propertyStore";

export default function Admin() {
  const [tab, setTab] = useState("Overview");
  const [showForm, setShowForm] = useState(false);
  const properties = usePropertyStore((state) => state.properties);

  const overview = (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Total Props"
          value={properties.length}
          icon={Building2}
          color="bg-brand"
        />
        <StatsCard
          title="For Sale"
          value={
            properties.filter((property) => property.status === "for-sale")
              .length
          }
          icon={Home}
          color="bg-emerald-500"
        />
        <StatsCard
          title="For Rent"
          value={
            properties.filter((property) => property.status === "for-rent")
              .length
          }
          icon={MapPin}
          color="bg-amber-500"
        />
        <StatsCard
          title="Total Views"
          value={properties.reduce((sum, property) => sum + property.views, 0)}
          icon={Plus}
          color="bg-slate-700"
        />
      </div>
      <div className="rounded-3xl border bg-white p-5 dark:bg-slate-900">
        <h3 className="mb-4 text-xl font-semibold">Recent Properties</h3>
        <PropertyTable />
      </div>
    </div>
  );

  const agents = (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {mockAgents.map((agent) => (
        <div
          key={agent.id}
          className="rounded-3xl border bg-white p-5 dark:bg-slate-900"
        >
          <img
            src={agent.photo}
            alt={agent.name}
            className="h-48 w-full rounded-2xl object-cover"
          />
          <h3 className="mt-4 text-xl font-semibold">{agent.name}</h3>
          <p className="text-sm text-slate-500">{agent.title}</p>
          <p className="mt-2 text-sm text-slate-500">
            {agent.rating} rating • {agent.listingsCount} listings
          </p>
        </div>
      ))}
    </div>
  );

  return (
    <AdminLayout activeTab={tab} onChangeTab={setTab}>
      {tab === "Overview" ? overview : null}
      {tab === "Properties" ? (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowForm(true)}
              className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white"
            >
              Add Property
            </button>
          </div>
          {showForm ? (
            <PropertyForm
              onSave={() => setShowForm(false)}
              onCancel={() => setShowForm(false)}
            />
          ) : (
            <PropertyTable />
          )}
        </div>
      ) : null}
      {tab === "Agents" ? agents : null}
    </AdminLayout>
  );
}
