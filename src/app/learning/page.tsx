"use client";

import ScenarioCard from "@/components/ui/scenarioCard";
import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";
import { useInfoPages } from "@/actions/learning";

export default function LearningPage() {
  const router = useRouter();

  const { data: scenarios = [], isLoading, isError } = useInfoPages();

  const truncateText = (text: string, maxLength = 120) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };


  if (isLoading) return <div>Laster inn...</div>;
  if (isError) return <div>Kunne ikke hente scenarioer</div>;

  return (
    <div className="min-h-screen bg-background text-foreground p-8 space-y-6">
      <div className="flex justify-center items-center gap-3 mb-10">
        <BookOpen className="w-7 h-7 text-foreground" />
        <h1 className="text-3xl font-bold text-foreground">Læring</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {scenarios.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            title={scenario.title}
            content={truncateText(scenario.content)}
            onClick={() => router.push(`/learning/${scenario.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
