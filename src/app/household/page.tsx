"use client";

import { useMyHousehold } from "@/actions/household";
import HouseholdFood from "@/components/household/HouseholdFood";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import HouseholdInfo from "@/components/household/householdInfo";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function HouseholdPageWrapper() {
  const { data: household, isPending, isError, isFetching } = useMyHousehold();

  useEffect(() => {
    if (!isPending && !isFetching && !household) {
      redirect("/household/join");
    }
  }, [isPending, isFetching, household]);

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!household) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return <div className="text-center py-12 text-red-600">Kunne ikke hente profildata</div>;
  }

  return (
    <div className="min-h-screen flex bg-white text-foreground">
      <aside className="w-[400px] bg-white border-r border-border p-6 space-y-8">
        <HouseholdInfo household={household} />
      </aside>

      <HouseholdFood household={household} />
    </div>
  );
}
