"use client";

import { useParams, useRouter } from "next/navigation";
import Alert from "@/components/ui/alert";
import { useState, useEffect, useCallback } from "react";
import { useAcceptAdminInvite } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/ui/loadingSpinner";

export default function RegisterAdminPage() {
  const router = useRouter();
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const params = useParams();
  const key = params.key as string;
  const session = useSession();

  const { mutate: acceptAdminInvite, error, isError, isPending } = useAcceptAdminInvite();

  const handleAcceptInvite = useCallback(() => {
    acceptAdminInvite(
      { key },
      {
        onSuccess: () => {
          setRegistrationSuccess(true);
          setTimeout(() => {
            window.location.href = "/admin";
          }, 3000);
        },
      },
    );
  }, [acceptAdminInvite, key]);

  useEffect(() => {
    if (session.status === "loading") return;

    if (!session.data?.user) {
      router.push(`/login?returnUrl=${encodeURIComponent(`/register-admin/${key}`)}`);
      return;
    }

    if (key && session.data?.user) {
      handleAcceptInvite();
    }
  }, [handleAcceptInvite, key, router, session.data?.user, session.status]);

  if (session.status === "loading") {
    return (
      <div className="flex items-center justify-center bg-background px-4 mt-8">
        <div className="w-full max-w-md rounded-2xl p-8 space-y-6 text-center">
          <h1 className="text-2xl font-bold">Sjekker pålogging...</h1>
        </div>
      </div>
    );
  }

  if (!session.data?.user) {
    return (
      <div className="flex items-center justify-center bg-background px-4 mt-8">
        <div className="w-full max-w-md rounded-2xl p-8 space-y-6">
          <h1 className="text-2xl font-bold text-center">Innlogging nødvendig</h1>
          <Alert type="info">
            Du må være logget inn for å aktivere en administrator-invitasjon. Du blir videresendt til innlogging...
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center bg-background px-4 mt-8">
      <div className="w-full max-w-md rounded-2xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">Aktiver administratorkonto</h1>

        {registrationSuccess ? (
          <Alert type="success">Du er nå administrator! Du blir nå sendt til administrator-siden.</Alert>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              {isPending
                ? "Godtar administrator-invitasjon..."
                : "Klikk på knappen under for å godta administrator-invitasjon."}
            </p>

            {isError && (
              <Alert type="critical">
                {error instanceof Error
                  ? error.message
                  : "Ugyldig eller utløpt invitasjonslenke. Superadministrator for en ny invitasjon."}
              </Alert>
            )}

            <Button className="w-full" onClick={handleAcceptInvite} disabled={isPending}>
              {isPending ? <LoadingSpinner /> : "Godta administrator-invitasjon"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
