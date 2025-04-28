import { ApiError } from "@/types/apiResponses";
import { API_BASE_URL } from "@/types/constants";
import { HouseholdResponse, UserResponse } from "@/types/household";
import Fetch, { FetchFunction, useFetch } from "@/util/fetch";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export const getHousehold = async (id: number, fetcher: FetchFunction = Fetch): Promise<HouseholdResponse | null> => {
  try {
    const res = await fetcher<HouseholdResponse>(`${API_BASE_URL}/households/${id}`);
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

export const addUserToHousehold = async (data: { username: string; householdId: number }, fetcher: FetchFunction = Fetch) => {
  await fetcher(`${API_BASE_URL}/households/add-user`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
};

export const useHousehold = (id: number, options?: UseQueryOptions<HouseholdResponse | null, Error>) => {
  const fetcher = useFetch();

  return useQuery<HouseholdResponse | null, Error>({
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