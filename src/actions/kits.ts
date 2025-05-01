import { API_BASE_URL } from "@/types/constants";
import { HouseholdKit, Kit, UpdateHouseholdKitRequest } from "@/types/kit";
import Fetch, { FetchFunction, useFetch } from "@/util/fetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const getKits = async (fetcher: FetchFunction = Fetch): Promise<Kit[]> => {
  const res = await fetcher<Kit[]>(`${API_BASE_URL}/kits`);

  if (!res) {
    return [];
  }

  return res;
};

export const useKits = () => {
  const fetcher = useFetch();

  return useQuery({
    queryKey: ["kits"],
    queryFn: () => getKits(fetcher),
  });
};

export const getHouseholdKits = async (
  householdId: number,
  fetcher: FetchFunction = Fetch,
): Promise<HouseholdKit[]> => {
  const res = await fetcher<HouseholdKit[]>(`${API_BASE_URL}/household-kits/household/${householdId}`);

  if (!res) {
    return [];
  }

  return res;
};

export const useHouseholdKits = (householdId: number) => {
  const fetcher = useFetch();

  return useQuery({
    queryKey: ["household", "kits", householdId],
    queryFn: () => getHouseholdKits(householdId, fetcher),
  });
};

export const addHouseholdKit = async (req: UpdateHouseholdKitRequest, fetcher: FetchFunction = Fetch) =>
  await fetcher<HouseholdKit>(`${API_BASE_URL}/household-kits`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  });

export const useAddHouseholdKit = () => {
  const fetcher = useFetch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: UpdateHouseholdKitRequest) => addHouseholdKit(req, fetcher),
    onMutate: (req) => {
      queryClient.cancelQueries({ queryKey: ["household", "kits", req.householdId] });
      queryClient.setQueryData(["household", "kits", req.householdId], (oldData: HouseholdKit[] | undefined) => {
        if (!oldData) {
          return [];
        }
        return [...oldData, { householdId: req.householdId, kitId: req.kitId }];
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["household", "kits"] });
      queryClient.invalidateQueries({ queryKey: ["household", "my-household"] });
    },
    onError: (error, req, context) => {
      queryClient.setQueryData(["household", "kits", req.householdId], context);
    },
  });
};

export const removeHouseholdKit = async (req: UpdateHouseholdKitRequest, fetcher: FetchFunction = Fetch) =>
  await fetcher<HouseholdKit>(`${API_BASE_URL}/household-kits`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  });

export const useRemoveHouseholdKit = () => {
  const fetcher = useFetch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: UpdateHouseholdKitRequest) => removeHouseholdKit(req, fetcher),
    onMutate: (req) => {
      queryClient.cancelQueries({ queryKey: ["household", "kits", req.householdId] });
      queryClient.setQueryData(["household", "kits", req.householdId], (oldData: HouseholdKit[] | undefined) => {
        if (!oldData) {
          return [];
        }
        return oldData.filter((kit) => kit.kitId !== req.kitId);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["household", "kits"] });
      queryClient.invalidateQueries({ queryKey: ["household", "my-household"] });
    },
    onError: (error, req, context) => {
      queryClient.setQueryData(["household", "kits", req.householdId], context);
    },
  });
};
