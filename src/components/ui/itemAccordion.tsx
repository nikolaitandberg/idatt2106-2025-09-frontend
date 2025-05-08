"use client";

import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Calendar, Image as ImageIcon, Pencil, Trash, Plus, ArrowRightLeft } from "lucide-react";
import { cn } from "@/util/cn";
import { Food } from "@/types/household";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./dialog";
import { Button } from "./button";
import AddFoodForm from "../household/AddFoodForm";
import { useState } from "react";
import { useAddHouseholdFood, useDeleteHouseholdFood, useUpdateHouseholdFood } from "@/actions/household";
import { useQueryClient } from "@tanstack/react-query";
import MoveToGroupDialog from "@/components/household/moveToGroupDialog";
import ConfirmationDialog from "@/components/ui/confirmationDialog";
import EditFoodForm from "@/components/household/editFoodForm";

type FoodAccordionItemProps = {
  id: number;
  name: string;
  totalAmount: number;
  unit: string;
  units: Omit<Food, "typeId" | "householdId">[];
  householdId: number;
};

const expieryIsSoon = (date: string) => {
  const expieryDate = new Date(date);
  const currentDate = new Date();
  const diffTime = expieryDate.getTime() - currentDate.getTime();
  const diffDays = diffTime / (1000 * 3600 * 24);
  return diffDays >= 0 && diffDays < 7;
};

export default function FoodAccordionItem({ id, name, totalAmount, unit, householdId, units }: FoodAccordionItemProps) {
  const [addFoodDialogOpen, setAddFoodDialogOpen] = useState(false);
  const [moveDialogUnitId, setMoveDialogUnitId] = useState<number | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<number | null>(null);
  const [editingFoodId, setEditingFoodId] = useState<number | null>(null);

  const { mutate: addFood } = useAddHouseholdFood();
  const { mutate: deleteFood } = useDeleteHouseholdFood();
  const { mutate: editFood } = useUpdateHouseholdFood();
  const queryClient = useQueryClient();

  return (
    <AccordionItem className="rounded-lg overflow-hidden border" value={id.toString()}>
      <AccordionTrigger className="bg-white px-4 py-3 hover:no-underline">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="text-sm font-medium text-foreground">{name}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {totalAmount} {unit}
          </span>
        </div>
      </AccordionTrigger>

      <AccordionContent className="bg-muted/30 px-0">
        <Dialog open={addFoodDialogOpen} onOpenChange={setAddFoodDialogOpen}>
          <DialogTrigger asChild>
            <Button size="fullWidth" variant="outline">
              Legg til {name.toLowerCase()} <Plus className="inline w-4 h-4 ml-1" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Legg til {name.toLowerCase()}</DialogTitle>
            <AddFoodForm
              onSubmit={async (food) => {
                await new Promise((resolve) => {
                  addFood(
                    { ...food, householdId, typeId: id },
                    {
                      onSettled: resolve,
                      onSuccess: () => {
                        queryClient.invalidateQueries({ queryKey: ["household", "food"] });
                        queryClient.invalidateQueries({ queryKey: ["household", "my-household"] });
                      },
                    },
                  );
                });
              }}
            />
          </DialogContent>
        </Dialog>

        {units.map((entry, index) => (
          <div
            key={entry.id}
            className={cn(
              "flex items-center justify-between px-4 py-2 border-t",
              index % 2 === 0 ? "bg-white" : "bg-muted/20",
            )}>
            <span className="text-sm text-foreground">
              {entry.amount} {unit}
            </span>

            <span
              className={cn(
                "flex items-center gap-1 text-sm",
                expieryIsSoon(entry.expirationDate) ? "text-yellow-500" : "text-muted-foreground",
              )}>
              <Calendar className="w-4 h-4" />
              {entry.expirationDate}
            </span>

            <div className="flex gap-2">
              <button
                className="p-1 rounded hover:bg-muted transition"
                onClick={(open) => setEditingFoodId(open ? entry.id : null)}>
                <Pencil className="w-4 h-4 text-muted-foreground" />
              </button>

              <button
                onClick={() => setShowDeleteConfirmation(entry.id)}
                className="p-1 rounded bg-red-100 hover:bg-red-200 transition"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setShowDeleteConfirmation(entry.id);
                  }
                }}>
                <Trash className="w-4 h-4 text-red-500" />
              </button>

              {showDeleteConfirmation === entry.id && (
                <ConfirmationDialog
                  variant="critical"
                  title="Slett matvare"
                  description={`Er du sikker på at du vil slette ${entry.amount} ${unit} ${name}?`}
                  confirmText="Slett"
                  onConfirm={() => {
                    deleteFood(entry.id, {
                      onSuccess: () => {
                        queryClient.invalidateQueries({ queryKey: ["household", "food"] });
                        queryClient.invalidateQueries({ queryKey: ["household", "my-household"] });
                      },
                    });
                    setShowDeleteConfirmation(null);
                  }}
                  onCancel={() => setShowDeleteConfirmation(null)}
                />
              )}

              <Dialog
                open={moveDialogUnitId === entry.id}
                onOpenChange={(open) => setMoveDialogUnitId(open ? entry.id : null)}>
                <DialogTrigger asChild>
                  <button className="p-1 rounded bg-blue-100 hover:bg-blue-200 transition">
                    <ArrowRightLeft className="w-4 h-4 text-blue-500" />
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Flytt til gruppe</DialogTitle>
                  <MoveToGroupDialog
                    open={moveDialogUnitId === entry.id}
                    onOpenChange={(open) => setMoveDialogUnitId(open ? entry.id : null)}
                    foodId={entry.id}
                    maxAmount={entry.amount}
                    unit={unit}
                  />
                </DialogContent>
              </Dialog>

              <Dialog
                open={editingFoodId === entry.id}
                onOpenChange={(open) => setEditingFoodId(open ? entry.id : null)}>
                <DialogContent>
                  <DialogTitle>Rediger {name.toLowerCase()}</DialogTitle>
                  <EditFoodForm
                    onSubmit={async (food) => {
                      await new Promise((resolve) => {
                        editFood(
                          {
                            ...food,
                            id: entry.id,
                            householdId: householdId,
                            typeId: id,
                          },
                          {
                            onSettled: resolve,
                            onSuccess: () => {
                              queryClient.invalidateQueries({ queryKey: ["household", "food"] });
                              queryClient.invalidateQueries({ queryKey: ["household", "my-household"] });
                              setEditingFoodId(null);
                            },
                          },
                        );
                      });
                    }}
                    defaultValues={{
                      expirationDate: new Date(entry.expirationDate),
                      amount: entry.amount,
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}
