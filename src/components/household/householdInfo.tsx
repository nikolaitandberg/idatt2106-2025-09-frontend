"use client";

import { Home, LogOut, MapPin, Pencil } from "lucide-react";
import { Household } from "@/types/household";
import HouseholdUsers from "./householdUsers";
import HouseholdGroups from "./householdGroups";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import useAppForm from "@/util/formContext";
import { z } from "zod";
import { useEditHouseholdInfo, useLeaveHousehold } from "@/actions/household";
import FormError from "../ui/form/formError";
import { useState } from "react";
import ConfirmationDialog from "../ui/confirmationDialog";
import { showToast } from "../ui/toaster";
import { useRouter } from "next/navigation";

export default function HouseholdInfo({ household }: { household: Household }) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false);

  const { mutate: updateHousehold, error } = useEditHouseholdInfo();
  const { mutate: leaveHousehold, isPending: leaveHouseholdIsPending } = useLeaveHousehold();

  const router = useRouter();

  const schema = z.object({
    address: z.string().min(1, { message: "Husholdningen må ha en adresse" }),
    name: z.string().min(1, { message: "Husholdningen må ha et navn" }),
    position: z.object({
      longitude: z.number(),
      latitude: z.number(),
    }),
  });

  const editForm = useAppForm({
    defaultValues: {
      address: household.address ?? "",
      name: household.name ?? "",
      position: {
        longitude: household.longitude,
        latitude: household.latitude,
      },
    },
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      await new Promise((resolve) => {
        updateHousehold(
          {
            id: household.id,
            address: value.address,
            latitude: value.position.latitude,
            longitude: value.position.longitude,
            nextWaterChangeDate: household.nextWaterChangeDate,
            name: value.name,
          },
          {
            onSettled: resolve,
          },
        );
      });
      setEditDialogOpen(false);
    },
  });

  return (
    <>
      <div className="space-y-3 mb-6">
        <div className="flex items-left justify-between flex-col">
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            <h1 className="text-xl font-semibold">{household.name ?? "Husholdning uten navn"}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{household.address}</span>
        </div>

        <div className="text-sm text-muted-foreground">Husholdning ID: {household.id}</div>

        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="fullWidth" className="hover:text-foreground gap-2">
              Rediger husholdning <Pencil className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Rediger husholdning</DialogTitle>
            <editForm.AppField name="address">{(field) => <field.TextInput label="Adresse" />}</editForm.AppField>
            <editForm.AppField name="name">{(field) => <field.TextInput label="Navn" />}</editForm.AppField>
            <editForm.AppField name="position">{(field) => <field.PositionSelector />}</editForm.AppField>
            <editForm.AppForm>
              <editForm.SubmitButton>Lagre endringer</editForm.SubmitButton>
            </editForm.AppForm>
            <FormError error={error?.message} />
          </DialogContent>
        </Dialog>
        <Button variant="outline" size="fullWidth" onClick={() => setConfirmLeaveOpen(true)}>
          <div className="flex items-center gap-2">
            Forlat husholdning <LogOut strokeWidth={1.5} size={15} />
          </div>
        </Button>
      </div>

      <ConfirmationDialog
        open={confirmLeaveOpen}
        onConfirm={() => {
          leaveHousehold(undefined, {
            onSuccess: () => {
              setConfirmLeaveOpen(false);
              showToast({
                title: "Husholdning forlatt",
                description: "Du har forlatt husholdningen",
                variant: "success",
              });
              router.replace("/household/join");
            },
            onError: () => {
              setConfirmLeaveOpen(false);
              showToast({
                title: "Kunne ikke forlate husholdning",
                description: "Prøv igjen senere",
                variant: "error",
              });
            },
          });
        }}
        confirmIsPending={leaveHouseholdIsPending}
        onCancel={() => setConfirmLeaveOpen(false)}
        variant="warning"
        title="Forlat husholdning"
        description="Er du sikker på at du vil forlate husholdningen?"
      />

      <hr className="border-border" />
      <HouseholdUsers householdId={household.id} />
      <hr className="border-border" />
      <HouseholdGroups />
    </>
  );
}
