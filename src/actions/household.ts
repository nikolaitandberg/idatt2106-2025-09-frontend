import { ApiError, GetHouseholdFoodResponse, GetHouseholdResonse } from "@/types/apiResponses";
import { API_BASE_URL } from "@/types/constants";
import { Household, UserResponse } from "@/types/household";
import Fetch, { FetchFunction, useFetch } from "@/util/fetch";
import { useQuery, UseQueryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AddUserToHouseRequest,
  AddExtraResidentRequest,
  AddHouseholdFoodRequest,
  EditHouseholdInfoRequest,
  EditHouseholdWaterRequest,
} from "@/types/apiRequests";
import { ExtraResidentResponse } from "@/types/extraResident";
import { useSession } from "next-auth/react";

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

export const getMyHousehold = async (fetcher: FetchFunction = Fetch): Promise<GetHouseholdResonse | null> => {
  try {
    const res = await fetcher<GetHouseholdResonse>(`${API_BASE_URL}/households/my-household`);
    return res ?? null;
  } catch (error) {
    if (error instanceof ApiError && error.code === 404) {
      return { id: 0 } as GetHouseholdResonse;
    }
    throw error;
  }
};

export const useMyHousehold = () => {
  const fetcher = useFetch();
  const session = useSession();

  return useQuery({
    retry: false,
    queryKey: ["household", "my-household"],
    queryFn: () => getMyHousehold(fetcher),
    enabled: session.status !== "loading",
  });
};

export const getHouseholdUsers = async (id: number, fetcher: FetchFunction = Fetch): Promise<UserResponse[]> => {
  const res = await fetcher<UserResponse[]>(`${API_BASE_URL}/households/${id}/users`);
  return res ?? [];
};

export const addUserToHousehold = async (data: AddUserToHouseRequest, fetcher: FetchFunction = Fetch) => {
  await fetcher<void>(`${API_BASE_URL}/households/invite-user`, {
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

export const deleteExtraResident = async (id: number, fetcher: FetchFunction = Fetch) => {
  await fetcher<void>(`${API_BASE_URL}/extra-residents/${id}`, {
    method: "DELETE",
  });
};

export const getExtraResidents = async (fetcher: FetchFunction = Fetch): Promise<ExtraResidentResponse[]> => {
  const res = await fetcher<ExtraResidentResponse[]>(`${API_BASE_URL}/extra-residents`);
  return res ?? [];
};

export const useExtraResidents = (options?: UseQueryOptions<ExtraResidentResponse[], Error>) => {
  const fetcher = useFetch();

  return useQuery<ExtraResidentResponse[], Error>({
    queryKey: ["household", "extraResidents"],
    queryFn: () => getExtraResidents(fetcher),
    ...options,
  });
};

export const createHousehold = async (
  household: Omit<Household, "id" | "levelOfPreparedness">,
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
    queryKey: ["household", "users", id],
    queryFn: () => getHouseholdUsers(id, fetcher),
    enabled: !!id && (options?.enabled ?? true),
    ...options,
  });
};

export const useAddUserToHousehold = () => {
  const fetcher = useFetch();
  const queryClient = useQueryClient();

  return useMutation<void, Error, AddUserToHouseRequest>({
    mutationFn: (data) => addUserToHousehold(data, fetcher),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["household", "users"] });
    },
  });
};

export const useAddExtraResident = () => {
  const fetcher = useFetch();
  const queryClient = useQueryClient();

  return useMutation<void, Error, AddExtraResidentRequest>({
    mutationFn: (data) => addExtraResident(data, fetcher),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["household", "extraResidents"] });
    },
  });
};

export const useDeleteExtraResident = () => {
  const fetcher = useFetch();
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id) => deleteExtraResident(id, fetcher),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["household", "extraResidents"] });
    },
  });
};

export const getHouseholdFood = async (
  householdId: number,
  fetcher: FetchFunction = Fetch,
): Promise<GetHouseholdFoodResponse> => {
  const food = await fetcher<GetHouseholdFoodResponse>(
    `${API_BASE_URL}/food/household/summary/detailed/${householdId}`,
  );

  if (!food) {
    throw new ApiError("Failed to fetch food data");
  }

  return food;
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

  return useMutation<void, Error, Omit<Household, "id" | "levelOfPreparedness"> & { username?: string }>({
    mutationFn: (data) => createHousehold(data, fetcher),
  });
};

export const joinHousehold = async (inviteKey: string, fetcher: FetchFunction = Fetch): Promise<void> => {
  await fetcher<void>(`${API_BASE_URL}/households/accept/${inviteKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
};

export const useJoinHousehold = () => {
  const fetcher = useFetch();

  return useMutation<void, Error, { inviteKey: string }>({
    mutationFn: ({ inviteKey }) => joinHousehold(inviteKey, fetcher),
  });
};

export const editHouseholdInfo = async (
  req: EditHouseholdInfoRequest,
  fetcher: FetchFunction = Fetch,
): Promise<void> => {
  await fetcher<void>(`${API_BASE_URL}/households/${req.id}`, {
    method: "PUT",
    body: JSON.stringify({
      address: req.address,
      longitude: req.longitude,
      latitude: req.latitude,
    }),
    headers: { "Content-Type": "application/json" },
  });
};

export const useEditHouseholdInfo = () => {
  const fetcher = useFetch();
  const queryClient = useQueryClient();

  return useMutation<void, Error, EditHouseholdInfoRequest>({
    mutationFn: (data) => editHouseholdInfo(data, fetcher),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["household", "my-household"] });
    },
  });
};

export const updateHouseholdWater = async (
  req: EditHouseholdWaterRequest,
  fetcher: FetchFunction = Fetch,
): Promise<void> => {
  await fetcher<void>(`${API_BASE_URL}/households/${req.id}`, {
    method: "PUT",
    body: JSON.stringify(req),
    headers: { "Content-Type": "application/json" },
  });
};

export const useUpdateHouseholdWater = () => {
  const fetcher = useFetch();
  const queryClient = useQueryClient();

  return useMutation<void, Error, EditHouseholdWaterRequest>({
    mutationFn: (data) => updateHouseholdWater(data, fetcher),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["household", "my-household"] });
    },
  });
};
