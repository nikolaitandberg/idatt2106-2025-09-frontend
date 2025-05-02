"use client";

import { useMyGroupMemberships, getGroupById } from "@/actions/group";
import GroupCard from "@/components/ui/groupCard";
import { useQueries } from "@tanstack/react-query";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useFetch } from "@/util/fetch";

export default function UserGroupsPage() {
  const fetcher = useFetch();
  const { data: relations, isPending, isError, error } = useMyGroupMemberships();

  const groupQueries = useQueries({
    queries: (relations ?? []).map((relation) => ({
      queryKey: ["group", "details", relation.groupId],
      queryFn: () => getGroupById(relation.groupId, fetcher),
      enabled: !!relations,
    })),
  });

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-500 text-center mt-8">Kunne ikke hente gruppemedlemskap: {error?.message}</div>;
  }

  const allLoaded = groupQueries.every((q) => q.isSuccess);
  const anyError = groupQueries.some((q) => q.isError);

  if (!allLoaded && !anyError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold text-center">Dine grupper</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div key={index} className="text-red-500 text-sm">
              Kunne ikke hente gruppe-ID {relations?.[index].groupId}
            </div>
          );
        })}
      </div>
    </div>
  );
}
