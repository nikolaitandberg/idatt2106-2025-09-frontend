"use client";

import { useCreateGroup, getGroupInvitesForMyHousehold } from "@/actions/group";
import { useFetch } from "@/util/fetch";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TextInput from "@/components/ui/textinput";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import FormSection from "../ui/form/formSection";
import InviteCard from "@/components/group/groupInviteCard";

export default function CreateOrJoinGroupForm() {
  const queryClient = useQueryClient();
  const { mutate: createGroup, isPending } = useCreateGroup();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const fetcher = useFetch();

  const {
    data: invites,
    isPending: isInvitesPending,
    isError: isInvitesError,
    error: invitesError,
  } = useQuery({
    queryKey: ["group-invites", "my-household"],
    queryFn: () => getGroupInvitesForMyHousehold(fetcher),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name || !description) {
      setErrorMessage("Vennligst fyll ut navn og beskrivelse");
      return;
    }

    createGroup(
      { name, description },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["group-households", "my-groups"] });
          router.refresh();
        },
        onError: (error) => {
          console.error("Error creating group:", error);
          setErrorMessage("Kunne ikke opprette gruppe. Prøv igjen senere.");
        },
      },
    );
  };

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
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormSection title="Gruppeinformasjon">
              <TextInput label="Navn" name="name" initialValue={name} onChange={setName} />
              <TextInput label="Beskrivelse" name="description" initialValue={description} onChange={setDescription} />
            </FormSection>

            {errorMessage && (
              <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">{errorMessage}</div>
            )}

            <Button type="submit" size="fullWidth" disabled={isPending}>
              {isPending ? (
                <LoadingSpinner />
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Opprett gruppe
                </>
              )}
            </Button>
          </form>
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
