"use client";

import { useState } from "react";
import { useInfoPages } from "@/actions/learning";
import ScenarioCard from "@/components/admin/scenarioCard";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import CreateScenarioForm from "@/components/admin/createScenarioForm";

export default function AdminScenario() {
  const { data: scenarios, isLoading, error } = useInfoPages();
  const queryClient = useQueryClient();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const handleDeleted = () => {
    queryClient.invalidateQueries({ queryKey: ["infoPages"] });
  };

  const handleCreated = () => {
    queryClient.invalidateQueries({ queryKey: ["infoPages"] });
    setOpenCreateDialog(false);
  };

  if (isLoading) return <p>Laster scenarioer...</p>;
  if (error) return <p className="text-red-500">Kunne ikke hente scenarioer</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold" data-testid="admin-title">
          Scenario
        </h1>

        <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
          <DialogTrigger asChild>
            <Button data-testid="create-scenario">
              <Plus className="mr-2" size={18} />
            </Button>
            <Button>
              Legg til scenario
              <Plus className="ml-2" size={18} />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogTitle>Nytt scenario</DialogTitle>
            <CreateScenarioForm onCreated={handleCreated} />
          </DialogContent>
        </Dialog>
      </div>

      <ul className="space-y-4" data-testid="admin-scenario-list">
        {scenarios?.map((scenario) => <ScenarioCard key={scenario.id} scenario={scenario} onDeleted={handleDeleted} />)}
      </ul>
    </div>
  );
}
