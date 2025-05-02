"use client";

import { useParams, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Pencil, LogOut, Users, Apple, CirclePlus, Home, UserPlus } from "lucide-react";
import GroupHouseholdCard from "@/components/ui/groupHouseholdCard";
import { getGroupById, useGroupHouseholds, useLeaveGroup, useMyGroupMemberships } from "@/actions/group";
import { useMyHousehold } from "@/actions/household";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { showToast } from "@/components/ui/toaster";
import ConfirmationDialog from "@/components/ui/confirmationDialog";
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import EditGroupForm from "@/components/ui/editGroupForm";
import { useQuery } from "@tanstack/react-query";
import { useFetch } from "@/util/fetch";

export default function GroupPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = Number(params.id);
  const fetcher = useFetch();
  const leaveGroupMutation = useLeaveGroup();

  const { data: groupRelations } = useMyGroupMemberships();
  const { data: group, isPending: loadingGroup } = useQuery({
    queryKey: ["group", "details", groupId],
    queryFn: () => getGroupById(groupId, fetcher),
    enabled: !!groupId,
  });
  const { data: households, isPending: loadingHouseholds } = useGroupHouseholds(groupId);
  const { data: myHousehold } = useMyHousehold();

  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleLeaveGroup = () => {
    const relation = groupRelations?.find((r) => r.groupId === groupId);
    if (!relation) return;

    leaveGroupMutation.mutate(relation.id, {
      onSuccess: () => {
        showToast({
          title: "Forlot gruppen",
          description: `Du har forlatt ${group?.groupName ?? "gruppen"}`,
          variant: "success",
        });
        router.push("/group");
      },
      onError: () => {
        showToast({
          title: "Kunne ikke forlate gruppen",
          description: `Noe gikk galt når du prøvde å forlate ${group?.groupName ?? "gruppen"}`,
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
      <nav className="text-sm text-muted-foreground">Husholdning &gt; {group?.groupName}</nav>

      <div>
        <h1 className="text-4xl font-bold">{group?.groupName}</h1>
        <p className="text-lg text-muted-foreground mt-2">{group?.groupDescription}</p>
        <div className="flex items-center gap-6 mt-3 text-muted-foreground text-sm">
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            <span>
              {group?.totalHouseholds} husholdning{group?.totalHouseholds === 1 ? "" : "er"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>
              {group?.totalResidents} medlem{group?.totalResidents === 1 ? "" : "mer"}
            </span>
          </div>
          {(group?.totalExtraResidents ?? 0) > 0 && (
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              <span>
                {group?.totalExtraResidents} ekstra medlem
                {group?.totalExtraResidents === 1 ? "" : "mer"}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end items-center gap-4">
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Pencil className="h-4 w-4" />
              Rediger gruppen
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogTitle>Rediger gruppe</DialogTitle>
            {group && (
              <EditGroupForm
                group={{
                  id: group.groupId,
                  name: group.groupName,
                  description: group.groupDescription,
                }}
                onClose={() => setIsEditDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>

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
          description={`Er du sikker på at du vil forlate "${group?.groupName}"?`}
          confirmText="Forlat"
          cancelText="Avbryt"
          variant="critical"
          confirmIsPending={leaveGroupMutation.isPending}
          onConfirm={handleLeaveGroup}
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
                <GroupHouseholdCard key={h.id} householdId={h.householdId} isHome={myHousehold?.id === h.householdId} />
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
