"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/solution", label: "Solution" },
  { href: "/technologie", label: "Technologie" },
  { href: "/impact", label: "Impact" },
] as const;

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Ferme automatiquement le menu mobile lors d'un changement de route.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="relative z-20 mx-auto w-full max-w-6xl px-5 py-5 sm:py-6">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          aria-label="AfriVoice AI — accueil"
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
              Voice-first · Afrique de l&apos;Ouest
            </p>
          </div>
        </Link>

        {/* NAV DESKTOP */}
        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative transition hover:text-sky-300 ${
                isActive(link.href) ? "text-sky-300" : ""
              }`}
              aria-current={isActive(link.href) ? "page" : undefined}
            >
              {link.label}
              {isActive(link.href) && (
                <span
                  aria-hidden
                  className="absolute -bottom-1.5 left-0 h-0.5 w-full rounded-full bg-gradient-to-r from-sky-300 to-sky-500"
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/contact"
            className={`hidden rounded-full border px-3.5 py-1.5 text-xs font-medium transition sm:inline-flex sm:px-4 sm:py-2 sm:text-sm ${
              isActive("/contact")
                ? "border-sky-300/60 bg-sky-400/20 text-sky-50"
                : "border-sky-400/40 bg-sky-400/10 text-sky-100 hover:bg-sky-400/20"
            }`}
          >
            Contact
          </Link>

          {/* BURGER MOBILE */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-100 transition hover:bg-white/10 md:hidden"
          >
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
              {open ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* MENU MOBILE */}
      {open && (
        <div
          id="mobile-menu"
          className="glass mt-4 animate-fade-in-up rounded-2xl p-3 md:hidden"
        >
          <nav className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive(link.href)
                    ? "bg-sky-400/15 text-sky-100"
                    : "text-slate-200 hover:bg-white/5 hover:text-sky-200"
                }`}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className={`mt-1 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive("/contact")
                  ? "bg-sky-400/15 text-sky-100"
                  : "text-slate-200 hover:bg-white/5 hover:text-sky-200"
              }`}
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
