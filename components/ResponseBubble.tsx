"use client";

import type { AfriVoiceResponse } from "@/services/afrivoiceClient";

/** Mode de lecture actif — local (Wolof/Mooré…) ou français. */
export type SpeakingMode = "local" | "french" | null;

interface ResponseBubbleProps {
  response: AfriVoiceResponse;
  /** Quel canal audio est en train de jouer (ou `null` si silence). */
  speakingMode: SpeakingMode;
  /** Rejoue la voix en langue locale (Wolof, Mooré…) via TTS HF. */
  onReplayLocal: () => void;
  /** Rejoue la traduction française via la Web Speech API du navigateur. */
  onReplayFrench: () => void;
}

/**
 * Bulle de réponse conversationnelle. Affiche la réponse en langue locale
 * (+ traduction française) et propose **deux** boutons de lecture séparés :
 *   1. « Écouter en {langue locale} » — TTS Hugging Face
 *   2. « Écouter en français »        — Web Speech API du navigateur
 */
export default function ResponseBubble({
  response,
  speakingMode,
  onReplayLocal,
  onReplayFrench,
}: ResponseBubbleProps) {
  const localBusy = speakingMode === "local";
  const frenchBusy = speakingMode === "french";
  const anyBusy = speakingMode !== null;

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
      </header>

      <div className="mt-4 space-y-3">
        {response.transcription && (
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Vous avez dit
              </p>
              {response.asrSource && response.asrSource !== "none" && (
                <span className="rounded-full bg-sky-400/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-sky-200">
                  {response.asrSource === "mms"
                    ? `Écouté en ${response.languageLabel} (MMS)`
                    : response.asrSource === "whisper"
                      ? "Écouté en français (Whisper)"
                      : "Texte saisi"}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm italic leading-relaxed text-slate-200">
              « {response.transcription} »
            </p>
          </div>
        )}

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

      {/* Deux boutons de lecture — langue locale + français */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <ReplayButton
          label={`Écouter en ${response.languageLabel}`}
          busyLabel={`Lecture en ${response.languageLabel}…`}
          busy={localBusy}
          disabled={anyBusy && !localBusy}
          variant="primary"
          onClick={onReplayLocal}
        />
        <ReplayButton
          label="Écouter en français"
          busyLabel="Lecture en français…"
          busy={frenchBusy}
          disabled={anyBusy && !frenchBusy}
          variant="secondary"
          onClick={onReplayFrench}
        />
      </div>

      <footer className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/5 pt-4 text-[11px] uppercase tracking-wider text-slate-400">
        <span className="rounded-full bg-white/5 px-2 py-1">
          ASR · {response.meta?.asrOk ? "OK" : "vide"}
        </span>
        <span className="rounded-full bg-white/5 px-2 py-1">
          TTS · {response.meta?.ttsOk ? "OK" : "off"}
        </span>
        <span className="rounded-full bg-white/5 px-2 py-1">
          {response.languageLabel} · {response.sector}
        </span>
      </footer>

      {response.meta?.warnings && response.meta.warnings.length > 0 && (
        <details className="mt-3 rounded-xl border border-amber-300/20 bg-amber-300/5 p-3 text-[11px] text-amber-100/80">
          <summary className="cursor-pointer font-semibold uppercase tracking-wider text-amber-200/90">
            Diagnostic ({response.meta.warnings.length})
          </summary>
          <ul className="mt-2 space-y-1">
            {response.meta.warnings.map((w, i) => (
              <li key={i} className="font-mono text-[10px] leading-snug">
                • {w}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[10px] text-amber-100/60">
            ASR primaire : {response.meta.asrPrimaryModel} · Fallback :{" "}
            {response.meta.asrFallbackModel} · TTS : {response.meta.ttsModel}
          </p>
        </details>
      )}
    </article>
  );
}

// ---------------------------------------------------------------
//  Petit bouton de lecture — deux variantes stylistiques
// ---------------------------------------------------------------
interface ReplayButtonProps {
  label: string;
  busyLabel: string;
  busy: boolean;
  disabled?: boolean;
  variant: "primary" | "secondary";
  onClick: () => void;
}

function ReplayButton({
  label,
  busyLabel,
  busy,
  disabled,
  variant,
  onClick,
}: ReplayButtonProps) {
  const base =
    "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-40";
  const styles =
    variant === "primary"
      ? "border border-sky-400/40 bg-sky-400/15 text-sky-50 hover:bg-sky-400/25"
      : "border border-white/10 bg-white/[0.04] text-slate-200 hover:bg-white/[0.08]";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles}`}
      aria-label={busy ? busyLabel : label}
      aria-pressed={busy}
    >
      {busy ? (
        <span className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-300 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-300" />
          </span>
          {busyLabel}
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
          {label}
        </>
      )}
    </button>
  );
}
