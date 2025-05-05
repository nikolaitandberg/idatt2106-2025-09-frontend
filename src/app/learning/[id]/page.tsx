import { getInfoPageById } from "@/actions/learning";
import { Button } from "@/components/ui/button";
import MarkdownRenderer from "@/components/ui/markdownRenderer";
import Link from "next/link";

export default async function ScenarioPage({ params }: { params: Promise<{ id: string }> }) {
  const id = parseInt((await params).id);

  const infoPage = await getInfoPageById(id);

  if (!infoPage) {
    return (
      <div className="min-h-screen bg-background text-foreground px-4 py-10 flex justify-center">
        <div className="w-full max-w-5xl">
          <h1 className="text-3xl font-bold text-left">Scenario ikke funnet</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-10 flex justify-center">
      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-left">{infoPage.title}</h1>
          <Link href={`/learning/${id}/quiz`}>
            <Button variant="default" size="lg">
              Ta Quiz
            </Button>
          </Link>
        </div>

        <hr className="border-border mb-6" />

        <div className="prose max-w-none text-left">
          <MarkdownRenderer content={infoPage.content} />
        </div>
        <div className="flex items-center justify-between mt-12">
          <div className="flex gap-4">
            <Link href={`/learning`}>
              <Button variant="default" size="lg">
                Tilbake til scenarioer
              </Button>
            </Link>
            <Link href={`/learning/${id}/quiz`}>
              <Button variant="default" size="lg">
                Ta Quiz
              </Button>
            </Link>
          </div>
          <div>
            <p className="text-sm text-foreground">
              Opprettet: {new Date(infoPage.createdAt).toLocaleDateString("no-NO")}
            </p>
            <p className="text-sm text-foreground">
              Sist oppdatert: {new Date(infoPage.updatedAt).toLocaleDateString("no-NO")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
