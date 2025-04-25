import { HouseholdResponse } from "@/types/household";
import { API_BASE_URL } from "@/types/constants";

export const getHousehold = async (householdId: number): Promise<HouseholdResponse> => {
  const res = await fetch(`${API_BASE_URL}/households/${householdId}`);
  
  if (!res.ok) {
    throw new Error("Failed to fetch household");
  }

  const data: HouseholdResponse = await res.json();
  return data;
};

export const getAllHouseholds = async (): Promise<HouseholdResponse[]> => {
  const res = await fetch(`${API_BASE_URL}/households`);

  if (!res.ok) {
    throw new Error("Failed to fetch households");
  }

  const data: HouseholdResponse[] = await res.json();
  return data;
};
