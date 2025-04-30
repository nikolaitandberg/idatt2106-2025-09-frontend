"use client";

import { useInfoPages } from "@/actions/learning";
import ScenarioCard from "@/components/admin/scenarioCard";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminScenario() {
  const { data: scenarios, isLoading, error } = useInfoPages();
  const queryClient = useQueryClient();

  const handleDeleted = () => {
    queryClient.invalidateQueries({ queryKey: ["infoPages"] });
  };

  if (isLoading) return <p>Laster scenarioer...</p>;
  if (error) return <p className="text-red-500">Kunne ikke hente scenarioer</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Scenario</h1>
      <ul className="space-y-4">
        {scenarios?.map((scenario) => (
          <ScenarioCard key={scenario.id} scenario={scenario} onDeleted={handleDeleted} />
        ))}
      </ul>
    </div>
  );
}