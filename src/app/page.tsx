"use client";

import { MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useClosestMapObject, useMapObjects, useMapObjectTypes } from "@/actions/map";
import { useEvents } from "@/actions/event";
import MapObject from "@/components/map/mapObject";
import MapEvent from "@/components/map/mapEvent";
import { useDebounce, useDebouncedCallback } from "use-debounce";
import { useEffect, useMemo, useRef, useState } from "react";
import { EventWebsocketMessage, MapBounds, MapObject as MapObjectType, MapObjectWebsocketMessage } from "@/types/map";
import MapComponent from "@/components/map/mapComponent";
import UserPositionDisplay, { UserPositionDisplayRef } from "@/components/map/userPositionDisplay";
import MapToolBar from "@/components/map/mapToolbar";
import { useMyHousehold } from "@/actions/household";
import MyHouseholdMapObject from "@/components/map/myHouseholdMapObject";
import { showToast } from "@/components/ui/toaster";
import { useLastKnownLocations, useUpdateUserLocation } from "@/actions/location";
import { useSession } from "next-auth/react";
import useSettings from "@/components/settingsProvider";
import MapUsers from "@/components/map/mapUsers";
import useSocket from "@/components/socketProvider";
import { useQueryClient } from "@tanstack/react-query";
import { UserLocation } from "@/types/user";

export default function Home() {
  const [bounds, setBounds] = useState<MapBounds>({} as MapBounds);
  const [debouncedBounds] = useDebounce(bounds, 100);
  const [selectedMapObjectTypes, setSelectedMapObjectTypes] = useState<number[]>([]);
  const [hasSelectedMapObjectTypes, setHasSelectedMapObjectTypes] = useState(false);

  const session = useSession();
  const settings = useSettings();
  const queryClient = useQueryClient();

  const { mutate: findMapObject } = useClosestMapObject();
  const { mutate: updateUserLocation } = useUpdateUserLocation();

  const { data: events, isFetching: eventsIsFetching } = useEvents(debouncedBounds);
  const { data: mapObjects, isFetching: mapObjectsIsFetching } = useMapObjects(debouncedBounds);
  const { data: mapObjectTypes, isFetching: mapObjectTypesIsFetching } = useMapObjectTypes();
  const { data: myHousehold } = useMyHousehold();
  const { data: lastKnownLocations } = useLastKnownLocations(myHousehold?.id ?? 0, {
    enabled: !!myHousehold?.id,
  });

  const socket = useSocket();

  useEffect(() => {
    if (!myHousehold?.id) return;

    const subscription = socket.subscribe(
      `/topic/location/${myHousehold.id}`,
      (data: { userId: number; latitude: number; longitude: number }) => {
        if (!session.data?.user.userId) return;
        if (data.userId === session.data.user.userId) return;

        queryClient.setQueryData(["location", "last-known"], (oldData: UserLocation[]) => {
          if (!oldData) return [{ userId: data.userId, latitude: data.latitude, longitude: data.longitude }];

          const newData = oldData.filter((object) => object.userId !== data.userId);

          return [...newData, { userId: data.userId, latitude: data.latitude, longitude: data.longitude }];
        });
      },
    );

    return () => {
      subscription?.subscription?.unsubscribe();
    };
  }, [myHousehold?.id]);

  useEffect(() => {
    const sub = socket.subscribe<MapObjectWebsocketMessage>("/topic/map-object/all", (data) => {
      if (data.eventType === "deleted") {
        queryClient.setQueryData(["map", "mapObjects"], (oldData: MapObjectType[] | undefined) => {
          if (!oldData) return [];
          const newData = oldData.filter((object) => object.id !== data.payload);
          return newData;
        });
      } else if (data.eventType === "created") {
        queryClient.setQueryData(["map", "mapObjects"], (oldData: MapObjectType[] | undefined) => {
          if (!oldData) return [data.payload];
          data.payload.id = oldData[oldData.length - 1].id + 1;
          return [...oldData, data.payload];
        });
      } else if (data.eventType === "updated") {
        queryClient.setQueryData(["map", "mapObjects"], (oldData: MapObjectType[] | undefined) => {
          if (!oldData) return [data.payload];
          const newData = oldData.filter((object) => object.id !== data.payload.id);
          return [...newData, data.payload];
        });
      }

      queryClient.invalidateQueries({ queryKey: ["map", "mapObjects"] });
    });

    return () => {
      sub?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const sub = socket.subscribe<EventWebsocketMessage>("/topic/events", (data) => {
      queryClient.invalidateQueries({ queryKey: ["event", "events"] });

      if (data.eventType === "deleted") {
        queryClient.setQueryData(["event", "events"], (oldData: MapObjectType[] | undefined) => {
          if (!oldData) return [];
          const newData = oldData.filter((object) => object.id !== data.payload.id);
          return newData;
        });
      } else if (data.eventType === "created") {
        queryClient.setQueryData(["event", "events"], (oldData: MapObjectType[] | undefined) => {
          if (!oldData) return [data.payload];
          data.payload.id = oldData[oldData.length - 1].id + 1;
          return [...oldData, data.payload];
        });
      } else if (data.eventType === "updated") {
        queryClient.setQueryData(["event", "events"], (oldData: MapObjectType[] | undefined) => {
          if (!oldData) return [data.payload];
          const newData = oldData.filter((object) => object.id !== data.payload.id);
          return [...newData, data.payload];
        });
      }

      queryClient.invalidateQueries({ queryKey: ["event", "events"] });
    });

    return () => {
      sub?.subscription?.unsubscribe();
    };
  }, []);

  const debouncedPositionUpdate = useDebouncedCallback((position: GeolocationPosition) => {
    if (!session.data?.user.userId) return;
    if (!settings.sharePositionHousehold && !settings.sharePositionHouseholdGroup) return;

    updateUserLocation(
      {
        userId: session.data?.user.userId,
        longitude: position.coords.longitude,
        latitude: position.coords.latitude,
      },
      {
        onError: () => {
          showToast({
            title: "Feil",
            description: "Kunne ikke oppdatere posisjonen din",
            variant: "error",
          });
        },
      },
    );
  }, 1000);

  const mapRef = useRef<MapRef>(null);
  const positionRef = useRef<UserPositionDisplayRef>(null);

  const filteredMapObjects = useMemo(() => {
    if (!hasSelectedMapObjectTypes) {
      return mapObjects;
    }

    if (!mapObjectTypes) return [];

    if (selectedMapObjectTypes.length === 0) {
      return [];
    }

    return mapObjects?.filter((object) => selectedMapObjectTypes.includes(object.typeId));
  }, [JSON.stringify(mapObjects), mapObjectTypes, selectedMapObjectTypes]);

  const renderedMapObjects = useMemo(() => {
    return filteredMapObjects?.map((object) => (
      <MapObject
        key={object.id}
        object={object}
        icon={mapObjectTypes?.find((type) => type.id === object.typeId)?.icon ?? "house"}
      />
    ));
  }, [filteredMapObjects]);

  const renderedEvents = useMemo(() => {
    return events?.map((event) => <MapEvent key={event.id} event={event} />);
  }, [JSON.stringify(events)]);

  const handleMove = () => {
    if (mapRef.current) {
      const bounds = mapRef.current.getBounds();
      setBounds({
        minLat: bounds.getSouth(),
        maxLat: bounds.getNorth(),
        minLong: bounds.getWest(),
        maxLong: bounds.getEast(),
      });
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 items-center justify-center w-full h-[90vh]">
      <div className="flex items-center justify-center bg-white px-4 pb-4 pt-2 h-full w-full n">
        <div className="w-full h-full rounded-md overflow-hidden">
          <MapComponent
            initialViewState={{
              longitude: 9.726463,
              latitude: 60.931636,
              zoom: 5,
            }}
            ref={mapRef}
            onMove={handleMove}
            onLoad={handleMove}>
            {renderedMapObjects}
            {renderedEvents}
            {myHousehold && <MyHouseholdMapObject household={myHousehold} />}
            <MapUsers userLocations={lastKnownLocations} />
            <UserPositionDisplay
              ref={positionRef}
              onInitialPosition={(pos) => {
                mapRef.current?.flyTo({
                  center: [pos.coords.longitude, pos.coords.latitude],
                  zoom: 12,
                  animate: false,
                });
              }}
              onPositionChange={(pos) => {
                debouncedPositionUpdate(pos);
              }}
            />
          </MapComponent>
          <div className="absolute bottom-10 w-full left-0 px-8">
            <MapToolBar
              onMapObjectTypesChange={(setSelectedTypes) => {
                setSelectedMapObjectTypes(setSelectedTypes);
                setHasSelectedMapObjectTypes(true);
              }}
              onFindObject={async (typeId) => {
                if (!mapRef.current) return;

                const position = positionRef.current?.getPosition();

                if (!position) {
                  return;
                }

                await new Promise((resolve) => {
                  findMapObject(
                    {
                      position,
                      type: typeId,
                    },
                    {
                      onSuccess: (data) => {
                        if (!data) return;
                        mapRef.current?.flyTo({
                          center: [data.longitude, data.latitude],
                          zoom: 15,
                          animate: true,
                          duration: 1000,
                        });
                      },
                      onSettled: resolve,
                      onError: () => {
                        showToast({
                          title: "Feil",
                          description: "Fant ikke kartobjektet",
                          variant: "error",
                        });
                      },
                    },
                  );
                });
              }}
              canGoToHousehold={!!myHousehold}
              onHouseholdClick={() => {
                if (!mapRef.current) return;
                if (!myHousehold) return;
                mapRef.current.flyTo({
                  center: [myHousehold.longitude, myHousehold.latitude],
                  zoom: 15,
                  animate: true,
                  duration: 1000,
                });
              }}
              loading={eventsIsFetching || mapObjectsIsFetching || mapObjectTypesIsFetching}
              onPositionClick={() => {
                if (!mapRef.current) return;

                const position = positionRef.current?.getPosition();

                if (!position) {
                  return;
                }

                mapRef.current.flyTo({
                  center: [position.coords.longitude, position.coords.latitude],
                  zoom: 15,
                  animate: true,
                  duration: 1000,
                });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
