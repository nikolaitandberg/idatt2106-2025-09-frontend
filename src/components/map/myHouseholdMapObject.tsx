import { Household } from "@/types/household";
import { useClickOutside } from "@/util/hooks";
import { House, X } from "lucide-react";
import { useRef, useState } from "react";
import { Marker } from "react-map-gl/maplibre";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/util/cn";

interface MyHouseholdMapObjectProps {
  household: Household;
}

export default function MyHouseholdMapObject({ household }: MyHouseholdMapObjectProps) {
  const [open, setOpen] = useState(false);
  const innerRef = useRef<HTMLDivElement>(null);

  useClickOutside(innerRef, () => {
    setOpen(false);
  });

  return (
    <Marker
      className={cn("hover:z-10", open ? "z-10" : "z-0")}
      longitude={household.longitude}
      latitude={household.latitude}
      anchor="center"
      onClick={() => setOpen(true)}>
      {open ? (
        <div className="bg-white pl-4 pr-2 py-2 rounded-md shadow-md relative cursor-auto" ref={innerRef}>
          <div className="flex justify-between flex-row items-center">
            <div className="text-black text-base ">Din husholdning</div>
            <X onClick={() => setOpen(false)} className="cursor-pointer" />
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row items-center gap-2 mt-2">
              <House size={20} className="text-gray-500" />
              <div className="text-gray-500 text-sm">{household.address}</div>
            </div>
            <Link href={`/household`}>
              <Button variant="link" className="p-0">
                Gå til husholdning
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white p-1 rounded-full shadow-md">
          <House />
        </div>
      )}
    </Marker>
  );
}
