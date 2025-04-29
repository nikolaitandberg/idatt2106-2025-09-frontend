"use client";

import { useParams } from "next/navigation";
import { BookOpen } from "lucide-react";
import { useInfoPageById } from "@/actions/learning";
import ReactMarkdown from "react-markdown";

export default function ScenarioPage() {
  const params = useParams();
  const id = parseInt(params.id as string, 10);
  

  const { data: infoPage, isLoading, isError } = useInfoPageById(id);

  if (isLoading) return <div>Laster scenario...</div>;
  if (isError || !infoPage) return <div>Scenario ikke funnet.</div>;

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-10 flex justify-center">
      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-left">{infoPage.title}</h1>
          <BookOpen className="w-7 h-7 text-foreground" />
        </div>

        <hr className="border-border mb-6" />

        <div className="prose max-w-none text-left">
          <ReactMarkdown>{infoPage.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
