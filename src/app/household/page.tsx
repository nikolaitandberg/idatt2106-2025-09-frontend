"use client";

import { useEffect, useState } from "react";
import { getHousehold } from "@/actions/household";
import { HouseholdResponse } from "@/types/household";
import ProgressBar from "@/components/ui/progressbar";
import Alert from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Home, MapPin, Pencil, ImageIcon } from "lucide-react";
import MemberCard from "@/components/ui/memberCard";
import GroupCard from "@/components/ui/groupCard";
import { Accordion } from "@/components/ui/accordion";
import FoodAccordionItem from "@/components/ui/itemAccordion";

export default function HouseholdPage() {
  const [household, setHousehold] = useState<HouseholdResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const householdId = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHousehold(householdId);
        setHousehold(data);
      } catch (err) {
        setError("Kunne ikke hente husholdningsdata");
      }
    };

    fetchData();
  }, [householdId]);

  return (
    <div className="min-h-screen flex bg-white text-foreground">
      <aside className="w-[400px] bg-white border-r border-border p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            <h1 className="text-xl font-semibold">Husholdningen</h1>
          </div>
          <Pencil className="w-4 h-4 text-muted-foreground" />
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{household?.address ?? "Laster adresse..."}</span>
        </div>

        <hr className="border-border" />

        <div className="space-y-4">
          <h2 className="font-medium">Medlemmer</h2>
          <MemberCard name="Markus Madsbakken" />
          <MemberCard name="Nikolai Tandberg" />
          <MemberCard name="Felix" type="animal" />
          <Button variant="default" className="w-full">
            Legg til eller inviter medlem
          </Button>
        </div>

        <hr className="border-border" />

        <div className="space-y-4">
          <h2 className="font-medium">Grupper</h2>
          <div className="grid grid-cols-2 gap-4">
            <GroupCard name="Gruppe 1" households={5} members={100} />
            <GroupCard name="Gruppe 2" households={2} members={3} />
          </div>
          <Button variant="default" className="w-full">
            Lag ny gruppe
          </Button>
        </div>
      </aside>

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
              <div className="text-sm text-muted-foreground">350 dager til neste vannbytte</div>
              <div className="text-sm font-medium">40 L</div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium">Matvarer</h2>
            <Accordion type="multiple">
              <FoodAccordionItem id="bananer" name="Bananer" totalAmount="2 stk" units={[]} />
              <FoodAccordionItem id="bonner" name="Bønner" totalAmount="2 pk" units={[]} />
            </Accordion>
          </section>
        </div>
      </main>
    </div>
  );
}
