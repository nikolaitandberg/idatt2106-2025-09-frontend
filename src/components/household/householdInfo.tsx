import { Home, MapPin, Pencil } from "lucide-react";
import { Household } from "@/types/household";
import HouseholdUsers from "./householdUsers";
import HouseholdGroups from "./householdGroups";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import useAppForm from "@/util/formContext";
import { z } from "zod";
import { useEditHouseholdInfo } from "@/actions/household";
import FormError from "../ui/form/formError";
import { useState } from "react";

export default function HouseholdInfo({ household }: { household: Household }) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { mutate: updateHousehold, error } = useEditHouseholdInfo();

  const schema = z.object({
    address: z.string().min(1, { message: "Husholdningen må ha en adresse" }),
  });

  const editForm = useAppForm({
    defaultValues: {
      address: household.address,
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
            latitude: household.latitude,
            longitude: household.longitude,
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
      <div />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Home className="w-5 h-5" />
          <h1 className="text-xl font-semibold">Din husholdning</h1>
        </div>
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              <Pencil className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Rediger husholdning</DialogTitle>
            <editForm.AppField name="address">{(field) => <field.TextInput label="Adresse" />}</editForm.AppField>
            <editForm.AppForm>
              <editForm.SubmitButton>Lagre endringer</editForm.SubmitButton>
            </editForm.AppForm>
            <FormError error={error?.message} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="w-4 h-4" />
        <span>{household.address}</span>
      </div>

      <hr className="border-border" />
      <HouseholdUsers householdId={household.id} />
      <hr className="border-border" />
      <HouseholdGroups />
    </>
  );
}
