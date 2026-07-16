"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Waveform from "./Waveform";
import ResponseBubble, { type TurnPhase } from "./ResponseBubble";
import { DEMO_TURNS, type DemoTurn } from "@/services/demoScenarios";
import { isSpeechSynthesisSupported, speak, stopSpeaking } from "@/services/speech";

/** État global de la démonstration jouée à l'écran. */
type DemoState = "idle" | "playing" | "done";

/** Historique des tours joués — chacun avec sa phase courante. */
interface PlayedTurn {
  turn: DemoTurn;
  phase: TurnPhase;
}

// ---------------------------------------------------------------
//  Timings (ms) — calibrés pour un rythme naturel de conversation
// ---------------------------------------------------------------
const USER_LISTEN_MS = 1800;
const USER_TYPE_MS = 800;
const AI_THINK_MS = 1400;
const BETWEEN_TURNS_MS = 3200;

/** Compte à rebours (secondes) avant le démarrage automatique de la démo. */
const AUTOSTART_SECONDS = 4;

/**
 * Interface de démonstration interactive AfriVoice AI (MVP STIC'26).
 *
 * Un clic sur « Démarrer la démonstration » (ou l'autostart de 4 s à
 * l'ouverture) enchaîne automatiquement quatre conversations complètes,
 * incarnées par quatre personas :
 *  1. Aïcha  · Wolof   · Agriculture
 *  2. Fanta  · Bambara · Santé
 *  3. Oumar  · Peul    · Agriculture
 *  4. Salif  · Mooré   · Inclusion financière
 *
 * Chaque tour suit un cycle scénarisé :
 *   micro (waveform) → transcription → analyse (typing dots)
 *   → réponse IA affichée + lue à voix haute en français (Web Speech API)
 *   → sous-titre karaoké synchrone (surbrillance mot par mot)
 *
 * Aucun accès micro ni backend requis — le prototype est 100 % offline
 * et se rejoue à l'infini pour la présentation devant jury.
 */
export default function VoiceInterface() {
  const [state, setState] = useState<DemoState>("idle");
  const [played, setPlayed] = useState<PlayedTurn[]>([]);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [spokenChar, setSpokenChar] = useState<{
    turnId: string;
    index: number;
  } | null>(null);
  const [progress, setProgress] = useState(0);
  const [autostartLeft, setAutostartLeft] = useState<number | null>(
    AUTOSTART_SECONDS
  );

  const timers = useRef<number[]>([]);
  const cancelled = useRef(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const autostartInterval = useRef<number | null>(null);
  const hasStartedRef = useRef(false);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  const wait = useCallback((ms: number): Promise<void> => {
    return new Promise((resolve) => {
      const id = window.setTimeout(resolve, ms);
      timers.current.push(id);
    });
  }, []);

  const cancelAutostart = useCallback(() => {
    if (autostartInterval.current !== null) {
      window.clearInterval(autostartInterval.current);
      autostartInterval.current = null;
    }
    setAutostartLeft(null);
  }, []);

  useEffect(() => {
    return () => {
      cancelled.current = true;
      clearTimers();
      stopSpeaking();
      if (autostartInterval.current !== null) {
        window.clearInterval(autostartInterval.current);
      }
    };
  }, [clearTimers]);

  // Auto-scroll doux vers le bas quand un nouveau tour arrive.
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [played]);

  const setTurnPhase = useCallback((turnId: string, phase: TurnPhase) => {
    setPlayed((prev) =>
      prev.map((p) => (p.turn.id === turnId ? { ...p, phase } : p))
    );
  }, []);

  // -----------------------------------------------------------
  //  Joue un tour de conversation complet, phase par phase
  // -----------------------------------------------------------
  const playTurn = useCallback(
    async (turn: DemoTurn): Promise<void> => {
      if (cancelled.current) return;

      setPlayed((prev) => [...prev, { turn, phase: "user-listening" }]);

      await wait(USER_LISTEN_MS);
      if (cancelled.current) return;

      setTurnPhase(turn.id, "user-typed");
      await wait(USER_TYPE_MS);
      if (cancelled.current) return;

      setTurnPhase(turn.id, "ai-thinking");
      await wait(AI_THINK_MS);
      if (cancelled.current) return;

      setTurnPhase(turn.id, "ai-answered");
      if (isSpeechSynthesisSupported()) {
        setSpeakingId(turn.id);
        setSpokenChar({ turnId: turn.id, index: 0 });
        speak({
          text: turn.aiFrenchText,
          lang: "fr-FR",
          onStart: () => {
            setSpeakingId(turn.id);
            setSpokenChar({ turnId: turn.id, index: 0 });
          },
          onBoundary: (charIndex) => {
            setSpokenChar({ turnId: turn.id, index: charIndex });
          },
          onEnd: () => {
            setSpeakingId((current) => (current === turn.id ? null : current));
            setSpokenChar((current) =>
              current?.turnId === turn.id ? null : current
            );
          },
        });
      }

      await wait(BETWEEN_TURNS_MS);
    },
    [wait, setTurnPhase]
  );

  // -----------------------------------------------------------
  //  Lance la démonstration complète
  // -----------------------------------------------------------
  const startDemo = useCallback(async () => {
    cancelAutostart();
    hasStartedRef.current = true;
    clearTimers();
    stopSpeaking();
    cancelled.current = false;

    setPlayed([]);
    setSpeakingId(null);
    setSpokenChar(null);
    setProgress(0);
    setState("playing");

    for (let i = 0; i < DEMO_TURNS.length; i++) {
      if (cancelled.current) break;
      setProgress(i);
      await playTurn(DEMO_TURNS[i]);
    }

    if (!cancelled.current) {
      setProgress(DEMO_TURNS.length);
      setState("done");
    }
  }, [cancelAutostart, clearTimers, playTurn]);

  // -----------------------------------------------------------
  //  Autostart — décompte de 4 s au chargement
  // -----------------------------------------------------------
  useEffect(() => {
    if (hasStartedRef.current || autostartLeft === null) return;

    autostartInterval.current = window.setInterval(() => {
      setAutostartLeft((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          if (autostartInterval.current !== null) {
            window.clearInterval(autostartInterval.current);
            autostartInterval.current = null;
          }
          // Déclenche la démo au tick 0.
          window.setTimeout(() => {
            if (!hasStartedRef.current) void startDemo();
          }, 0);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (autostartInterval.current !== null) {
        window.clearInterval(autostartInterval.current);
        autostartInterval.current = null;
      }
    };
  }, [autostartLeft, startDemo]);

  // -----------------------------------------------------------
  //  Interruption / réinitialisation
  // -----------------------------------------------------------
  const stopDemo = useCallback(() => {
    cancelled.current = true;
    clearTimers();
    stopSpeaking();
    setSpeakingId(null);
    setSpokenChar(null);
    setState(played.length > 0 ? "done" : "idle");
  }, [clearTimers, played.length]);

  const replayAnswer = useCallback((turn: DemoTurn) => {
    if (!isSpeechSynthesisSupported()) return;
    stopSpeaking();
    setSpokenChar({ turnId: turn.id, index: 0 });
    speak({
      text: turn.aiFrenchText,
      lang: "fr-FR",
      onStart: () => {
        setSpeakingId(turn.id);
        setSpokenChar({ turnId: turn.id, index: 0 });
      },
      onBoundary: (charIndex) => {
        setSpokenChar({ turnId: turn.id, index: charIndex });
      },
      onEnd: () => {
        setSpeakingId((current) => (current === turn.id ? null : current));
        setSpokenChar((current) =>
          current?.turnId === turn.id ? null : current
        );
      },
    });
  }, []);

  const activeMicTurn = played.find((p) => p.phase === "user-listening");

  return (
    <div className="glass mx-auto flex flex-col gap-6 rounded-3xl px-4 py-6 sm:px-6 sm:py-8">
      {/* ==================================================== */}
      {/*  BARRE DE CONTRÔLE                                    */}
      {/* ==================================================== */}
      <ControlBar
        state={state}
        progress={progress}
        totalTurns={DEMO_TURNS.length}
        currentPersona={
          state === "playing"
            ? DEMO_TURNS[Math.min(progress, DEMO_TURNS.length - 1)]
            : null
        }
        autostartLeft={autostartLeft}
        onStart={() => void startDemo()}
        onStop={stopDemo}
        onReplay={() => void startDemo()}
        onCancelAutostart={cancelAutostart}
      />

      {/* ==================================================== */}
      {/*  ZONE MICRO                                           */}
      {/* ==================================================== */}
      {state === "playing" && activeMicTurn && (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-sky-400/20 bg-sky-400/[0.03] px-4 py-4 animate-fade-in-up">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-200/90">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-300 opacity-80" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-300" />
            </span>
            <span>
              Écoute · {activeMicTurn.turn.persona.name} parle en{" "}
              {activeMicTurn.turn.languageLabel}
            </span>
          </div>
          <Waveform active bars={28} />
        </div>
      )}

      {/* ==================================================== */}
      {/*  FIL DE CONVERSATION                                  */}
      {/* ==================================================== */}
      {played.length > 0 && (
        <div
          ref={scrollRef}
          className="max-h-[520px] space-y-6 overflow-y-auto pr-1"
          aria-label="Historique de la conversation"
        >
          {played.map(({ turn, phase }) => (
            <ResponseBubble
              key={turn.id}
              turn={turn}
              phase={phase}
              isSpeaking={speakingId === turn.id}
              spokenCharIndex={
                spokenChar?.turnId === turn.id ? spokenChar.index : -1
              }
              onReplay={() => replayAnswer(turn)}
            />
          ))}
        </div>
      )}

      {/* ==================================================== */}
      {/*  ÉTAT INITIAL                                         */}
      {/* ==================================================== */}
      {state === "idle" && <IdlePreview />}
    </div>
  );
}

// ============================================================
//  Barre de contrôle — bouton + progression + autostart
// ============================================================
interface ControlBarProps {
  state: DemoState;
  progress: number;
  totalTurns: number;
  currentPersona: DemoTurn | null;
  autostartLeft: number | null;
  onStart: () => void;
  onStop: () => void;
  onReplay: () => void;
  onCancelAutostart: () => void;
}

function ControlBar({
  state,
  progress,
  totalTurns,
  currentPersona,
  autostartLeft,
  onStart,
  onStop,
  onReplay,
  onCancelAutostart,
}: ControlBarProps) {
  const percent = Math.min(100, Math.round((progress / totalTurns) * 100));

  if (state === "idle") {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <button
          type="button"
          onClick={onStart}
          className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-br from-sky-300 to-sky-500 px-6 py-3.5 text-sm font-semibold text-navy-950 shadow-glow-lg transition hover:scale-[1.02] active:scale-100 sm:text-base"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-navy-950/90 text-sky-300 transition group-hover:bg-navy-950">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden
            >
              <polygon points="6 4 20 12 6 20 6 4" />
            </svg>
          </span>
          Démarrer la démonstration
        </button>

        {autostartLeft !== null && autostartLeft > 0 ? (
          <button
            type="button"
            onClick={onCancelAutostart}
            className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/[0.06] px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-sky-100/90 transition hover:bg-sky-400/[0.12]"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-300 opacity-80" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sky-300" />
            </span>
            Démarrage auto dans {autostartLeft} s · annuler
          </button>
        ) : (
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
            4 langues · 4 secteurs · ~1 minute
          </p>
        )}
      </div>
    );
  }

  if (state === "playing") {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-200/90">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-300 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-300" />
            </span>
            <span>
              Tour {Math.min(progress + 1, totalTurns)} / {totalTurns}
              {currentPersona
                ? ` · ${currentPersona.languageLabel} · ${currentPersona.sector}`
                : ""}
            </span>
          </div>
          <button
            type="button"
            onClick={onStop}
            className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-[11px] font-medium text-slate-200 transition hover:border-red-300/40 hover:bg-red-400/10 hover:text-red-100"
          >
            Arrêter
          </button>
        </div>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.05]"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-300 to-sky-500 transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="rounded-full bg-sky-400/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-200 ring-1 ring-inset ring-sky-400/25">
        Démonstration terminée · 4 langues restituées
      </div>
      <button
        type="button"
        onClick={onReplay}
        className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-br from-sky-300 to-sky-500 px-5 py-3 text-sm font-semibold text-navy-950 shadow-glow transition hover:scale-[1.02] active:scale-100"
      >
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
          <path d="M3 12a9 9 0 1 0 3-6.7" />
          <polyline points="3 4 3 10 9 10" />
        </svg>
        Rejouer la démonstration
      </button>
    </div>
  );
}

// ============================================================
//  Aperçu initial — les 4 personas alignés en cartes
// ============================================================
function IdlePreview() {
  return (
    <div>
      <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-300/90">
        Au programme de la démonstration
      </p>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {DEMO_TURNS.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3"
          >
            <span
              aria-hidden
              className="grid h-9 w-9 flex-none place-items-center rounded-full bg-gradient-to-br from-navy-700 to-navy-900 text-[11px] font-semibold text-sky-200"
            >
              {t.persona.initials}
            </span>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-medium text-slate-100">
                {t.persona.name}
                <span className="ml-1 text-[11px] font-normal text-slate-400">
                  · {t.languageLabel}
                </span>
              </p>
              <p className="truncate text-[11px] text-slate-400">
                {t.sector} · {t.persona.location}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
