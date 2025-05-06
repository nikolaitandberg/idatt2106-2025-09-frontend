"use client";

import {
  useAcceptHouseholdInvite,
  useDeclineHouseholdInvite,
  useHousehold,
  useHouseholdUsers,
} from "@/actions/household";
import { HouseholdInvite } from "@/types/household";
import { Button } from "../ui/button";
import { showToast } from "../ui/toaster";
import LoadingSpinner from "../ui/loadingSpinner";
import { redirect } from "next/navigation";

interface HouseholdInviteCardProps {
  invite: HouseholdInvite;
}

export default function HouseholdInviteCard({ invite }: HouseholdInviteCardProps) {
  const { data: household, isPending: householdIsPending } = useHousehold(invite.householdId);
  const { data: householdUsers, isPending: householdUsersIsPending } = useHouseholdUsers(household?.id ?? 0);
  const { mutate: acceptInvite, isPending: acceptIsPending } = useAcceptHouseholdInvite();
  const { mutate: declineInvite, isPending: declineIsPending } = useDeclineHouseholdInvite();

  return (
    <div className="flex flex-col bg-white rounded-lg p-4 shadow-md gap-4">
      <div className="flex flex-col gap-2">
        {householdIsPending ? (
          <>
            <div className="animate-pulse bg-gray-200 h-6 w-52 rounded" />
            <div className="animate-pulse bg-gray-200 h-4 w-62 mt-1 rounded" />
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold">{household?.name ?? "Husholdning uten navn"}</h2>
            <p className="text-sm text-gray-500">{household?.address}</p>
          </>
        )}
        {householdUsersIsPending ? (
          <div className="animate-pulse bg-gray-200 h-4 w-24 rounded mt-1" />
        ) : (
          <p className="text-sm text-gray-500">
            {householdUsers?.length} {householdUsers?.length === 1 ? "medlem" : "medlemmer"}
          </p>
        )}
      </div>
      <div className="flex flex-row gap-2">
        <Button
          size="fullWidth"
          variant="outline"
          onClick={() => {
            declineInvite(invite.householdId, {
              onError: () => {
                showToast({
                  title: "Kunne ikke avslå invitasjon",
                  description: "Prøv igjen senere",
                  variant: "error",
                });
              },
            });
          }}>
          {declineIsPending ? <LoadingSpinner /> : "Avslå"}
        </Button>
        <Button
          size="fullWidth"
          onClick={() => {
            acceptInvite(invite.householdId, {
              onSuccess: () => {
                showToast({
                  title: "Invitasjon akseptert",
                  description: "Du har blitt med i husholdningen",
                  variant: "success",
                });
                redirect("/household");
              },
              onError: () => {
                showToast({
                  title: "Kunne ikke akseptere invitasjon",
                  description: "Prøv igjen senere",
                  variant: "error",
                });
              },
            });
          }}>
          {acceptIsPending ? <LoadingSpinner /> : "Aksepter"}
        </Button>
      </div>
    </div>
  );
}

export function HouseholdInviteCardSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-lg p-4 shadow-md gap-4">
      <div className="flex flex-col gap-2">
        <div className="animate-pulse bg-gray-200 h-6 w-52 rounded" />
        <div className="animate-pulse bg-gray-200 h-4 w-62 mt-1 rounded" />
        <div className="animate-pulse bg-gray-200 h-4 w-24 rounded mt-1" />
      </div>
      <div className="flex flex-row gap-2">
        <Button size="fullWidth" variant="outline">
          Avslå
        </Button>
        <Button size="fullWidth"> Aksepter </Button>
      </div>
    </div>
  );
}
