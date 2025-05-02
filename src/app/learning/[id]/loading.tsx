import { Button } from "@/components/ui/button";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-10 flex justify-center">
      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-between mb-4">
          <div className="animate-pulese bg-skeleton rounded-md w-1/2 h-8" />
          <Button variant="default" size="lg">
            Ta Quiz
          </Button>
        </div>

        <hr className="border-border mb-6" />

        <div className="prose max-w-none text-left">
          <div className="space-y-4">
            <div className="animate-pulse bg-skeleton rounded-md h-4 w-full" />
            <div className="animate-pulse bg-skeleton rounded-md h-4 w-5/6" />
            <div className="animate-pulse bg-skeleton rounded-md h-4 w-4/6" />
            <div className="animate-pulse bg-skeleton rounded-md h-4 w-3/4" />
            <hr className="border-border mb-6" />
            <div className="animate-pulse bg-skeleton rounded-md h-4 w-full" />
            <div className="animate-pulse bg-skeleton rounded-md h-4 w-5/6" />
            <div className="animate-pulse bg-skeleton rounded-md h-4 w-4/6" />
          </div>
        </div>
        <div className="flex items-center justify-between mt-12">
          <div className="flex gap-4">
            <Button variant="default" size="lg">
              Tilbake til scenarioer
            </Button>
            <Button variant="default" size="lg">
              Ta Quiz
            </Button>
          </div>
          <div>
            <div className="flex flex-row items-center gap-2">
              <p className="text-sm text-foreground">Opprettet:</p>
              <div className="animate-pulse bg-skeleton rounded-md w-24 h-4" />
            </div>
            <div className="flex flex-row items-center gap-2">
              <p className="text-sm text-foreground">Sist oppdatert:</p>
              <div className="animate-pulse bg-skeleton rounded-md w-24 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
