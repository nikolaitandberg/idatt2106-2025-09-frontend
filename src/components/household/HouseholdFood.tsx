"use client";

import { Plus, Droplets } from "lucide-react";
import Alert from "../ui/alert";
import ProgressBar from "../ui/progressbar";
import { useAddHouseholdFood, useHouseholdFood } from "@/actions/household";
import { Accordion } from "../ui/accordion";
import FoodAccordionItem from "../ui/itemAccordion";
import { Household } from "@/types/household";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "../ui/dialog";
import PreparednessBreakdown from "./PreparednessBreakdown";
import { useMemo, useState } from "react";
import AddNewFoodForm from "./AddNewFoodForm";
import { useQueryClient } from "@tanstack/react-query";
import HouseholdKits from "./HouseholdKits";
import UpdateWaterForm from "@/components/household/UpdateWaterForm";

export default function HouseholdFood({ household }: Readonly<{ household: Household }>) {
  const { data: householdFood } = useHouseholdFood(household.id);
  const { mutate: updateHouseholdFood } = useAddHouseholdFood();
  const [addNewFoodDialogOpen, setAddNewFoodDialogOpen] = useState(false);
  const [waterDialogOpen, setWaterDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const alertType = useMemo<{ type: "warning" | "info" | "success" | "critical"; message: string }>(() => {
    if (household.levelOfPreparedness.levelOfPreparedness < 0.75) {
      return {
        type: "warning",
        message: "Du er ikke godt nok forberedt.",
      };
    }

    return {
      type: "info",
      message: "Du er godt forberedt.",
    };
  }, [household.levelOfPreparedness]);

  if (!householdFood) {
    return <div>laster...</div>;
  }

  return (
    <main className="flex-1 p-8 bg-background">
      <div className="max-w-3xl mx-auto space-y-8">
        <section className="space-y-4">
          <ProgressBar value={household.levelOfPreparedness.levelOfPreparedness * 100} label="Forberedelsesgrad" />
          <Alert type={alertType.type}>
            {alertType.message}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="text-md p-1 underline" variant="link">
                  Lær mer om hvordan vi beregner dette
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Hvordan beregner vi forberedelsesgrad?</DialogTitle>
                <PreparednessBreakdown household={household} />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button>Lukk</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Alert>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium">Vann</h2>
          <div className="flex justify-between items-center border p-4 rounded shadow-sm bg-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <Droplets className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="text-sm">Vann</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {Math.floor(
                (new Date(household.nextWaterChangeDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24),
              )}{" "}
              dager til neste vannbytte
            </div>
            <div className="text-sm font-medium">{household.waterAmountLiters} L</div>
            <Dialog open={waterDialogOpen} onOpenChange={setWaterDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Endre vannmengde
                  <Plus className="w-4 h-4 ml-1" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Oppdater vannmengde</DialogTitle>
                <UpdateWaterForm household={household} onClose={() => setWaterDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-medium">Utstyr</h2>
            <p className="text-sm text-muted-foreground">Utstyr husholdningen har</p>
          </div>
          <HouseholdKits householdId={household.id} />
        </section>

        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Matvarer</h2>
            <Dialog open={addNewFoodDialogOpen} onOpenChange={setAddNewFoodDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  Legg til ny matvare <Plus strokeWidth={1.25} size={20} />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Legg til ny matvare</DialogTitle>
                <AddNewFoodForm
                  onSubmit={async (e) => {
                    await new Promise((resolve) => {
                      updateHouseholdFood(
                        {
                          householdId: household.id,
                          typeId: e.typeId,
                          amount: e.amount,
                          expirationDate: e.expirationDate,
                        },
                        {
                          onSettled: resolve,
                          onSuccess: () => {
                            queryClient.invalidateQueries({
                              queryKey: ["household", "food"],
                            });
                            queryClient.invalidateQueries({
                              queryKey: ["household", "my-household"],
                            });
                          },
                        },
                      );
                    });
                    setAddNewFoodDialogOpen(false);
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
          <Accordion type="multiple">
            {householdFood.map((foodType) => {
              return (
                <FoodAccordionItem
                  householdId={household.id}
                  key={foodType.typeId}
                  id={foodType.typeId}
                  name={foodType.typeName}
                  totalAmount={foodType.totalAmount}
                  units={foodType.batches}
                />
              );
            })}
          </Accordion>
        </section>
      </div>
    </main>
  );
}
