import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VoiceInterface from "@/components/VoiceInterface";
import ImpactStats from "@/components/ImpactStats";
import FounderSection from "@/components/FounderSection";

export default function HomePage() {
  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* HERO */}
        <section className="mx-auto w-full max-w-4xl px-5 pt-6 pb-4 text-center sm:pt-14 sm:pb-6 md:pt-20">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-sky-100/90 sm:mb-6 sm:text-xs sm:tracking-[0.18em]">
            <span aria-hidden className="h-1 w-1 rounded-full bg-sky-300" />
            STIC&apos;26 · MVP Phase 1 · Mooré
          </span>

          <h1 className="text-balance text-[2rem] font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            Parlez <span className="text-gradient">Mooré</span>,
            <br /> entrez dans le numérique.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-pretty text-[13px] leading-relaxed text-slate-200/80 sm:mt-6 sm:text-base md:text-lg">
            AfriVoice AI est un assistant vocal IA qui écoute le Mooré,
            comprend l&apos;intention, et répond à voix haute. Aucune
            lecture, aucun clavier — juste la voix.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[10px] uppercase tracking-[0.14em] text-sky-100/60 sm:mt-7 sm:gap-x-6 sm:text-[11px] sm:tracking-[0.18em]">
            <span>Voice-first</span>
            <span aria-hidden className="h-1 w-1 rounded-full bg-sky-100/30" />
            <span>Mooré · 8 M locuteurs</span>
            <span aria-hidden className="h-1 w-1 rounded-full bg-sky-100/30" />
            <span>Inclusion numérique</span>
          </div>
        </section>

        {/* VOICE INTERFACE */}
        <section
          id="demo"
          className="mx-auto w-full max-w-3xl scroll-mt-24 px-3 pb-14 sm:px-4 sm:pb-24"
        >
          <VoiceInterface />
        </section>

        {/* PILLARS */}
        <section
          id="architecture"
          aria-label="Piliers technologiques"
          className="mx-auto w-full max-w-6xl scroll-mt-24 px-5 pb-16 sm:pb-20"
        >
          <div className="mb-6 flex flex-col items-center text-center sm:mb-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-300/90 sm:text-[11px] sm:tracking-[0.18em]">
              Architecture
            </p>
            <h2 className="mt-2 max-w-xl text-xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
              Trois briques, une seule interface humaine&nbsp;: la voix.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-6">
            {[
              {
                title: "ASR",
                subtitle: "Reconnaissance vocale",
                desc: "L'utilisateur parle librement en Mooré, sans lecture ni clavier.",
              },
              {
                title: "NLP",
                subtitle: "Compréhension contextuelle",
                desc: "L'IA saisit l'intention et formule une réponse adaptée au contexte local.",
              },
              {
                title: "TTS",
                subtitle: "Synthèse vocale humanisée",
                desc: "La réponse est restituée à voix haute, accessible à tous.",
              },
            ].map((p) => (
              <div
                key={p.title}
                className="glass rounded-2xl p-4 sm:p-6 transition hover:border-sky-400/40"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-sky-400/10 px-2 py-1 text-[11px] font-semibold tracking-[0.14em] text-sky-200 ring-1 ring-inset ring-sky-400/20">
                    {p.title}
                  </span>
                  <h3 className="text-sm font-semibold text-slate-100 sm:text-base">
                    {p.subtitle}
                  </h3>
                </div>
                <p className="mt-2.5 text-[13px] leading-relaxed text-slate-200/80 sm:mt-3 sm:text-sm">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* IMPACT — chiffres animés */}
        <div id="impact" className="scroll-mt-24">
          <ImpactStats />
        </div>

        {/* FONDATRICE */}
        <div id="equipe" className="scroll-mt-24">
          <FounderSection />
        </div>
      </main>

      <Footer />
    </div>
  );
}
