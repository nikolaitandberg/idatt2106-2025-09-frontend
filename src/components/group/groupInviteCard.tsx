"use client";

import { useAcceptInvite } from "@/actions/group";
import { GroupInvite } from "@/types/group";
import { useState } from "react";
import { Button } from "../ui/button";

interface InviteCardProps {
  invite: GroupInvite;
}

export default function InviteCard({ invite }: InviteCardProps) {
  const [accepted, setAccepted] = useState(false);
  const [declined, setDeclined] = useState(false);
  const { mutate: acceptInvite, isPending } = useAcceptInvite();

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
        Du har godtatt invitasjon til gruppe {invite.groupId}.
      </div>
    );
  }

  if (declined) {
    return (
      <div className="p-4 border rounded bg-gray-100 text-gray-600">
        Du har avslått invitasjon til gruppe {invite.groupId}.
      </div>
    );
  }

  return (
      <div className="rounded-lg border border-border shadow-sm bg-white p-4 space-y-2 text-sm hover:shadow transition-shadow">
      <div className="text-sm">
        Du er invitert til å bli med i gruppe <strong>{invite.groupId}</strong>.
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