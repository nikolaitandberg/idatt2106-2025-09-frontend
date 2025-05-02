"use client";

import { useParams, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Pencil, LogOut, Users, Apple, CirclePlus } from "lucide-react";
import HouseholdCard from "@/components/ui/householdCard";
import { useGroupDetails, useGroupHouseholds, useLeaveGroup, useMyGroupMemberships } from "@/actions/group";
import { useMyHousehold } from "@/actions/household";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { showToast } from "@/components/ui/toaster";
import ConfirmationDialog from "@/components/ui/confirmationDialog";
import { useState } from "react";

export default function GroupPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = Number(params.id);
  const leaveGroupMutation = useLeaveGroup();

  const { data: groupRelations } = useMyGroupMemberships();
  const { data: group, isPending: loadingGroup } = useGroupDetails(groupId);
  const { data: households, isPending: loadingHouseholds } = useGroupHouseholds(groupId);
  const { data: myHousehold } = useMyHousehold();
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);

  const handleLeaveGroup = () => {
    const relation = groupRelations?.find((r) => r.groupId === groupId);
    if (!relation) return;

    leaveGroupMutation.mutate(relation.id, {
      onSuccess: () => {
        showToast({
          title: "Forlot gruppen",
          description: `Du har forlatt ${group?.name}`,
          variant: "success",
        });
        router.push("/group");
      },
      onError: () => {
        showToast({
          title: "Kunne ikke forlate gruppen",
          description: `Noe gikk galt når du prøvde å forlate ${group?.name}`,
          variant: "error",
        });
      },
    });
  };

  if (loadingGroup || loadingHouseholds) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <nav className="text-sm text-muted-foreground">Husholdning &gt; {group?.name}</nav>

      <div>
        <h1 className="text-4xl font-bold">{group?.name}</h1>
        <p className="text-lg text-muted-foreground mt-2">{group?.description}</p>
      </div>

      <div className="flex justify-end items-center gap-4">
        <Button variant="outline" className="flex items-center gap-2">
          <Pencil className="h-4 w-4" />
          Rediger gruppen
        </Button>
        <Button
          variant="destructive"
          className="flex items-center gap-2"
          onClick={() => setIsLeaveDialogOpen(true)}
          disabled={leaveGroupMutation.isPending}>
          Forlat gruppen
          <LogOut className="h-4 w-4" />
        </Button>

        <ConfirmationDialog
          open={isLeaveDialogOpen}
          title="Forlat gruppen"
          description={`Er du sikker på at du vil forlate "${group?.name}"?`}
          confirmText="Forlat"
          cancelText="Avbryt"
          variant="critical"
          confirmIsPending={leaveGroupMutation.isPending}
          onConfirm={() => handleLeaveGroup()}
          onCancel={() => setIsLeaveDialogOpen(false)}
        />
      </div>

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
          <div className="flex flex-col items-center mt-6 space-y-6">
            <h2 className="text-2xl font-semibold">Medlemmer</h2>

            <div className="flex flex-wrap justify-center gap-4">
              {households?.map((h) => (
                <HouseholdCard
                  key={h.id}
                  id={h.householdId}
                  name={h.name}
                  address={h.address}
                  peopleCount={h.peopleCount}
                  petCount={h.petCount}
                  isHome={myHousehold?.id === h.householdId}
                />
              ))}
            </div>

            <Button variant="outline" className="flex items-center gap-2">
              Inviter en husholdning
              <CirclePlus className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="matvarer">
          <p className="text-muted-foreground mt-4">Matvarer kommer snart</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
