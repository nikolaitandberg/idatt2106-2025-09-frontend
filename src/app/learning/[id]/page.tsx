"use client";

import { useParams, useRouter } from "next/navigation";
import { useInfoPageById } from "@/actions/learning";
import { Button } from "@/components/ui/button";
import MarkdownRenderer from "@/components/ui/markdownRenderer";

export default function ScenarioPage() {
  const params = useParams();
  const id = parseInt(params.id as string, 10);
  const router = useRouter();

  const { data: infoPage, isLoading, isError } = useInfoPageById(id);

  if (isLoading) return <div>Laster scenario...</div>;
  if (isError || !infoPage) return <div>Scenario ikke funnet.</div>;

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-10 flex justify-center">
      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-left">{infoPage.title}</h1>
          <Button variant="default" size="lg" onClick={() => router.push(`/learning/${id}/quiz`)}>
            Ta Quiz
          </Button>
        </div>

        <hr className="border-border mb-6" />

        <div className="prose max-w-none text-left">
          <MarkdownRenderer content={infoPage.content} />
        </div>
      </div>
    </div>
  );
}
