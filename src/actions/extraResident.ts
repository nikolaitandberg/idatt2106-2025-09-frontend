import { API_BASE_URL } from "@/types/constants";
import Fetch, { FetchFunction, useFetch } from "@/util/fetch";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export interface ExtraResidentType {
  id: number;
  name: string;
  consumptionWater: number;
  consumptionFood: number;
}

export const getExtraResidentTypes = async (fetcher: FetchFunction = Fetch): Promise<ExtraResidentType[]> => {
  const res = await fetcher<ExtraResidentType[]>(`${API_BASE_URL}/extra-resident-types`);
  return res ?? [];
};

export const useExtraResidentTypes = (options?: UseQueryOptions<ExtraResidentType[], Error>) => {
  const fetcher = useFetch();

  return useQuery<ExtraResidentType[], Error>({
    queryKey: ["extraResidentTypes"],
    queryFn: () => getExtraResidentTypes(fetcher),
    ...options,
  });
};
