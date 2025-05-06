"use client";

import { useSharedFood } from "@/actions/group";
import { Accordion } from "@/components/ui/accordion";
import FoodAccordionItem from "@/components/ui/itemAccordion";

export default function GroupSharedFood({ groupHouseholdId }: { groupHouseholdId: number }) {
  const { data: sharedFood, isLoading, isError } = useSharedFood(groupHouseholdId);

  if (isLoading) return <div>Laster delt mat...</div>;
  if (isError || !sharedFood) return <div className="text-red-600">Kunne ikke hente delt mat</div>;

  return (
    <Accordion type="multiple">
      {sharedFood.map((food) => (
        <FoodAccordionItem
          key={food.typeId}
          householdId={groupHouseholdId}
          id={food.typeId}
          name={food.typeName}
          totalAmount={food.totalAmount}
          units={food.batches}
        />
      ))}
    </Accordion>
  );
}
