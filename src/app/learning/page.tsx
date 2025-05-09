import ScenarioCard from "@/components/ui/scenarioCard";
import { BookOpen } from "lucide-react";
import { getAllInfoPages } from "@/actions/learning";

export default async function LearningPage() {
  const scenarios = await getAllInfoPages();

  return (
    <div className="min-h-screen bg-background text-foreground p-8 space-y-6">
      <div className="flex justify-center items-center gap-3 mb-10">
        <BookOpen className="w-6 h-6 text-foreground" />
        <h1 className="text-2xl font-bold text-foreground">Scenarioer</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 max-w-6xl mx-auto">
        {scenarios.map((scenario) => (
          <ScenarioCard key={scenario.id} scenario={scenario} />
        ))}
        {scenarios.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">Fant ingen læringssider.</p>
          </div>
        )}
      </div>
    </div>
  );
}
