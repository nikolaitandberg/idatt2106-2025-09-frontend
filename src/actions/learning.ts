import { InfoPage } from "@/types/learning";
import { API_BASE_URL } from "@/types/constants";
import Fetch, { FetchFunction, useFetch } from "@/util/fetch";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export const getAllInfoPages = async (fetcher: FetchFunction = Fetch): Promise<InfoPage[]> => {
  const res = await fetcher<InfoPage[]>(`${API_BASE_URL}/info-page/all`);
  return res ?? [];
};

export const useInfoPages = (options?: UseQueryOptions<InfoPage[], Error>) => {
  const fetcher = useFetch();

  return useQuery<InfoPage[], Error>({
    queryKey: ["infoPages"],
    queryFn: () => getAllInfoPages(fetcher),
    ...options,
  });
};

export const getInfoPageById = async (id: number, fetcher: FetchFunction = Fetch): Promise<InfoPage | null> => {
  try {
    return await fetcher<InfoPage>(`${API_BASE_URL}/info-page/${id}`);
  } catch {
    return null;
  }
};

export const useInfoPageById = (id: number, options?: UseQueryOptions<InfoPage | null, Error>) => {
  const fetcher = useFetch();

  return useQuery<InfoPage | null, Error>({
    queryKey: ["infoPage", id],
    queryFn: () => getInfoPageById(id, fetcher),
    enabled: id > 0,
    ...options,
  });
};
