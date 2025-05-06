"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { FetchFunction, Fetch, useFetch } from "@/util/fetch";
import { API_BASE_URL } from "@/types/constants";
import {
  GroupDetails,
  GroupHouseholdRelation,
  GroupHousehold,
  EditGroupRequest,
  SharedFoodResponse,
  GroupInviteRequest,
  GroupInvite,
} from "@/types/group";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export const getMyGroupMemberships = async (fetcher: FetchFunction = Fetch): Promise<GroupHouseholdRelation[]> => {
  const res = await fetcher<GroupHouseholdRelation[]>(`${API_BASE_URL}/group-households/my-groups`);
  if (!res) {
    throw new Error("Kunne ikke hente gruppemedlemskap");
  }
  return res;
};

export const useMyGroupMemberships = () => {
  const fetcher = useFetch();
  const session = useSession();

  return useQuery({
    retry: false,
    queryKey: ["group-households", "my-groups"],
    queryFn: () => getMyGroupMemberships(fetcher),
    enabled: session.status !== "loading",
  });
};

export const getGroupById = async (id: number, fetcher: FetchFunction = Fetch): Promise<GroupDetails> => {
  const res = await fetcher<GroupDetails>(`${API_BASE_URL}/emergency-groups/summary/group/${id}`);
  if (!res) throw new Error("Could not fetch group");
  return res;
};

export const getGroupDetails = async (groupId: number, fetcher: FetchFunction = Fetch): Promise<GroupDetails> => {
  const res = await fetcher<GroupDetails>(`${API_BASE_URL}/emergency-groups/summary/group/${groupId}`);
  if (!res) {
    throw new Error("Kunne ikke hente gruppe");
  }
  return res;
};

export const useGroupDetails = (groupId: number, options?: UseQueryOptions<GroupDetails, Error>) => {
  const fetcher = useFetch();

  return useQuery<GroupDetails, Error>({
    queryKey: ["group", "details", groupId],
    queryFn: () => getGroupDetails(groupId, fetcher),
    enabled: !!groupId && (options?.enabled ?? true),
    ...options,
  });
};

export const getGroupHouseholds = async (
  groupId: number,
  fetcher: FetchFunction = Fetch,
): Promise<GroupHousehold[]> => {
  const res = await fetcher<GroupHousehold[]>(`${API_BASE_URL}/group-households/group/${groupId}`);
  if (!res) {
    throw new Error("Kunne ikke hente husholdninger i gruppen");
  }
  return res;
};

export const useGroupHouseholds = (groupId: number, options?: UseQueryOptions<GroupHousehold[], Error>) => {
  const fetcher = useFetch();

  return useQuery<GroupHousehold[], Error>({
    queryKey: ["group", "households", groupId],
    queryFn: () => getGroupHouseholds(groupId, fetcher),
    enabled: !!groupId && (options?.enabled ?? true),
    ...options,
  });
};

export const leaveGroup = async (relationId: number, fetcher: FetchFunction = Fetch) => {
  await fetcher<void>(`${API_BASE_URL}/group-households/${relationId}`, {
    method: "DELETE",
  });
};

export const useLeaveGroup = () => {
  const fetcher = useFetch();
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (relationId) => leaveGroup(relationId, fetcher),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group-households", "my-groups"] });
    },
  });
};

export const editGroup = async (req: EditGroupRequest, fetcher: FetchFunction = Fetch): Promise<void> => {
  await fetcher<void>(`${API_BASE_URL}/emergency-groups/${req.id}`, {
    method: "PUT",
    body: JSON.stringify({
      name: req.name,
      description: req.description,
    }),
    headers: { "Content-Type": "application/json" },
  });
};

export const useEditGroup = () => {
  const fetcher = useFetch();
  const queryClient = useQueryClient();

  return useMutation<void, Error, EditGroupRequest>({
    mutationFn: (data) => editGroup(data, fetcher),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["group", "details", variables.id] });
    },
  });
};

export const getSharedFood = async (
  groupHouseholdId: number,
  fetcher: FetchFunction = Fetch,
): Promise<SharedFoodResponse[]> => {
  const res = await fetcher<SharedFoodResponse[]>(`${API_BASE_URL}/shared-food/summary/detailed/${groupHouseholdId}`);
  if (!res) throw new Error("Kunne ikke hente delt mat");
  return res;
};

export const useSharedFood = (groupHouseholdId: number) => {
  const fetcher = useFetch();

  return useQuery<SharedFoodResponse[]>({
    queryKey: ["shared-food", groupHouseholdId],
    queryFn: () => getSharedFood(groupHouseholdId, fetcher),
    enabled: !!groupHouseholdId,
  });
};

export const inviteHouseholdToGroup = async (
  req: GroupInviteRequest,
  fetcher: FetchFunction = Fetch,
): Promise<void> => {
  await fetcher<void>(`${API_BASE_URL}/group-households/invite`, {
    method: "POST",
    body: JSON.stringify(req),
    headers: { "Content-Type": "application/json" },
  });
};

export const addHouseholdToGroup = async (data: GroupInviteRequest, fetcher: FetchFunction = Fetch): Promise<void> => {
  await fetcher<void>(`${API_BASE_URL}/group-households/invite`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
};

export const useAddHouseholdToGroup = () => {
  const fetcher = useFetch();
  const queryClient = useQueryClient();

  return useMutation<void, Error, GroupInviteRequest>({
    mutationFn: (data) => addHouseholdToGroup(data, fetcher),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["group", "households", variables.groupId] });
    },
  });
};

export const getGroupInvitesForMyHousehold = async (fetcher: FetchFunction): Promise<GroupInvite[]> => {
  const res = await fetcher<GroupInvite[]>(`${API_BASE_URL}/group-invite/household`);
  if (!res) return [];
  return res;
};

export const acceptGroupInvite = async (groupId: number, fetcher: FetchFunction = Fetch): Promise<void> => {
  await fetcher<void>(`${API_BASE_URL}/group-households/accept`, {
    method: "POST",
    body: JSON.stringify(groupId),
    headers: { "Content-Type": "application/json" },
  });
};

export const useAcceptInvite = () => {
  const fetcher = useFetch();
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (groupId) => acceptGroupInvite(groupId, fetcher),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group-households", "my-groups"] });
      queryClient.invalidateQueries({ queryKey: ["group-invites", "my-household"] });
    },
  });
};

export const createGroup = async (
  data: { name: string; description: string },
  fetcher: FetchFunction = Fetch,
): Promise<void> => {
  await fetcher<void>(`${API_BASE_URL}/emergency-groups`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
};

export const useCreateGroup = () => {
  const fetcher = useFetch();
  const queryClient = useQueryClient();
  return useMutation<void, Error, { name: string; description: string }>({
    mutationFn: (data) => createGroup(data, fetcher),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group-households", "my-groups"] });
    },
  });
};

export const rejectGroupInvite = async (groupId: number, fetcher: FetchFunction = Fetch): Promise<void> => {
  await fetcher<void>(`${API_BASE_URL}/group-households/reject`, {
    method: "POST",
    body: JSON.stringify(groupId),
    headers: { "Content-Type": "application/json" },
  });
};

export const useRejectInvite = () => {
  const fetcher = useFetch();
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (groupId) => rejectGroupInvite(groupId, fetcher),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group-invites", "my-household"] });
    },
  });
};
