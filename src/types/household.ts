export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
}

export interface HouseholdResponse {
  id: number;
  address: string;
  longitude: number;
  latitude: number;
  waterAmountLiters: number;
  lastWaterChangeDate: string;
}
