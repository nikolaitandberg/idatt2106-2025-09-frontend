import { ApiError } from "@/types/apiResponses";
import { API_BASE_URL } from "@/types/constants";
import { HouseholdResponse, UserResponse } from "@/types/household";
import Fetch, { FetchFunction, useFetch } from "@/util/fetch";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AddUserToHouseRequest, AddExtraResidentRequest } from "@/types/apiRequests";
import { useMutation } from "@tanstack/react-query";
import { ExtraResidentResponse } from "@/types/extraResident";

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

