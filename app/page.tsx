import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VoiceInterface from "@/components/VoiceInterface";
import ImpactStats from "@/components/ImpactStats";
import FounderSection from "@/components/FounderSection";
import TeamTarget from "@/components/TeamTarget";

export default function HomePage() {
  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* BANDEAU HONNÊTETÉ — prototype de vision */}
        <div
          role="note"
          aria-label="À propos de ce prototype"
          className="mx-auto mt-4 w-full max-w-4xl px-5"
        >
          <div className="flex flex-col gap-1 rounded-2xl border border-amber-400/30 bg-amber-400/[0.06] px-4 py-3 text-center sm:flex-row sm:items-center sm:justify-center sm:gap-3 sm:text-left">
            <span className="inline-flex items-center gap-2 self-center rounded-full border border-amber-300/40 bg-amber-300/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-100">
              Prototype de vision
            </span>
            <p className="text-[12px] leading-relaxed text-amber-50/90 sm:text-[13px]">
              Cet aperçu illustre l&apos;expérience utilisateur cible d&apos;AfriVoice AI.
              La langue pilote et les modèles IA de production seront finalisés
              avec l&apos;équipe experte à recruter (candidature STIC&apos;26).
            </p>
          </div>
        </div>

        {/* HERO */}
        <section className="mx-auto w-full max-w-4xl px-5 pt-6 pb-4 text-center sm:pt-10 sm:pb-6 md:pt-14">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-sky-100/90 sm:mb-6 sm:text-xs sm:tracking-[0.18em]">
            <span aria-hidden className="h-1 w-1 rounded-full bg-sky-300" />
            STIC&apos;26 · Vision + prototype
          </span>

          <h1 className="text-balance text-[2rem] font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            Parlez <span className="text-gradient">votre langue</span>,
            <br /> entrez dans le numérique.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-pretty text-[13px] leading-relaxed text-slate-200/80 sm:mt-6 sm:text-base md:text-lg">
            AfriVoice AI est une infrastructure d&apos;IA vocale pensée pour
            les langues d&apos;Afrique de l&apos;Ouest. Elle écoute, comprend
            et répond à voix haute — aucune lecture, aucun clavier.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[10px] uppercase tracking-[0.14em] text-sky-100/60 sm:mt-7 sm:gap-x-6 sm:text-[11px] sm:tracking-[0.18em]">
            <span>Voice-first</span>
            <span aria-hidden className="h-1 w-1 rounded-full bg-sky-100/30" />
            <span>Afrique de l&apos;Ouest</span>
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
                desc: "L'utilisateur parle librement dans sa langue locale, sans lecture ni clavier.",
              },
              {
                title: "NLP",
                subtitle: "Compréhension contextuelle",
                desc: "L'IA saisit l'intention et formule une réponse adaptée au contexte ouest-africain.",
              },
              {
                title: "TTS",
                subtitle: "Synthèse vocale humanisée",
                desc: "La réponse est restituée à voix haute, accessible à tous — même non alphabétisés.",
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

        {/* ÉQUIPE CIBLE — 3 profils experts à recruter (fiche §5) */}
        <div id="equipe-cible" className="scroll-mt-24">
          <TeamTarget />
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
