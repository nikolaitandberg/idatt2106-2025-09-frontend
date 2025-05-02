import { useQueryClient } from "@tanstack/react-query";
import { useCreateHousehold } from "@/actions/household";
import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import { useProfile } from "@/actions/user";
import { useRouter } from "next/navigation";
import { Home, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TextInput from "@/components/ui/textinput";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import FormSection from "../ui/form/formSection";

export default function CreateHouseholdForm() {
  const queryClient = useQueryClient();
  const { mutate: createHousehold, isPending } = useCreateHousehold();
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const session = useSession();
  const username = session.data?.sub;
  const { refetch: refetchProfile } = useProfile(session.data?.user.userId || 0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [inviteKey, setInviteKey] = useState("");
  const router = useRouter();

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
        address: fullAddress,
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

    if (!inviteKey) {
      setErrorMessage("Vennligst skriv inn en invitasjonskode");
      return;
    }

    router.push(`/household/join/${inviteKey}`);
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
              initialValue={inviteKey}
              onChange={setInviteKey}
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
