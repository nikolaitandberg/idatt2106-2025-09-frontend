import { Household } from "@/types/household";
import ProgressBar from "../ui/progressbar";

interface PreparednessBreakdownProps {
  household: Household;
}

export default function PreparednessBreakdown({ household }: PreparednessBreakdownProps) {
  return (
    <div className="flex flex-col gap-4">
      {typeof household.levelOfPreparedness.timePrepared === "number" && (
        <div className="text-sm text-muted-foreground px-2">
          Estimert beredskapstid: {household.levelOfPreparedness.timePrepared} timer
        </div>
      )}

      <ProgressResult
        value={household.levelOfPreparedness.levelOfPreparednessFood * 100}
        label="Mat"
        descrption="Matvarer husstanden din har selv eller har blitt delt med i en gruppe."
      />
      <ProgressResult
        value={household.levelOfPreparedness.levelOfPreparednessKit * 100}
        label="Utstyr"
        descrption="I hvor stor grad husstanden din har av utstyr som er anbefalt i en beredskapssituasjon, som førstehjelpsutstyr og brannlukkingsapparat."
      />
      <ProgressResult
        value={household.levelOfPreparedness.levelOfPreparednessWater * 100}
        label="Vann"
        descrption="Har husstanden nok vann, og er det lenge til neste vannbytte?"
      />
      <ProgressResult value={household.levelOfPreparedness.levelOfPreparedness * 100} label="Totalt" />
    </div>
  );
}

function ProgressResult({ value, label, descrption }: { value: number; label?: string; descrption?: string }) {
  return (
    <div className="flex flex-col justify-between gap-1">
      <div className="flex items-center justify-between px-2">
        <span className="text-md">{label}</span>
        <span className="text-sm font-medium">{value.toFixed(0)}%</span>
      </div>
      <div className="flex items-center justify-between px-2">
        <span className="text-sm text-muted-foreground">{descrption}</span>
      </div>
      <ProgressBar value={value} />
    </div>
  );
}
