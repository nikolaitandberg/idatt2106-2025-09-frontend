"use client";

import { useState } from "react";
import { InfoPage } from "@/types/learning";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Trash } from "lucide-react";
import EditScenarioForm from "@/components/admin/editScenarioForm";
import { useDeleteScenario } from "@/actions/learning";

interface ScenarioCardProps {
  scenario: InfoPage;
  onDeleted: () => void;
}

export default function ScenarioCard({ scenario, onDeleted }: ScenarioCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: deleteScenario, isPending } = useDeleteScenario();

  const handleDelete = () => {
    const confirmed = confirm("Er du sikker på at du vil slette dette scenariet?");
    if (confirmed) {
      deleteScenario(scenario.id, {
        onSuccess: () => {
          onDeleted();
        },
      });
    }
  };

  return (
    <li className="border p-4 rounded shadow-sm flex justify-between items-start">
      <div>
        <h2 className="text-xl font-semibold">{scenario.title}</h2>
        <p className="text-gray-600">{scenario.shortDescription}</p>
      </div>

      <div className="flex flex-col items-end ml-4 space-y-2 mt-1 w-32">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full flex items-center gap-2 justify-center">
              <Pencil size={16} strokeWidth={1.5} />
              Rediger
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogTitle>Rediger scenario</DialogTitle>
            <EditScenarioForm scenario={scenario} onClose={() => setIsOpen(false)} />
          </DialogContent>
        </Dialog>

        <Button
          variant="destructive"
          className="w-full flex items-center gap-2 justify-center"
          onClick={handleDelete}
          disabled={isPending}
        >
          <Trash size={16} strokeWidth={1.5} />
          Slett
        </Button>
      </div>
    </li>
  );
}