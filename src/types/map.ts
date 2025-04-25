/**
 * A map object
 */
export type MapObject = {
  id: number;
  type: number;
  latitude: number;
  longitude: number;
  opening?: Date;
  closing?: Date;
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
