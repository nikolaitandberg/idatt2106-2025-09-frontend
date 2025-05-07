"use client";

import { useCreateGroup, getGroupInvitesForMyHousehold } from "@/actions/group";
import { useFetch } from "@/util/fetch";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import FormSection from "@/components/ui/form/formSection";
import InviteCard from "@/components/group/groupInviteCard";
import { z } from "zod";
import useAppForm from "@/util/formContext";

export default function CreateOrJoinGroupForm() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const fetcher = useFetch();
  const { mutate: createGroup, isPending } = useCreateGroup();

  const {
    data: invites,
    isPending: isInvitesPending,
    isError: isInvitesError,
    error: invitesError,
  } = useQuery({
    queryKey: ["group-invites", "my-household"],
    queryFn: () => getGroupInvitesForMyHousehold(fetcher),
  });

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

            <Button type="submit" size="fullWidth" disabled={isPending}>
              {isPending ? <LoadingSpinner /> : "Opprett gruppe"}
            </Button>
          </form.AppForm>
        </TabsContent>

        <TabsContent value="join">
          {isInvitesPending && <LoadingSpinner />}
          {isInvitesError && (
            <div className="text-red-500 p-4">Feil ved henting av invitasjoner: {invitesError?.message}</div>
          )}
          {!isInvitesPending && invites?.length === 0 && (
            <p className="text-gray-500">Du har ingen invitasjoner for øyeblikket.</p>
          )}
          {!isInvitesPending && invites && (
            <ul className="space-y-2 text-sm">
              {invites.map((invite) => (
                <InviteCard key={`${invite.groupId}-${invite.householdId}`} invite={invite} />
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
