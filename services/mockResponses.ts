import type { AfriVoiceResponse } from "./afrivoiceClient";

/**
 * Réponses "seed" en langues locales d'Afrique de l'Ouest.
 * Sources : conseils agricoles et sanitaires vulgarisés, formulés par
 * l'équipe AfriVoice AI pour la démo STIC'26.
 *
 * Remarque : les transcriptions locales sont volontairement simples
 * pour rester lisibles en démonstration. Les corpus validés
 * linguistiquement sont gérés côté backend FastAPI.
 */
export const MOCK_RESPONSES: AfriVoiceResponse[] = [
  {
    id: "wolof-agri-1",
    languageCode: "wo",
    languageLabel: "Wolof",
    sector: "Agriculture",
    localText:
      "Ndëpp mi, bëgg naa la wax : jaay sa gerte bi ci diggante ëllëg ak ëllëg-jotti, ndax njëg gi jog na ci béréb bi.",
    frenchText:
      "Bonne nouvelle : vends ton arachide entre demain et après-demain, les prix ont augmenté sur le marché régional.",
    ttsLangHint: "fr-FR",
  },
  {
    id: "bambara-sante-1",
    languageCode: "bm",
    languageLabel: "Bambara",
    sector: "Santé",
    localText:
      "N'i den bɛ farigan sɔrɔ, i k'a min ji caman, ka taa dɔgɔtɔrɔso la ni farigan ma ban tile fila kɔfɛ.",
    frenchText:
      "Si ton enfant a de la fièvre, fais-lui boire beaucoup d'eau et emmène-le au dispensaire si la fièvre persiste plus de deux jours.",
    ttsLangHint: "fr-FR",
  },
  {
    id: "peul-agri-1",
    languageCode: "ff",
    languageLabel: "Peul (Fulfulde)",
    sector: "Agriculture",
    localText:
      "Ndiyam ngam remuru gawri maa : rem e balɗe tati garooje, ndeen ɓaawo lewru, sabu toɓo ina jokka.",
    frenchText:
      "Pour ton champ de mil : sème dans les trois prochains jours, avant la fin du mois — la pluie continue de bien tomber.",
    ttsLangHint: "fr-FR",
  },
  {
    id: "moore-finance-1",
    languageCode: "mos",
    languageLabel: "Mooré",
    sector: "Inclusion financière",
    localText:
      "Yãmb tõe n paama ligd bilfu tɛka mobile ba wã pʋgẽ. Yãmb sã n dat, m na n wilg-y-la sore.",
    frenchText:
      "Vous pouvez obtenir un petit crédit directement depuis votre mobile money. Si vous le souhaitez, je vous guide étape par étape.",
    ttsLangHint: "fr-FR",
  },
];

/**
 * Sélection cyclique — chaque interaction met en avant une langue différente
 * pour illustrer la couverture multilingue du MVP.
 */
export function pickMockResponse(index: number): AfriVoiceResponse {
  const safeIndex =
    ((index % MOCK_RESPONSES.length) + MOCK_RESPONSES.length) %
    MOCK_RESPONSES.length;
  return MOCK_RESPONSES[safeIndex];
}
