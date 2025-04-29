import { ImageIcon } from "lucide-react";
import Alert from "../ui/alert";
import ProgressBar from "../ui/progressbar";
import { useHouseholdFood } from "@/actions/household";
import { Accordion } from "../ui/accordion";
import FoodAccordionItem from "../ui/itemAccordion";
import { Household } from "@/types/household";

export default function HouseholdFood({ household }: { household: Household }) {
  const { data: householdFood } = useHouseholdFood(household.id);

  if (!householdFood) {
    return <div>laster...</div>;
  }

  return (
    <main className="flex-1 p-8 bg-background">
      <div className="max-w-3xl mx-auto space-y-8">
        <section className="space-y-4">
          <ProgressBar value={45} label="Forberedelsesgrad" />
          <Alert type="warning">
            Du er ikke godt nok forberedt.{" "}
            <a href="household" className="underline underline-offset-2">
              Lær mer om hvordan vi beregner dette
            </a>
          </Alert>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium">Vann</h2>
          <div className="flex justify-between items-center border p-4 rounded shadow-sm bg-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="text-sm">Vann</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {Math.floor(
                (new Date(household.lastWaterChangeDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24),
              )}{" "}
              dager til neste vannbytte
            </div>
            <div className="text-sm font-medium">{household.waterAmountLiters} L</div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium">Matvarer</h2>
          <Accordion type="multiple">
            {householdFood.map((foodType) => (
              <FoodAccordionItem
                householdId={household.id}
                key={foodType.id}
                id={foodType.id}
                name={foodType.name}
                totalAmount={foodType.food.length}
                units={foodType.food}
              />
            ))}
          </Accordion>
        </section>
      </div>
    </main>
  );
}
