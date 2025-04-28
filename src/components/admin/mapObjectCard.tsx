import { MapObject } from "@/types/map";
import { Clock, Mail, Phone, User } from "lucide-react";

export default function MapObjectCard({ mapObject, onClick }: { mapObject: MapObject; onClick?: () => void }) {
  const openDate = new Date(mapObject.opening ?? 0);
  const closeDate = new Date(mapObject.closing ?? 0);

  return (
    <div onClick={onClick} className="bg-white p-4 rounded-md shadow-md cursor-pointer w-full flex flex-col">
      <div className="flex flex-col">
        <div className="text-black text-base ">{mapObject.description}</div>
        <div className="flex items-center gap-1">
          <User size={10} />
          <div className="text-gray-500 text-sm">{mapObject.contactName}</div>
        </div>
        <div className="flex items-center gap-1">
          <Mail size={10} />
          <div className="text-gray-500 text-sm">{mapObject.contactEmail}</div>
        </div>
        <div className="flex items-center gap-1">
          <Phone size={10} />
          <div className="text-gray-500 text-sm">{mapObject.contactPhone}</div>
        </div>
        {(mapObject.opening || mapObject.closing) && (
          <>
            <div className="flex items-center gap-1 mt-2 pt-2 border-t border-t-neutral-200">
              <div className="text-gray-800 text-md">Åpningstider</div>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={10} />
              <div className="text-gray-500 text-sm">
                {openDate.getHours()}:{openDate.getMinutes().toString().padStart(2, "0")}
              </div>
              -
              <div className="text-gray-500 text-sm">
                {closeDate.getHours()}:{closeDate.getMinutes().toString().padStart(2, "0")}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
