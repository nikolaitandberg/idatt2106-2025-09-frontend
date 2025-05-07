import { Food, FoodType, Household } from "./household";
import { MapObject, MapObjectType } from "./map";
import { Event } from "./event";
import { User } from "./user";

export type CreateMapObjectTypeRequest = Omit<MapObjectType, "id">;

export type AddUserToHouseRequest = { username: string };

export type AddExtraResidentRequest = {
  householdId: number;
  typeId: number;
  name: string;
};
export type CreateMapObjectRequest = Omit<MapObject, "id">;
export type EditMapObjectRequest = MapObject;

export type AddHouseholdFoodRequest = Omit<Food, "id">;
export type EditHouseholdInfoRequest = Omit<
  Household,
  "waterAmountLiters" | "lastWaterChangeDate" | "levelOfPreparedness"
>;
export type EditHouseholdWaterRequest = Omit<
  Household,
  "address" | "latitude" | "longitude" | "levelOfPreparedness" | "nextWaterChangeDate" | "name"
>;
export type CreateHouseholdRequest = Omit<Household, "id" | "levelOfPreparedness" | "nextWaterChangeDate"> & {
  username: string;
};

export type CreateFoodTypeRequest = Omit<FoodType, "id">;
export type ResetPasswordRequest = {
  key: string;
  newPassword: string;
};

export type CreateEventRequest = Omit<Event, "id">;

export type userUpdateRequest = Omit<
  User,
  | "admin"
  | "superAdmin"
  | "householdId"
  | "emailConfirmed"
  | "password"
  | "picture"
  | "username"
  | "sharePositionHousehold"
  | "sharePositionGroup"
>;
