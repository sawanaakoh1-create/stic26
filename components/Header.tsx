import Link from "next/link";

export default function Header() {
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
              Voice-first · Mooré · Burkina Faso
            </p>
          </div>
        </Link>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/40 bg-sky-400/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-sky-100 sm:gap-2 sm:px-3.5 sm:py-1.5 sm:text-xs sm:tracking-[0.18em]">
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
      </div>
    </header>
  );
}
