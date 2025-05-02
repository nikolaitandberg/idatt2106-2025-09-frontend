"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { FetchFunction, Fetch, useFetch } from "@/util/fetch";
import { API_BASE_URL } from "@/types/constants";
import { Group, GroupDetails, GroupHouseholdRelation, GroupHousehold } from "@/types/group";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const getMyGroupMemberships = async (
  fetcher: FetchFunction = Fetch,
): Promise<GroupHouseholdRelation[]> => {
  const res = await fetcher<GroupHouseholdRelation[]>(`${API_BASE_URL}/group-households/my-groups`);
  if (!res) {
    throw new Error("Failed to fetch group-household relations");
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

export const getGroupById = async (
  id: number,
  fetcher: FetchFunction = Fetch,
): Promise<Group> => {
  const res = await fetcher<Group>(`${API_BASE_URL}/emergency-groups/${id}`);
  if (!res) {
    throw new Error("Could not fetch emergency group data");
  }
  return res;
};

export const getGroupDetails = async (
  groupId: number,
  fetcher: FetchFunction = Fetch,
): Promise<GroupDetails> => {
  const res = await fetcher<GroupDetails>(`${API_BASE_URL}/emergency-groups/${groupId}`);
  if (!res) {
    throw new Error("Failed to fetch group details");
  }
  return res;
};

export const useGroupDetails = (
  groupId: number,
  options?: UseQueryOptions<GroupDetails, Error>,
) => {
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
    throw new Error("Failed to fetch households in group");
  }
  return res;
};

export const useGroupHouseholds = (
  groupId: number,
  options?: UseQueryOptions<GroupHousehold[], Error>,
) => {
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