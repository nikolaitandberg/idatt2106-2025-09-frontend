import { useProfile } from "@/actions/user";
import { UserLocation } from "@/types/user";
import { Marker } from "react-map-gl/maplibre";
import UserAvatar from "../ui/UserAvatar";
import { useRef, useState } from "react";
import { useClickOutside } from "@/util/hooks";

interface MapUsersProps {
  userLocations?: UserLocation[];
}

export default function MapUsers({ userLocations }: MapUsersProps) {
  if (!userLocations) return null;

  return (
    <>
      {userLocations.map((userLocation) => (
        <UserMapObject
          key={userLocation.userId}
          userId={userLocation.userId}
          latitude={userLocation.latitude}
          longitude={userLocation.longitude}
        />
      ))}
    </>
  );
}

function UserMapObject({
  userId,
  latitude,
  longitude,
}: Readonly<{ userId: number; latitude: number; longitude: number }>) {
  const [open, setOpen] = useState(false);
  const { data: user } = useProfile(userId);
  const markerRef = useRef<HTMLDivElement>(null);

  useClickOutside(markerRef, () => {
    setOpen(false);
  });

  if (!user) return null;

  const username = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username;

  return (
    <Marker longitude={longitude} latitude={latitude} anchor="center" onClick={() => setOpen(!open)}>
      <div
        ref={markerRef}
        className="bg-white p-1 rounded-full flex flex-row items-center transition-all duration-200 hover:scale-110 cursor-pointer">
        <UserAvatar name={username} type="person" image={user.picture} />
        {open && <div>{username}</div>}
      </div>
    </Marker>
  );
}
