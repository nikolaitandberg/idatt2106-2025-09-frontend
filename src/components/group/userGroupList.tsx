"use client";

import { useMyGroupMemberships, getGroupById } from "@/actions/group";
import GroupCard, { GroupCardSkeleton } from "@/components/group/groupCard";
import { useFetch } from "@/util/fetch";
import { useQueries } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export default function UserGroupList() {
  const session = useSession();
  const fetcher = useFetch();
  const { data: relations, isPending, isError, error } = useMyGroupMemberships();

  const groupQueries = useQueries({
    queries: (relations ?? []).map((relation) => ({
      queryKey: ["group", "details", relation.groupId],
      queryFn: () => getGroupById(relation.groupId, fetcher),
      enabled: !!relation && session.status !== "loading",
    })),
  });

  if (isError) {
    return <div className="text-red-500 text-center mt-8">Kunne ikke hente gruppemedlemskap: {error?.message}</div>;
  }

  const allLoaded = groupQueries.every((q) => q.isSuccess);
  const anyError = groupQueries.some((q) => q.isError);

  if ((!allLoaded && !anyError) || isPending) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <GroupCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {groupQueries.map((query, index) => {
        if (query.isSuccess) {
          const group = query.data;
          return (
            <GroupCard
              key={group.groupId}
              id={group.groupId}
              name={group.groupName}
              households={group.totalHouseholds}
              members={group.totalResidents + group.totalExtraResidents}
            />
          );
        }
        return (
          <div key={index + "error"} className="text-red-500 text-sm">
            Kunne ikke hente gruppe-ID {relations?.[index].groupId}
          </div>
        );
      })}
    </div>
  );
}
