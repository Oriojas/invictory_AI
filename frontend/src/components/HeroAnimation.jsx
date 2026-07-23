import React from 'react';

export default function HeroAnimation() {
  return (
    <div style={{
      width: '100%',
      maxWidth: '1240px',
      margin: '0 auto',
      background: 'rgba(255, 255, 255, 0.95)',
      border: '1px solid rgba(0, 103, 177, 0.15)',
      borderRadius: '20px',
      boxShadow: '0 16px 40px rgba(0, 103, 177, 0.08)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 380"
        role="img"
        aria-label="Invictory AI workflow animation"
        style={{ display: 'block', width: '100%', height: 'auto' }}
      >
        <style>{`
          :root {
            --blue: #0067b1;
            --yellow: #ffd000;
            --graphite: #575756;
            --bg: transparent;
          }

          .bg { fill: var(--bg); }

          .s-blue, .s-yellow, .s-graphite, .t-blue, .t-yellow, .t-graphite {
            fill: none;
            stroke-linecap: round;
            stroke-linejoin: round;
            vector-effect: non-scaling-stroke;
          }

          .s-blue { stroke: var(--blue); stroke-width: 2.4; }
          .s-yellow { stroke: var(--yellow); stroke-width: 2.4; }
          .s-graphite { stroke: var(--graphite); stroke-width: 2.0; }

          .t-blue { stroke: var(--blue); stroke-width: 1.6; }
          .t-yellow { stroke: var(--yellow); stroke-width: 1.6; }
          .t-graphite { stroke: var(--graphite); stroke-width: 1.4; }

          .fill-blue { fill: var(--blue); }
          .fill-yellow { fill: var(--yellow); }
          .fill-graphite { fill: var(--graphite); }

          /* Escenas con opacidad base constante de 0.35 e iluminación al activarse */
          .scene {
            opacity: 0.35;
            transition: opacity 0.4s ease, filter 0.4s ease;
          }

          .draw {
            stroke-dasharray: 900;
            stroke-dashoffset: 900;
          }

          .scene-1 { animation: scene1 12s cubic-bezier(.4,0,.2,1) infinite; }
          .scene-2 { animation: scene2 12s cubic-bezier(.4,0,.2,1) infinite; }
          .scene-3 { animation: scene3 12s cubic-bezier(.4,0,.2,1) infinite; }
          .scene-4 { animation: scene4 12s cubic-bezier(.4,0,.2,1) infinite; }
          .scene-5 { animation: scene5 12s cubic-bezier(.4,0,.2,1) infinite; }

          .scene-1 .draw { animation: draw1 12s ease-in-out infinite; }
          .scene-2 .draw { animation: draw2 12s ease-in-out infinite; }
          .scene-3 .draw { animation: draw3 12s ease-in-out infinite; }
          .scene-4 .draw { animation: draw4 12s ease-in-out infinite; }
          .scene-5 .draw { animation: draw5 12s ease-in-out infinite; }

          .float-soft { animation: floatSoft 3.4s ease-in-out infinite; }
          .pulse-soft { animation: pulseSoft 1.8s ease-in-out infinite; }
          .pulse-soft-delayed { animation: pulseSoft 1.8s ease-in-out .5s infinite; }
          .scanline { animation: scan 2.2s linear infinite; }
          .wave-left { animation: waveLeft 1.5s ease-in-out infinite; }
          .wave-right { animation: waveRight 1.5s ease-in-out infinite; }
          .blink { animation: blink 3.2s linear infinite; }
          .spark { animation: sparkle 1.6s ease-in-out infinite; }
          .rec-dot { animation: recBlink 1.2s ease-in-out infinite; }
          .progress {
            stroke-dasharray: 880;
            stroke-dashoffset: 880;
            animation: progressLine 12s linear infinite;
          }
          .node1 { animation: node1 12s linear infinite; }
          .node2 { animation: node2 12s linear infinite; }
          .node3 { animation: node3 12s linear infinite; }
          .node4 { animation: node4 12s linear infinite; }
          .node5 { animation: node5 12s linear infinite; }

          @keyframes scene1 {
            0%, 2%   { opacity: 0.35; filter: none; }
            4%, 18%  { opacity: 1; filter: drop-shadow(0 4px 10px rgba(0,103,177,0.35)); }
            22%,100% { opacity: 0.35; filter: none; }
          }
          @keyframes scene2 {
            0%, 18%  { opacity: 0.35; filter: none; }
            22%, 38% { opacity: 1; filter: drop-shadow(0 4px 10px rgba(255,208,0,0.4)); }
            42%,100% { opacity: 0.35; filter: none; }
          }
          @keyframes scene3 {
            0%, 38%  { opacity: 0.35; filter: none; }
            42%, 58% { opacity: 1; filter: drop-shadow(0 4px 10px rgba(0,103,177,0.35)); }
            62%,100% { opacity: 0.35; filter: none; }
          }
          @keyframes scene4 {
            0%, 58%  { opacity: 0.35; filter: none; }
            62%, 78% { opacity: 1; filter: drop-shadow(0 4px 10px rgba(255,208,0,0.4)); }
            82%,100% { opacity: 0.35; filter: none; }
          }
          @keyframes scene5 {
            0%, 78%  { opacity: 0.35; filter: none; }
            82%, 98% { opacity: 1; filter: drop-shadow(0 4px 10px rgba(0,103,177,0.35)); }
            100%     { opacity: 0.35; filter: none; }
          }

          @keyframes draw1 {
            0%, 3%   { stroke-dashoffset: 900; }
            9%, 100% { stroke-dashoffset: 0; }
          }
          @keyframes draw2 {
            0%, 21%  { stroke-dashoffset: 900; }
            27%, 100% { stroke-dashoffset: 0; }
          }
          @keyframes draw3 {
            0%, 41%  { stroke-dashoffset: 900; }
            47%, 100% { stroke-dashoffset: 0; }
          }
          @keyframes draw4 {
            0%, 61%  { stroke-dashoffset: 900; }
            67%, 100% { stroke-dashoffset: 0; }
          }
          @keyframes draw5 {
            0%, 81%  { stroke-dashoffset: 900; }
            87%, 100% { stroke-dashoffset: 0; }
          }

          @keyframes floatSoft {
            0%,100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
          }
          @keyframes pulseSoft {
            0%,100% { opacity: .4; transform: scale(.95); }
            50% { opacity: 1; transform: scale(1.1); }
          }
          @keyframes scan {
            0% { transform: translateY(-18px); opacity: 0; }
            20% { opacity: 1; }
            80% { opacity: 1; }
            100% { transform: translateY(18px); opacity: 0; }
          }
          @keyframes waveLeft {
            0%,100% { transform: scaleY(.65); opacity: .35; }
            50% { transform: scaleY(1); opacity: 1; }
          }
          @keyframes waveRight {
            0%,100% { transform: scaleY(1); opacity: 1; }
            50% { transform: scaleY(.65); opacity: .35; }
          }
          @keyframes blink {
            0%, 46%, 48%, 100% { transform: scaleY(1); }
            47% { transform: scaleY(.12); }
          }
          @keyframes sparkle {
            0%,100% { opacity: .2; transform: scale(.85) rotate(0deg); }
            50% { opacity: 1; transform: scale(1.15) rotate(18deg); }
          }
          @keyframes recBlink {
            0%,100% { opacity: .4; }
            50% { opacity: 1; }
          }
          @keyframes progressLine {
            0% { stroke-dashoffset: 880; }
            96%,100% { stroke-dashoffset: 0; }
          }
          @keyframes node1 { 0%,3% { fill: #fff; stroke: var(--blue); } 6%,100% { fill: var(--blue); stroke: var(--blue); } }
          @keyframes node2 { 0%,22% { fill: #fff; stroke: var(--yellow); } 25%,100% { fill: var(--yellow); stroke: var(--yellow); } }
          @keyframes node3 { 0%,42% { fill: #fff; stroke: var(--blue); } 45%,100% { fill: var(--blue); stroke: var(--blue); } }
          @keyframes node4 { 0%,62% { fill: #fff; stroke: var(--yellow); } 65%,100% { fill: var(--yellow); stroke: var(--yellow); } }
          @keyframes node5 { 0%,82% { fill: #fff; stroke: var(--blue); } 85%,100% { fill: var(--blue); stroke: var(--blue); } }

          /* Etiquetas de los pasos en el diagrama */
          .step-label {
            font-family: 'Manrope', system-ui, sans-serif;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.5px;
            text-anchor: middle;
          }
        `}</style>

        <rect className="bg" width="1200" height="380" rx="20"/>

        {/* Línea Base y Conexiones */}
        <path d="M160 300 H1040" className="t-blue" opacity=".25"/>
        <path d="M160 300 H1040" className="s-blue progress" opacity=".75"/>

        {/* Nodos de Progreso */}
        <circle cx="160" cy="300" r="10" className="s-blue node1"/>
        <circle cx="380" cy="300" r="10" className="s-yellow node2"/>
        <circle cx="600" cy="300" r="10" className="s-blue node3"/>
        <circle cx="820" cy="300" r="10" className="s-yellow node4"/>
        <circle cx="1040" cy="300" r="10" className="s-blue node5"/>

        {/* Textos descriptivos debajo de los nodos */}
        <text x="160" y="332" className="step-label" fill="#0067b1">01. INVENTARIO ERP</text>
        <text x="380" y="332" className="step-label" fill="#575756">02. CAPTURA FOTO</text>
        <text x="600" y="332" className="step-label" fill="#0067b1">03. DICTADO VOZ</text>
        <text x="820" y="332" className="step-label" fill="#575756">04. AGENTE IA</text>
        <text x="1040" y="332" className="step-label" fill="#0067b1">05. CONCILIACIÓN PDF</text>

        {/* Flechas conectoras ajustadas */}
        <path d="M235 160 H302" className="t-blue"/>
        <path d="M294 154 l10 6 -10 6" className="t-blue"/>
        <path d="M455 160 H522" className="t-yellow"/>
        <path d="M514 154 l10 6 -10 6" className="t-yellow"/>
        <path d="M675 160 H742" className="t-blue"/>
        <path d="M734 154 l10 6 -10 6" className="t-blue"/>
        <path d="M895 160 H962" className="t-yellow"/>
        <path d="M954 154 l10 6 -10 6" className="t-yellow"/>

        {/* Step 1: Caja de inventario - Escalado compacto al 72% */}
        <g transform="translate(160, 150) scale(0.72)">
          <g className="scene scene-1">
            <g className="float-soft">
              <path className="s-blue draw" d="M-44 -6 L0 -30 L44 -6 L0 18 Z"/>
              <path className="s-blue draw" d="M-44 -6 V42 L0 66 L44 42 V-6"/>
              <path className="s-yellow draw" d="M0 18 V66"/>
              <path className="s-yellow draw" d="M-21 -17 L21 5"/>
              <path className="s-blue draw" d="M0 -30 V18"/>
              <path className="t-blue draw" d="M-70 22 H-90 M-64 12 H-82" opacity=".75"/>
              <path className="t-yellow draw" d="M14 -54 A70 70 0 0 1 68 -30" opacity=".8"/>
              <path className="t-blue draw" d="M-46 60 Q0 66 46 60" opacity=".32"/>
              <path className="t-graphite draw" d="M24 30 l8 -7 M31 38 l8 -7 M34 44 h18" opacity=".9"/>
            </g>
          </g>
        </g>

        {/* Step 2: Captura por foto / cámara - Escalado compacto al 72% */}
        <g transform="translate(380, 150) scale(0.72)">
          <g className="scene scene-2">
            <g className="float-soft">
              <path className="s-blue draw" d="M-60 -52 h24 M-60 -52 v24 M60 -52 h-24 M60 -52 v24 M-60 52 h24 M-60 52 v-24 M60 52 h-24 M60 52 v-24"/>
              <circle cx="22" cy="-38" r="4" className="fill-yellow rec-dot"/>
              <path className="s-graphite draw" d="M-30 -8 L0 -25 L30 -8 L0 8 Z"/>
              <path className="s-graphite draw" d="M-30 -8 V26 L0 43 L30 26 V-8"/>
              <path className="s-blue draw" d="M0 -25 V8"/>
              <path className="s-blue draw" d="M-14 -15 L14 -1"/>
              <path className="t-blue scanline" d="M-46 -14 H46" opacity=".82"/>
              <path className="t-yellow draw" d="M-70 0 H-50 M50 0 H70" opacity=".8"/>
              <circle cx="0" cy="70" r="16" className="s-graphite draw"/>
              <rect x="-6.5" y="65" width="13" height="9" rx="1.6" className="s-blue draw"/>
              <path d="M-2 65 l2 -4 h4 l2 4" className="t-blue draw"/>
            </g>
          </g>
        </g>

        {/* Step 3: Dictado por voz / micrófono - Escalado compacto al 72% */}
        <g transform="translate(600, 150) scale(0.72)">
          <g className="scene scene-3">
            <g className="float-soft">
              <rect x="-20" y="-30" width="40" height="88" rx="20" className="s-blue draw"/>
              <path d="M-38 26 v5 c0 34 25 60 38 60 s38-26 38-60 v-5" className="s-blue draw"/>
              <path d="M0 91 v21 M-18 112 h36" className="s-yellow draw"/>
              <g transform="translate(-60,8)" className="wave-left">
                <path d="M-18 0 v7 M-9 -9 v25 M0 -16 v38 M9 -9 v25 M18 0 v7" className="s-blue"/>
              </g>
              <g transform="translate(60,8)" className="wave-right">
                <path d="M-18 0 v7 M-9 -9 v25 M0 -16 v38 M9 -9 v25 M18 0 v7" className="s-yellow"/>
              </g>
              <path d="M-30 -64 A78 78 0 0 1 30 -64" className="t-blue draw" opacity=".78"/>
              <path d="M30 -64 A78 78 0 0 1 48 -50" className="t-yellow draw" opacity=".82"/>
              <circle cx="48" cy="-50" r="3" className="fill-yellow pulse-soft"/>
            </g>
          </g>
        </g>

        {/* Step 4: Agente IA Robot - Escalado compacto al 72% */}
        <g transform="translate(820, 150) scale(0.72)">
          <g className="scene scene-4">
            <g className="float-soft">
              <rect x="-40" y="-4" width="80" height="58" rx="16" className="s-blue draw"/>
              <path d="M0 -4 v-16" className="s-yellow draw"/>
              <circle cx="0" cy="-26" r="5.5" className="s-yellow draw"/>
              <path d="M-50 10 h10 M40 10 h10" className="t-blue draw"/>
              <circle cx="-14" cy="16" r="4.2" className="s-blue draw"/>
              <circle cx="14" cy="16" r="4.2" className="s-blue draw"/>
              <path d="M-10 34 h20" className="s-graphite draw"/>
              <path d="M-20 54 v14 M20 54 v14" className="t-blue draw"/>
              <path d="M-32 62 v8 M32 62 v8" className="t-yellow draw"/>
              <g className="blink">
                <path d="M-18 16 h8" className="t-yellow"/>
                <path d="M10 16 h8" className="t-yellow"/>
              </g>
              <path d="M-76 -8 q-10 8 -10 18 t10 18" className="t-graphite draw"/>
              <path d="M76 -8 q10 8 10 18 t-10 18" className="t-graphite draw"/>
              <path d="M-72 -16 l-10 -8 M-82 24 l-12 8 M72 -16 l10 -8 M82 24 l12 8" className="t-blue draw"/>
              <circle cx="-82" cy="-24" r="3.2" className="s-graphite pulse-soft"/>
              <circle cx="-94" cy="32" r="3.2" className="s-yellow pulse-soft-delayed"/>
              <circle cx="82" cy="-24" r="3.2" className="s-blue pulse-soft"/>
              <circle cx="94" cy="32" r="3.2" className="s-graphite pulse-soft-delayed"/>
              <path d="M-68 -48 A86 86 0 0 1 68 -48" className="t-graphite draw" opacity=".72"/>
            </g>
          </g>
        </g>

        {/* Step 5: Trofeo de Victoria - Trazado Simétrico y Proporcional Escalado al 72% */}
        <g transform="translate(1040, 150) scale(0.72)">
          <g className="scene scene-5">
            <g className="float-soft">
              {/* Copa Principal Simétrica */}
              <path d="M-26 -24 H26 V12 C26 38 14 54 0 54 C-14 54 -26 38 -26 12 Z" className="s-blue draw"/>
              {/* Asas Izquierda y Derecha Simétricas */}
              <path d="M-26 -10 H-40 V10 C-40 28 -26 36 -12 40" className="s-blue draw"/>
              <path d="M26 -10 H40 V10 C40 28 26 36 12 40" className="s-blue draw"/>
              {/* Tallo y Base Estable */}
              <path d="M0 54 V74 M-24 74 H24 M-18 64 H18" className="s-blue draw"/>
              {/* Estrella de Certificación Central */}
              <path d="M0 -4 L4 4 L12 5 L6 11 L8 19 L0 15 L-8 19 L-6 11 L-12 5 L-4 4 Z" className="s-yellow draw"/>
              {/* Sparkles de Brillo */}
              <g className="spark">
                <path d="M52 -24 v14 M45 -17 h14" className="t-yellow"/>
                <path d="M-52 -16 l-8 -8 M60 12 l8 8 M62 -20 l8 -8" className="t-yellow"/>
                <path d="M-44 76 q14 8 30 6" className="t-blue"/>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
