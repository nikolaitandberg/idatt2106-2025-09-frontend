import { InfoPage, EditInfoPageRequest } from "@/types/learning";
import { API_BASE_URL } from "@/types/constants";
import Fetch, { FetchFunction, useFetch } from "@/util/fetch";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";


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

export const editInfoPage = async (data: EditInfoPageRequest): Promise<InfoPage> => {
  const response = await Fetch<InfoPage | null>(`${API_BASE_URL}/info-page/${data.id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response) {
    throw new Error("Failed to edit InfoPage: response is null");
  }

  return response;
};

export const useEditScenario = () => {
  return useMutation<InfoPage, Error, EditInfoPageRequest>({
    mutationFn: editInfoPage,
  });
};
