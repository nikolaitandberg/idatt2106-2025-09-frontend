"use client";

import { useCreateGroup, useGroupInvitesForMyHousehold } from "@/actions/group";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import FormSection from "@/components/ui/form/formSection";
import InviteCard from "@/components/group/groupInviteCard";
import { z } from "zod";
import useAppForm from "@/util/formContext";
import { useMyHousehold } from "@/actions/household";
import { showToast } from "../ui/toaster";
import { useEffect } from "react";

export default function CreateOrJoinGroupForm() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate: createGroup } = useCreateGroup();
  const { data: household, isPending, isError } = useMyHousehold();

  useEffect(() => {
    if (!isPending && (!household || isError)) {
      showToast({
        title: "Ingen husstand",
        description: "Du må være medlem av en husstand for å opprette en gruppe.",
        variant: "error",
      });
      router.replace("/household/join");
    }
  }, [isPending, household, isError, router]);

  const schema = z.object({
    name: z.string().min(1, "Navn er påkrevd"),
    description: z.string().min(1, "Beskrivelse er påkrevd"),
  });

  const form = useAppForm({
    defaultValues: { name: "", description: "" },
    validators: { onChange: schema },
    onSubmit: async ({ value }) => {
      await new Promise<void>((resolve) => {
        createGroup(
          {
            name: value.name,
            description: value.description,
          },
          {
            onSuccess: async () => {
              await queryClient.invalidateQueries({ queryKey: ["group-households", "my-groups"] });
              router.refresh();
            },
            onSettled: resolve,
          },
        );
      });
    },
  });

  return (
    <div className="w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-5 h-5 text-primary" />
        <h1 className="text-xl font-semibold">Beredskapsgruppe</h1>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="create">Opprett ny</TabsTrigger>
          <TabsTrigger value="join">Dine invitasjoner</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <form.AppForm>
            <FormSection title="Gruppeinformasjon">
              <form.AppField name="name">{(field) => <field.TextInput label="Navn" />}</form.AppField>
              <form.AppField name="description">{(field) => <field.TextInput label="Beskrivelse" />}</form.AppField>
            </FormSection>
            <form.SubmitButton>Lag gruppe</form.SubmitButton>
          </form.AppForm>
        </TabsContent>

        <TabsContent value="join">
          <JoinForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function JoinForm() {
  const {
    data: invites,
    isPending: isInvitesPending,
    isError: isInvitesError,
    error: invitesError,
  } = useGroupInvitesForMyHousehold();

  if (isInvitesPending) {
    return (
      <div className="flex flex-col gap-2">
        <LoadingSpinner />
        <p className="text-gray-500">Henter invitasjoner...</p>
      </div>
    );
  }

  if (isInvitesError) {
    return <div className="text-red-500 p-4">Feil ved henting av invitasjoner: {invitesError?.message}</div>;
  }

  return (
    <ul className="space-y-2 text-sm">
      {invites.map((invite) => (
        <InviteCard key={`${invite.groupId}-${invite.householdId}`} invite={invite} />
      ))}
    </ul>
  );
}
