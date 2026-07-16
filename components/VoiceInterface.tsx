"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Waveform from "./Waveform";
import ResponseBubble, { type SpeakingMode } from "./ResponseBubble";
import {
  requestVoiceFromAudio,
  requestVoiceFromText,
  requestVoiceResponse,
  type AfriVoiceResponse,
} from "@/services/afrivoiceClient";
import {
  isSpeechSynthesisSupported,
  playAudioBase64,
  speak,
  stopAudioPlayback,
  stopSpeaking,
} from "@/services/speech";
import { encodeBlobAsWav16kMono } from "@/services/audioEncoder";
import {
  isLiveRecognitionSupported,
  startLiveRecognition,
} from "@/services/liveRecognition";

type UIState = "idle" | "listening" | "loading" | "answered";

/** Un tour = un message utilisateur + la réponse de l'IA. */
interface ConversationTurn {
  id: string;
  userText: string;
  response: AfriVoiceResponse;
}

/** Durée max d'un enregistrement (garde-fou) — ms. */
const MAX_RECORDING_MS = 12000;
/** Durée mock pour le mode démo sans micro — ms. */
const MOCK_LISTEN_DURATION_MS = 2000;
const MOCK_PROCESSING_DURATION_MS = 2000;

/**
 * Composant central de l'expérience conversationnelle AfriVoice AI.
 *
 * - Historique de conversation multilingue (multi-turn)
 * - Le dernier intent + la dernière langue sont renvoyés au backend
 * - Transcription **en direct pendant qu'on parle** (Web Speech API)
 * - Enregistrement audio en parallèle pour envoi au pipeline HF
 */
export default function VoiceInterface() {
  const [state, setState] = useState<UIState>("idle");
  const [history, setHistory] = useState<ConversationTurn[]>([]);
  /** Quel canal audio joue actuellement (local / français / silence). */
  const [speakingMode, setSpeakingMode] = useState<SpeakingMode>(null);
  const [turnIndex, setTurnIndex] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");
  const [liveTranscript, setLiveTranscript] = useState("");

  const lastResponse =
    history.length > 0 ? history[history.length - 1].response : null;
  const previousIntent = lastResponse?.intent ?? null;
  const previousLanguage = lastResponse?.languageCode ?? null;

  const timers = useRef<number[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const stopAudioRef = useRef<(() => void) | null>(null);
  const stopLiveRecRef = useRef<(() => void) | null>(null);
  const finalLiveTranscriptRef = useRef<string>("");

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  const stopMicStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
  }, []);

  const stopLiveRecognition = useCallback(() => {
    if (stopLiveRecRef.current) {
      stopLiveRecRef.current();
      stopLiveRecRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearTimers();
      stopSpeaking();
      stopAudioPlayback();
      stopMicStream();
      stopLiveRecognition();
    };
  }, [clearTimers, stopMicStream, stopLiveRecognition]);

  const stopAllAudio = useCallback(() => {
    stopAudioRef.current?.();
    stopAudioRef.current = null;
    stopSpeaking();
    stopAudioPlayback();
    setSpeakingMode(null);
  }, []);

  /** Lit la réponse dans la LANGUE LOCALE via TTS HF (base64). */
  const playLocalAudio = useCallback(
    (r: AfriVoiceResponse) => {
      stopAllAudio();

      if (!r.audioBase64) {
        // TTS backend indisponible : on utilise la Web Speech API en repli
        // sur le TEXTE LOCAL (le navigateur essaiera avec sa meilleure voix).
        if (isSpeechSynthesisSupported()) {
          setSpeakingMode("local");
          speak({
            text: r.localText,
            lang: r.ttsLangHint || "fr-FR",
            onStart: () => setSpeakingMode("local"),
            onEnd: () => setSpeakingMode(null),
          });
        }
        return;
      }

      setSpeakingMode("local");
      const stop = playAudioBase64({
        base64: r.audioBase64,
        mimeType: r.audioMimeType,
        onStart: () => setSpeakingMode("local"),
        onEnd: () => setSpeakingMode(null),
      });
      if (stop) stopAudioRef.current = stop;
    },
    [stopAllAudio]
  );

  /** Lit la TRADUCTION française via la Web Speech API du navigateur. */
  const playFrenchAudio = useCallback(
    (r: AfriVoiceResponse) => {
      stopAllAudio();
      if (!isSpeechSynthesisSupported()) return;

      setSpeakingMode("french");
      speak({
        text: r.frenchText,
        lang: "fr-FR",
        onStart: () => setSpeakingMode("french"),
        onEnd: () => setSpeakingMode(null),
      });
    },
    [stopAllAudio]
  );

  /**
   * Lecture par défaut après une nouvelle réponse : toujours la LANGUE LOCALE.
   * L'utilisateur peut ensuite cliquer manuellement sur « Écouter en français ».
   */
  const playResponseAudio = useCallback(
    (r: AfriVoiceResponse) => {
      playLocalAudio(r);
    },
    [playLocalAudio]
  );

  // -----------------------------------------------------------
  //  MODE RÉEL — enregistrement micro + /api/voice
  // -----------------------------------------------------------

  const startRealRecording = useCallback(async (): Promise<boolean> => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      return false;
    }
    if (typeof window === "undefined" || typeof window.MediaRecorder === "undefined") {
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType =
        MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : MediaRecorder.isTypeSupported("audio/webm")
            ? "audio/webm"
            : "";

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.start();
      setMicError(null);

      // Démarre la reconnaissance vocale du navigateur en parallèle
      // (transcription en direct pendant qu'on parle).
      finalLiveTranscriptRef.current = "";
      setLiveTranscript("");
      if (isLiveRecognitionSupported()) {
        const stop = startLiveRecognition({
          lang: "fr-FR",
          onPartial: (text) => setLiveTranscript(text),
          onFinal: (text) => {
            finalLiveTranscriptRef.current = text;
            setLiveTranscript(text);
          },
          onError: (msg) => {
            // Silencieux : on garde le fallback audio → HF ASR.
            if (msg && msg !== "no-speech" && msg !== "aborted") {
              console.warn("[LiveRecognition] error:", msg);
            }
          },
        });
        if (stop) stopLiveRecRef.current = stop;
      }

      return true;
    } catch (err) {
      const msg = (err as Error).message || "Micro indisponible";
      console.warn("[VoiceInterface] getUserMedia error:", err);
      setMicError(msg);
      stopMicStream();
      return false;
    }
  }, [stopMicStream]);

  const stopRealRecording = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder) {
        resolve(null);
        return;
      }
      recorder.onstop = () => {
        const chunks = audioChunksRef.current;
        const type = recorder.mimeType || "audio/webm";
        const blob = chunks.length ? new Blob(chunks, { type }) : null;
        stopMicStream();
        resolve(blob);
      };
      try {
        recorder.stop();
      } catch {
        stopMicStream();
        resolve(null);
      }
    });
  }, [stopMicStream]);

  // -----------------------------------------------------------
  //  MODE DÉMO — cycle mocké (fallback)
  // -----------------------------------------------------------

  const appendTurn = useCallback(
    (userText: string, response: AfriVoiceResponse) => {
      setHistory((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${prev.length}`,
          userText,
          response,
        },
      ]);
    },
    []
  );

  const runMockCycle = useCallback(async () => {
    setState("listening");

    await new Promise<void>((resolve) => {
      const id = window.setTimeout(resolve, MOCK_LISTEN_DURATION_MS);
      timers.current.push(id);
    });

    setState("loading");
    const [nextResponse] = await Promise.all([
      requestVoiceResponse({}, turnIndex),
      new Promise<void>((resolve) => {
        const id = window.setTimeout(resolve, MOCK_PROCESSING_DURATION_MS);
        timers.current.push(id);
      }),
    ]);

    appendTurn("(démo)", nextResponse);
    setState("answered");
    setTurnIndex((i) => i + 1);
    playResponseAudio(nextResponse);
  }, [turnIndex, playResponseAudio, appendTurn]);

  // -----------------------------------------------------------
  //  Orchestration
  // -----------------------------------------------------------

  const startConversation = useCallback(async () => {
    clearTimers();
    stopAllAudio();

    const started = await startRealRecording();
    if (!started) {
      // Fallback : pas de micro dispo → cycle mocké
      void runMockCycle();
      return;
    }

    setState("listening");

    // Garde-fou : auto-stop après MAX_RECORDING_MS
    const autoStopId = window.setTimeout(() => {
      void finishRecording();
    }, MAX_RECORDING_MS);
    timers.current.push(autoStopId);
  }, [clearTimers, stopAllAudio, startRealRecording, runMockCycle]);

  const finishRecording = useCallback(async () => {
    clearTimers();
    stopLiveRecognition();
    setState("loading");

    // On laisse un petit délai pour que la Web Speech API finalise
    // (event onend arrive de façon asynchrone).
    await new Promise<void>((resolve) => window.setTimeout(resolve, 300));

    const rawBlob = await stopRealRecording();
    // Priorité : ref finalisée → sinon état React (contient l'intérim en cours)
    const liveText = (
      finalLiveTranscriptRef.current || liveTranscript
    ).trim();

    let nextResponse: AfriVoiceResponse;

    if (liveText) {
      // Priorité : la transcription en direct du navigateur est plus fiable
      // pour le français que l'ASR HF (WebM ↔ Whisper flaky).
      nextResponse = await requestVoiceFromText(
        liveText,
        turnIndex,
        previousIntent,
        previousLanguage
      );
    } else if (rawBlob) {
      // Fallback : conversion WAV puis envoi au pipeline HF (MMS → Whisper).
      let uploadBlob: Blob = rawBlob;
      try {
        const { wav } = await encodeBlobAsWav16kMono(rawBlob);
        uploadBlob = wav;
      } catch (err) {
        console.warn("[VoiceInterface] Encodage WAV échoué, envoi brut.", err);
      }
      nextResponse = await requestVoiceFromAudio(
        uploadBlob,
        turnIndex,
        previousIntent,
        previousLanguage
      );
    } else {
      nextResponse = await requestVoiceResponse({}, turnIndex);
    }

    setLiveTranscript("");
    finalLiveTranscriptRef.current = "";

    appendTurn(nextResponse.transcription || liveText || "(voix)", nextResponse);
    setState("answered");
    setTurnIndex((i) => i + 1);
    playResponseAudio(nextResponse);
  }, [
    clearTimers,
    stopLiveRecognition,
    stopRealRecording,
    liveTranscript,
    turnIndex,
    playResponseAudio,
    previousIntent,
    previousLanguage,
    appendTurn,
  ]);

  const handlePrimaryClick = useCallback(() => {
    if (state === "listening") {
      void finishRecording();
      return;
    }
    if (state === "loading") return;
    void startConversation();
  }, [state, startConversation, finishRecording]);

  const handleTextSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const value = textInput.trim();
      if (!value || state === "loading") return;

      clearTimers();
      stopAllAudio();
      setState("loading");

      const nextResponse = await requestVoiceFromText(value, turnIndex, previousIntent, previousLanguage);

      appendTurn(value, nextResponse);
      setState("answered");
      setTurnIndex((i) => i + 1);
      setTextInput("");
      playResponseAudio(nextResponse);
    },
    [textInput, state, clearTimers, stopAllAudio, turnIndex, playResponseAudio, previousIntent, previousLanguage, appendTurn]
  );

  const handleReplayLocal = useCallback(() => {
    if (!lastResponse) return;
    if (speakingMode === "local") {
      stopAllAudio();
      return;
    }
    playLocalAudio(lastResponse);
  }, [lastResponse, speakingMode, stopAllAudio, playLocalAudio]);

  const handleReplayFrench = useCallback(() => {
    if (!lastResponse) return;
    if (speakingMode === "french") {
      stopAllAudio();
      return;
    }
    playFrenchAudio(lastResponse);
  }, [lastResponse, speakingMode, stopAllAudio, playFrenchAudio]);

  const handleResetConversation = useCallback(() => {
    clearTimers();
    stopAllAudio();
    stopMicStream();
    stopLiveRecognition();
    setHistory([]);
    setState("idle");
    setTextInput("");
    setLiveTranscript("");
    finalLiveTranscriptRef.current = "";
  }, [clearTimers, stopAllAudio, stopMicStream, stopLiveRecognition]);

  const primaryLabel =
    state === "listening"
      ? "Arrêter et envoyer"
      : state === "loading"
        ? "Analyse IA…"
        : state === "answered"
          ? "Reparler"
          : "Parler";

  const primaryDisabled = state === "loading";

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
          onClick={handlePrimaryClick}
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
          <MicIcon
            state={state}
            className="h-10 w-10 text-navy-950 sm:h-12 sm:w-12"
          />
        </button>

        <p className="mt-5 text-sm font-medium tracking-wide text-slate-200 sm:text-base">
          {primaryLabel}
        </p>
        <p className="mt-1 text-center text-xs text-slate-400 sm:text-sm">
          {state === "idle" && "Appuyez et parlez — l'IA écoute en Mooré."}
          {state === "listening" && "Enregistrement… Ré-appuyez pour envoyer."}
          {state === "loading" && "Analyse ASR & génération vocale en Mooré…"}
          {state === "answered" && "Appuyez à nouveau pour une autre question."}
        </p>

        {micError && (
          <p className="mt-2 max-w-xs text-center text-[11px] text-amber-200/80">
            Micro indisponible ({micError}) — bascule en mode démo.
          </p>
        )}
      </div>

      {/* WAVEFORM */}
      <div
        className={`flex w-full items-center justify-center transition-opacity duration-300 ${
          state === "listening" ? "opacity-100" : "opacity-40"
        }`}
      >
        <Waveform active={state === "listening"} />
      </div>

      {/* LIVE TRANSCRIPT — texte qui s'écrit pendant qu'on parle */}
      {state === "listening" && (
        <div
          className="w-full max-w-md animate-fade-in-up rounded-2xl border border-sky-400/25 bg-sky-400/[0.06] p-4"
          role="status"
          aria-live="polite"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300/80">
            Vous dites…
          </p>
          <p className="mt-1 min-h-[1.5rem] text-sm leading-relaxed text-slate-100">
            {liveTranscript || (
              <span className="italic text-slate-400">
                (parlez, votre voix apparaît ici en temps réel)
              </span>
            )}
          </p>
        </div>
      )}

      {/* LOADER SHIMMER */}
      {state === "loading" && (
        <div className="w-full max-w-md animate-fade-in-up space-y-2.5" aria-hidden>
          <div className="shimmer h-3.5 w-3/4 rounded-full" />
          <div className="shimmer h-3.5 w-full rounded-full" />
          <div className="shimmer h-3.5 w-5/6 rounded-full" />
        </div>
      )}

      {/* CHAMP TEXTE — pour tester le pipeline sans micro */}
      <form
        onSubmit={handleTextSubmit}
        className="flex w-full max-w-md items-center gap-2 border-t border-white/5 pt-4"
      >
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          disabled={state === "loading" || state === "listening"}
          placeholder="Écrivez : « bonjour », « fièvre », « tang » (wolof), « farigan » (mooré)…"
          className="input flex-1 text-sm"
          aria-label="Message texte de test"
        />
        <button
          type="submit"
          disabled={!textInput.trim() || state === "loading" || state === "listening"}
          className="rounded-xl bg-gradient-to-br from-sky-300 to-sky-500 px-3.5 py-2 text-xs font-semibold text-navy-950 shadow-glow transition hover:scale-[1.02] active:scale-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
        >
          Envoyer
        </button>
      </form>

      {/* RÉPONSE — dernier tour uniquement (l'historique est conservé en mémoire pour le contexte) */}
      {history.length > 0 && lastResponse && (
        <div className="w-full space-y-3">
          {/* Bandeau discret : compteur de tours + reset */}
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">
              {history.length === 1
                ? "Tour 1"
                : `Tour ${history.length} · continuité contextuelle active`}
            </p>
            <button
              type="button"
              onClick={handleResetConversation}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium text-slate-200 transition hover:bg-white/[0.06]"
              aria-label="Réinitialiser la conversation"
            >
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
                <path d="M3 12a9 9 0 1 0 3-6.7" />
                <path d="M3 3v6h6" />
              </svg>
              Nouvelle conversation
            </button>
          </div>

          <ResponseBubble
            response={lastResponse}
            speakingMode={speakingMode}
            onReplayLocal={handleReplayLocal}
            onReplayFrench={handleReplayFrench}
          />
        </div>
      )}

      {/* ANNONCE ACCESSIBILITÉ */}
      <span className="sr-only" role="status" aria-live="polite">
        {state === "listening" && "Écoute vocale en cours."}
        {state === "loading" && "Traitement de la requête."}
        {state === "answered" && lastResponse
          ? `Réponse en ${lastResponse.languageLabel}. Traduction : ${lastResponse.frenchText}`
          : ""}
      </span>
    </div>
  );
}

function MicIcon({
  state,
  className,
}: {
  state: UIState;
  className?: string;
}) {
  if (state === "loading") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${className ?? ""} animate-spin text-sky-300`}
        aria-hidden
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M12 3a3.5 3.5 0 0 0-3.5 3.5v6a3.5 3.5 0 0 0 7 0v-6A3.5 3.5 0 0 0 12 3z" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0" />
      <path d="M12 17.5V21" />
      <path d="M8.5 21h7" />
    </svg>
  );
}
