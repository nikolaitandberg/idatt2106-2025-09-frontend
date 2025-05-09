"use client";

import { useState } from "react";
import { useAddHouseholdToGroup } from "@/actions/group";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogTitle, DialogClose } from "../ui/dialog";
import TextInput from "../ui/textinput";
import { showToast } from "../ui/toaster";
import { Plus } from "lucide-react";

export default function InviteHouseholdDialog({ groupId }: { groupId: number }) {
  const [householdId, setHouseholdId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const { mutate: invite, isPending } = useAddHouseholdToGroup();

  const handleInvite = () => {
    if (householdId === null) return;

    invite(
      { householdId, groupId },
      {
        onSuccess: () => {
          showToast({
            title: "Invitasjon sendt",
            description: `Husholdning ${householdId} ble invitert til gruppen.`,
            variant: "success",
          });
          setHouseholdId(null);
          setOpen(false);
        },
        onError: () => {
          showToast({
            title: "Feil",
            description: "Husholdning er allerede invitert eller med i gruppen.",
            variant: "error",
          });
          setOpen(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Inviter en husholdning
          <Plus className="h-4 w-4 ml-2" />
          </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Inviter husholdning</DialogTitle>
        <TextInput
          name="householdId"
          label="Husholdnings-ID"
          type="number"
          onChange={(val) => {
            const parsed = Number(val);
            setHouseholdId(Number.isNaN(parsed) ? null : parsed);
          }}
        />

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="ghost">Avbryt</Button>
          </DialogClose>
          <Button onClick={handleInvite} disabled={isPending || householdId === null}>
            Send invitasjon
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
