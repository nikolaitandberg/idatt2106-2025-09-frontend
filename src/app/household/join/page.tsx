"use client";

import { useCreateHousehold, useMyHousehold, useMyHouseholdInvites } from "@/actions/household";
import { redirect } from "next/navigation";
import { Home, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FormSection from "@/components/ui/form/formSection";
import useAppForm from "@/util/formContext";
import { z } from "zod";
import { CreateHouseholdRequest } from "@/types";
import { showToast } from "@/components/ui/toaster";
import HouseholdInviteCard from "@/components/household/HouseholdInviteCard";
import LoadingSpinner from "@/components/ui/loadingSpinner";

export default function CreateHouseholdForm() {
  const { mutate: createHousehold, isError, error } = useCreateHousehold();
  const { data: household } = useMyHousehold();
  const {
    data: myInvites,
    isPending: invitesIsPending,
    isError: invitesIsError,
    invitesError,
  } = useMyHouseholdInvites();

  const shema = z.object({
    address: z.string().min(1, { message: "Adresse må fylles ut" }),
    position: z.object({
      longitude: z.number(),
      latitude: z.number(),
    }),
    name: z.string().min(1, { message: "Navn må fylles ut" }),
  });

  const defaultValues: Omit<
    CreateHouseholdRequest,
    "longitude" | "latitude" | "waterAmountLiters" | "lastWaterChangeDate"
  > & {
    position: {
      longitude: number;
      latitude: number;
    };
  } = {
    address: "",
    position: {
      longitude: 0,
      latitude: 0,
    },
    name: "",
  };

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: shema,
    },
    onSubmit: async ({ value }) => {
      createHousehold({
        address: value.address,
        name: value.name,
        longitude: value.position.longitude,
        latitude: value.position.latitude,
        lastWaterChangeDate: new Date().toISOString(),
        waterAmountLiters: 0,
      });
    },
  });

  if (household) {
    showToast({
      title: "Du har allerede en husholdning",
      description: "Forlat husholdningen din før du oppretter en ny",
      variant: "warning",
    });
    redirect("/household");
  }

  return (
    <div className="w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <div className="flex items-center gap-2 mb-6">
        <Home className="w-5 h-5 text-primary" />
        <h1 className="text-xl font-semibold">Husholdning</h1>
      </div>

      <Tabs defaultValue="join" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="join">Invitasjoner </TabsTrigger>
          <TabsTrigger value="create">Opprett ny</TabsTrigger>
        </TabsList>

        <TabsContent value="join">
          {invitesIsPending ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {myInvites?.length === 0 ? (
                <div className="text-center text-muted-foreground">Ingen invitasjoner</div>
              ) : (
                myInvites?.map((invite) => <HouseholdInviteCard key={invite.householdId} invite={invite} />)
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="create">
          <div className="space-y-6">
            <FormSection title="Lag ny husholdning" className="space-y-0">
              <form.AppField name="name">{(field) => <field.TextInput label="Navn" />}</form.AppField>
              <form.AppField name="address">{(field) => <field.TextInput label="addresse" />}</form.AppField>
              <form.AppField name="position">{(field) => <field.PositionSelector />}</form.AppField>
            </FormSection>

            {isError && (
              <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">{error.message}</div>
            )}

            <form.AppForm>
              <form.SubmitButton>
                <Plus className="w-4 h-4 mr-2" />
                Opprett husholdning
              </form.SubmitButton>
            </form.AppForm>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
