"use client";

import { useState } from "react";
import { useInfoPages } from "@/actions/learning";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import EditScenarioForm from "@/components/admin/editScenarioForm";

export default function ScenarioList() {
  const { data: scenarios, isLoading, error } = useInfoPages();
  const [openDialogId, setOpenDialogId] = useState<number | null>(null);

  if (isLoading) return <p>Laster scenarioer...</p>;
  if (error) return <p className="text-red-500">Kunne ikke hente scenarioer</p>;

  return (
    <ul className="space-y-4">
      {scenarios?.map((scenario) => (
        <li key={scenario.id} className="border p-4 rounded shadow-sm flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold">{scenario.title}</h2>
            <p className="text-gray-600">{scenario.shortDescription}</p>
          </div>

          <Dialog
            open={openDialogId === scenario.id}
            onOpenChange={(open) => setOpenDialogId(open ? scenario.id : null)}>
            <DialogTrigger asChild>
              <Button variant="outline" className="ml-4 mt-1 flex items-center gap-2 whitespace-nowrap">
                <Pencil size={16} strokeWidth={1.5} />
                Rediger
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogTitle>Rediger scenario</DialogTitle>
              <EditScenarioForm scenario={scenario} onClose={() => setOpenDialogId(null)} />
            </DialogContent>
          </Dialog>
        </li>
      ))}
    </ul>
  );
}
