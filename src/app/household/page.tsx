"use client";

import { useMyHousehold } from "@/actions/household";
import HouseholdFood, { HouseholdFoodSkeleton } from "@/components/household/HouseholdFood";
import HouseholdInfo, { HouseholdInfoSkeleton } from "@/components/household/householdInfo";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { showToast } from "@/components/ui/toaster";

export default function HouseholdPageWrapper() {
  const session = useSession();
  const { data: household, isPending, isError, isFetching } = useMyHousehold();

  useEffect(() => {
    if (!isPending && !isFetching && !household) {
      redirect("/household/join");
    }
  }, [isPending, isFetching, household]);

  useEffect(() => {
    if (session.status === "unauthenticated") {
      showToast({
        title: "Du må være innlogget",
        description: "Du må være innlogget for å se husholdningen din",
        variant: "error",
      });
      redirect("/login");
    }
  }, [session.status]);

  if (isPending || !household) {
    return (
      <div className="min-h-screen max-w-screen flex flex-col md:flex-row bg-white text-foreground">
        <div className="w-full md:w-[300px] lg:w-[400px] shrink-0 bg-white border-b md:border-r border-border p-6 space-y-8">
          <HouseholdInfoSkeleton />
        </div>

        <HouseholdFoodSkeleton />
      </div>
    );
  }

  if (isError) {
    return <div className="text-center py-12 text-red-600">Kunne ikke hente profildata</div>;
  }

  return (
    <div className="min-h-screen max-w-screen flex flex-col md:flex-row bg-white text-foreground">
      <div className="w-full md:w-[300px] lg:w-[400px] shrink-0 bg-white border-b md:border-r border-border p-6 space-y-8">
        <HouseholdInfo household={household} />
      </div>

      <HouseholdFood household={household} />
    </div>
  );
}
