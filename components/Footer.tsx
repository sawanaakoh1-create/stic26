import Link from "next/link";

const FOOTER_LINKS: {
  title: string;
  links: { href: string; label: string }[];
}[] = [
  {
    title: "Produit",
    links: [
      { href: "/", label: "Démo vocale" },
      { href: "/solution", label: "Solution" },
      { href: "/technologie", label: "Technologie" },
    ],
  },
  {
    title: "Projet",
    links: [
      { href: "/impact", label: "Impact" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative z-10 mt-4 border-t border-white/5">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-10 sm:grid-cols-2 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-sky-300 to-sky-500 text-navy-950 shadow-glow"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden
              >
                <path d="M12 3v18" />
                <path d="M7 7v10" />
                <path d="M17 7v10" />
                <path d="M2 11v2" />
                <path d="M22 11v2" />
              </svg>
            </span>
            <p className="text-base font-semibold text-slate-100">
              AfriVoice <span className="text-sky-300">AI</span>
            </p>
          </div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
            Une infrastructure d&apos;IA vocale pour l&apos;inclusion numérique
            en Afrique de l&apos;Ouest. Parler devient un droit numérique.
          </p>
          <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-slate-500">
            Candidature STIC&apos;26
          </p>
        </div>

        {FOOTER_LINKS.map((col) => (
          <div key={col.title}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300/80">
              {col.title}
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="transition hover:text-sky-300"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-5 py-5 text-xs text-slate-400 sm:flex-row sm:text-sm">
          <p>
            © {new Date().getFullYear()} AfriVoice AI · Tous droits réservés
          </p>
          <p className="text-slate-500">
            Fondatrice & Lead Dev IA — AKOH N&apos;DJARMA M. Sawanatou
          </p>
        </div>
      </div>
    </footer>
  );
}
