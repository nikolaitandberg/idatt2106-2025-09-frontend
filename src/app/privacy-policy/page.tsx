export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 text-base leading-7 text-foreground space-y-6">
      <h1 className="text-3xl font-bold">Personvernerklæring</h1>

      <p>
        Krisefikser.no tar personvernet ditt på alvor. Denne erklæringen forklarer hvordan vi samler inn, bruker og
        beskytter dine data, både som innlogget og ikke-innlogget bruker.
      </p>

      <h2 className="text-xl font-semibold">1. Hvilke data samler vi inn?</h2>
      <ul className="list-disc list-inside space-y-1">
        <li>E-post og navn ved registrering av bruker.</li>
        <li>Husstandsinformasjon (antall personer, deltakere og lokasjon).</li>
        <li>Gruppeinformasjon (antall medlemmer i gruppe, antall deltakere og delt mat)</li>
        <li>Beredskapsdata du legger inn (f.eks. vann, mat, utstyr).</li>
        <li>Frivillig stedsdata dersom du aktiverer stedsdeling.</li>
      </ul>

      <h2 className="text-xl font-semibold">2. Hvordan bruker vi informasjonen?</h2>
      <ul className="list-disc list-inside space-y-1">
        <li>For å gi deg oversikt over din husstands beredskap.</li>
        <li>For å sende varsler om utløpsdatoer og kriser i nærområdet.</li>
        <li>For å forbedre tjenesten gjennom anonym statistikk.</li>
      </ul>

      <h2 className="text-xl font-semibold">3. Dine rettigheter</h2>
      <p>
        Du kan når som helst be om innsyn i, endring eller sletting av dine data. Du kan også deaktivere stedsdeling og
        endre informasjon i instillingene dine.
      </p>

      <h2 className="text-xl font-semibold">4. Lagring og sikkerhet</h2>
      <p>
        All informasjon lagres sikkert i henhold til gjeldende krav. Vi følger retningslinjene fra NTNU og OWASP for
        sikkerhet og bruker autentisering og autorisering for å beskytte dine data.
      </p>

      <h2 className="text-xl font-semibold">5. Informasjonskapsler</h2>
      <p>
        Vi benytter nødvendige informasjonskapsler for å holde deg innlogget og forbedre brukeropplevelsen. Ingen data
        selges videre.
      </p>

      <h2 className="text-xl font-semibold">6. Kontakt</h2>
      <p>
        For spørsmål angående personvern, kontakt teamet bak Krisefikser.no via e-post: <em>kontakt@krisefikser.no</em>.
      </p>

      <p className="text-sm text-muted-foreground">Sist oppdatert: 8. mai 2025</p>
    </main>
  );
}
