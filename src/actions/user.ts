import { API_BASE_URL } from "@/types/constants";
import { User } from "@/types/user";
import Fetch, { FetchFunction, useFetch } from "@/util/fetch";
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { ApiError, ResetPasswordRequest } from "@/types";
import { UpdatePositionSharingRequest } from "@/types/setting";
import { userUpdateRequest } from "@/types/apiRequests";

export const getProfile = async (userId: number, fetcher: FetchFunction = Fetch): Promise<User> => {
  return await fetcher<User>(`${API_BASE_URL}/user/${userId}`);
};

export const useProfile = (userId: number, options?: Omit<UseQueryOptions<User, ApiError>, "queryKey" | "queryFn">) => {
  const fetcher = useFetch();

  return useQuery({
    ...options,
    queryKey: ["user", userId],
    queryFn: () => getProfile(userId, fetcher),
    retry: false,
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

export const updateUserPositionSharing = async (req: UpdatePositionSharingRequest, fetcher: FetchFunction = Fetch) => {
  await fetcher<void>(`${API_BASE_URL}/user/${req.userId}/position-sharing`, {
    method: "PATCH",
    body: JSON.stringify({
      sharePositionHousehold: req.sharePositionHousehold,
      sharePositionGroup: req.sharePositionGroup,
    }),
    headers: { "Content-Type": "application/json" },
  });
};

export const useUpdateUserPositionSharing = () => {
  const fetcher = useFetch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: UpdatePositionSharingRequest) => updateUserPositionSharing(req, fetcher),
    onMutate: (req: UpdatePositionSharingRequest) => {
      const previousUser = queryClient.getQueryData<User>(["user", req.userId]);
      if (previousUser) {
        queryClient.setQueryData<User>(["user", req.userId], {
          ...previousUser,
          sharePositionHousehold: req.sharePositionHousehold,
          sharePositionGroup: req.sharePositionGroup,
        });
      }
      return { previousUser };
    },
    onError: (err, req, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData<User>(["user", req.userId], context.previousUser);
      }
    },
    onSuccess: (data, req) => {
      queryClient.invalidateQueries({ queryKey: ["user", req.userId] });
    },
  });
};

export const updateUser = async (req: userUpdateRequest, fetcher: FetchFunction = Fetch) => {
  await fetcher<void>(`${API_BASE_URL}/user/${req.id}`, {
    method: "PUT",
    body: JSON.stringify(req),
    headers: { "Content-Type": "application/json" },
  });
};

export const useUpdateUser = () => {
  const fetcher = useFetch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: userUpdateRequest) => updateUser(req, fetcher),
    onMutate: (req: userUpdateRequest) => {
      const previousUser = queryClient.getQueryData<User>(["user", req.id]);
      if (previousUser) {
        queryClient.setQueryData<User>(["user", req.id], { ...previousUser, ...req });
      }
      return { previousUser };
    },
    onError: (err, req, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData<User>(["user", req.id], context.previousUser);
      }
    },
    onSuccess: (data, req) => {
      queryClient.invalidateQueries({ queryKey: ["user", req.id] });
    },
  });
};
