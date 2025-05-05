import { useState } from "react";
import { Button } from "../ui/button";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { Household } from "@/types/household";
import { useUpdateHouseholdWater } from "@/actions/household";

export default function UpdateWaterForm({ household }: { household: Household }) {
  const [amount, setAmount] = useState<number>(0);
  const { mutate: updateWater, isPending } = useUpdateHouseholdWater();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    updateWater(
      {
        id: household.id,
        waterAmountLiters: household.waterAmountLiters + amount,
        lastWaterChangeDate: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          // Close dialog by finding and clicking the DialogClose button
          const closeButton = document.querySelector('[role="dialog"] button[data-state="closed"]');
          if (closeButton instanceof HTMLButtonElement) closeButton.click();
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="waterAmount" className="text-sm font-medium">
          Mengde vann å legge til (liter)
        </label>
        <input
          id="waterAmount"
          type="number"
          className="w-full border rounded p-2"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          min="1"
        />
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Avbryt</Button>
        </DialogClose>
        <Button type="submit" disabled={amount <= 0 || isPending}>
          {isPending ? "Oppdaterer..." : "Lagre"}
        </Button>
      </DialogFooter>
    </form>
  );
}
