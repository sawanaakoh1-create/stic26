"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Liens du menu principal — ancres locales vers les sections de la page.
 * L'ordre reflète le parcours narratif du pitch : démo → tech → chiffres → équipe.
 */
const NAV_LINKS: Array<{ href: string; label: string }> = [
  { href: "#demo", label: "Démo" },
  { href: "#architecture", label: "Architecture" },
  { href: "#impact", label: "Impact" },
  { href: "#equipe", label: "Équipe" },
];

/**
 * Header principal — logo + navigation par ancres + badge STIC'26.
 * Sur mobile : le menu se replie derrière un bouton hamburger accessible.
 */
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Ferme le menu à chaque changement d'ancre (clic sur un lien).
  useEffect(() => {
    if (!menuOpen) return;
    const closeOnHash = () => setMenuOpen(false);
    window.addEventListener("hashchange", closeOnHash);
    return () => window.removeEventListener("hashchange", closeOnHash);
  }, [menuOpen]);

  // Verrouille le scroll du body quand le menu mobile est ouvert.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="relative z-30 mx-auto w-full max-w-6xl px-5 py-4 sm:py-6">
      <div className="flex items-center justify-between gap-3">
        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center gap-2.5"
          aria-label="AfriVoice AI — accueil"
          onClick={() => setMenuOpen(false)}
        >
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
            >
              <path d="M12 3v18" />
              <path d="M7 7v10" />
              <path d="M17 7v10" />
              <path d="M2 11v2" />
              <path d="M22 11v2" />
            </svg>
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-wide text-slate-100 sm:text-base">
              AfriVoice <span className="text-sky-300">AI</span>
            </p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400 sm:text-[11px]">
              Voice-first · Mooré · Burkina Faso
            </p>
          </div>
        </Link>

        {/* NAV DESKTOP */}
        <nav
          aria-label="Navigation principale"
          className="hidden items-center gap-1 md:flex"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1.5 text-[13px] font-medium text-slate-200/85 transition hover:bg-white/[0.06] hover:text-slate-50"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* BADGE + BURGER */}
        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full border border-sky-400/40 bg-sky-400/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-sky-100 sm:inline-flex sm:gap-2 sm:px-3.5 sm:py-1.5 sm:text-xs sm:tracking-[0.18em]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3 w-3 sm:h-3.5 sm:w-3.5"
              aria-hidden
            >
              <circle cx="12" cy="8" r="6" />
              <path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5" />
            </svg>
            STIC&apos;26 · Finaliste
          </span>

          {/* Bouton hamburger — visible < md */}
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setMenuOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-slate-100 transition hover:border-sky-400/40 hover:bg-sky-400/[0.08] md:hidden"
          >
            {menuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* MENU MOBILE — panneau replié sous le header */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="absolute left-0 right-0 top-full z-30 mx-4 mt-2 rounded-2xl border border-white/10 bg-navy-900/95 p-3 shadow-glow backdrop-blur-lg md:hidden"
        >
          <nav aria-label="Navigation mobile" className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-3 text-[15px] font-medium text-slate-100 transition hover:bg-sky-400/10 hover:text-slate-50"
              >
                {link.label}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-sky-300"
                  aria-hidden
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </a>
            ))}

            <span className="mt-2 inline-flex items-center gap-2 self-start rounded-full border border-sky-400/40 bg-sky-400/10 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-sky-100 sm:hidden">
              STIC&apos;26 · Finaliste
            </span>
          </nav>
        </div>
      )}
    </header>
  );
}
