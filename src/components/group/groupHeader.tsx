"use client";

import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil, LogOut, Home, Users, UserPlus } from "lucide-react";
import { GroupDetails } from "@/types/group";
import ConfirmationDialog from "@/components/ui/confirmationDialog";
import EditGroupForm from "@/components/ui/editGroupForm";
import { showToast } from "@/components/ui/toaster";
import { useLeaveGroup, useMyGroupMemberships } from "@/actions/group";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  group: GroupDetails;
};

export default function GroupHeader({ group }: Props) {
  const router = useRouter();
  const { data: groupRelations } = useMyGroupMemberships();
  const leaveGroupMutation = useLeaveGroup();
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleLeaveGroup = () => {
    const relation = groupRelations?.find((r) => r.groupId === group.groupId);
    if (!relation) return;

    leaveGroupMutation.mutate(relation.id, {
      onSuccess: () => {
        showToast({
          title: "Forlot gruppen",
          description: `Du har forlatt ${group.groupName}`,
          variant: "success",
        });
        router.push("/group");
      },
      onError: () => {
        showToast({
          title: "Kunne ikke forlate gruppen",
          description: `Noe gikk galt når du prøvde å forlate ${group.groupName}`,
          variant: "error",
        });
      },
    });
  };

  return (
    <div>
      <div>
        <h1 className="text-4xl font-bold">{group.groupName}</h1>
        <p className="text-lg text-muted-foreground mt-2">{group.groupDescription}</p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mt-3 text-muted-foreground text-sm">
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            <span>
              {group.totalHouseholds} husholdning{group.totalHouseholds === 1 ? "" : "er"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>
              {group.totalResidents} medlem{group.totalResidents === 1 ? "" : "mer"}
            </span>
          </div>
          {(group.totalExtraResidents ?? 0) > 0 && (
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              <span>
                {group.totalExtraResidents} ekstra medlem{group.totalExtraResidents === 1 ? "" : "mer"}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end sm:items-center gap-2 sm:gap-4 mt-4">
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              Rediger gruppen
              <Pencil className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogTitle>Rediger gruppe</DialogTitle>
            <EditGroupForm
              group={{
                id: group.groupId,
                name: group.groupName,
                description: group.groupDescription,
              }}
              onClose={() => setIsEditDialogOpen(false)}
            />
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
          description={`Er du sikker på at du vil forlate "${group.groupName}"?`}
          confirmText="Forlat"
          cancelText="Avbryt"
          variant="critical"
          confirmIsPending={leaveGroupMutation.isPending}
          onConfirm={handleLeaveGroup}
          onCancel={() => setIsLeaveDialogOpen(false)}
        />
      </div>
    </div>
  );
}

export function GroupHeaderSkeleton() {
  return (
    <div>
      <div>
        <div className="animate-pulse bg-gray-200 h-8 w-1/2 rounded mb-4" />
        <div className="mt-2 animate-pulse bg-gray-200 h-6 w-2/3 rounded mb-4" />
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mt-3 text-muted-foreground text-sm">
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            <span className="animate-pulse bg-gray-200 h-5 w-24 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="animate-pulse bg-gray-200 h-5 w-24 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <span className="animate-pulse bg-gray-200 h-5 w-32 rounded" />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end sm:items-center gap-2 sm:gap-4 mt-4">
        <Button variant="outline" className="flex items-center gap-2" disabled>
          <Pencil className="h-4 w-4" />
          Rediger gruppen
        </Button>

        <Button variant="destructive" className="flex items-center gap-2" disabled>
          Forlat gruppen
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
