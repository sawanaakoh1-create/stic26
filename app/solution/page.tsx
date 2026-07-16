import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Solution — AfriVoice AI",
  description:
    "AfriVoice AI : un assistant vocal IA multilingue pour l'inclusion numérique des populations d'Afrique de l'Ouest, quel que soit leur niveau d'alphabétisation.",
};

type IconName = "health" | "agri" | "civic" | "learn";

const USE_CASES: {
  icon: IconName;
  sector: string;
  title: string;
  desc: string;
}[] = [
  {
    icon: "health",
    sector: "Santé",
    title: "Accéder à un conseil médical de base",
    desc: "Poser une question sur un symptôme, obtenir des consignes de prévention ou l'adresse du centre de santé le plus proche — dans sa langue maternelle.",
  },
  {
    icon: "agri",
    sector: "Agriculture",
    title: "Comprendre le marché & la météo",
    desc: "Connaître le prix du kilo au marché du jour, la période de semis ou une alerte météo locale, sans jamais avoir à lire ou écrire.",
  },
  {
    icon: "civic",
    sector: "Services publics",
    title: "Démarches administratives simplifiées",
    desc: "Se renseigner sur une pièce d'identité, un acte de naissance ou une inscription scolaire par simple conversation vocale.",
  },
  {
    icon: "learn",
    sector: "Éducation",
    title: "Apprendre à tout âge",
    desc: "Un compagnon vocal qui explique, reformule et raconte — un pont entre l'oralité africaine et le savoir numérique.",
  },
];

const AUDIENCES = [
  "Populations rurales & péri-urbaines",
  "Personnes en situation d'illettrisme",
  "Aînés & analphabètes fonctionnels",
  "Jeunesse mobile-first",
  "Femmes entrepreneures locales",
  "Agents de santé communautaires",
];

export default function SolutionPage() {
  return (
    <PageShell
      eyebrow="Solution · Voice-first"
      title={
        <>
          Une IA qui vous <span className="text-gradient">écoute</span>,
          <br className="hidden sm:block" /> pas qui vous fait lire.
        </>
      }
      intro="AfriVoice AI transforme la voix en interface universelle. Notre solution permet à toute personne — même non alphabétisée — d'accéder à l'information, aux services et à l'IA générative dans sa langue locale."
    >
      {/* PROBLÈME / RÉPONSE */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="glass rounded-2xl p-6 sm:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300/80">
            Le problème
          </p>
          <h2 className="mt-3 text-xl font-semibold text-slate-100 sm:text-2xl">
            Le numérique parle une langue qui n&apos;est pas la nôtre.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
            En Afrique de l&apos;Ouest, des millions de personnes sont exclues
            du numérique parce que les services sont écrits, en français ou en
            anglais. Résultat : une fracture qui creuse les inégalités
            d&apos;accès à la santé, à l&apos;éducation et à l&apos;économie.
          </p>
        </div>

        <div className="glass rounded-2xl p-6 sm:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300/80">
            Notre réponse
          </p>
          <h2 className="mt-3 text-xl font-semibold text-slate-100 sm:text-2xl">
            Parler devient un droit numérique.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
            AfriVoice AI combine reconnaissance vocale (ASR), compréhension
            contextuelle (NLP) et synthèse vocale (TTS) adaptées aux langues
            africaines. L&apos;utilisateur parle, l&apos;IA répond — en voix, en
            langue locale.
          </p>
        </div>
      </div>

      {/* USE CASES */}
      <div className="mt-14">
        <div className="mb-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300/80">
            Cas d&apos;usage
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-100 sm:text-3xl">
            4 secteurs, un même geste : parler.
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {USE_CASES.map((u) => (
            <div
              key={u.title}
              className="glass rounded-2xl p-6 transition hover:border-sky-400/40"
            >
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sky-400/10 text-sky-200 ring-1 ring-inset ring-sky-400/20">
                  <SectorIcon name={u.icon} />
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300/80">
                    {u.sector}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-slate-100">
                    {u.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    {u.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PUBLICS CIBLES */}
      <div className="mt-14">
        <div className="glass rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-lg">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300/80">
                Pour qui ?
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-100 sm:text-3xl">
                Une solution pensée pour les invisibles du numérique.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                AfriVoice AI est conçu pour toutes celles et ceux que le
                clavier a laissés au bord de la route.
              </p>
            </div>
            <ul className="flex flex-wrap gap-2">
              {AUDIENCES.map((a) => (
                <li
                  key={a}
                  className="rounded-full border border-sky-400/25 bg-sky-400/10 px-3 py-1.5 text-xs font-medium text-sky-100 sm:text-sm"
                >
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-14 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-sky-300 to-sky-500 px-5 py-3 text-sm font-semibold text-navy-950 shadow-glow transition hover:scale-[1.02] active:scale-100 sm:text-base"
        >
          Tester la démo vocale
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden
          >
            <path d="M5 12h14" />
            <path d="M13 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </PageShell>
  );
}

function SectorIcon({ name }: { name: IconName }) {
  const commonProps = {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-5 w-5",
    "aria-hidden": true,
  };

  switch (name) {
    case "health":
      return (
        <svg {...commonProps}>
          <path d="M12 21s-7-4.5-7-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.5-7 11-7 11z" />
          <path d="M12 8v6" />
          <path d="M9 11h6" />
        </svg>
      );
    case "agri":
      return (
        <svg {...commonProps}>
          <path d="M12 21c0-6 3-10 9-11-1 6-4 10-9 11z" />
          <path d="M12 21c0-6-3-10-9-11 1 6 4 10 9 11z" />
          <path d="M12 21V9" />
        </svg>
      );
    case "civic":
      return (
        <svg {...commonProps}>
          <path d="M3 21h18" />
          <path d="M4 21V10l8-5 8 5v11" />
          <path d="M8 21v-7" />
          <path d="M12 21v-7" />
          <path d="M16 21v-7" />
        </svg>
      );
    case "learn":
      return (
        <svg {...commonProps}>
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v14H6.5A2.5 2.5 0 0 0 4 19.5z" />
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20v4H6.5A2.5 2.5 0 0 1 4 18.5z" />
        </svg>
      );
  }
}
