import { API_BASE_URL } from "@/types/constants";
import { User } from "@/types/user";
import Fetch, { FetchFunction, useFetch } from "@/util/fetch";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ResetPasswordRequest } from "@/types";

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

export const requestPasswordReset = async (email: string, fetcher: FetchFunction = Fetch): Promise<void> => {
  await fetcher<void>(`${API_BASE_URL}/auth/request-password-reset`, {
    method: "POST",
    body: JSON.stringify({ email }),
    headers: { "Content-Type": "application/json" },
  });
};

export const useRequestPasswordReset = () => {
  const fetcher = useFetch();

  return useMutation({
    mutationFn: (email: string) => requestPasswordReset(email, fetcher),
  });
};

export const resetPassword = async (req: ResetPasswordRequest, fetcher: FetchFunction = Fetch): Promise<void> => {
  await fetcher<void>(`${API_BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
};

export const useResetPassword = () => {
  const fetcher = useFetch();

  return useMutation({
    mutationFn: async (req: ResetPasswordRequest) => resetPassword(req, fetcher),
  });
};
