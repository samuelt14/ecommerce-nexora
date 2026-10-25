// Ilustración SVG generativa premium para periféricos tecnológicos NEXORA.
// Si el producto define `images`, se prioriza la imagen real.
export default function ProductArt({
  p,
  view = 0,
  className = "",
  size,
}) {
  if (p.images?.[view]) {
    return (
      <img
        className={className}
        src={p.images[view]}
        alt={p.name}
        loading="lazy"
        width={size}
        height={size}
      />
    );
  }

  const h = p.hue || 210;
  const fg = `hsl(${h} 80% 65%)`;
  const fgDark = `hsl(${h} 35% 15%)`;
  const fgMid = `hsl(${h} 30% 24%)`;
  const fgLight = `hsl(${h} 90% 78%)`;
  const rot = [0, -6, 8][view] || 0;
  const id = `nx-${p.id || "p"}-${view}`;

  // Patrones de fondo especializados por categoría
  const backgroundPattern = () => {
    switch (p.category) {
      case "Teclados":
        return `url(#pattern-keys-${id})`;
      case "Monitores":
        return `url(#pattern-screen-${id})`;
      case "Ratones":
        return `url(#pattern-curves-${id})`;
      case "Auriculares":
        return `url(#pattern-waves-${id})`;
      default:
        return `url(#pattern-circuit-${id})`;
    }
  };

  // Teclas para el teclado
  const keysRow0 = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((c) => (
    <rect
      key={`r0-${c}`}
      x={76 + c * 28}
      y={142}
      width="23"
      height="18"
      rx="4"
      fill={fgMid}
      stroke={fg}
      strokeWidth="1.2"
      strokeOpacity="0.7"
    />
  ));
  const keysRow1 = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((c) => (
    <rect
      key={`r1-${c}`}
      x={76 + c * 28}
      y={166}
      width="23"
      height="18"
      rx="4"
      fill={fgDark}
      stroke={fg}
      strokeWidth="1"
      strokeOpacity="0.5"
    />
  ));
  const keysRow2 = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((c) => (
    <rect
      key={`r2-${c}`}
      x={76 + c * 28}
      y={190}
      width="23"
      height="18"
      rx="4"
      fill={fgDark}
      stroke={fg}
      strokeWidth="1"
      strokeOpacity="0.5"
    />
  ));
  const keysRow3 = (
    <>
      <rect
        x={76}
        y={214}
        width="34"
        height="18"
        rx="4"
        fill={fgDark}
        stroke={fg}
        strokeWidth="1"
        strokeOpacity="0.5"
      />
      <rect
        x={116}
        y={214}
        width="142"
        height="18"
        rx="4"
        fill={fgMid}
        stroke={fg}
        strokeWidth="1.4"
        strokeOpacity="0.85"
      />
      <rect
        x={264}
        y={214}
        width="30"
        height="18"
        rx="4"
        fill={fgDark}
        stroke={fg}
        strokeWidth="1"
        strokeOpacity="0.5"
      />
      <rect
        x={300}
        y={214}
        width="24"
        height="18"
        rx="4"
        fill={fgDark}
        stroke={fg}
        strokeWidth="1"
        strokeOpacity="0.5"
      />
    </>
  );

  const S = {
    Auriculares: (
      <g>
        {/* Glow de ambientación acústica */}
        <circle cx="200" cy="230" r="105" fill={fg} opacity="0.08" />

        {/* Diadema superior y acolchado */}
        <path
          d="M108 238 C 108 120, 292 120, 292 238"
          fill="none"
          stroke={fgMid}
          strokeWidth="22"
          strokeLinecap="round"
        />
        <path
          d="M112 235 C 112 128, 288 128, 288 235"
          fill="none"
          stroke={fg}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="160 10"
        />
        <path
          d="M140 148 C 170 134, 230 134, 260 148"
          fill="none"
          stroke={fgLight}
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* Articulaciones de pivote */}
        <rect x="94" y="210" width="16" height="30" rx="4" fill={fg} opacity="0.9" />
        <rect x="290" y="210" width="16" height="30" rx="4" fill={fg} opacity="0.9" />

        {/* Copa Izquierda */}
        <rect
          x="78"
          y="218"
          width="48"
          height="96"
          rx="24"
          fill={fgDark}
          stroke={fg}
          strokeWidth="3.5"
        />
        <rect
          x="88"
          y="230"
          width="28"
          height="72"
          rx="14"
          fill={fgMid}
          stroke={fgLight}
          strokeWidth="1.5"
          opacity="0.85"
        />
        <circle cx="102" cy="266" r="6" fill={fg} />

        {/* Copa Derecha */}
        <rect
          x="274"
          y="218"
          width="48"
          height="96"
          rx="24"
          fill={fgDark}
          stroke={fg}
          strokeWidth="3.5"
        />
        <rect
          x="284"
          y="230"
          width="28"
          height="72"
          rx="14"
          fill={fgMid}
          stroke={fgLight}
          strokeWidth="1.5"
          opacity="0.85"
        />
        <circle cx="298" cy="266" r="6" fill={fg} />
      </g>
    ),

    Teclados: (
      <g>
        {/* Glow de retroiluminación RGB */}
        <rect
          x="58"
          y="126"
          width="284"
          height="124"
          rx="20"
          fill={fg}
          opacity="0.14"
        />

        {/* Chasis de aluminio biselado */}
        <rect
          x="62"
          y="130"
          width="276"
          height="116"
          rx="16"
          fill={fgDark}
          stroke={fg}
          strokeWidth="3"
        />
        <rect
          x="68"
          y="136"
          width="264"
          height="104"
          rx="12"
          fill={`hsl(${h} 25% 10%)`}
          stroke={fg}
          strokeWidth="1"
          strokeOpacity="0.4"
        />

        {/* Perilla rotatoria de volumen arriba a la derecha */}
        <circle cx="316" cy="148" r="7" fill={fg} opacity="0.9" />
        <circle cx="316" cy="148" r="3" fill={fgDark} />

        {/* Filas de teclas mecánicas */}
        {keysRow0}
        {keysRow1}
        {keysRow2}
        {keysRow3}
      </g>
    ),

    Ratones: (
      <g>
        {/* Glow de sensor óptico / aura de movimiento */}
        <ellipse cx="200" cy="205" rx="70" ry="110" fill={fg} opacity="0.1" />

        {/* Cuerpo ergonómico esculpido */}
        <path
          d="M150 160 C 146 110, 180 84, 200 84 C 220 84, 254 110, 250 160 C 254 220, 246 295, 200 295 C 154 295, 146 220, 150 160 Z"
          fill={fgDark}
          stroke={fg}
          strokeWidth="3.5"
        />

        {/* División de botones izquierdo y derecho */}
        <path d="M200 85 V 172" stroke={fg} strokeWidth="2.5" />
        <path
          d="M152 172 C 175 186, 225 186, 248 172"
          fill="none"
          stroke={fg}
          strokeWidth="2"
          strokeOpacity="0.6"
        />

        {/* Scroll wheel de aluminio estriado */}
        <rect
          x="193"
          y="114"
          width="14"
          height="34"
          rx="7"
          fill={fgMid}
          stroke={fgLight}
          strokeWidth="2"
        />
        <line x1="193" y1="124" x2="207" y2="124" stroke={fgLight} strokeWidth="1.5" />
        <line x1="193" y1="131" x2="207" y2="131" stroke={fgLight} strokeWidth="1.5" />
        <line x1="193" y1="138" x2="207" y2="138" stroke={fgLight} strokeWidth="1.5" />

        {/* Agarre lateral para el pulgar y botones de navegación */}
        <path
          d="M148 175 C 144 195, 144 215, 149 235"
          fill="none"
          stroke={fgLight}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <rect x="142" y="185" width="4" height="15" rx="2" fill={fg} />
        <rect x="142" y="204" width="4" height="15" rx="2" fill={fg} />

        {/* Logo / acento sutil en palma */}
        <circle cx="200" cy="245" r="9" fill="none" stroke={fg} strokeWidth="2" strokeDasharray="3 3" />
        <circle cx="200" cy="245" r="4" fill={fg} opacity="0.8" />
      </g>
    ),

    Monitores: (
      <g>
        {/* Glow de la pantalla */}
        <rect
          x="44"
          y="78"
          width="312"
          height="196"
          rx="14"
          fill={fg}
          opacity="0.12"
        />

        {/* Bisel y marco del monitor */}
        <rect
          x="48"
          y="82"
          width="304"
          height="188"
          rx="10"
          fill={fgDark}
          stroke={fg}
          strokeWidth="3.5"
        />

        {/* Panel activo con degradado y wallpaper interactivo */}
        <rect
          x="56"
          y="90"
          width="288"
          height="172"
          rx="6"
          fill={`hsl(${h} 45% 14%)`}
        />

        {/* Gráfico de paisaje futurista en pantalla */}
        <path
          d="M56 215 L 120 165 L 180 205 L 240 145 L 344 225 L 344 262 L 56 262 Z"
          fill={fgMid}
          opacity="0.75"
        />
        <path
          d="M110 262 L 170 215 L 230 250 L 290 190 L 344 240 L 344 262 Z"
          fill={fg}
          opacity="0.3"
        />
        <circle cx="270" cy="130" r="18" fill={fgLight} opacity="0.6" />

        {/* Barra de menú sutil superior en pantalla */}
        <line x1="68" y1="102" x2="110" y2="102" stroke={fg} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        <circle cx="320" cy="102" r="3" fill={fg} />
        <circle cx="328" cy="102" r="3" fill={fg} />

        {/* Cuello del soporte y peana sólida */}
        <path d="M190 270 L 186 322 H 214 L 210 270 Z" fill={fgMid} stroke={fg} strokeWidth="2" />
        <rect
          x="142"
          y="322"
          width="116"
          height="12"
          rx="6"
          fill={fgDark}
          stroke={fg}
          strokeWidth="2.5"
        />
      </g>
    ),

    Accesorios: (
      <g>
        {/* Glow del accesorio */}
        <rect
          x="68"
          y="180"
          width="264"
          height="88"
          rx="24"
          fill={fg}
          opacity="0.1"
        />

        {/* Chasis de aluminio del hub */}
        <rect
          x="72"
          y="184"
          width="256"
          height="80"
          rx="20"
          fill={fgDark}
          stroke={fg}
          strokeWidth="3"
        />

        {/* Puertos USB-C y USB-A frontales */}
        <rect x="96" y="214" width="28" height="14" rx="4" fill={fgMid} stroke={fgLight} strokeWidth="1.5" />
        <rect x="136" y="214" width="28" height="14" rx="4" fill={fgMid} stroke={fgLight} strokeWidth="1.5" />
        <rect x="176" y="214" width="38" height="14" rx="3" fill={fgMid} stroke={fg} strokeWidth="1.5" />
        <rect x="226" y="214" width="38" height="14" rx="3" fill={fgMid} stroke={fg} strokeWidth="1.5" />

        {/* Ranuras de tarjeta SD y MicroSD */}
        <rect x="276" y="210" width="36" height="6" rx="2" fill={fg} opacity="0.85" />
        <rect x="282" y="222" width="24" height="4" rx="1.5" fill={fg} opacity="0.85" />

        {/* Cable trenzado con conector reforzado */}
        <path
          d="M72 224 C 34 224, 30 140, 78 126"
          fill="none"
          stroke={fgMid}
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M72 224 C 34 224, 30 140, 78 126"
          fill="none"
          stroke={fg}
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        <rect x="74" y="116" width="32" height="20" rx="4" fill={fgDark} stroke={fg} strokeWidth="2" />
        <rect x="106" y="121" width="14" height="10" rx="2" fill={fgLight} />

        {/* LED indicador de energía */}
        <circle cx="304" cy="198" r="4" fill={fg} />
      </g>
    ),
  };

  return (
    <svg
      className={className}
      viewBox="0 0 400 400"
      width={size}
      height={size}
      role="img"
      aria-label={`${p.name} (ilustración de demostración)`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Fondo radial primario */}
        <radialGradient id={id} cx="50%" cy="40%" r="75%">
          <stop offset="0%" stopColor={`hsl(${h} 50% ${20 + view * 3}%)`} />
          <stop offset="100%" stopColor={`hsl(${h} 25% 7%)`} />
        </radialGradient>

        {/* PATRÓN 1: Teclas mecánicas para teclados */}
        <pattern
          id={`pattern-keys-${id}`}
          width="32"
          height="32"
          patternUnits="userSpaceOnUse"
        >
          <rect
            x="4"
            y="4"
            width="24"
            height="24"
            rx="5"
            fill="none"
            stroke={fg}
            strokeWidth="1.2"
            strokeOpacity="0.16"
          />
          <rect
            x="7"
            y="7"
            width="18"
            height="18"
            rx="3"
            fill={fg}
            fillOpacity="0.04"
          />
        </pattern>

        {/* PATRÓN 2: Cuadrícula de pantalla / píxeles para monitores */}
        <pattern
          id={`pattern-screen-${id}`}
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <line
            x1="0"
            y1="12"
            x2="24"
            y2="12"
            stroke={fg}
            strokeWidth="0.8"
            strokeDasharray="2,3"
            strokeOpacity="0.18"
          />
          <line
            x1="12"
            y1="0"
            x2="12"
            y2="24"
            stroke={fg}
            strokeWidth="0.8"
            strokeDasharray="2,3"
            strokeOpacity="0.18"
          />
          <circle cx="12" cy="12" r="1.5" fill={fg} fillOpacity="0.25" />
        </pattern>

        {/* PATRÓN 3: Curvas ergonómicas para ratones */}
        <pattern
          id={`pattern-curves-${id}`}
          width="48"
          height="48"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M -12 24 C 8 8, 28 40, 60 24"
            fill="none"
            stroke={fg}
            strokeWidth="1.4"
            strokeOpacity="0.18"
          />
          <path
            d="M -12 40 C 8 24, 28 56, 60 40"
            fill="none"
            stroke={fg}
            strokeWidth="1"
            strokeOpacity="0.1"
          />
        </pattern>

        {/* PATRÓN 4: Ondas de sonido para auriculares */}
        <pattern
          id={`pattern-waves-${id}`}
          width="36"
          height="36"
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx="18"
            cy="18"
            r="14"
            fill="none"
            stroke={fg}
            strokeWidth="1"
            strokeDasharray="3 3"
            strokeOpacity="0.18"
          />
          <circle
            cx="18"
            cy="18"
            r="7"
            fill="none"
            stroke={fg}
            strokeWidth="1"
            strokeOpacity="0.1"
          />
        </pattern>

        {/* PATRÓN 5: Circuitos y pistas de cobre para accesorios */}
        <pattern
          id={`pattern-circuit-${id}`}
          width="36"
          height="36"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 18 h14 l4 4 h18 M18 0 v14 l4 4 v18"
            fill="none"
            stroke={fg}
            strokeWidth="1.2"
            strokeOpacity="0.18"
          />
          <circle cx="18" cy="18" r="2.5" fill={fg} fillOpacity="0.25" />
        </pattern>
      </defs>

      {/* Fondo degradado base */}
      <rect width="400" height="400" fill={`url(#${id})`} />

      {/* Capa de textura con el patrón temático correspondiente */}
      <rect width="400" height="400" fill={backgroundPattern()} />

      {/* Ilustración del producto orientada según la vista */}
      <g transform={`rotate(${rot} 200 200)`}>
        {S[p.category] || S.Accesorios}
      </g>
    </svg>
  );
}
