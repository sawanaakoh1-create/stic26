/**
 * Bloc « À propos de la fondatrice » — humanise le projet devant le jury.
 * Placé juste avant le footer sur la page d'accueil.
 */
export default function FounderSection() {
  return (
    <section
      aria-label="À propos de la fondatrice"
      className="mx-auto w-full max-w-4xl px-5 py-14"
    >
      <div className="glass rounded-3xl p-6 sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300/90">
          À propos
        </p>

        <div className="mt-4 flex flex-col items-center gap-5 sm:flex-row sm:items-start sm:gap-6">
          {/* Avatar aux initiales — remplaçable par une vraie photo <Image /> */}
          <div
            aria-hidden
            className="grid h-20 w-20 flex-none place-items-center rounded-full bg-gradient-to-br from-sky-300 to-sky-500 text-2xl font-semibold text-navy-950 shadow-glow"
          >
            AS
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-semibold tracking-tight text-slate-100 sm:text-2xl">
              AKOH N&apos;DJARMA M. Sawanatou
            </h2>
            <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-sky-300/80">
              Fondatrice · Lead développeuse IA · Lomé, Togo
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-slate-200/85 sm:text-base">
              Informaticienne passionnée par l&apos;inclusion numérique en
              Afrique de l&apos;Ouest, je porte seule aujourd&apos;hui la vision
              d&apos;AfriVoice AI : une infrastructure d&apos;IA vocale pour
              les langues locales. J&apos;ai conçu l&apos;architecture,
              développé ce prototype et rédigé la fiche de candidature
              STIC&apos;26. La suite exige
              <span className="font-semibold text-sky-200"> une équipe experte </span>
              — CTO, expert linguistique et responsable produit — pour
              industrialiser les modèles et finaliser le choix de la
              langue pilote.
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] uppercase tracking-wider text-slate-300 sm:text-[11px]">
                Candidature STIC&apos;26
              </span>
              <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] uppercase tracking-wider text-slate-300 sm:text-[11px]">
                Vision · Prototype · Recrutement
              </span>
              <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] uppercase tracking-wider text-slate-300 sm:text-[11px]">
                Afrique de l&apos;Ouest
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
