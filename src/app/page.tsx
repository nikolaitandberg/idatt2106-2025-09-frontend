"use client";

import { MapPin, Users, BookOpen } from "lucide-react";
import Image from "next/image";
import FeatureCard from "@/components/ui/featureCard";

export default function HomePage() {
  return (
    <main className="overflow-hidden flex flex-col lg:flex-row">
      <section className="flex-1 p-10 space-y-12">
        <div className="space-y-4">
        <h1 className="text-4xl font-bold" data-testid="page-title">Krisefikser</h1>
          <p className="text-muted-foreground text-m max-w-prose">
            I en hverdag der mange nordmenn opplever at terskelen for å bli krisesikre er for høy, gjør Krisefikser det
            enkelt å planlegge, organisere og vedlikeholde ditt eget beredskapslager – alt samlet på ett sted. I stedet
            for å grave deg gjennom lange DSB-lister, får du med et par tastetrykk full kontroll på husstandens behov.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureCard
            icon={<Users className="w-6 h-6 text-primary" />}
            title="Husholdning"
            description="Administrer mat, utstyr og medlemmer i din egen husholdning."
            href="/household"
          />
          <FeatureCard
            icon={<MapPin className="w-6 h-6 text-primary" />}
            title="Gruppe"
            description="Samarbeid med andre husholdninger for deling av ressurser og bedre beredskap."
            href="/group"
          />
          <FeatureCard
            icon={<BookOpen className="w-6 h-6 text-primary" />}
            title="Læring"
            description="Få tips og ressurser for å øke din beredskapskunnskap før, under og etter en krise."
            href="/learning"
          />
          <FeatureCard
            icon={<MapPin className="w-6 h-6 text-primary" />}
            title="Kart"
            description="Se husholdningens posisjoner, sikre steder og steder hvor det har skjedd en krise."
            href="/map"
          />
        </div>
      </section>

      <aside className="lg:w-1/2 w-full p-10">
        <a href="/map" className="block relative h-[600px] rounded-xl shadow-sm overflow-hidden group">
          <Image src="/kart-hjem.png" alt="Kart" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-300 flex items-center justify-center">
            <span className="text-white text-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Klikk for å se kart
            </span>
          </div>
        </a>
      </aside>
    </main>
  );
}
