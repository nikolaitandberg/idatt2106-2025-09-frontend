"use client";

import { useCreateHousehold, useMyHousehold, useMyHouseholdInvites } from "@/actions/household";
import { Home, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FormSection from "@/components/ui/form/formSection";
import useAppForm from "@/util/formContext";
import { z } from "zod";
import { CreateHouseholdRequest } from "@/types";
import { showToast } from "@/components/ui/toaster";
import HouseholdInviteCard, { HouseholdInviteCardSkeleton } from "@/components/household/HouseholdInviteCard";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";

export default function CreateHouseholdForm() {
  const { mutate: createHousehold, isError, error } = useCreateHousehold();
  const { data: household, isFetching: householdIsFetching } = useMyHousehold();
  const { data: myInvites, isPending: invitesIsPending } = useMyHouseholdInvites();
  const session = useSession();

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (householdIsFetching || !household) {
      return;
    }

    setIsInitialLoad(false);
  }, [householdIsFetching, household]);

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
    "longitude" | "latitude" | "waterAmountLiters" | "lastWaterChangeDate" | "username"
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
      await new Promise((resolve) => {
        createHousehold(
          {
            address: value.address,
            name: value.name,
            longitude: value.position.longitude,
            latitude: value.position.latitude,
            lastWaterChangeDate: new Date().toISOString(),
            waterAmountLiters: 0,
            username: session.data?.sub ?? "",
          },
          {
            onSuccess: () => {
              showToast({
                title: "Husholdning opprettet",
                description: "Du har nå opprettet en husholdning",
              });
              router.replace("/household");
            },
            onError: () => {
              showToast({
                title: "Noe gikk galt",
                description: "Kunne ikke opprette husholdning",
                variant: "error",
              });
            },
            onSettled: resolve,
          },
        );
      });
    },
  });

  if (household && isInitialLoad && !householdIsFetching) {
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
          <div className="flex flex-col gap-4 mb-4">
            {invitesIsPending ? (
              <>
                {[1, 2].map((i) => (
                  <HouseholdInviteCardSkeleton key={i} />
                ))}
              </>
            ) : (
              <>
                {myInvites?.length === 0 || !myInvites ? (
                  <div className="text-center text-muted-foreground">Ingen invitasjoner</div>
                ) : (
                  myInvites?.map((invite) => <HouseholdInviteCard key={invite.householdId} invite={invite} />)
                )}
              </>
            )}
          </div>
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
