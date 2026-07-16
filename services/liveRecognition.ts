"use client";

/**
 * Wrapper autour de la Web Speech API du navigateur (SpeechRecognition).
 * Permet une transcription **en direct pendant qu'on parle**, sans aller-retour
 * réseau. Fonctionne dans Chrome / Edge / Safari (limité dans Firefox).
 *
 * Langues supportées côté navigateur : français, anglais, arabe, espagnol,
 * portugais, allemand, etc. Les langues locales d'Afrique de l'Ouest
 * (Mooré, Wolof, Bambara, Peul) ne sont **pas** reconnues nativement par
 * le navigateur — c'est pour cela que l'on garde le pipeline HF en parallèle
 * pour les envois audio bruts.
 */

// Types minimalistes pour SpeechRecognition (l'API n'est pas standard TS).
interface SpeechRecognitionResultAlternative {
  transcript: string;
  confidence: number;
}
interface SpeechRecognitionResult {
  isFinal: boolean;
  0: SpeechRecognitionResultAlternative;
  length: number;
}
interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionCtor {
  new (): SpeechRecognitionInstance;
}

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: ((e: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

function getSpeechRecognition(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export function isLiveRecognitionSupported(): boolean {
  return getSpeechRecognition() !== null;
}

export interface LiveRecognitionOptions {
  lang?: string;
  onPartial?: (text: string) => void;
  onFinal?: (text: string) => void;
  onError?: (message: string) => void;
  onEnd?: () => void;
}

/**
 * Démarre la reconnaissance vocale en direct. Retourne une fonction pour
 * l'arrêter (déclenche `onFinal` avec le texte complet).
 *
 * ⚠️ Le navigateur peut demander une autorisation micro à l'utilisateur.
 */
export function startLiveRecognition(
  opts: LiveRecognitionOptions = {}
): (() => void) | null {
  const Ctor = getSpeechRecognition();
  if (!Ctor) return null;

  const rec = new Ctor();
  rec.lang = opts.lang ?? "fr-FR";
  rec.continuous = true;
  rec.interimResults = true;
  rec.maxAlternatives = 1;

  let finalTranscript = "";
  /**
   * Buffer de secours contenant la meilleure transcription disponible à
   * tout moment (final + intérim). Utile si l'utilisateur arrête l'écoute
   * AVANT que le navigateur n'ait marqué un chunk comme `isFinal`.
   */
  let latestCombined = "";
  let stopped = false;

  rec.onresult = (event) => {
    let interim = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const chunk = event.results[i][0]?.transcript ?? "";
      if (event.results[i].isFinal) {
        finalTranscript += chunk;
      } else {
        interim += chunk;
      }
    }
    latestCombined = (finalTranscript + " " + interim).trim();
    opts.onPartial?.(latestCombined);
  };

  rec.onerror = (event) => {
    // "no-speech", "aborted", "network", "not-allowed", "audio-capture", ...
    opts.onError?.(event.error || event.message || "unknown");
  };

  rec.onend = () => {
    // Priorité au texte final ; sinon on prend l'intérim le plus récent
    // (le user a arrêté avant que le navigateur ne mette "isFinal").
    const result = finalTranscript.trim() || latestCombined;
    opts.onFinal?.(result);
    opts.onEnd?.();
  };

  try {
    rec.start();
  } catch (err) {
    opts.onError?.((err as Error).message);
    return null;
  }

  return () => {
    if (stopped) return;
    stopped = true;
    try {
      rec.stop();
    } catch {
      /* noop */
    }
  };
}
