import { pickMockResponse } from "./mockResponses";

/**
 * Contrat de données partagé entre le front (Next.js) et le futur
 * backend AfriVoice AI (FastAPI). Toute évolution doit rester
 * rétro-compatible côté client.
 */
export interface AfriVoiceResponse {
  id: string;
  /** Code ISO 639 de la langue locale (wo, bm, ff, mos, ...) */
  languageCode: string;
  /** Libellé humain de la langue */
  languageLabel: string;
  /** Domaine sectoriel : Agriculture, Santé, Éducation, ... */
  sector: string;
  /** Réponse en langue locale (transcription textuelle du TTS) */
  localText: string;
  /** Traduction française pour le jury */
  frenchText: string;
  /**
   * Indicateur de langue pour la Web Speech API du navigateur.
   * En attendant le vrai moteur TTS AfriVoice, on utilise fr-FR pour
   * une voix propre et intelligible sur la démo.
   */
  ttsLangHint: string;
  /**
   * URL optionnelle d'un fichier audio pré-généré (WAV/MP3) renvoyé
   * par le backend FastAPI. Priorité au fichier si présent.
   */
  audioUrl?: string;
}

export interface AfriVoiceRequest {
  /** Audio brut encodé en base64 (WebM/Opus par défaut). Optionnel côté démo. */
  audioBase64?: string;
  /** Requête textuelle facultative pour les tests. */
  text?: string;
  /** Langue attendue de la réponse (optionnel — sinon détection auto). */
  languageCode?: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_AFRIVOICE_API_URL?.replace(/\/$/, "") ?? "";

/**
 * Appelle le backend AfriVoice AI (FastAPI) si `NEXT_PUBLIC_AFRIVOICE_API_URL`
 * est défini. Sinon, retombe sur une réponse mockée (démo hors-ligne).
 *
 * @param request Charge utile — audio, texte ou hint de langue.
 * @param turnIndex Index de tour pour la rotation des mocks en démo.
 */
export async function requestVoiceResponse(
  request: AfriVoiceRequest = {},
  turnIndex = 0
): Promise<AfriVoiceResponse> {
  if (!API_BASE_URL) {
    return pickMockResponse(turnIndex);
  }

  try {
    const res = await fetch(`${API_BASE_URL}/v1/voice/converse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`AfriVoice API ${res.status}`);
    }

    return (await res.json()) as AfriVoiceResponse;
  } catch (error) {
    console.warn(
      "[AfriVoice] Backend indisponible, bascule sur la réponse mock.",
      error
    );
    return pickMockResponse(turnIndex);
  }
}
