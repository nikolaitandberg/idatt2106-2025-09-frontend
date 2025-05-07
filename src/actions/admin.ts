import Fetch, { FetchFunction, useFetch } from "@/util/fetch";
import { API_BASE_URL } from "@/types/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import type { User } from "@/types/user";

export const inviteAdmin = async (req: { username: string }, fetcher: FetchFunction = Fetch): Promise<void> => {
  await fetcher<void>(`${API_BASE_URL}/auth/invite-admin`, {
    method: "POST",
    body: JSON.stringify(req),
    headers: { "Content-Type": "application/json" },
  });
};

export const useInviteAdmin = () => {
  const fetcher = useFetch();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { username: string }>({
    mutationFn: (data) => inviteAdmin(data, fetcher),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "invite"] });
    },
  });
};

export const deleteAdmin = async (req: { username: string }, fetcher: FetchFunction = Fetch): Promise<void> => {
  await fetcher<void>(`${API_BASE_URL}/auth/admin`, {
    method: "DELETE",
    body: JSON.stringify(req),
    headers: { "Content-Type": "application/json" },
  });
};

export const useDeleteAdmin = () => {
  const fetcher = useFetch();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { username: string }>({
    mutationFn: (data) => deleteAdmin(data, fetcher),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "list"] });
    },
  });
};

export const deleteAdminInvite = async (req: { username: string }, fetcher: FetchFunction = Fetch): Promise<void> => {
  await fetcher<void>(`${API_BASE_URL}/auth/admin-invite`, {
    method: "DELETE",
    body: JSON.stringify(req),
    headers: { "Content-Type": "application/json" },
  });
}

export const useDeleteAdminInvite = () => {
  const fetcher = useFetch();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { username: string }>({
    mutationFn: (data) => deleteAdminInvite(data, fetcher),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "pending"] });
    },
  });
};

export const getAdminList = async (fetcher: FetchFunction = Fetch): Promise<User[]> => {
  return await fetcher<User[]>(`${API_BASE_URL}/user/admins`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
};

export const useGetAdminList = () => {
  const fetcher = useFetch();
  const session = useSession();

  return useQuery({
    queryKey: ["admin", "list"],
    queryFn: () => getAdminList(fetcher),
    enabled: session.status !== "loading",
    retry: false,
  });
};

export const getPendingAdminList = async (fetcher: FetchFunction = Fetch): Promise<User[]> => {
  return await fetcher<User[]>(`${API_BASE_URL}/user/pending-admins`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
};

export const useGetPendingAdminList = () => {
  const fetcher = useFetch();
  const session = useSession();

  return useQuery({
    queryKey: ["admin", "pending"],
    queryFn: () => getPendingAdminList(fetcher),
    enabled: session.status !== "loading",
    retry: false,
  });
};

export const acceptAdminInvite = async (
  req: { key: string },
  fetcher: FetchFunction = Fetch,
): Promise<{ token: string }> => {
  return await fetcher<{ token: string }>(`${API_BASE_URL}/auth/accept-admin-invite`, {
    method: "POST",
    body: JSON.stringify(req),
    headers: { "Content-Type": "application/json" },
  });
};

export const useAcceptAdminInvite = () => {
  const fetcher = useFetch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: { key: string }) => acceptAdminInvite(req, fetcher),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["user", "accept-admin-invite", "me", "admin"] });

      await signIn("token", {
        token: data.token,
        redirect: false,
      });
    },
  });
};
