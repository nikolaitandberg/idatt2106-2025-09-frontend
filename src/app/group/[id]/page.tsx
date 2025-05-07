"use client";

import { useParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Apple, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getGroupById, useGroupHouseholds, useSharedFood } from "@/actions/group";
import { useFetch } from "@/util/fetch";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import GroupHeader from "@/components/group/groupHeader";
import GroupMembersTab from "@/components/group/groupMembersTab";
import GroupFoodTab from "@/components/group/groupFoodTab";

export default function GroupPage() {
  const params = useParams();
  const groupId = Number(params.id);
  const fetcher = useFetch();

  const { data: group, isPending: loadingGroup } = useQuery({
    queryKey: ["group", "details", groupId],
    queryFn: () => getGroupById(groupId, fetcher),
    enabled: !!groupId,
  });

  const { data: households, isPending: loadingHouseholds } = useGroupHouseholds(groupId);
  const { data: sharedFood } = useSharedFood(groupId);

  if (loadingGroup || loadingHouseholds) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {group && <GroupHeader group={group} />}

      <Tabs defaultValue="medlemmer" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="medlemmer">
            <Users className="mr-2 h-4 w-4" />
            Medlemmer
          </TabsTrigger>
          <TabsTrigger value="matvarer">
            <Apple className="mr-2 h-4 w-4" />
            Matvarer
          </TabsTrigger>
        </TabsList>

        <TabsContent value="medlemmer">
          <GroupMembersTab groupId={groupId} households={households ?? []} />
        </TabsContent>

        <TabsContent value="matvarer">
          <GroupFoodTab sharedFood={sharedFood ?? []} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
