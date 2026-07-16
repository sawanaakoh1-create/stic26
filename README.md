# AfriVoice AI — MVP (STIC'26)

> **Votre voix, votre monde numérique.**
> Prototype "Wow-Effect" démontrant la vision d'AfriVoice AI : une infrastructure linguistique d'IA générative pour l'inclusion numérique en Afrique de l'Ouest.

Ce dépôt contient le **front-end MVP** en Next.js 14 (App Router) + TypeScript + Tailwind CSS. Il simule le parcours conversationnel de bout en bout (écoute → analyse → réponse vocale) et est prêt à être branché sur le backend FastAPI d'AfriVoice AI.

---

## ✨ Ce que fait le prototype

- Page d'accueil minimaliste et élégante (palette bleu marine + bleu ciel, standards institutionnels tech).
- Bouton central **« Parler »** avec effet de pulsation lumineuse.
- **Waveform** SVG animé en direct pendant l'écoute simulée (2 s).
- **Loader shimmer** élégant (2 s) puis apparition d'une **bulle de réponse** (fondu ascendant).
- Réponse **multilingue** (Wolof, Bambara, Peul, Mooré) avec traduction française + **synthèse vocale** via la Web Speech API du navigateur (aucune clé requise).
- Design **mobile-first**, accessible (aria-live, `prefers-reduced-motion`, focus rings), sans dépendance lourde.

---

## 🗂️ Structure des dossiers

```
.
├── app/
│   ├── globals.css          # Styles globaux, palette, animations
│   ├── icon.svg             # Favicon
│   ├── layout.tsx           # Layout racine (metadata, viewport)
│   └── page.tsx             # Page d'accueil (Hero + VoiceInterface + Piliers)
├── components/
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── ResponseBubble.tsx   # Bulle de réponse conversationnelle
│   ├── VoiceInterface.tsx   # Orchestrateur : bouton, cycle d'états, TTS
│   └── Waveform.tsx         # Onde sonore SVG animée
├── services/
│   ├── afrivoiceClient.ts   # Client de l'API AfriVoice (FastAPI-ready)
│   ├── mockResponses.ts     # Corpus de réponses de démo
│   └── speech.ts            # Helper Web Speech API (TTS de secours)
├── .env.example             # Variable d'env pour brancher le backend
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🚀 Démarrage local

Prérequis : **Node.js ≥ 18.17** et **npm** (ou pnpm/yarn).

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:3000.

> ⚠️ **Important — Windows + OneDrive** : si le projet est situé dans un dossier synchronisé OneDrive, `npm install` est très lent (~15 – 20 min) et peut corrompre le binaire natif `@next/swc-win32-x64-msvc` (erreur *« Failed to load SWC binary »*). **Solution recommandée : déplacer le dossier hors de OneDrive** (par ex. `C:\dev\afrivoice-ai`) puis exécuter `npm install`. Autre option : `npm install --ignore-scripts=false` puis en cas de corruption `Remove-Item -Recurse -Force node_modules, package-lock.json` et réinstaller. Sur Vercel (Linux) le problème ne se pose pas.

Astuce démo : sur Chrome/Edge, la synthèse vocale française est disponible immédiatement. Sur mobile, la première interaction utilisateur (le clic « Parler ») débloque la lecture audio.

---

## 🔌 Brancher le backend FastAPI (plus tard)

Le composant `VoiceInterface` consomme une seule fonction : `requestVoiceResponse(request, turnIndex)`
définie dans [`services/afrivoiceClient.ts`](services/afrivoiceClient.ts).

1. Copier `.env.example` en `.env.local` (ou définir la variable directement dans Vercel) :

   ```bash
   NEXT_PUBLIC_AFRIVOICE_API_URL=https://api.afrivoice.ai
   ```

2. Exposer côté FastAPI un endpoint `POST /v1/voice/converse` qui renvoie un JSON respectant l'interface `AfriVoiceResponse` :

   ```jsonc
   {
     "id": "wolof-agri-1",
     "languageCode": "wo",
     "languageLabel": "Wolof",
     "sector": "Agriculture",
     "localText": "…",
     "frenchText": "…",
     "ttsLangHint": "fr-FR",
     "audioUrl": "https://cdn.afrivoice.ai/tts/xxx.mp3"
   }
   ```

3. Si `audioUrl` est fourni par le backend, il suffira d'étendre `services/speech.ts` pour préférer la lecture du fichier natif (meilleure qualité que la synthèse navigateur). Aucun autre changement front n'est nécessaire.

En l'absence de backend, le client bascule automatiquement sur les réponses seed de `services/mockResponses.ts`.

---

## ☁️ Déploiement Vercel — en un clic

### Option A · Interface web (recommandée pour la démo)

1. Créer un dépôt GitHub (ex. `afrivoice-ai-mvp`) et pousser ce projet :
   ```bash
   git init
   git add .
   git commit -m "feat: MVP AfriVoice AI (STIC'26)"
   git branch -M main
   git remote add origin https://github.com/<votre-user>/afrivoice-ai-mvp.git
   git push -u origin main
   ```
2. Aller sur https://vercel.com/new, choisir **Import Git Repository** et sélectionner votre dépôt.
3. Vercel détecte automatiquement **Next.js** :
   - Framework Preset : `Next.js`
   - Build Command : `next build` (auto)
   - Output : `.next` (auto)
   - Install Command : `npm install` (auto)
4. (Optionnel) Ajouter la variable d'environnement `NEXT_PUBLIC_AFRIVOICE_API_URL` dans **Settings → Environment Variables**.
5. Cliquer **Deploy**. L'URL publique est disponible en ~1 minute (ex. `https://afrivoice-ai-mvp.vercel.app`).

### Option B · Vercel CLI

```bash
npm i -g vercel
vercel                  # 1er déploiement (preview)
vercel --prod           # déploiement production
```

### Après déploiement

- Aucune configuration supplémentaire : le projet est **stateless** et fonctionne en Edge/CDN.
- La démo est **100% opérationnelle sans backend** grâce aux réponses seed.
- Pour brancher FastAPI, définir la variable d'env et redéployer (`vercel --prod`).

---

## 🎯 Argumentaire jury (rappel)

Ce MVP démontre concrètement :

- **Exécution technique** : architecture propre (App Router, services isolés, contrat d'API typé), prête à absorber un backend FastAPI sans refactor.
- **Pertinence sociale** : réponses en langues locales (Wolof, Bambara, Peul, Mooré) sur des cas d'usage réels — agriculture, santé, inclusion financière.
- **Accessibilité immédiate** : voice-first, mobile-first, fonctionne sur un smartphone d'entrée de gamme.
- **Vision produit** : les trois piliers ASR / NLP / TTS sont matérialisés visuellement.

---

## 📄 Licence & équipe

© AfriVoice AI — Candidature **STIC'26**
Fondatrice & Lead Développeuse IA : **AKOH N'DJARMA M. Sawanatou**.
