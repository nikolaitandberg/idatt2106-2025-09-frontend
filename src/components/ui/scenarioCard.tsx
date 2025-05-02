import { Button } from "@/components/ui/button";
import { InfoPage } from "@/types/learning";

import Link from "next/link";

type ScenarioCardProps = {
  scenario: InfoPage;
};

export default function ScenarioCard({ scenario }: ScenarioCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold">{scenario.title}</h2>
      <p className="text-sm text-foreground">{scenario.shortDescription}</p>
      <Link href={`/learning/${scenario.id}`}>
        <Button variant="default" size="lg">
          Les mer
        </Button>
      </Link>
    </div>
  );
}

export function ScenarioCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
      <div className="text-xl font-bold animate-pulse bg-skeleton rounded-md w-1/2 h-6" />
      <div className="space-y-2">
        <div className="text-sm text-foreground animate-pulse bg-skeleton rounded-md w-full h-4" />
        <div className="text-sm text-foreground animate-pulse bg-skeleton rounded-md w-1/2 h-4" />
      </div>
      <Button variant="default" size="lg">
        Les mer
      </Button>
    </div>
  );
}
