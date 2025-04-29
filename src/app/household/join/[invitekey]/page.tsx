"use client";

import { useParams, useRouter } from "next/navigation";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useJoinHousehold } from "@/actions/household";
import { useEffect } from "react";

export default function JoinHouseholdPage() {
  const params = useParams();
  const inviteKey = params.invitekey as string;
  const router = useRouter();

  const { mutate: joinHousehold, isPending, isError, error } = useJoinHousehold();

  useEffect(() => {
    joinHousehold(
      { inviteKey },
      {
        onSuccess: () => {
          router.replace("/household");
        },
      },
    );
  }, [inviteKey, joinHousehold, router]);

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-semibold mb-6">Blir med i husholdning...</h1>
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-semibold mb-6">Kunne ikke bli med i husholdning</h1>
        <div className="p-4 bg-red-100 border border-red-300 text-red-700 rounded-md max-w-md">{error?.message}</div>
        <button onClick={() => router.push("/household")} className="mt-6 px-4 py-2 bg-primary text-white rounded-md">
          Tilbake
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Du er nå med i husholdningen!</h1>
      <div className="p-4 bg-green-100 border border-green-300 text-green-700 rounded-md max-w-md">
        Du blir omdirigert til husholdningssiden...
      </div>
    </div>
  );
}
