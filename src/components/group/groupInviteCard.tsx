"use client";

import { useAcceptInvite, useGroupDetails } from "@/actions/group";
import { GroupInvite } from "@/types/group";
import { useState } from "react";
import { Button } from "../ui/button";
import LoadingSpinner from "../ui/loadingSpinner";

interface InviteCardProps {
  invite: GroupInvite;
}

export default function InviteCard({ invite }: InviteCardProps) {
  const [accepted, setAccepted] = useState(false);
  const [declined, setDeclined] = useState(false);
  const { mutate: acceptInvite, isPending } = useAcceptInvite();
  const { data: group, isPending: loadingGroup } = useGroupDetails(invite.groupId);

  const handleAccept = () => {
    acceptInvite(invite.groupId, {
      onSuccess: () => setAccepted(true),
    });
  };

  const handleDecline = () => {
    // TODO: Implement API call to decline invite
    setDeclined(true);
  };

  if (accepted) {
    return (
      <div className="p-4 border rounded bg-green-50 text-green-800">
        Du har godtatt invitasjon til gruppen <strong>{group?.groupName ?? invite.groupId}</strong>.
      </div>
    );
  }

  if (declined) {
    return (
      <div className="p-4 border rounded bg-gray-100 text-gray-600">
        Du har avslått invitasjon til gruppe <strong>{group?.groupName ?? invite.groupId}</strong>.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border shadow-sm bg-white p-4 space-y-2 text-sm hover:shadow transition-shadow">
      <div className="text-sm">
        {loadingGroup ? (
          <LoadingSpinner />
        ) : (
          <>
            Du er invitert til å bli med i gruppe <strong>{group?.groupName ?? invite.groupId}</strong>.
          </>
        )}
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={handleAccept} disabled={isPending}>
          Godta
        </Button>
        <Button size="sm" variant="outline" onClick={handleDecline}>
          Avslå
        </Button>
      </div>
    </div>
  );
}