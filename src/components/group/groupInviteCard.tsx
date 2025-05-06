"use client";

import { useAcceptInvite, useRejectInvite, useGroupDetails } from "@/actions/group";
import { GroupInvite } from "@/types/group";
import { useState } from "react";
import { Button } from "../ui/button";
import LoadingSpinner from "../ui/loadingSpinner";
import { showToast } from "../ui/toaster";

interface InviteCardProps {
  invite: GroupInvite;
}

export default function InviteCard({ invite }: InviteCardProps) {
  const [accepted, setAccepted] = useState(false);
  const [declined, setDeclined] = useState(false);
  const { mutate: acceptInvite, isPending } = useAcceptInvite();
  const { data: group, isPending: loadingGroup } = useGroupDetails(invite.groupId);
  const { mutate: rejectInvite, isPending: isRejecting } = useRejectInvite();

  const handleAccept = () => {
    acceptInvite(invite.groupId, {
      onSuccess: () => {
        setAccepted(true);
        showToast({
          title: "Invitasjon godtatt",
          description: `Du har blitt med i gruppen "${group?.groupName ?? invite.groupId}"`,
          variant: "success",
        });
      },
      onError: () => {
        showToast({
          title: "Feil ved godkjenning",
          description: "Noe gikk galt da du prøvde å godta invitasjonen.",
          variant: "error",
        });
      },
    });
  };

  const handleDecline = () => {
    rejectInvite(invite.groupId, {
      onSuccess: () => {
        setDeclined(true);
        showToast({
          title: "Invitasjon avslått",
          description: `Du har avslått invitasjon til gruppen "${group?.groupName ?? invite.groupId}"`,
          variant: "success",
        });
      },
      onError: () => {
        showToast({
          title: "Feil ved avslag",
          description: "Noe gikk galt da du prøvde å avslå invitasjonen.",
          variant: "error",
        });
      },
    });
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
            <p className="font-semibold">{group?.groupName ?? invite.groupId}</p>
            <div className="flex items-center gap-2 mt-1 text-gray-700">
              <span>
                Det er {group?.totalHouseholds ?? invite.groupId}{" "}
                {group?.totalHouseholds === 1 ? "husholdning" : "husholdninger"} i denne gruppen.
              </span>
            </div>
          </>
        )}
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={handleAccept} disabled={isPending}>
          Godta
        </Button>
        <Button size="sm" variant="outline" onClick={handleDecline} disabled={isRejecting}>
          Avslå
        </Button>
      </div>
    </div>
  );
}
