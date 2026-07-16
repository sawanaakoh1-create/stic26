"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Waveform from "./Waveform";
import ResponseBubble from "./ResponseBubble";
import {
  requestVoiceResponse,
  type AfriVoiceResponse,
} from "@/services/afrivoiceClient";
import { isSpeechSynthesisSupported, speak, stopSpeaking } from "@/services/speech";

type UIState = "idle" | "listening" | "loading" | "answered";

const LISTEN_DURATION_MS = 2000;
const PROCESSING_DURATION_MS = 2000;

/**
 * Composant central de l'expérience conversationnelle AfriVoice AI (MVP).
 *
 * Cycle purement mocké — aucun accès micro, aucun backend requis :
 *   idle → listening (2 s, waveform animé)
 *        → loading  (2 s, shimmer)
 *        → answered (bulle + lecture TTS français via Web Speech API)
 *
 * Ce prototype démontre le parcours utilisateur voice-first sans dépendre
 * d'un pipeline ASR/TTS distant. Il est prêt à être branché sur le backend
 * FastAPI via `services/afrivoiceClient.ts`.
 */
export default function VoiceInterface() {
  const [state, setState] = useState<UIState>("idle");
  const [response, setResponse] = useState<AfriVoiceResponse | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [turnIndex, setTurnIndex] = useState(0);

  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  useEffect(() => {
    return () => {
      clearTimers();
      stopSpeaking();
    };
  }, [clearTimers]);

  const playResponse = useCallback((r: AfriVoiceResponse) => {
    if (!isSpeechSynthesisSupported()) return;
    speak({
      // On lit la traduction française : voix propre et intelligible sur
      // tous les navigateurs, en attendant le vrai TTS AfriVoice AI.
      text: r.frenchText,
      lang: "fr-FR",
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
    });
  }, []);

  const runCycle = useCallback(async () => {
    clearTimers();
    stopSpeaking();
    setIsSpeaking(false);

    setState("listening");

    await new Promise<void>((resolve) => {
      const id = window.setTimeout(resolve, LISTEN_DURATION_MS);
      timers.current.push(id);
    });

    setState("loading");
    const [nextResponse] = await Promise.all([
      requestVoiceResponse({}, turnIndex),
      new Promise<void>((resolve) => {
        const id = window.setTimeout(resolve, PROCESSING_DURATION_MS);
        timers.current.push(id);
      }),
    ]);

    setResponse(nextResponse);
    setState("answered");
    setTurnIndex((i) => i + 1);
    playResponse(nextResponse);
  }, [turnIndex, playResponse, clearTimers]);

  const handleReplay = useCallback(() => {
    if (!response) return;
    playResponse(response);
  }, [response, playResponse]);

  const primaryLabel =
    state === "listening"
      ? "Écoute en cours…"
      : state === "loading"
        ? "Analyse IA…"
        : state === "answered"
          ? "Reparler"
          : "Parler";

  const primaryDisabled = state === "listening" || state === "loading";

  return (
    <div className="glass mx-auto flex flex-col items-center gap-6 rounded-3xl px-5 py-8 sm:px-8 sm:py-10">
      {/* BOUTON CENTRAL */}
      <div className="relative flex flex-col items-center">
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-0 -z-10 rounded-full ${
            state === "listening"
              ? "animate-pulse-ring bg-sky-400/30"
              : "opacity-0"
          }`}
        />
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-0 -z-10 rounded-full ${
            state === "listening"
              ? "animate-pulse-ring bg-sky-300/20 [animation-delay:0.6s]"
              : "opacity-0"
          }`}
        />

        <button
          type="button"
          onClick={() => void runCycle()}
          disabled={primaryDisabled}
          aria-label={primaryLabel}
          aria-pressed={state === "listening"}
          className={`group relative grid h-28 w-28 place-items-center rounded-full shadow-glow-lg outline-none transition-all duration-300 sm:h-32 sm:w-32
            focus-visible:ring-4 focus-visible:ring-sky-300/60
            ${
              state === "listening"
                ? "scale-105 bg-gradient-to-br from-sky-300 to-sky-500"
                : state === "loading"
                  ? "bg-gradient-to-br from-navy-700 to-navy-900"
                  : "bg-gradient-to-br from-sky-400 to-sky-500 hover:from-sky-300 hover:to-sky-500 active:scale-95"
            }
            ${primaryDisabled ? "cursor-wait" : "cursor-pointer"}
          `}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`h-10 w-10 text-navy-950 transition-transform duration-300 sm:h-12 sm:w-12 ${
              state === "listening" ? "scale-110" : ""
            }`}
            aria-hidden
          >
            <path d="M12 3a4 4 0 0 0-4 4v6a4 4 0 0 0 8 0V7a4 4 0 0 0-4-4z" />
            <path d="M5 11a7 7 0 0 0 14 0" />
            <path d="M12 18v3" />
            <path d="M8 21h8" />
          </svg>
        </button>

        <p className="mt-4 text-sm font-medium tracking-wide text-slate-200 sm:text-base">
          {primaryLabel}
        </p>
      </div>

      {/* WAVEFORM */}
      <div className="min-h-[80px] w-full max-w-md">
        <Waveform active={state === "listening"} />
      </div>

      {/* LOADER SHIMMER */}
      {state === "loading" && (
        <div
          className="w-full max-w-md space-y-3"
          role="status"
          aria-label="Analyse par l'IA en cours"
        >
          <div className="h-3 w-2/3 rounded-full shimmer" />
          <div className="h-3 w-full rounded-full shimmer" />
          <div className="h-3 w-4/5 rounded-full shimmer" />
        </div>
      )}

      {/* RÉPONSE */}
      {state === "answered" && response && (
        <div className="w-full">
          <ResponseBubble
            response={response}
            isSpeaking={isSpeaking}
            onReplay={handleReplay}
          />
        </div>
      )}

      {/* HINT ACCESSIBILITÉ */}
      <p className="text-center text-xs text-slate-400 sm:text-sm">
        Cliquez sur « Parler » pour lancer une conversation de démonstration.
        <br className="hidden sm:inline" />
        Chaque essai met en avant une langue différente : Wolof, Bambara,
        Peul, Mooré.
      </p>
    </div>
  );
}
