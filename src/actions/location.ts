import { API_BASE_URL } from "@/types/constants";
import { UserLocation } from "@/types/user";
import Fetch, { FetchFunction, useFetch } from "@/util/fetch";
import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";

const getLastKnownLocations = async (householdId: number, fetcher: FetchFunction = Fetch): Promise<UserLocation[]> => {
  return await fetcher<UserLocation[]>(`${API_BASE_URL}/location/last-known/${householdId}`);
};

export const useLastKnownLocations = (
  householdId: number,
  options: Omit<
    UseQueryOptions<UserLocation[], Error, UserLocation[], [string, string, number]>,
    "queryKey" | "queryFn"
  >,
) => {
  const fetcher = useFetch();

  return useQuery({
    ...options,
    queryKey: ["location", "last-known", householdId],
    queryFn: () => getLastKnownLocations(householdId, fetcher),
  });
};

const updateUserLocation = async (location: UserLocation, fetcher: FetchFunction = Fetch): Promise<void> => {
  await fetcher<void>(`${API_BASE_URL}/location/update`, {
    method: "PUT",
    body: JSON.stringify(location),
    headers: { "Content-Type": "application/json" },
  });
};

export const useUpdateUserLocation = () => {
  const fetcher = useFetch();

  return useMutation({
    mutationFn: (location: UserLocation) => updateUserLocation(location, fetcher),
  });
};
