"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Waveform from "./Waveform";
import ResponseBubble, { type TurnPhase } from "./ResponseBubble";
import {
  DEMO_SCENARIOS,
  withScenarioContext,
  type DemoScenario,
  type ScenarioTurn,
} from "@/services/demoScenarios";
import { isSpeechSynthesisSupported, speak, stopSpeaking } from "@/services/speech";

/** État global de l'expérience de démonstration. */
type DemoState = "menu" | "playing" | "done";

/** Historique des tours joués pour le scénario actif. */
interface PlayedTurn {
  turn: ScenarioTurn;
  phase: TurnPhase;
}

// ---------------------------------------------------------------
//  Timings (ms) — calibrés pour un rythme naturel de conversation
// ---------------------------------------------------------------
/** L'utilisateur "parle" pendant ~2 s (waveform actif). */
const USER_LISTEN_MS = 2000;
/** La transcription apparaît en ~0,7 s. */
const USER_TYPE_MS = 700;
/** L'IA "réfléchit" pendant ~1,4 s. */
const AI_THINK_MS = 1400;
/** Pause entre deux tours pour laisser respirer la voix TTS. */
const BETWEEN_TURNS_MS = 2600;

/**
 * Interface principale de la démonstration AfriVoice AI (MVP STIC'26).
 *
 * ── Menu de sélection : le jury choisit un scénario parmi 4 secteurs
 *    (santé, agriculture, finance, éducation). Cela évite d'enchaîner
 *    automatiquement 4 démos et donne le contrôle au présentateur.
 *
 * ── Conversation multi-tours : une fois le scénario choisi, la démo
 *    joue en séquence 3 échanges question/réponse avec le même persona.
 *    C'est visuellement plus court, plus incarné et plus mémorable pour
 *    le jury qu'une succession de conversations décousues.
 *
 * ── Chaque tour :
 *    micro (waveform) → transcription → IA "analyse" (typing dots)
 *    → réponse IA affichée + lue à voix haute en français (Web Speech API)
 *    → sous-titre karaoké synchrone (surbrillance mot par mot)
 */
export default function VoiceInterface() {
  const [state, setState] = useState<DemoState>("menu");
  const [activeScenario, setActiveScenario] = useState<DemoScenario | null>(
    null
  );
  const [played, setPlayed] = useState<PlayedTurn[]>([]);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [spokenChar, setSpokenChar] = useState<{
    turnId: string;
    index: number;
  } | null>(null);
  const [turnProgress, setTurnProgress] = useState(0);

  const timers = useRef<number[]>([]);
  const cancelled = useRef(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    return () => {
      cancelled.current = true;
      clearTimers();
      stopSpeaking();
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
    async (turn: ScenarioTurn, isLast: boolean): Promise<void> => {
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

      // Ne pas attendre après le dernier tour — la démo passe à l'écran final.
      if (!isLast) {
        await wait(BETWEEN_TURNS_MS);
      } else {
        await wait(1200);
      }
    },
    [wait, setTurnPhase]
  );

  // -----------------------------------------------------------
  //  Démarre un scénario complet (3 tours enchaînés)
  // -----------------------------------------------------------
  const startScenario = useCallback(
    async (scenario: DemoScenario) => {
      clearTimers();
      stopSpeaking();
      cancelled.current = false;

      setActiveScenario(scenario);
      setPlayed([]);
      setSpeakingId(null);
      setSpokenChar(null);
      setTurnProgress(0);
      setState("playing");

      const total = scenario.turns.length;
      for (let i = 0; i < total; i++) {
        if (cancelled.current) break;
        setTurnProgress(i);
        const turn = withScenarioContext(scenario, scenario.turns[i]);
        await playTurn(turn, i === total - 1);
      }

      if (!cancelled.current) {
        setTurnProgress(total);
        setState("done");
      }
    },
    [clearTimers, playTurn]
  );

  // -----------------------------------------------------------
  //  Interruption / retour au menu
  // -----------------------------------------------------------
  const stopScenario = useCallback(() => {
    cancelled.current = true;
    clearTimers();
    stopSpeaking();
    setSpeakingId(null);
    setSpokenChar(null);
    setState(played.length > 0 ? "done" : "menu");
  }, [clearTimers, played.length]);

  const backToMenu = useCallback(() => {
    cancelled.current = true;
    clearTimers();
    stopSpeaking();
    setActiveScenario(null);
    setPlayed([]);
    setSpeakingId(null);
    setSpokenChar(null);
    setTurnProgress(0);
    setState("menu");
  }, [clearTimers]);

  const replayScenario = useCallback(() => {
    if (activeScenario) void startScenario(activeScenario);
  }, [activeScenario, startScenario]);

  const replayAnswer = useCallback((turn: ScenarioTurn) => {
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
    <div className="glass mx-auto flex flex-col gap-5 rounded-3xl px-3 py-5 sm:gap-6 sm:px-6 sm:py-8">
      {/* ==================================================== */}
      {/*  BARRE DE CONTRÔLE                                    */}
      {/* ==================================================== */}
      {state !== "menu" && activeScenario && (
        <ControlBar
          state={state}
          scenario={activeScenario}
          turnProgress={turnProgress}
          totalTurns={activeScenario.turns.length}
          onStop={stopScenario}
          onReplay={replayScenario}
          onBackToMenu={backToMenu}
        />
      )}

      {/* ==================================================== */}
      {/*  ZONE MICRO                                           */}
      {/* ==================================================== */}
      {state === "playing" && activeMicTurn && (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-sky-400/20 bg-sky-400/[0.03] px-3 py-3 animate-fade-in-up sm:px-4 sm:py-4">
          <div className="flex items-center gap-2 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-200/90 sm:text-[11px] sm:tracking-[0.14em]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-300 opacity-80" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-300" />
            </span>
            <span>
              Écoute · {activeMicTurn.turn.persona.name} parle en{" "}
              {activeMicTurn.turn.languageLabel}
            </span>
          </div>
          <Waveform active bars={24} />
        </div>
      )}

      {/* ==================================================== */}
      {/*  FIL DE CONVERSATION                                  */}
      {/* ==================================================== */}
      {played.length > 0 && (
        <div
          ref={scrollRef}
          className="max-h-[60vh] space-y-4 overflow-y-auto pr-1 sm:max-h-[520px] sm:space-y-6"
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
      {/*  MENU DE SÉLECTION                                    */}
      {/* ==================================================== */}
      {state === "menu" && (
        <ScenarioMenu onSelect={(s) => void startScenario(s)} />
      )}
    </div>
  );
}

// ============================================================
//  Menu de sélection — 4 cartes cliquables
// ============================================================
interface ScenarioMenuProps {
  onSelect: (scenario: DemoScenario) => void;
}

function ScenarioMenu({ onSelect }: ScenarioMenuProps) {
  return (
    <div>
      <div className="mb-4 flex flex-col items-center text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-sky-300/90 sm:text-[11px] sm:tracking-[0.16em]">
          Choisissez un scénario
        </p>
        <h3 className="mt-1.5 text-base font-semibold text-slate-100 sm:text-lg">
          4 cas d&apos;usage Mooré · 3 échanges chacun
        </h3>
        <p className="mt-1 max-w-md text-[12px] leading-relaxed text-slate-400 sm:text-[13px]">
          Chaque scénario se joue en ~30 s. Le persona pose 3 questions, l&apos;IA
          répond à voix haute en Mooré.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
        {DEMO_SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect(s)}
            className="group flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-3.5 text-left transition hover:border-sky-400/40 hover:bg-sky-400/[0.04] active:scale-[0.99] sm:p-4"
          >
            <span
              aria-hidden
              className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-gradient-to-br from-sky-300 to-sky-500 text-lg text-navy-950 shadow-glow transition group-hover:scale-105"
            >
              {s.icon}
            </span>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold text-slate-100 sm:text-[15px]">
                  {s.sector}
                </p>
                <span className="rounded-full bg-sky-400/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-sky-200 ring-1 ring-inset ring-sky-400/20">
                  {s.turns.length} tours
                </span>
              </div>
              <p className="mt-0.5 truncate text-[11px] text-slate-400 sm:text-[12px]">
                {s.persona.name} · {s.persona.location}
              </p>
              <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-slate-300/85 sm:text-[13px]">
                {s.sectorTagline}
              </p>
            </div>
            <span
              aria-hidden
              className="mt-1 flex h-6 w-6 flex-none items-center justify-center rounded-full border border-sky-400/30 text-sky-200 transition group-hover:border-sky-400/60 group-hover:bg-sky-400/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-3 w-3"
              >
                <polygon points="6 4 20 12 6 20 6 4" />
              </svg>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
//  Barre de contrôle — persona actif + progression + actions
// ============================================================
interface ControlBarProps {
  state: DemoState;
  scenario: DemoScenario;
  turnProgress: number;
  totalTurns: number;
  onStop: () => void;
  onReplay: () => void;
  onBackToMenu: () => void;
}

function ControlBar({
  state,
  scenario,
  turnProgress,
  totalTurns,
  onStop,
  onReplay,
  onBackToMenu,
}: ControlBarProps) {
  const percent = Math.min(
    100,
    Math.round((turnProgress / totalTurns) * 100)
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-gradient-to-br from-sky-300 to-sky-500 text-lg text-navy-950 shadow-glow"
          >
            {scenario.icon}
          </span>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold text-slate-100 sm:text-sm">
              {scenario.sector}
            </p>
            <p className="text-[10px] uppercase tracking-[0.14em] text-sky-300/80">
              {scenario.persona.name} · {scenario.persona.location}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {state === "playing" ? (
            <>
              <span className="rounded-full bg-sky-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-sky-200 ring-1 ring-inset ring-sky-400/25">
                Tour {Math.min(turnProgress + 1, totalTurns)} / {totalTurns}
              </span>
              <button
                type="button"
                onClick={onStop}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] font-medium text-slate-200 transition hover:border-red-300/40 hover:bg-red-400/10 hover:text-red-100"
              >
                Arrêter
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onReplay}
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-sky-300 to-sky-500 px-3.5 py-1.5 text-[11px] font-semibold text-navy-950 shadow-glow transition hover:scale-[1.02]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3"
                  aria-hidden
                >
                  <path d="M3 12a9 9 0 1 0 3-6.7" />
                  <polyline points="3 4 3 10 9 10" />
                </svg>
                Rejouer
              </button>
              <button
                type="button"
                onClick={onBackToMenu}
                className="rounded-full border border-sky-400/40 bg-sky-400/[0.06] px-3 py-1.5 text-[11px] font-medium text-sky-100 transition hover:bg-sky-400/[0.14]"
              >
                Autre scénario
              </button>
            </>
          )}
        </div>
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
