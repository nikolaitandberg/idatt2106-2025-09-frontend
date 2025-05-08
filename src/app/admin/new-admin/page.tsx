"use client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { InviteAdminForm } from "@/components/admin/inviteAdminForm";
import { useState } from "react";
import { useGetAdminList, useGetPendingAdminList, useDeleteAdmin, useDeleteAdminInvite } from "@/actions/admin";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { showToast } from "@/components/ui/toaster";
import type { User } from "@/types/user";
import { ConfirmAdminActionDialog } from "@/components/admin/confirmAdminActionDialog";
import { notFound } from "next/navigation";
import { useSession } from "next-auth/react";

type ActionType = "removeAdmin" | "cancelInvite";

export default function NewAdmin() {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<string | null>(null);
  const [actionType, setActionType] = useState<ActionType>("removeAdmin");

  const { data: adminList, isPending: adminsLoading, refetch: refetchAdmins } = useGetAdminList();
  const { data: pendingAdmins, isPending: pendingLoading, refetch: refetchPendingAdmins } = useGetPendingAdminList();
  const { mutate: deleteAdmin, isPending: isDeleting } = useDeleteAdmin();
  const { mutate: deleteAdminInvite, isPending: isDeletingInvite } = useDeleteAdminInvite();

  const session = useSession();

  if (!session?.data?.user.isSuperAdmin && session?.status !== "loading") {
    notFound();
  }

  const openConfirmation = (username: string, type: ActionType) => {
    setSelectedAdmin(username);
    setActionType(type);
    setConfirmDialogOpen(true);
  };

  const handleConfirmAction = () => {
    if (!selectedAdmin) return;

    const action = actionType === "removeAdmin" ? deleteAdmin : deleteAdminInvite;

    action(
      { username: selectedAdmin },
      {
        onSuccess: () => {
          refetchAdmins();
          refetchPendingAdmins();
          showToast({
            title: actionType === "removeAdmin" ? "Administrator fjernet" : "Invitasjon avbrutt",
            description:
              actionType === "removeAdmin"
                ? `${selectedAdmin} er ikke lenger administrator`
                : `Invitasjonen til ${selectedAdmin} er avbrutt`,
            variant: "success",
          });
          setConfirmDialogOpen(false);
          setSelectedAdmin(null);
        },
        onError: (error) => {
          showToast({
            title: "Feil",
            description: error.message || "Kunne ikke utføre handlingen",
            variant: "error",
          });

          setConfirmDialogOpen(false);
          setSelectedAdmin(null);
        },
      },
    );
  };
  const refreshData = () => {
    refetchAdmins();
    refetchPendingAdmins();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold mb-4">Administratorer</h1>
        <Button variant="default" onClick={() => setInviteDialogOpen(true)}>
          Inviter ny administrator
        </Button>
      </div>

      <h2 className="text-xl font-medium mt-6 mb-3">Aktive administratorer</h2>
      <Table>
        <TableCaption>Tabell over aktive administratorer</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Brukernavn</TableHead>
            <TableHead>E-post</TableHead>
            <TableHead className="text-right">Handling</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {adminsLoading || !adminList ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4">
                <LoadingSpinner />
              </TableCell>
            </TableRow>
          ) : adminList && adminList.length > 0 ? (
            adminList.map((admin: User, index: number) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {admin.username}
                  {admin.superAdmin && <span className="ml-2 text-xs text-blue-700">(Super)</span>}
                </TableCell>
                <TableCell>{admin.email || "-"}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openConfirmation(admin.username, "removeAdmin")}
                    disabled={admin.superAdmin || isDeleting}
                  >
                    {isDeleting && selectedAdmin === admin.username ? <LoadingSpinner /> : "Fjern"}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground py-4">
                Ingen administratorer funnet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <h2 className="text-xl font-medium mt-6 mb-3">Invitasjoner</h2>
      <Table>
        <TableCaption>Tabell over utestående administrator-invitasjoner</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Brukernavn</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Handling</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingLoading || !pendingAdmins ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4">
                <LoadingSpinner />
              </TableCell>
            </TableRow>
          ) : pendingAdmins && pendingAdmins.length > 0 ? (
            pendingAdmins.map((admin: User, index: number) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{admin.username}</TableCell>
                <TableCell>Invitert</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openConfirmation(admin.username, "cancelInvite")}
                    disabled={isDeleting}>
                    {isDeleting && selectedAdmin === admin.username ? <LoadingSpinner /> : "Avbryt"}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground py-4">
                Ingen ventende invitasjoner
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <InviteAdminForm
        open={inviteDialogOpen}
        onClose={() => {
          setInviteDialogOpen(false);
          refreshData();
        }}
      />

      <ConfirmAdminActionDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleConfirmAction}
        isLoading={actionType === "removeAdmin" ? isDeleting : isDeletingInvite}
        title={actionType === "removeAdmin" ? "Fjern administrator" : "Avbryt invitasjon"}
        description={
          actionType === "removeAdmin"
            ? `Er du sikker på at du vil fjerne ${selectedAdmin} som administrator?`
            : `Er du sikker på at du vil avbryte invitasjonen til ${selectedAdmin}?`
        }
        confirmText={actionType === "removeAdmin" ? "Fjern" : "Avbryt invitasjon"}
      />
    </div>
  );
}
