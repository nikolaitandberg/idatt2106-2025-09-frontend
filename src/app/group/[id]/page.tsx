"use client";

import { redirect, useParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Apple, Users } from "lucide-react";
import { useGroupById, useGroupHouseholds, useSharedFood } from "@/actions/group";
import GroupHeader, { GroupHeaderSkeleton } from "@/components/group/groupHeader";
import GroupMembersTab, { GroupMembersTabSkeleton } from "@/components/group/groupMembersTab";
import GroupFoodTab from "@/components/group/groupFoodTab";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { showToast } from "@/components/ui/toaster";
import Link from "next/link";

export default function GroupPage() {
  const params = useParams();
  const groupId = Number(params.id);

  const { data: households, isPending: loadingHouseholds, isError: householdsIsError } = useGroupHouseholds(groupId);
  const { data: sharedFood, isError: sharedFoodIsError } = useSharedFood(groupId);
  const { data: group, isPending: loadingGroup, isError: groupIsError } = useGroupById(groupId);

  const session = useSession();

  useEffect(() => {
    if (session.status === "unauthenticated") {
      showToast({
        title: "Ikke innlogget",
        description: "Du må være innlogget for å se gruppen din.",
        variant: "error",
      });
      redirect("/login");
    }
  }, [session.status]);

  if (isNaN(groupId)) {
    return (
      <div className="flex flex-col items-center justify-center h-full flex-1">
        <h1 className="text-2xl font-bold">Ugyldig gruppe-ID</h1>
        <p className="text-lg text-muted-foreground mt-2">Denne gruppen finnes ikke.</p>
        <Link href="/group" className="hover:underline mt-4">
          Tilbake til grupper
        </Link>
      </div>
    );
  }

  if (loadingGroup || loadingHouseholds || session.status === "loading") {
    return (
      <div className="p-8 space-y-6">
        <GroupHeaderSkeleton />

        <Tabs defaultValue="medlemmer" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="medlemmer" disabled>
              <Users className="mr-2 h-4 w-4" />
              Medlemmer
            </TabsTrigger>
            <TabsTrigger value="matvarer" disabled>
              <Apple className="mr-2 h-4 w-4" />
              Matvarer
            </TabsTrigger>
          </TabsList>
          <TabsContent value="medlemmer">
            <GroupMembersTabSkeleton />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  if (groupIsError || householdsIsError || sharedFoodIsError) {
    return (
      <div className="flex flex-col items-center justify-center h-full flex-1">
        <h1 className="text-2xl font-bold">Noe gikk galt</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Noe gikk galt når vi prøvde å laste inn gruppen din. Prøv igjen senere.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <GroupHeader group={group} />

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
          <GroupFoodTab groupId={groupId} sharedFood={sharedFood ?? []} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
