import { API_BASE_URL } from "@/types/constants";
import { User } from "@/types/user";
import Fetch, { FetchFunction, useFetch } from "@/util/fetch";
import { useQuery } from "@tanstack/react-query";

export const getProfile = async (userId: number, fetcher: FetchFunction = Fetch): Promise<User | null> => {
  try {
    const res = await fetcher<User>(`${API_BASE_URL}/user/${userId}`);
    return res ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const useProfile = (userId: number) => {
  const fetcher = useFetch();

  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: () => getProfile(userId, fetcher),
  });
};
