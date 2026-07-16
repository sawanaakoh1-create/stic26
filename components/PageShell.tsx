import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface PageShellProps {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
}

/**
 * Squelette partagé pour les pages internes (Solution, Technologie, Impact,
 * Contact). Reprend le style visuel de la home : header, hero centré, contenu,
 * footer.
 */
export default function PageShell({
  eyebrow,
  title,
  intro,
  children,
}: PageShellProps) {
  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-5 pt-10 pb-6 text-center sm:pt-16 md:pt-20">
          {eyebrow && (
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-300 sm:text-xs">
              <span aria-hidden className="h-1 w-1 rounded-full bg-sky-300" />
              {eyebrow}
            </span>
          )}
          <h1 className="max-w-3xl text-balance text-3xl font-semibold leading-[1.08] tracking-tight sm:text-4xl md:text-5xl">
            {title}
          </h1>
          {intro && (
            <p className="mt-6 max-w-2xl text-pretty text-sm leading-relaxed text-slate-300 sm:text-base md:text-lg">
              {intro}
            </p>
          )}
        </section>

        <section className="mx-auto w-full max-w-6xl px-5 pb-20">
          {children}
        </section>
      </main>

      <Footer />
    </div>
  );
}
