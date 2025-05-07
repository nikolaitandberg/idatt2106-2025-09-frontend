import Fetch, { FetchFunction, useFetch } from "@/util/fetch";
import { API_BASE_URL } from "@/types/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signIn } from "next-auth/react";

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
      queryClient.invalidateQueries({ queryKey: ["admin", "delete"] });
    },
  });
};

export const getAdminList = async (fetcher: FetchFunction = Fetch): Promise<{ admins: string[] }> => {
  return await fetcher<{ admins: string[] }>(`${API_BASE_URL}/user/admins`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
};

export const useGetAdminList = () => {
  const fetcher = useFetch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => getAdminList(fetcher),
    onSuccess: (data) => {
      queryClient.setQueryData(["admin", "list"], data);
    },
  });
};

export const getPendingAdminList = async (fetcher: FetchFunction = Fetch): Promise<{ pendingAdmins: string[] }> => {
  return await fetcher<{ pendingAdmins: string[] }>(`${API_BASE_URL}/user/pending-admins`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
};

export const useGetPendingAdminList = () => {
  const fetcher = useFetch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => getPendingAdminList(fetcher),
    onSuccess: (data) => {
      queryClient.setQueryData(["admin", "pending"], data);
    },
  });
};

export const acceptAdminInvite = async (req: { key: string }, fetcher: FetchFunction = Fetch): Promise<void> => {
  await fetcher<void>(`${API_BASE_URL}/auth/accept-admin-invite`, {
    method: "POST",
    body: JSON.stringify(req),
    headers: { "Content-Type": "application/json" },
  });
};

export const useAcceptAdminInvite = () => {
  const fetcher = useFetch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: { key: string }) => {
      return await fetcher<{ token: string }>(`${API_BASE_URL}/auth/accept-admin-invite`, {
        method: "POST",
        body: JSON.stringify(req),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["user", "accept-admin-invite", "me", "admin"] });

      await signIn("token", {
        token: data.token,
        redirect: false,
      });
    },
  });
};
