"use client";

import GroupHouseholdCard, { GroupHouseholdCardSkeleton } from "@/components/group/groupHouseholdCard";
import InviteHouseholdDialog from "@/components/group/inviteHouseholdDialog";
import { GroupHousehold } from "@/types/group";
import { Button } from "../ui/button";

type Props = {
  groupId: number;
  households: GroupHousehold[];
};

export default function GroupMembersTab({ groupId, households }: Props) {
  return (
    <div className="flex flex-col items-center mt-6 space-y-6">
      <h2 className="text-2xl font-semibold">Medlemmer</h2>

      <div className="flex flex-wrap justify-center gap-4">
        {households.map((h) => (
          <GroupHouseholdCard key={h.id} householdId={h.householdId} />
        ))}
      </div>

      <InviteHouseholdDialog groupId={groupId} />
    </div>
  );
}

export function GroupMembersTabSkeleton() {
  return (
    <div className="flex flex-col items-center mt-6 space-y-6">
      <h2 className="text-2xl font-semibold">Medlemmer</h2>

      <div className="flex flex-wrap justify-center gap-4">
        {[1, 2, 3].map((i) => (
          <GroupHouseholdCardSkeleton key={i} />
        ))}
      </div>

      <Button variant="outline" disabled>
        Inviter en husholdning
      </Button>
    </div>
  );
}
