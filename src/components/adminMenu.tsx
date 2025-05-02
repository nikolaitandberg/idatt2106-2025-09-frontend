import { AdminMenuCard } from "@/components/ui/AdminMenuCard";
import { ShieldUser, MapPin, CircleAlert, Newspaper } from "lucide-react";

export function AdminMenu() {
  return (
    <div className="border-r-1 border-black divide-y-1 divide-black h-full">
      <AdminMenuCard icon={Newspaper} text="Nyheter" href="/admin/news" />
      <AdminMenuCard icon={MapPin} text="Kart" href="/admin/map" />
      <AdminMenuCard icon={CircleAlert} text="Scenario" href="/admin/scenario" />
      <AdminMenuCard icon={ShieldUser} text="Ny admin" href="/admin/new-admin" />
    </div>
  );
}
