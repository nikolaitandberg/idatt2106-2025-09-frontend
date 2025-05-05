"use client";

import { useMyGroupMemberships, getGroupById, getGroupInvitesForMyHousehold } from "@/actions/group";
import GroupCard from "@/components/group/groupCard";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useFetch } from "@/util/fetch";
import { useQueries, useQuery } from "@tanstack/react-query";
import InviteCard from "@/components/group/groupInviteCard";
import { useSession } from "next-auth/react";
import CreateGroupDialog from "@/components/group/createGroupDialog";

export default function UserGroupsPage() {
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

  const {
    data: invites,
    isPending: invitesPending,
    isError: invitesError,
    error: invitesErrorMessage,
  } = useQuery({
    queryKey: ["group-invites", "my-household"],
    queryFn: () => getGroupInvitesForMyHousehold(fetcher),
    enabled: session.status !== "loading",
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

  const allLoaded = groupQueries.every((q) => q.isSuccess) && !invitesPending && !invitesError;
  const anyError = groupQueries.some((q) => q.isError) || invitesError;

  if (!allLoaded && !anyError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dine beredskapsgrupper</h1>
        <CreateGroupDialog />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

        <div className="rounded-lg border border-border shadow-sm bg-white p-4 space-y-2 text-sm hover:shadow transition-shadow">
          <h2 className="text-xl font-semibold mb-4">Gruppeinvitasjoner</h2>

          {invitesPending && <p>Laster invitasjoner...</p>}

          {invitesError && (
            <p className="text-red-500">Feil ved henting av invitasjoner: {invitesErrorMessage?.message}</p>
          )}

          {!invitesPending && invites && invites.length > 0 && (
            <ul className="space-y-2 text-sm">
              {invites.map((invite) => (
                <InviteCard key={`${invite.groupId}-${invite.householdId}`} invite={invite} />
              ))}
            </ul>
          )}

          {!invitesPending && invites?.length === 0 && <p className="text-gray-500">Du har ingen invitasjoner.</p>}
        </div>
      </div>
    </div>
  );
}
