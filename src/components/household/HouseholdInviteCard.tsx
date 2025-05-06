import { useHousehold } from "@/actions/household";
import { HouseholdInvite } from "@/types/household";

interface HouseholdInviteCardProps {
  invite: HouseholdInvite;
}

export default function HouseholdInviteCard({ invite }: HouseholdInviteCardProps) {
  const { data: household } = useHousehold(invite.householdId);

  return (
    <div className="flex flex-col bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold">Household Invite</h2>
      <p className="text-gray-600">Household ID: {invite.householdId}</p>
      <p className="text-gray-600">User ID: {invite.userId}</p>
    </div>
  );
}
