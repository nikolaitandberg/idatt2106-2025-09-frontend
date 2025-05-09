import { useDeleteExtraResident, useExtraResidents, useHouseholdUsers } from "@/actions/household";
import MemberCard, { MemberCardSkeleton } from "../ui/memberCard";
import { AddMemberDialog } from "./addMemberDialog";
import { showToast } from "../ui/toaster";

export default function HouseholdUsers({ householdId }: { householdId: number }) {
  const {
    data: householdUsers,
    isPending: householdUsersIsPending,
    isError: householdUsersIsError,
    error: householdUsersError,
  } = useHouseholdUsers(householdId);
  const {
    data: extraResidents,
    isPending: extraResidentsIsPending,
    isError: extraResidentsIsError,
    error: extraResidentsError,
  } = useExtraResidents();
  const { mutate: deleteExtraResidentMutation } = useDeleteExtraResident();

  const handleRemoveExtraResident = (id: number) => {
    deleteExtraResidentMutation(id, {
      onSuccess: () => {
        showToast({
          variant: "success",
          title: "Ekstern deltaker fjernet",
          description: "Deltaker ble fjernet fra husholdningen.",
        });
      },
      onError: () => {
        showToast({
          variant: "error",
          title: "Feil",
          description: "Kunne ikke fjerne deltaker. Prøv igjen senere.",
        });
      },
    });
  };

  if (householdUsersIsPending || extraResidentsIsPending) {
    return <HouseholdUsersSkeleton />;
  }

  if (householdUsersIsError || extraResidentsIsError) {
    return (
      <>
        <div className="text-center py-12 text-red-600">Kunne ikke hente husholdningsmedlemmer</div>
        <div className="text-center py-12 text-red-600">
          {householdUsersError?.message ?? extraResidentsError?.message}
        </div>
      </>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-medium">Medlemmer</h2>
        <span className="text-sm text-muted-foreground">
          {householdUsers.length + extraResidents.filter((r) => r.householdId === householdId).length} medlemmer
        </span>
      </div>

      {householdUsers.map((user) => (
        <MemberCard
          key={`user-${user.id}`}
          name={user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username}
          image={user.picture}
        />
      ))}

      {extraResidents
        .filter((resident) => resident.householdId === householdId)
        .map((resident) => (
          <MemberCard
            key={`resident-${resident.id}`}
            name={resident.name}
            type={resident.typeId === 3 || resident.typeId === 4 ? "animal" : "person"}
            onRemove={() => handleRemoveExtraResident(resident.id)}
          />
        ))}

      <AddMemberDialog householdId={householdId} />
    </div>
  );
}

export function HouseholdUsersSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-medium">Medlemmer</h2>
        <span className="animate-pulse bg-muted rounded w-1/2 h-5" />
      </div>

      {[1, 2, 3, 4].map((i) => (
        <MemberCardSkeleton key={i} />
      ))}
    </div>
  );
}
