import { Household } from "@/types/household";
import { useClickOutside } from "@/util/hooks";
import { House, X } from "lucide-react";
import { useRef, useState } from "react";
import { Marker } from "react-map-gl/maplibre";
import { Button } from "../ui/button";
import Link from "next/link";

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
    <Marker longitude={household.longitude} latitude={household.latitude} anchor="center" onClick={() => setOpen(true)}>
      {open ? (
        <div className="bg-white pl-4 pr-2 py-2 rounded-md shadow-md relative cursor-auto" ref={innerRef}>
          <div className="flex justify-between flex-row items-center">
            <div className="text-black text-base ">Din husholdning</div>
            <X onClick={() => setOpen(false)} className="cursor-pointer" />
          </div>
          <div className="flex flex-col">
            <div className="text-gray-500 text-sm">{household.address}</div>
            <Link href={`/household`}>
              <Button variant="link">Gå til husholdning</Button>
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
