import { NextResponse, type NextRequest } from "next/server";
import {
  matchIntent,
  resolveAnswer,
  getTtsModel,
  LANGUAGES,
  INTENTS,
  DEFAULT_LANGUAGE,
  type IntentId,
  type LanguageCode,
} from "@/services/localResponses";

export const runtime = "nodejs";
export const maxDuration = 60;

const HF_INFERENCE_BASE = "https://api-inference.huggingface.co/models";

const ASR_MODEL_PRIMARY =
  process.env.HF_ASR_MODEL_PRIMARY || "facebook/mms-1b-all";
const ASR_MODEL_FALLBACK =
  process.env.HF_ASR_MODEL_FALLBACK || "openai/whisper-large-v3";
const ASR_FALLBACK_LANGUAGE =
  process.env.HF_ASR_FALLBACK_LANGUAGE || "french";

interface VoiceApiResponse {
  ok: boolean;
  id: string;
  languageCode: LanguageCode;
  languageLabel: string;
  sector: string;
  transcription: string;
  asrSource: "mms" | "whisper" | "text-input" | "none";
  localText: string;
  frenchText: string;
  ttsLangHint: string;
  audioBase64: string | null;
  audioMimeType: string | null;
  intent: IntentId;
  meta: {
    asrPrimaryModel: string;
    asrFallbackModel: string;
    ttsModel: string;
    matchedKeyword: string | null;
    detectedLanguage: LanguageCode;
    asrOk: boolean;
    ttsOk: boolean;
    previousIntent: IntentId | null;
    previousLanguage: LanguageCode | null;
    warnings: string[];
  };
}

function extractTextFromAsrPayload(data: unknown): string {
  if (typeof data === "string") return data;
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (typeof obj.text === "string") return obj.text;
    if (
      Array.isArray(obj) &&
      obj[0] &&
      typeof (obj[0] as { text?: string }).text === "string"
    ) {
      return (obj[0] as { text: string }).text;
    }
  }
  return "";
}

async function runMmsAsr(
  audioBuffer: ArrayBuffer,
  contentType: string,
  targetLanguage: LanguageCode,
  token: string,
  warnings: string[]
): Promise<string> {
  try {
    const url = new URL(`${HF_INFERENCE_BASE}/${ASR_MODEL_PRIMARY}`);
    url.searchParams.set("target_language", targetLanguage);

    const res = await fetch(url.toString(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": contentType || "audio/wav",
        "x-wait-for-model": "true",
      },
      body: audioBuffer,
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      warnings.push(`MMS ${res.status}: ${errText.slice(0, 240)}`);
      return "";
    }

    const data = await res.json();
    const text = extractTextFromAsrPayload(data);
    if (!text.trim()) {
      warnings.push(
        `MMS: transcription vide (payload: ${JSON.stringify(data).slice(0, 160)})`
      );
    }
    return text.trim();
  } catch (err) {
    warnings.push(`MMS exception: ${(err as Error).message}`);
    return "";
  }
}

async function runWhisperAsr(
  audioBuffer: ArrayBuffer,
  contentType: string,
  token: string,
  warnings: string[]
): Promise<string> {
  try {
    const url = new URL(`${HF_INFERENCE_BASE}/${ASR_MODEL_FALLBACK}`);
    if (ASR_FALLBACK_LANGUAGE) {
      url.searchParams.set("language", ASR_FALLBACK_LANGUAGE);
    }

    const res = await fetch(url.toString(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": contentType || "audio/wav",
        "x-wait-for-model": "true",
      },
      body: audioBuffer,
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      warnings.push(`Whisper ${res.status}: ${errText.slice(0, 240)}`);
      return "";
    }

    const data = await res.json();
    const text = extractTextFromAsrPayload(data);
    if (!text.trim()) warnings.push(`Whisper: transcription vide`);
    return text.trim();
  } catch (err) {
    warnings.push(`Whisper exception: ${(err as Error).message}`);
    return "";
  }
}

async function runTts(
  text: string,
  language: LanguageCode,
  token: string,
  warnings: string[]
): Promise<{ base64: string | null; mime: string | null; model: string }> {
  const model = getTtsModel(language);
  try {
    const res = await fetch(`${HF_INFERENCE_BASE}/${model}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "x-wait-for-model": "true",
      },
      body: JSON.stringify({ inputs: text }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      warnings.push(`TTS ${res.status} (${model}): ${errText.slice(0, 240)}`);
      return { base64: null, mime: null, model };
    }

    const mime = res.headers.get("content-type") || "audio/flac";
    const buf = await res.arrayBuffer();
    const base64 = Buffer.from(buf).toString("base64");
    return { base64, mime, model };
  } catch (err) {
    warnings.push(`TTS exception (${model}): ${(err as Error).message}`);
    return { base64: null, mime: null, model };
  }
}

export async function POST(
  req: NextRequest
): Promise<NextResponse<VoiceApiResponse>> {
  const warnings: string[] = [];
  const token = process.env.HUGGINGFACE_TOKEN;

  let transcription = "";
  let asrSource: VoiceApiResponse["asrSource"] = "none";
  let previousIntent: IntentId | null = null;
  let previousLanguage: LanguageCode | null = null;

  try {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      const textField = formData.get("text");
      if (typeof textField === "string" && textField.trim()) {
        transcription = textField.trim();
        asrSource = "text-input";
      }

      const prevField = formData.get("previousIntent");
      if (typeof prevField === "string" && prevField.trim()) {
        previousIntent = prevField.trim() as IntentId;
      }

      const prevLang = formData.get("previousLanguage");
      if (typeof prevLang === "string" && prevLang.trim()) {
        previousLanguage = prevLang.trim() as LanguageCode;
      }

      const audioField = formData.get("audio");
      if (audioField instanceof Blob && audioField.size > 0 && !transcription) {
        if (!token) {
          warnings.push("HUGGINGFACE_TOKEN manquant — ASR désactivé.");
        } else {
          const audioBuffer = await audioField.arrayBuffer();
          const audioMime = audioField.type || "audio/wav";

          // MMS avec la langue précédente (multi-tour) ou la langue par défaut
          const asrTargetLang = previousLanguage || DEFAULT_LANGUAGE;
          const mmsText = await runMmsAsr(
            audioBuffer,
            audioMime,
            asrTargetLang,
            token,
            warnings
          );

          if (mmsText) {
            transcription = mmsText;
            asrSource = "mms";
          } else {
            warnings.push("MMS n'a rien renvoyé — bascule sur Whisper (fr).");
            const whisperText = await runWhisperAsr(
              audioBuffer,
              audioMime,
              token,
              warnings
            );
            if (whisperText) {
              transcription = whisperText;
              asrSource = "whisper";
            }
          }
        }
      }
    } else if (contentType.includes("application/json")) {
      const body = (await req.json()) as {
        text?: string;
        previousIntent?: IntentId;
        previousLanguage?: LanguageCode;
      };
      transcription = body?.text?.trim() || "";
      if (transcription) asrSource = "text-input";
      previousIntent = body?.previousIntent ?? null;
      previousLanguage = body?.previousLanguage ?? null;
    }
  } catch (err) {
    warnings.push(`Body parse: ${(err as Error).message}`);
  }

  // Matching multilingue → détecte langue + intent
  const match = matchIntent(transcription, previousIntent, previousLanguage);
  const resolved = resolveAnswer(match.intent, match.language);

  // TTS dans la langue détectée
  let audioBase64: string | null = null;
  let audioMimeType: string | null = null;
  let ttsModel = getTtsModel(resolved.language);
  if (token) {
    const tts = await runTts(resolved.localText, resolved.language, token, warnings);
    audioBase64 = tts.base64;
    audioMimeType = tts.mime;
    ttsModel = tts.model;
  } else {
    warnings.push("HUGGINGFACE_TOKEN manquant — TTS désactivé.");
  }

  const payload: VoiceApiResponse = {
    ok: true,
    id: `${resolved.language}-${match.intent.id}-${Date.now()}`,
    languageCode: resolved.language,
    languageLabel: LANGUAGES[resolved.language].label,
    sector: match.intent.sector,
    transcription,
    asrSource,
    localText: resolved.localText,
    frenchText: resolved.frenchText,
    ttsLangHint: LANGUAGES[resolved.language].webSpeechHint,
    audioBase64,
    audioMimeType,
    intent: match.intent.intent,
    meta: {
      asrPrimaryModel: ASR_MODEL_PRIMARY,
      asrFallbackModel: ASR_MODEL_FALLBACK,
      ttsModel,
      matchedKeyword: match.matchedKeyword,
      detectedLanguage: resolved.language,
      asrOk: Boolean(transcription),
      ttsOk: Boolean(audioBase64),
      previousIntent,
      previousLanguage,
      warnings,
    },
  };

  return NextResponse.json(payload);
}

/** GET utilitaire — état du backend et catalogue multilingue. */
export async function GET() {
  return NextResponse.json({
    ok: true,
    hasToken: Boolean(process.env.HUGGINGFACE_TOKEN),
    asrPrimaryModel: ASR_MODEL_PRIMARY,
    asrFallbackModel: ASR_MODEL_FALLBACK,
    languages: Object.entries(LANGUAGES).map(([code, meta]) => ({
      code,
      label: meta.label,
      ttsModel: meta.ttsModel,
    })),
    availableIntents: INTENTS.map((a) => ({
      id: a.id,
      sector: a.sector,
      intent: a.intent,
      parentIntent: a.parentIntent,
      supportedLanguages: Object.keys(a.answers),
      keywords: a.keywords,
    })),
  });
}
