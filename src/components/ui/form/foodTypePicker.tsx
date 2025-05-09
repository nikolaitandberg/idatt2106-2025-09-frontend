"use client";

import { useCreateFoodType, useFoodTypes } from "@/actions/food";
import { useFieldContext } from "@/util/formContext";
import ComboBox from "../comboBox";
import LoadingSpinner from "../loadingSpinner";
import { Button } from "../button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../dialog";
import AddFoodTypeForm from "@/components/household/AddFoodTypeForm";
import { useState } from "react";

interface FoodTypePickerProps {
  label?: string;
  placeholder?: string;
}

export default function FoodTypePicker({ label, placeholder }: FoodTypePickerProps) {
  const [newFoodTypeDialogOpen, setNewFoodTypeDialogOpen] = useState(false);
  const { data: foodTypes, isPending, isError, error } = useFoodTypes();
  const { mutate: createFoodType } = useCreateFoodType();
  const field = useFieldContext<number | undefined>();

  if (isError) {
    return <div className="text-red-500">Feil: {error.message}</div>;
  }

  if (isPending) {
    return (
      <>
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <ComboBox
          placeholder={placeholder}
          options={["a"]}
          renderSelected={() => <LoadingSpinner />}
          renderOption={() => <LoadingSpinner />}
          onSelect={() => {}}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <Dialog open={newFoodTypeDialogOpen} onOpenChange={setNewFoodTypeDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Lag ny matvaretype</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Lag ny matvaretype</DialogTitle>
            <AddFoodTypeForm
              onSubmit={async (req) => {
                await new Promise((resolve) => {
                  createFoodType(req, {
                    onSettled: resolve,
                  });
                });
                setNewFoodTypeDialogOpen(false);
              }}
              onCancel={() => setNewFoodTypeDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <ComboBox
        placeholder={placeholder}
        options={foodTypes}
        renderOption={(option) => (
          <div key={option.id} className="text-start">
            {option.name.charAt(0).toUpperCase() + option.name.slice(1)} ({option.unit})
          </div>
        )}
        renderSelected={(option) => (
          <div key={option.id}>
            {option.name.charAt(0).toUpperCase() + option.name.slice(1)} ({option.unit})
          </div>
        )}
        value={foodTypes.find((option) => option.id === field.state.value)}
        onSelect={(option) => {
          field.handleChange(option?.id);
        }}
      />
    </>
  );
}
