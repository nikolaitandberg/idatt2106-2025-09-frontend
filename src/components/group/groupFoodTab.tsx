"use client";

import GroupSharedFoodAccordion from "@/components/group/groupFoodAccordion";
import { SharedFoodByHousehold } from "@/types/group";

type Props = {
  sharedFood: SharedFoodByHousehold[];
};

export default function GroupFoodTab({ sharedFood }: Props) {
  return (
    <div className="flex flex-col items-center mt-6 space-y-6">
      <h2 className="text-2xl font-semibold">Delt mat i gruppen</h2>
      <div className="w-full max-w-2xl">
        <GroupSharedFoodAccordion foodByHousehold={sharedFood} />
      </div>
    </div>
  );
}
