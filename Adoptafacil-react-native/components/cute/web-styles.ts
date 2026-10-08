import { Platform } from "react-native";

import { Palette, Radius } from "@/constants/palette";

/**
 * Estilos globales decorativos SOLO para la versión web (expo start --web).
 * Inserta una hoja de estilos propia con id "cute-web-styles"; no toca
 * ningún elemento, clase ni id existente. En Android/iOS no hace nada.
 */

// Flecha negra clásica con un borde blanco fino (se ve sobre cualquier fondo).
// El navegador dibuja el cursor por encima de todo el contenido de la página.
const arrowSvg =
  `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>` +
  `<path d='M3 2 L3 19.5 L7.6 15.2 L10.7 22 L13.6 20.7 L10.5 14 L16.8 14 Z' ` +
  `fill='black' stroke='white' stroke-width='1.4' stroke-linejoin='round'/>` +
  `</svg>`;

const arrowCursor = `url("data:image/svg+xml,${encodeURIComponent(arrowSvg)}") 3 2`;

// Cursor de escritura ("I") negro con un contorno blanco muy fino.
// Reemplaza al del sistema, que en Windows puede verse blanco sobre fondos claros.
const iBeamPath = "M8 3.5 H16 M8 20.5 H16 M12 3.5 V20.5";
const iBeamSvg =
  `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>` +
  `<path d='${iBeamPath}' fill='none' stroke='white' stroke-width='4' stroke-linecap='round'/>` +
  `<path d='${iBeamPath}' fill='none' stroke='#111111' stroke-width='2' stroke-linecap='round'/>` +
  `</svg>`;

const iBeamCursor = `url("data:image/svg+xml,${encodeURIComponent(iBeamSvg)}") 12 12`;

// Paleta única publicada como variables CSS (--af-background, --af-primary, …)
const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());
const cssVars = Object.entries(Palette)
  .map(([name, value]) => `  --af-${kebab(name)}: ${value};`)
  .join("\n");

const css = `
/* Paleta de AdoptaFácil (misma fuente que constants/palette.ts) */
:root {
${cssVars}
  --af-radius-card: ${Radius.card}px;
  --af-radius-field: ${Radius.field}px;
  color-scheme: light; /* estilo claro siempre, también en modo oscuro */
}
html, body { background: var(--af-background); }

/* Listas desplegables (Picker): sin el marco gris cuadrado del navegador */
select {
  font-family: 'Nunito', system-ui, sans-serif !important;
  color: var(--af-text);
  background-color: transparent;
  border: none !important;
  outline: none;
  padding: 0 12px;
  border-radius: var(--af-radius-field);
}
select option { background: var(--af-surface); color: var(--af-text); }
html, body, body * { cursor: ${arrowCursor}, default; }

/* Campos de texto en TODAS las pantallas (login: correo y contraseña,
   registro, buscador, filtros, comunidad, gestionar mascotas):
   cursor de escritura negro, rayita parpadeante negra y texto bien legible.
   Los selectores con [type] y :hover/:focus suben la especificidad para
   que ninguna otra regla pueda volver a poner un cursor claro. */
html body input,
html body input[type="email"],
html body input[type="password"],
html body input[type="text"],
html body input[type="search"],
html body textarea,
html body [contenteditable="true"],
html body input:hover,
html body input:focus,
html body textarea:hover,
html body textarea:focus {
  cursor: ${iBeamCursor}, text !important;
  caret-color: #000 !important;
  color: var(--af-text) !important;
  -webkit-text-fill-color: var(--af-text) !important;
}
html body input::placeholder,
html body textarea::placeholder {
  color: var(--af-text-muted) !important;
  -webkit-text-fill-color: var(--af-text-muted) !important;
  opacity: 1 !important;
}
/* Autocompletado del navegador (correo/contraseña guardados):
   sin fondo amarillo, texto oscuro y rayita negra */
html body input:-webkit-autofill,
html body input:-webkit-autofill:hover,
html body input:-webkit-autofill:focus,
html body textarea:-webkit-autofill {
  -webkit-text-fill-color: var(--af-text) !important;
  caret-color: #000 !important;
  -webkit-box-shadow: 0 0 0 1000px var(--af-surface) inset !important;
}

[tabindex="0"], [role="button"], a {
  cursor: ${arrowCursor}, pointer !important;
  transition: transform .25s cubic-bezier(.34,1.56,.64,1), filter .25s ease, box-shadow .25s ease;
}
[tabindex="0"]:hover, [role="button"]:hover {
  transform: translateY(-3px) scale(1.02);
  filter: brightness(1.04) saturate(1.08);
}
/* Al presionar, el botón NO cambia de tamaño ni de posición (si se moviera,
   un clic cerca del borde podría "salirse" del botón y cancelarse);
   solo se oscurece un poquito como respuesta visual. */
[tabindex="0"]:active, [role="button"]:active {
  filter: brightness(.92) saturate(1.1);
  transition-duration: .08s;
}

input, textarea, select {
  font-family: 'Nunito', system-ui, sans-serif !important;
  transition: box-shadow .25s ease, transform .25s ease;
}
input:focus, textarea:focus, select:focus {
  outline: none !important;
  box-shadow: 0 0 0 4px var(--af-primary-soft) !important;
  transform: translateY(-1px);
}
:focus-visible { outline: 3px dashed var(--af-primary) !important; outline-offset: 3px; }

img { transition: transform .4s cubic-bezier(.34,1.56,.64,1); }
img:hover { transform: scale(1.04) rotate(-1deg); }

::selection { background: var(--af-primary-soft); color: var(--af-text); }

* { scrollbar-width: thin; scrollbar-color: var(--af-border-strong) var(--af-background); }
::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-track { background: var(--af-background); }
::-webkit-scrollbar-thumb {
  background: var(--af-border-strong);
  border-radius: 10px; border: 2px solid var(--af-background);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition: none !important; animation: none !important; }
}
`;

export function injectCuteWebStyles() {
  if (Platform.OS !== "web" || typeof document === "undefined") return;

  if (!document.getElementById("cute-web-font")) {
    const font = document.createElement("link");
    font.id = "cute-web-font";
    font.rel = "stylesheet";
    font.href =
      "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap";
    document.head.appendChild(font);
  }

  // Si la hoja ya existe (p. ej. tras una recarga en caliente) se actualiza
  // su contenido, para que nunca quede una versión vieja de los estilos.
  let style = document.getElementById("cute-web-styles");
  if (!style) {
    style = document.createElement("style");
    style.id = "cute-web-styles";
    document.head.appendChild(style);
  }
  if (style.textContent !== css) style.textContent = css;
}

// Se aplica apenas se carga este módulo (antes de mostrar el login),
// sin esperar a que se monte ningún componente.
injectCuteWebStyles();

export const cuteFontFamily = Platform.select({
  web: "'Nunito', 'Quicksand', system-ui, sans-serif",
  default: undefined,
});
