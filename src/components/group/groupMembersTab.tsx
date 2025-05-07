"use client";

import GroupHouseholdCard from "@/components/group/groupHouseholdCard";
import InviteHouseholdDialog from "@/components/group/inviteHouseholdDialog";
import { useMyHousehold } from "@/actions/household";
import { GroupHousehold } from "@/types/group";

type Props = {
  groupId: number;
  households: GroupHousehold[];
};

export default function GroupMembersTab({ groupId, households }: Props) {
  const { data: myHousehold } = useMyHousehold();

  return (
    <div className="flex flex-col items-center mt-6 space-y-6">
      <h2 className="text-2xl font-semibold">Medlemmer</h2>

      <div className="flex flex-wrap justify-center gap-4">
        {households.map((h) => (
          <GroupHouseholdCard
            key={h.id}
            householdId={h.householdId}
            isHome={myHousehold?.id === h.householdId}
          />
        ))}
      </div>

      <InviteHouseholdDialog groupId={groupId} />
    </div>
  );
}
