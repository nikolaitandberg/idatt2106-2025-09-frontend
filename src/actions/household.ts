import { ApiError, GetHouseholdFoodResponse, GetHouseholdResonse } from "@/types/apiResponses";
import { API_BASE_URL } from "@/types/constants";
import { Food, FoodType, Household, UserResponse } from "@/types/household";
import Fetch, { FetchFunction, useFetch } from "@/util/fetch";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AddUserToHouseRequest, AddExtraResidentRequest, AddHouseholdFoodRequest } from "@/types/apiRequests";
import { useMutation } from "@tanstack/react-query";
import { ExtraResidentResponse } from "@/types/extraResident";

export const getHousehold = async (id: number, fetcher: FetchFunction = Fetch): Promise<GetHouseholdResonse | null> => {
  try {
    const res = await fetcher<GetHouseholdResonse>(`${API_BASE_URL}/households/${id}`);
    return res ?? null;
  } catch (error) {
    if (error instanceof ApiError && error.code === 404) {
      return null;
    }
    throw error;
  }
};

export const getHouseholdUsers = async (id: number, fetcher: FetchFunction = Fetch): Promise<UserResponse[]> => {
  const res = await fetcher<UserResponse[]>(`${API_BASE_URL}/households/${id}/users`);
  return res ?? [];
};

export const addUserToHousehold = async (data: AddUserToHouseRequest, fetcher: FetchFunction = Fetch) => {
  await fetcher<void>(`${API_BASE_URL}/households/add-user`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
};

export const addExtraResident = async (data: AddExtraResidentRequest, fetcher: FetchFunction = Fetch) => {
  await fetcher<void>(`${API_BASE_URL}/extra-residents`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
};

export const getExtraResidents = async (fetcher: FetchFunction = Fetch): Promise<ExtraResidentResponse[]> => {
  const res = await fetcher<ExtraResidentResponse[]>(`${API_BASE_URL}/extra-residents`);
  return res ?? [];
};

export const useExtraResidents = (options?: UseQueryOptions<ExtraResidentResponse[], Error>) => {
  const fetcher = useFetch();

  return useQuery<ExtraResidentResponse[], Error>({
    queryKey: ["extraResidents"],
    queryFn: () => getExtraResidents(fetcher),
    ...options,
  });
};

export const createHousehold = async (
  household: Omit<Household, "id">,
  fetcher: FetchFunction = Fetch,
): Promise<void> => {
  await fetcher<void>(`${API_BASE_URL}/households/register`, {
    method: "POST",
    body: JSON.stringify(household),
    headers: { "Content-Type": "application/json" },
  });
};

export const useHousehold = (id: number, options?: UseQueryOptions<GetHouseholdResonse | null, Error>) => {
  const fetcher = useFetch();

  return useQuery<GetHouseholdResonse | null, Error>({
    queryKey: ["household", id],
    queryFn: () => getHousehold(id, fetcher),
    enabled: options?.enabled ?? true,
    ...options,
  });
};

export const useHouseholdUsers = (id: number, options?: UseQueryOptions<UserResponse[], Error>) => {
  const fetcher = useFetch();

  return useQuery<UserResponse[], Error>({
    queryKey: ["householdUsers", id],
    queryFn: () => getHouseholdUsers(id, fetcher),
    enabled: options?.enabled ?? true,
    ...options,
  });
};

export const useAddUserToHousehold = () => {
  const fetcher = useFetch();

  return useMutation<void, Error, AddUserToHouseRequest>({
    mutationFn: (data) => addUserToHousehold(data, fetcher),
  });
};

export const useAddExtraResident = () => {
  const fetcher = useFetch();

  return useMutation<void, Error, AddExtraResidentRequest>({
    mutationFn: (data) => addExtraResident(data, fetcher),
  });
};

export const getHouseholdFood = async (
  householdId: number,
  fetcher: FetchFunction = Fetch,
): Promise<GetHouseholdFoodResponse> => {
  const foodTypes = await fetcher<FoodType[]>(`${API_BASE_URL}/food-types`);
  const food = await fetcher<Food[]>(`${API_BASE_URL}/food/household/${householdId}`);

  if (!foodTypes || !food) {
    throw new Error("Failed to fetch food data");
  }

  return foodTypes.map((type) => ({
    ...type,
    food: food.filter((f) => f.typeId === type.id),
  }));
};

export const useHouseholdFood = (householdId: number) => {
  const fetcher = useFetch();

  return useQuery<GetHouseholdFoodResponse, Error>({
    queryKey: ["household", "food", householdId],
    queryFn: () => getHouseholdFood(householdId, fetcher),
  });
};

export const addHouseholdFood = async (req: AddHouseholdFoodRequest, fetcher: FetchFunction = Fetch) => {
  await fetcher<void>(`${API_BASE_URL}/food`, {
    method: "POST",
    body: JSON.stringify(req),
    headers: { "Content-Type": "application/json" },
  });
};

export const useAddHouseholdFood = () => {
  const fetcher = useFetch();

  return useMutation<void, Error, AddHouseholdFoodRequest>({
    mutationFn: (data) => addHouseholdFood(data, fetcher),
  });
};

export const deleteHouseholdFood = async (id: number, fetcher: FetchFunction = Fetch) => {
  await fetcher<void>(`${API_BASE_URL}/food/${id}`, {
    method: "DELETE",
  });
};

export const useDeleteHouseholdFood = () => {
  const fetcher = useFetch();

  return useMutation<void, Error, number>({
    mutationFn: (id) => deleteHouseholdFood(id, fetcher),
  });
};

export const useCreateHousehold = () => {
  const fetcher = useFetch();

  return useMutation<void, Error, Omit<Household, "id"> & { username?: string }>({
    mutationFn: (data) => createHousehold(data, fetcher),
  });
};
