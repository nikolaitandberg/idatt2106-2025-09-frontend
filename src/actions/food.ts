import { CreateFoodTypeRequest } from "@/types";
import { API_BASE_URL } from "@/types/constants";
import { FoodType } from "@/types/household";
import Fetch, { FetchFunction, useFetch } from "@/util/fetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const getFoodTypes = async (fetcher: FetchFunction = Fetch) => {
  const foodTypes = await fetcher<FoodType[]>(`${API_BASE_URL}/food-types`);

  if (!foodTypes) {
    return [];
  }

  return foodTypes;
};

export const useFoodTypes = () => {
  const fetcher = useFetch();

  return useQuery<FoodType[], Error>({
    queryKey: ["food", "types"],
    queryFn: () => getFoodTypes(fetcher),
  });
};

const createFoodType = async (req: CreateFoodTypeRequest, fetcher: FetchFunction = Fetch) => {
  return await fetcher<null>(`${API_BASE_URL}/food-types`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  });
};

export const useCreateFoodType = () => {
  const fetcher = useFetch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: CreateFoodTypeRequest) => createFoodType(req, fetcher),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["food", "types"] });
    },
  });
};
