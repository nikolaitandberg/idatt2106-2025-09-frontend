import { Food } from "@/types/household";
import { useState } from "react";
import TextInput from "../ui/textinput";
import { DatePicker } from "../ui/datePicker";
import { Button } from "../ui/button";

interface AddFoodFormProps {
  onSubmit?: (data: Omit<Food, "id" | "householdId" | "typeId">) => void;
}

export default function AddFoodForm({ onSubmit }: AddFoodFormProps) {
  const [expieryDate, setExpieryDate] = useState<Date | undefined>(undefined);
  const [amount, setAmount] = useState<number | undefined>(undefined);

  const handleSubmit = () => {
    if (!expieryDate || !amount) {
      return;
    }

    const data: Omit<Food, "id" | "householdId" | "typeId"> = {
      expirationDate: expieryDate.toISOString(),
      amount,
    };

    onSubmit?.(data);
  };

  return (
    <div className="flex flex-col gap-2">
      <DatePicker onDateChange={setExpieryDate} label="Utløpsdato" />
      <TextInput type="number" label="Antall" name="amount" onChange={(e) => setAmount(Number(e))} />
      <Button size="fullWidth" onClick={handleSubmit}>
        Legg til matvare
      </Button>
    </div>
  );
}
