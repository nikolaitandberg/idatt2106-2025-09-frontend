"use client";

import { useGroupInvitesForMyHousehold } from "@/actions/group";
import InviteCard, { GroupInviteCardSkeleton } from "@/components/group/groupInviteCard";

export default function GroupInvites() {
  const { data: invites, isPending, isError, error } = useGroupInvitesForMyHousehold();

  if (isPending) {
    return [1, 2, 3].map((i) => {
      return <GroupInviteCardSkeleton key={i} />;
    });
  }

  if (isError) {
    return <p className="text-red-500">Feil ved henting av invitasjoner: {error?.message}</p>;
  }

  return (
    <ul className="space-y-2 text-sm">
      {invites.map((invite) => (
        <InviteCard key={`${invite.groupId}-${invite.householdId}`} invite={invite} />
      ))}
      {invites.length === 0 && <li className="text-muted-foreground text-sm">Du har ingen invitasjoner</li>}
    </ul>
  );
}
