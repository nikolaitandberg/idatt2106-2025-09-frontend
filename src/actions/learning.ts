import { InfoPage, EditInfoPageRequest, CreateInfoPageRequest } from "@/types/learning";
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

export const editInfoPage = async (data: EditInfoPageRequest, fetcher: FetchFunction): Promise<void> => {
  await fetcher<void>(`${API_BASE_URL}/info-page`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const useEditScenario = () => {
  const fetcher = useFetch();

  return useMutation({
    mutationFn: (data: EditInfoPageRequest) => editInfoPage(data, fetcher),
  });
};


export const deleteInfoPage = async (id: number, fetcher: FetchFunction) => {
  await fetcher<void>(`${API_BASE_URL}/info-page/${id}`, {
    method: "DELETE",
  });
};

export const useDeleteScenario = () => {
  const fetcher = useFetch();

  return useMutation<void, Error, number>({
    mutationFn: (id: number) => deleteInfoPage(id, fetcher),
  });
};

export const createInfoPage = async (data: CreateInfoPageRequest, fetcher: FetchFunction): Promise<void> => {
  await fetcher<InfoPage>(`${API_BASE_URL}/info-page`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const useCreateScenario = () => {
  const fetcher = useFetch();

  return useMutation({
    mutationFn: (data: CreateInfoPageRequest) => {
      return createInfoPage(data, fetcher);
    }
  });
};