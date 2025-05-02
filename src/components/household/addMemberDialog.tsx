"use client";

import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAddUserToHousehold, useAddExtraResident } from "@/actions/household";
import AddExistingMemberForm from "./AddExistingMemberForm";
import AddExtraResidentForm from "./AddExtraResidentForm";

export function AddMemberDialog({ householdId }: { householdId: number }) {
  const [open, setOpen] = useState(false);

  const { mutate: addExistingMember } = useAddUserToHousehold();
  const { mutate: addExtraResident } = useAddExtraResident();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="w-full">
          Legg til eller inviter medlem
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Legg til medlem</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="existing">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="existing">Registrert bruker</TabsTrigger>
            <TabsTrigger value="new">Ekstern deltaker</TabsTrigger>
          </TabsList>

          <TabsContent value="existing">
            <AddExistingMemberForm
              onSubmit={async (req) => {
                await new Promise((resolve) => {
                  addExistingMember(req, {
                    onSettled: resolve,
                  });
                });
                setOpen(false);
              }}
            />
          </TabsContent>

          <TabsContent value="new">
            <AddExtraResidentForm
              onSubmit={async (req) => {
                await new Promise((resolve) => {
                  addExtraResident(
                    {
                      ...req,
                      householdId,
                    },
                    {
                      onSettled: resolve,
                    },
                  );
                });
                setOpen(false);
              }}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
