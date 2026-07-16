import type { AfriVoiceResponse } from "./afrivoiceClient";
import { DEMO_TURNS, toAfriVoiceResponse } from "./demoScenarios";

/**
 * Réponses "seed" en langues locales d'Afrique de l'Ouest, dérivées
 * du script narratif de la démonstration STIC'26.
 *
 * Ce corpus n'est utilisé que par le client `afrivoiceClient` lorsqu'il
 * doit produire une réponse hors-ligne (mode démo, backend absent).
 * L'expérience visible par le jury est pilotée par `services/demoScenarios.ts`.
 */
export const MOCK_RESPONSES: AfriVoiceResponse[] = DEMO_TURNS.map(
  toAfriVoiceResponse
);

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
