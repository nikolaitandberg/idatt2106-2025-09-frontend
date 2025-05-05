import { mapIcons } from "@/util/icons";
import { Event } from "./event";

/**
 * A map object
 */
export type MapObject = {
  id: number;
  typeId: number;
  latitude: number;
  longitude: number;
  opening?: string;
  closing?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactName?: string;
  description?: string;
  image?: string;
};

/**
 * Bounds of a map
 */
export type MapBounds = {
  minLat: number;
  maxLat: number;
  minLong: number;
  maxLong: number;
};

export const MAP_BOUNDS_MAX: MapBounds = {
  minLat: -90,
  maxLat: 90,
  minLong: -180,
  maxLong: 180,
};

export type MapObjectType = {
  id: number;
  name: string;
  icon: keyof typeof mapIcons;
};

export type MapObjectCreatedMessage = {
  eventType: "created";
  payload: MapObject;
};

export type MapObjectUpdatedMessage = {
  eventType: "updated";
  payload: MapObject;
};

export type MapObjectDeletedMessage = {
  eventType: "deleted";
  payload: number;
};

export type MapObjectWebsocketMessage = MapObjectCreatedMessage | MapObjectUpdatedMessage | MapObjectDeletedMessage;

export type EventCreatedMessage = {
  eventType: "created";
  payload: Event;
};

export type EventUpdatedMessage = {
  eventType: "updated";
  payload: Event;
};

export type EventDeletedMessage = {
  eventType: "deleted";
  payload: Event;
};

export type EventWebsocketMessage = EventCreatedMessage | EventUpdatedMessage | EventDeletedMessage;
