"use client";

import { useState } from "react";
import { useAddHouseholdToGroup } from "@/actions/group";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogTitle, DialogClose } from "../ui/dialog";
import TextInput from "../ui/textinput";

export default function InviteHouseholdDialog({ groupId }: { groupId: number }) {
  const [householdId, setHouseholdId] = useState<number | null>(null);
  const { mutate: invite, isPending } = useAddHouseholdToGroup();

  const handleInvite = () => {
    if (householdId === null) return;
    invite({ householdId, groupId });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Inviter en husholdning</Button>
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
