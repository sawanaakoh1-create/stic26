import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VoiceInterface from "@/components/VoiceInterface";

export default function HomePage() {
  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* HERO */}
        <section className="mx-auto w-full max-w-4xl px-5 pt-10 pb-6 text-center sm:pt-14 md:pt-20">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-sky-100/90 sm:text-xs">
            <span aria-hidden className="h-1 w-1 rounded-full bg-sky-300" />
            Candidature STIC&apos;26 · Prototype MVP
          </span>

          <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            Votre <span className="text-gradient">voix</span>,
            <br /> votre monde numérique.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-sm leading-relaxed text-slate-200/80 sm:text-base md:text-lg">
            AfriVoice AI est une infrastructure d&apos;IA vocale pour
            l&apos;Afrique de l&apos;Ouest. Parlez dans votre langue —
            l&apos;IA écoute, comprend et répond, à voix haute.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.18em] text-sky-100/50">
            <span>Voice-first</span>
            <span aria-hidden className="h-1 w-1 rounded-full bg-sky-100/30" />
            <span>Multi-langues</span>
            <span aria-hidden className="h-1 w-1 rounded-full bg-sky-100/30" />
            <span>Inclusion numérique</span>
          </div>
        </section>

        {/* VOICE INTERFACE */}
        <section className="mx-auto w-full max-w-3xl px-4 pb-16 sm:pb-24">
          <VoiceInterface />
        </section>

        {/* PILLARS */}
        <section
          aria-label="Piliers technologiques"
          className="mx-auto w-full max-w-6xl px-5 pb-20"
        >
          <div className="mb-8 flex flex-col items-center text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300/90">
              Architecture
            </p>
            <h2 className="mt-2 max-w-xl text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
              Trois briques, une seule interface humaine&nbsp;: la voix.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
            {[
              {
                title: "ASR",
                subtitle: "Reconnaissance vocale",
                desc: "L'utilisateur parle librement dans sa langue maternelle.",
              },
              {
                title: "NLP",
                subtitle: "Compréhension contextuelle",
                desc: "L'IA comprend l'intention et formule une réponse locale.",
              },
              {
                title: "TTS",
                subtitle: "Synthèse vocale humanisée",
                desc: "La réponse est restituée à voix haute, sans lecture requise.",
              },
            ].map((p) => (
              <div
                key={p.title}
                className="glass rounded-2xl p-5 sm:p-6 transition hover:border-sky-400/40"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-sky-400/10 px-2 py-1 text-[11px] font-semibold tracking-[0.14em] text-sky-200 ring-1 ring-inset ring-sky-400/20">
                    {p.title}
                  </span>
                  <h3 className="text-sm font-semibold text-slate-100 sm:text-base">
                    {p.subtitle}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-200/80">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
