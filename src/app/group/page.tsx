"use client";

import GroupCard from "@/components/ui/groupCard";

// MOCKDATA
const mockGroupRelations = [{ id: 1, householdId: 10, groupId: 1 }];
const mockGroup = {
  id: 2,
  name: "Testgruppe",
  householdsCount: 2,
  membersCount: 5,
};

export default function UserGroupsPage() {
  const groupRelations = mockGroupRelations;

  const groupQueries = [
    {
      isSuccess: true,
      data: mockGroup,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold">Dine grupper</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {groupQueries.map((query, index) => {
          if (query.isSuccess) {
            const group = query.data;
            return (
              <GroupCard
                key={group.id}
                id={group.id}
                name={group.name}
                households={group.householdsCount}
                members={group.membersCount}
              />
            );
          }

          return (
            <div key={index} className="text-red-500 text-sm">
              Kunne ikke hente gruppe-ID {groupRelations?.[index].groupId}
            </div>
          );
        })}
      </div>
    </div>
  );
}
