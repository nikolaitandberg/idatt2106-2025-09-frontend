import { useAddHouseholdKit, useHouseholdKits, useKits, useRemoveHouseholdKit } from "@/actions/kits";
import LoadingSpinner from "../ui/loadingSpinner";
import HouseholdKitItem, { HouseholdKitItemSkeleton } from "./householdKitItem";

interface HouseholdKitsProps {
  householdId: number;
}

export default function HouseholdKits({ householdId }: HouseholdKitsProps) {
  const {
    data: householdKits,
    isPending: householdKitsIsPending,
    isError: householdKitsIsError,
    error: householdKitsError,
  } = useHouseholdKits(householdId);
  const { data: kits, isPending: kitsIsPending, isError: kitsIsError, error: kitsError } = useKits();
  const { mutate: addHouseholdKit } = useAddHouseholdKit();
  const { mutate: removeHouseholdKit } = useRemoveHouseholdKit();

  if (householdKitsIsPending || kitsIsPending) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  if (householdKitsIsError || kitsIsError) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full p-4 text-red-500">
        <p>Det oppstod en feil ved lasting av utstyr.</p>
        <p>{householdKitsError?.message ?? kitsError?.message}</p>
      </div>
    );
  }

  return (
    <>
      {kits.map((kit) => (
        <HouseholdKitItem
          key={kit.id}
          kit={kit}
          householdHasKit={householdKits.some((hKit) => hKit.kitId === kit.id)}
          onAdd={() => {
            addHouseholdKit({
              householdId,
              kitId: kit.id,
            });
          }}
          onRemove={() => {
            removeHouseholdKit({
              householdId,
              kitId: kit.id,
            });
          }}
        />
      ))}
    </>
  );
}

export function HouseholdKitsSkeleton() {
  return (
    <>
      {[1, 2, 3].map((i) => {
        return <HouseholdKitItemSkeleton key={i} />;
      })}
    </>
  );
}
