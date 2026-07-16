"use client";

import type { AfriVoiceResponse } from "@/services/afrivoiceClient";

interface ResponseBubbleProps {
  response: AfriVoiceResponse;
  /** Indique si le TTS navigateur est en train de lire la réponse. */
  isSpeaking: boolean;
  /** Rejoue la traduction française via la Web Speech API. */
  onReplay: () => void;
}

/**
 * Bulle de réponse conversationnelle. Affiche la réponse en langue locale,
 * sa traduction française, et un bouton de relecture (TTS navigateur).
 */
export default function ResponseBubble({
  response,
  isSpeaking,
  onReplay,
}: ResponseBubbleProps) {
  return (
    <article
      className="glass animate-fade-in-up rounded-3xl p-5 sm:p-6 shadow-glow"
      aria-live="polite"
    >
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-sky-300 to-sky-500 text-navy-950">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden
            >
              <path d="M12 3a4 4 0 0 0-4 4v6a4 4 0 0 0 8 0V7a4 4 0 0 0-4-4z" />
              <path d="M5 11a7 7 0 0 0 14 0" />
              <path d="M12 18v3" />
            </svg>
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-100">AfriVoice AI</p>
            <p className="text-[11px] uppercase tracking-wider text-sky-300/80">
              {response.languageLabel} · {response.sector}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onReplay}
          className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-400/10 px-3.5 py-1.5 text-xs font-medium text-sky-100 transition hover:bg-sky-400/20 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label={
            isSpeaking ? "Lecture en cours" : "Réécouter la réponse"
          }
          disabled={isSpeaking}
        >
          {isSpeaking ? (
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-300 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-300" />
              </span>
              Lecture…
            </span>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5"
                aria-hidden
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Réécouter
            </>
          )}
        </button>
      </header>

      <div className="mt-4 space-y-3">
        {/* Réponse en langue locale — mise en valeur */}
        <div className="rounded-2xl border border-sky-400/20 bg-sky-400/[0.06] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-sky-300/80">
            Réponse en {response.languageLabel}
          </p>
          <p className="mt-2 text-base font-medium leading-relaxed text-slate-50 sm:text-lg">
            « {response.localText} »
          </p>
        </div>

        {/* Traduction française — support */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Traduction française
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-200 sm:text-base">
            {response.frenchText}
          </p>
        </div>
      </div>
    </article>
  );
}
