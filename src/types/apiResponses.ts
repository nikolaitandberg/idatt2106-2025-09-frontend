import { FoodSummary, Household } from "./household";
import { MapObject, MapObjectType } from "./map";

/**
 * Error response returned from the API
 */
export class ApiError extends Error {
  public code?: number;

  constructor(
    public message: string,
    code?: number,
  ) {
    super(message);
    this.code = code;
  }
}

/**
 * Response from the API when fetching map objects
 */
export type MapObjectsResponse = MapObject[];

/**
 * Response from the API when fetching map object types
 */
export type MapObjectsTypesResponse = MapObjectType[];

export type GetHouseholdFoodResponse = FoodSummary[];
export type GetHouseholdResonse = Household;
