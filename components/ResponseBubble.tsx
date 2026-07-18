"use client";

import { useMemo } from "react";
import type { ScenarioTurn } from "@/services/demoScenarios";

/** Étape courante d'un tour joué à l'écran. */
export type TurnPhase = "user-listening" | "user-typed" | "ai-thinking" | "ai-answered";

interface ConversationBubbleProps {
  turn: ScenarioTurn;
  phase: TurnPhase;
  /** Indique si la voix française du navigateur lit actuellement la réponse. */
  isSpeaking: boolean;
  /**
   * Index du caractère actuellement prononcé par le TTS (dans `aiFrenchText`).
   * Utilisé pour surligner le mot en cours (effet karaoké).
   * `-1` = pas de surbrillance.
   */
  spokenCharIndex: number;
  /** Rejouer la réponse via la Web Speech API. */
  onReplay: () => void;
}

/**
 * Bulle de conversation double : côté utilisateur (droite) puis côté IA
 * (gauche), dévoilées progressivement selon la phase courante.
 * Pendant la lecture TTS, chaque mot français s'illumine en synchro
 * avec la voix (effet karaoké via `SpeechSynthesisUtterance.onboundary`).
 */
export default function ResponseBubble({
  turn,
  phase,
  isSpeaking,
  spokenCharIndex,
  onReplay,
}: ConversationBubbleProps) {
  const showUser = phase !== "user-listening";
  const showAi = phase === "ai-answered";
  const aiThinking = phase === "ai-thinking";

  return (
    <div className="flex flex-col gap-3">
      {/* ------------------------------------------------------------------ */}
      {/* BULLE UTILISATEUR (droite)                                          */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex items-end justify-end gap-2 sm:gap-2.5">
        <article
          className={`glass max-w-[calc(100%-2.75rem)] rounded-2xl rounded-br-md border-sky-400/25 bg-sky-400/[0.05] p-3.5 sm:max-w-[85%] sm:p-4 ${
            showUser ? "animate-fade-in-up" : "opacity-0"
          }`}
          aria-live="polite"
        >
          <header className="flex flex-wrap items-center justify-between gap-2">
            <div className="leading-tight">
              <p className="text-xs font-semibold text-slate-100">
                {turn.persona.name}
                <span className="ml-1 font-normal text-slate-400">
                  · {turn.persona.role}
                </span>
              </p>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                {turn.persona.location} · {turn.languageLabel}
              </p>
            </div>
          </header>

          {showUser ? (
            <>
              <p className="mt-2.5 text-[13px] font-medium leading-relaxed text-slate-50 sm:text-[15px]">
                « {turn.userLocalText} »
              </p>
              <p className="mt-1 text-[11px] italic leading-relaxed text-slate-400 sm:text-[12px]">
                {turn.userFrenchText}
              </p>
            </>
          ) : (
            <p className="mt-2 text-xs text-slate-400">…</p>
          )}
        </article>

        <span
          aria-hidden
          className="grid h-9 w-9 flex-none place-items-center rounded-full border border-white/10 bg-gradient-to-br from-navy-700 to-navy-900 text-[11px] font-semibold text-sky-200"
        >
          {turn.persona.initials}
        </span>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* BULLE IA (gauche) — apparition différée                             */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex items-start gap-2 sm:gap-2.5">
        <span
          aria-hidden
          className="grid h-9 w-9 flex-none place-items-center rounded-full bg-gradient-to-br from-sky-300 to-sky-500 text-navy-950 shadow-glow"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M12 3v18" />
            <path d="M7 7v10" />
            <path d="M17 7v10" />
            <path d="M2 11v2" />
            <path d="M22 11v2" />
          </svg>
        </span>

        {aiThinking && (
          <div
            className="glass flex max-w-[85%] items-center gap-1.5 rounded-2xl rounded-tl-md px-4 py-3"
            role="status"
            aria-label="AfriVoice AI réfléchit"
          >
            <TypingDot delay="0s" />
            <TypingDot delay="0.15s" />
            <TypingDot delay="0.3s" />
            <span className="ml-1 text-[11px] uppercase tracking-wider text-sky-200/80">
              AfriVoice AI analyse…
            </span>
          </div>
        )}

        {showAi && (
          <article
            className="glass max-w-[calc(100%-2.75rem)] animate-fade-in-up rounded-2xl rounded-tl-md p-3.5 shadow-glow sm:max-w-[90%] sm:p-4"
            aria-live="polite"
          >
            <header className="flex flex-wrap items-center justify-between gap-3">
              <div className="leading-tight">
                <p className="text-sm font-semibold text-slate-100">
                  AfriVoice AI
                </p>
                <p className="text-[10px] uppercase tracking-wider text-sky-300/80">
                  Réponse en {turn.languageLabel} · {turn.sector}
                </p>
              </div>

              <button
                type="button"
                onClick={onReplay}
                disabled={isSpeaking}
                className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-400/10 px-3 py-1.5 text-[11px] font-medium text-sky-100 transition hover:bg-sky-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label={
                  isSpeaking ? "Lecture en cours" : "Réécouter la réponse"
                }
              >
                {isSpeaking ? (
                  <>
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-300 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-300" />
                    </span>
                    Lecture…
                  </>
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
                      className="h-3 w-3"
                      aria-hidden
                    >
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    Réécouter
                  </>
                )}
              </button>
            </header>

            {/* Réponse locale — mise en valeur */}
            <div className="mt-3 rounded-xl border border-sky-400/20 bg-sky-400/[0.06] p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-sky-300/80">
                Réponse vocale · {turn.languageLabel}
              </p>
              <p className="mt-1.5 text-[14px] font-medium leading-relaxed text-slate-50 sm:text-base">
                « {turn.aiLocalText} »
              </p>
            </div>

            {/* Traduction française — sous-titre karaoké synchronisé au TTS */}
            <div className="mt-2 rounded-xl border border-white/5 bg-white/[0.02] p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Traduction française
              </p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed sm:text-sm">
                <KaraokeText
                  text={turn.aiFrenchText}
                  spokenCharIndex={isSpeaking ? spokenCharIndex : -1}
                />
              </p>
            </div>
          </article>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
//  Sous-titre karaoké — surligne le mot en cours de lecture
// ---------------------------------------------------------------
interface KaraokeTextProps {
  text: string;
  spokenCharIndex: number;
}

function KaraokeText({ text, spokenCharIndex }: KaraokeTextProps) {
  // Découpe le texte en tokens (mots + espaces/ponctuation) tout en gardant
  // les offsets de caractères pour comparer à `spokenCharIndex`.
  const tokens = useMemo(() => {
    const parts: Array<{ text: string; start: number; end: number; word: boolean }> = [];
    const regex = /\S+|\s+/g;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      parts.push({
        text: match[0],
        start: match.index,
        end: match.index + match[0].length,
        word: /\S/.test(match[0]),
      });
    }
    return parts;
  }, [text]);

  if (spokenCharIndex < 0) {
    return <span className="text-slate-200">{text}</span>;
  }

  return (
    <>
      {tokens.map((t, i) => {
        const active = t.word && spokenCharIndex >= t.start && spokenCharIndex < t.end;
        const spoken = t.word && spokenCharIndex >= t.end;
        return (
          <span
            key={i}
            className={
              active
                ? "rounded bg-sky-400/30 px-0.5 text-sky-50 transition-colors duration-150"
                : spoken
                  ? "text-slate-100 transition-colors duration-150"
                  : "text-slate-400 transition-colors duration-150"
            }
          >
            {t.text}
          </span>
        );
      })}
    </>
  );
}

// ---------------------------------------------------------------
//  Point animé — indicateur "l'IA écrit"
// ---------------------------------------------------------------
function TypingDot({ delay }: { delay: string }) {
  return (
    <span className="relative flex h-2 w-2">
      <span
        className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-300 opacity-70"
        style={{ animationDelay: delay }}
      />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-300" />
    </span>
  );
}
