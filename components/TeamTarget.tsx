/**
 * Section « Équipe cible » — met en scène les 3 profils experts à recruter,
 * tels que listés dans la fiche de candidature STIC'26 (§5 Équipe de management).
 * Renforce visuellement le message clé au jury :
 *   « La vision est portée. L'équipe reste à constituer. »
 */

interface Profile {
  /** Numéro affiché dans la pastille. */
  index: string;
  /** Intitulé du poste. */
  title: string;
  /** Sous-titre / spécialité principale. */
  scope: string;
  /** Mission détaillée reprise de la fiche. */
  mission: string;
  /** Couleur d'accent (classes Tailwind). */
  accent: string;
}

const PROFILES: Profile[] = [
  {
    index: "01",
    title: "CTO",
    scope: "DevOps & Infrastructures Big Data",
    mission:
      "Industrialisation du déploiement des modèles IA à grande échelle, sécurité et conformité des données vocales.",
    accent: "from-rose-400/70 to-orange-400/70",
  },
  {
    index: "02",
    title: "Expert Linguistique & Data Manager",
    scope: "Langues d'Afrique de l'Ouest",
    mission:
      "Collecte, structuration et validation éthique des corpus vocaux — pilotage du choix scientifique de la langue pilote.",
    accent: "from-emerald-400/70 to-teal-400/70",
  },
  {
    index: "03",
    title: "Responsable Produit & Commercial",
    scope: "Business Development",
    mission:
      "Acquisition des clients B2B / B2G (ONG, banques, télécoms) et analyse continue des retours pour optimiser l'UX vocale.",
    accent: "from-sky-400/70 to-indigo-400/70",
  },
];

export default function TeamTarget() {
  return (
    <section
      aria-label="Équipe cible — 3 profils experts à recruter"
      className="mx-auto w-full max-w-6xl px-5 py-14 sm:py-16"
    >
      <div className="mb-6 flex flex-col items-center text-center sm:mb-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-300/90 sm:text-[11px] sm:tracking-[0.18em]">
          Équipe cible
        </p>
        <h2 className="mt-2 max-w-2xl text-xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
          La vision est portée. L&apos;équipe reste à constituer.
        </h2>
        <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-slate-300/80 sm:text-sm">
          Aujourd&apos;hui, AfriVoice AI est porté par sa fondatrice seule. Le
          financement STIC&apos;26 doit permettre de recruter les
          <span className="font-semibold text-sky-200"> trois profils experts </span>
          explicitement listés dans la fiche de candidature — condition
          indispensable pour passer du prototype à l&apos;infrastructure de
          production.
        </p>
      </div>

      <ol className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-6">
        {PROFILES.map((p) => (
          <li key={p.index} className="glass relative flex flex-col rounded-2xl p-5 sm:p-6">
            <span
              aria-hidden
              className={`absolute -top-3 left-5 inline-flex h-8 items-center rounded-full bg-gradient-to-r ${p.accent} px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-navy-950 shadow-glow`}
            >
              À recruter · {p.index}
            </span>
            <h3 className="mt-3 text-base font-semibold text-slate-100 sm:text-lg">
              {p.title}
            </h3>
            <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-sky-300/80 sm:text-[12px]">
              {p.scope}
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-slate-200/85 sm:text-sm">
              {p.mission}
            </p>
          </li>
        ))}
      </ol>

      <p className="mt-6 text-center text-[11px] text-slate-500">
        Source : Fiche de candidature AfriVoice AI · STIC&apos;26 · §5 Équipe de
        management.
      </p>
    </section>
  );
}
