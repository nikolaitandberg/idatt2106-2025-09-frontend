"use client";

import { Button } from "@/components/ui/button";

type ScenarioCardProps = {
  title: string;
  content: string;
  onClick: () => void;
};

export default function ScenarioCard({ title, content, onClick }: ScenarioCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md space-y-4 max-w-md">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-sm text-foreground">{content}</p>
      <Button onClick={onClick} variant="default" size="lg">
        Les mer
      </Button>
    </div>
  );
}
