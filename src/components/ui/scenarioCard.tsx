"use client";

import { Button } from "@/components/ui/button";

type ScenarioCardProps = {
  title: string;
  shortDescription: string;
  onClick: () => void;
};

export default function ScenarioCard({ title, shortDescription, onClick }: ScenarioCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-sm text-foreground">{shortDescription}</p>
      <Button onClick={onClick} variant="default" size="lg">
        Les mer
      </Button>
    </div>
  );
}
