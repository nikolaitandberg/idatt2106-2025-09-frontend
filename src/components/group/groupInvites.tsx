"use client";

import { getGroupInvitesForMyHousehold } from "@/actions/group";
import InviteCard from "@/components/group/groupInviteCard";
import { useFetch } from "@/util/fetch";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export default function GroupInvites() {
  const session = useSession();
  const fetcher = useFetch();

  const {
    data: invites,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["group-invites", "my-household"],
    queryFn: () => getGroupInvitesForMyHousehold(fetcher),
    enabled: session.status !== "loading",
  });

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Gruppeinvitasjoner</h2>

      {isPending && <p>Laster invitasjoner...</p>}

      {isError && <p className="text-red-500">Feil ved henting av invitasjoner: {error?.message}</p>}

      {!isPending && invites?.length === 0 && (
        <p className="text-gray-500 text-center py-8">Du har ingen invitasjoner.</p>
      )}

      {!isPending && invites && (
        <ul className="space-y-2 text-sm">
          {invites.map((invite) => (
            <InviteCard key={`${invite.groupId}-${invite.householdId}`} invite={invite} />
          ))}
        </ul>
      )}
    </>
  );
}
