"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMyGroupMemberships } from "@/actions/group";
import { useMyHousehold } from "@/actions/household";
import CreateOrJoinGroupForm from "@/components/group/createJoinGroupForm";
import GroupInvites from "@/components/group/groupInvites";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import UserGroupList from "@/components/group/userGroupList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { showToast } from "@/components/ui/toaster";
import CreateGroupDialog from "@/components/group/createGroupDialog";

export default function UserGroupsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: household, isPending: loadingHousehold } = useMyHousehold();
  const { data: relations, isPending, isError, error } = useMyGroupMemberships();
  const router = useRouter();

  useEffect(() => {
    if (!loadingHousehold && (!household || household.id <= 0)) {
      showToast({
        title: "Opprett husholdning",
        description: "Du må opprette en husholdning for å kunne være med i en gruppe.",
        variant: "info",
      });
      router.push("/household");
    }
  }, [household, loadingHousehold, router]);

  if (loadingHousehold || isPending) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-600 text-center py-12">Kunne ikke hente gruppedata: {error?.message}</div>;
  }

  if (!relations || relations.length === 0) {
    return <CreateOrJoinGroupForm />;
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <main className="flex-1 p-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Dine beredskapsgrupper</h1>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Opprett ny gruppe
          </Button>
        </div>

        <UserGroupList />
      </main>

      <aside className="w-[400px] bg-white border-l border-border p-6 space-y-8">
        <GroupInvites />
      </aside>

      <CreateGroupDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
