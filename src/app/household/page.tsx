"use client";

import { useProfile } from "@/actions/user";
import { useHousehold, useHouseholdUsers, useExtraResidents, useCreateHousehold } from "@/actions/household";
import { Button } from "@/components/ui/button";
import { Home, MapPin, Pencil, Plus } from "lucide-react";
import MemberCard from "@/components/ui/memberCard";
import GroupCard from "@/components/ui/groupCard";
import { useSession } from "next-auth/react";
import { AddMemberDialog } from "@/components/ui/addMemberDialog";
import HouseholdFood from "@/components/household/HouseholdFood";
import { useState, FormEvent } from "react";
import TextInput from "@/components/ui/textinput";
import FormSection from "@/components/ui/formSection";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HouseholdPageWrapper() {
  const session = useSession({ required: true });

  if (!session.data) {
    return <>Laster side...</>;
  }

  return <HouseholdPage userId={session.data.user.userId} />;
}

function CreateHouseholdForm() {
  const queryClient = useQueryClient();
  const { mutate: createHousehold, isPending } = useCreateHousehold();
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const session = useSession();
  const username = session.data?.sub;
  const { refetch: refetchProfile } = useProfile(session.data?.user.userId || 0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [joinCode, setJoinCode] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!address || !postalCode || !city) {
      setErrorMessage("Vennligst fyll ut alle feltene");
      return;
    }

    if (!username) {
      setErrorMessage("Brukernavn mangler. Prøv å logge inn på nytt.");
      return;
    }

    const fullAddress = `${address}, ${postalCode} ${city}`;

    createHousehold(
      {
        adress: fullAddress,
        longitude: 0,
        latitude: 0,
        waterAmountLiters: 0,
        lastWaterChangeDate: new Date().toISOString(),
        username: username,
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["profile"] });
          await refetchProfile();
        },
        onError: (error) => {
          console.error("Error creating household:", error);
          setErrorMessage("Kunne ikke opprette husholdning. Prøv igjen senere.");
        },
      },
    );
  };

  const handleJoinSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!joinCode) {
      setErrorMessage("Vennligst skriv inn en invitasjonskode");
      return;
    }

    // Here you would call your API to join a household with the code
    // This is a placeholder for the actual implementation
    console.log("Joining household with code:", joinCode);
    // TODO: Implement the actual join household functionality
  };

  return (
    <div className="w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <div className="flex items-center gap-2 mb-6">
        <Home className="w-5 h-5 text-primary" />
        <h1 className="text-xl font-semibold">Husholdning</h1>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="create">Opprett ny</TabsTrigger>
          <TabsTrigger value="join">Bli med i eksisterende</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormSection title="Adresse">
              <TextInput label="Gateadresse" name="address" initialValue={address} onChange={setAddress} />

              <div className="grid grid-cols-2 gap-4">
                <TextInput label="Postnummer" name="postalCode" initialValue={postalCode} onChange={setPostalCode} />
                <TextInput label="Poststed" name="city" initialValue={city} onChange={setCity} />
              </div>
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
                  Opprett husholdning
                </>
              )}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="join">
          <form onSubmit={handleJoinSubmit} className="space-y-6">
            <TextInput
              label="Invitasjonskode"
              name="joinCode"
              placeholder="Skriv inn koden du har fått"
              initialValue={joinCode}
              onChange={setJoinCode}
            />

            {errorMessage && (
              <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">{errorMessage}</div>
            )}

            <Button type="submit" size="fullWidth" disabled={isPending}>
              {isPending ? <LoadingSpinner /> : "Bli med i husholdning"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
function HouseholdPage({ userId }: { userId: number }) {
  const { data: profile, isPending: profilePending, isError: profileError } = useProfile(userId);
  const householdId = profile?.householdId ?? 0;

  const {
    data: household,
    isPending: householdPending,
    isError: householdError,
  } = useHousehold(householdId, {
    queryKey: ["household", householdId],
    enabled: householdId > 0,
  });

  const {
    data: householdUsers = [],
    isPending: usersPending,
    isError: usersError,
  } = useHouseholdUsers(householdId, {
    queryKey: ["householdUsers", householdId],
    enabled: householdId > 0,
  });

  const {
    data: extraResidents = [],
    isPending: extraResidentsPending,
    isError: extraResidentsError,
  } = useExtraResidents({
    queryKey: ["extraResidents", householdId],
    enabled: householdId > 0,
  });

  if (profilePending) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (profileError || !profile) {
    return <div className="text-center py-12 text-red-600">Kunne ikke hente profildata</div>;
  }

  // Show create household form if user doesn't have a household
  if (!householdId || householdId <= 0) {
    return <CreateHouseholdForm />;
  }

  if (householdPending || usersPending || extraResidentsPending) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (householdError || usersError || extraResidentsError || !household) {
    return <div className="text-center py-12 text-red-600">Kunne ikke hente husholdningsdata</div>;
  }

  return (
    <div className="min-h-screen flex bg-white text-foreground">
      <aside className="w-[400px] bg-white border-r border-border p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            <h1 className="text-xl font-semibold">Din husholdning</h1>
          </div>
          <Pencil className="w-4 h-4 text-muted-foreground" />
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{household.adress}</span>
        </div>

        <hr className="border-border" />

        <div className="space-y-4">
          <h2 className="font-medium">Medlemmer</h2>

          {householdUsers.map((user) => (
            <MemberCard key={`user-${user.id}`} name={`${user.firstName} ${user.lastName}`} />
          ))}

          {extraResidents
            .filter((resident) => resident.householdId === householdId)
            .map((resident) => (
              <MemberCard
                key={`resident-${resident.id}`}
                name={resident.name}
                type={resident.typeId === 4 ? "animal" : "person"}
              />
            ))}

          <AddMemberDialog householdId={household.id} />
        </div>

        <hr className="border-border" />

        <div className="space-y-4">
          <h2 className="font-medium">Grupper</h2>
          <div className="grid grid-cols-2 gap-4">
            <GroupCard name="Gruppe 1" households={5} members={100} />
            <GroupCard name="Gruppe 2" households={2} members={3} />
          </div>
          <Button variant="default" className="w-full">
            Lag ny gruppe
          </Button>
        </div>
      </aside>
      <HouseholdFood household={household} />
    </div>
  );
}
