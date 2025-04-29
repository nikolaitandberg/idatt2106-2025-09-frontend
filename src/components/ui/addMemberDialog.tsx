"use client";

import { useRef, useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TextInput from "@/components/ui/textinput";
import { Button } from "@/components/ui/button";
import { useAddUserToHousehold, useAddExtraResident } from "@/actions/household";
import { useQueryClient } from "@tanstack/react-query";
import ComboBox from "@/components/ui/comboBox";
import { useExtraResidentTypes } from "@/actions/extraResident";

export function AddMemberDialog({ householdId }: { householdId: number }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("existing");
  const usernameRef = useRef<string>("");
  const nameRef = useRef<string>("");
  const selectedTypeIdRef = useRef<number | null>(null);

  const queryClient = useQueryClient();
  const addUserMutation = useAddUserToHousehold();
  const addExtraResidentMutation = useAddExtraResident();
  const { data: residentTypes = [] } = useExtraResidentTypes();

  const handleSend = () => {
    if (tab === "existing") {
      addUserMutation.mutate(
        { username: usernameRef.current, householdId },
        {
          onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["householdUsers", householdId] });
            setOpen(false);
          },
          onError: (e) => {
            console.error(e);
          },
        },
      );
    } else {
      if (!selectedTypeIdRef.current || !nameRef.current) {
        console.error("Mangler typeId eller navn");
        return;
      }

      addExtraResidentMutation.mutate(
        {
          householdId,
          typeId: selectedTypeIdRef.current,
          name: nameRef.current,
        },
        {
          onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["extraResidents", householdId] });
            setOpen(false);
          },
          onError: (e) => {
            console.error(e);
          },
        },
      );
    }
  };

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

        <Tabs defaultValue="existing" onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="existing">Registrert bruker</TabsTrigger>
            <TabsTrigger value="new">Ekstern deltaker</TabsTrigger>
          </TabsList>

          <TabsContent value="existing">
            <TextInput
              label="Brukernavn"
              name="username"
              placeholder="Skriv inn brukernavn"
              onChange={(value) => (usernameRef.current = value)}
              validate={(value) => value.length >= 3}
              validationErrorMessage="Brukernavn må være minst 3 tegn"
            />
          </TabsContent>

          <TabsContent value="new">
            <div className="space-y-4">
              <div>
                <label className="block text-m font-medium mb-1">Type deltaker</label>
                <ComboBox
                  placeholder="Velg type"
                  options={residentTypes}
                  onSelect={(option) => (selectedTypeIdRef.current = option.id)}
                  renderOption={(option) => <span>{option.name}</span>}
                  renderSelected={(option) => <span>{option.name}</span>}
                />
              </div>

              <TextInput
                label="Navn"
                name="name"
                placeholder="Skriv inn navn"
                onChange={(value) => (nameRef.current = value)}
                validate={(value) => value.length >= 1}
                validationErrorMessage="Navn kan ikke være tomt"
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            variant="default"
            onClick={handleSend}
            disabled={addUserMutation.isPending || addExtraResidentMutation.isPending}>
            {addUserMutation.isPending || addExtraResidentMutation.isPending
              ? "Laster..."
              : tab === "existing"
                ? "Legg til medlem"
                : "Legg til deltaker"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
