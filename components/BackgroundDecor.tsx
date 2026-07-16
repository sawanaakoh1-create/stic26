/**
 * Signature visuelle d'AfriVoice AI — scène « Crépuscule & Voix » :
 * - soleil couchant chaud à l'horizon
 * - silhouette de baobab (arbre emblématique de la savane)
 * - ondes sonores concentriques émanant du sol (métaphore de la voix)
 * - halo latéral pour la profondeur
 *
 * Rendu 100 % SSR, `pointer-events-none`, `aria-hidden`.
 * Placé sous le contenu via `-z-10` depuis le layout racine.
 */
export default function BackgroundDecor() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Halo latéral droit — signal source chaud */}
      <div className="absolute -right-40 top-1/3 h-[680px] w-[680px] rounded-full bg-[#e88a4a]/[0.10] blur-[140px]" />
      {/* Halo haut-gauche — profondeur */}
      <div className="absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-[#f2ad6b]/[0.06] blur-[120px]" />

      {/* Scène crépuscule : soleil + baobab + ondes vocales */}
      <svg
        className="absolute inset-x-0 bottom-0 h-[70vh] w-full"
        viewBox="0 0 1440 720"
        fill="none"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          <radialGradient id="sunHalo" cx="50%" cy="60%" r="50%">
            <stop offset="0%" stopColor="#f4b942" stopOpacity="0.55" />
            <stop offset="40%" stopColor="#e88a4a" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#c8632a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sunCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fce8b6" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#f4b942" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#e88a4a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="waveStroke" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#f2ad6b" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#f2ad6b" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="baobab" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0a0503" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#1a0f08" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="horizon" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#20150f" stopOpacity="0" />
            <stop offset="100%" stopColor="#0a0503" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Halo général du soleil couchant */}
        <ellipse cx="960" cy="620" rx="800" ry="380" fill="url(#sunHalo)" />

        {/* Ondes concentriques (voix qui rayonne) — centrées sur l'origine du son */}
        {Array.from({ length: 8 }).map((_, i) => {
          const r = 90 + i * 85;
          return (
            <circle
              key={i}
              cx="720"
              cy="720"
              r={r}
              stroke="url(#waveStroke)"
              strokeWidth={i === 0 ? 1.3 : 0.9}
              fill="none"
            />
          );
        })}

        {/* Soleil (disque doux) */}
        <circle cx="960" cy="620" r="180" fill="url(#sunCore)" />

        {/* Silhouette de savane (horizon doux) */}
        <path
          d="M 0 660 Q 240 620 480 640 T 960 630 T 1440 645 L 1440 720 L 0 720 Z"
          fill="url(#horizon)"
        />

        {/* Silhouette de baobab stylisée — arbre emblématique */}
        <g fill="url(#baobab)">
          {/* Tronc massif */}
          <path d="M 232 720 L 232 470 Q 226 445 236 425 Q 245 405 258 425 Q 268 445 262 470 L 262 720 Z" />
          {/* Branches nues caractéristiques du baobab */}
          <path d="M 247 430 Q 235 395 210 385 Q 195 380 190 372 Q 200 380 218 388 Q 232 395 240 415 Z" />
          <path d="M 247 430 Q 258 395 285 385 Q 300 380 305 372 Q 295 380 278 388 Q 262 395 254 415 Z" />
          <path d="M 247 430 Q 240 400 220 380 Q 210 370 208 358 Q 216 370 228 382 Q 240 395 244 412 Z" />
          <path d="M 247 430 Q 254 400 275 380 Q 285 370 288 358 Q 280 370 268 382 Q 256 395 250 412 Z" />
          <path d="M 247 425 Q 245 400 246 380 Q 248 370 250 358 Q 251 375 250 390 Q 249 408 249 420 Z" />
        </g>

        {/* Petit baobab en second plan (perspective) */}
        <g fill="#0a0503" opacity="0.85">
          <path d="M 1220 720 L 1220 590 Q 1216 578 1224 570 Q 1230 562 1238 570 Q 1244 578 1240 590 L 1240 720 Z" />
          <path d="M 1230 573 Q 1220 555 1205 550 M 1230 573 Q 1240 555 1255 550 M 1230 568 Q 1225 550 1220 540 M 1230 568 Q 1235 550 1240 540"
            stroke="#0a0503" strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
      </svg>

      {/* Vignette pour recentrer l'attention */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(10,5,3,0.55)_100%)]" />
    </div>
  );
}
