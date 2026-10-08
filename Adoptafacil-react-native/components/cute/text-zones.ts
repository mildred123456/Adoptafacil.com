import { useCallback, useEffect, useRef } from "react";
import { Platform } from "react-native";

/**
 * Detecta dónde hay letras en pantalla para que las huellitas no pisen textos.
 * Solo decorativo: se usa para decidir si se dibuja o no una pisada.
 *
 * - Web: consulta el DOM en el punto exacto (textos reales, inputs, imágenes).
 * - Android/iOS: los ThemedText se registran aquí y se mide su posición
 *   en la ventana con measureInWindow.
 */

const IS_WEB = Platform.OS === "web";
const MARGIN = 6;

export type Zone = { x: number; y: number; w: number; h: number };

// ---------------- Registro de textos (nativo) ----------------

type Measurable = {
  measureInWindow?: (cb: (x: number, y: number, w: number, h: number) => void) => void;
};

const nodes = new Set<Measurable>();

/** Ref para colocar en un <Text>; registra el nodo mientras esté montado. */
export function useCuteTextZone() {
  const current = useRef<Measurable | null>(null);

  useEffect(
    () => () => {
      if (current.current) nodes.delete(current.current);
    },
    []
  );

  return useCallback((node: Measurable | null) => {
    if (IS_WEB) return;
    if (current.current) nodes.delete(current.current);
    current.current = node;
    if (node) nodes.add(node);
  }, []);
}

/** Mide todos los textos registrados (en coordenadas de la ventana). */
export function measureTextZones(): Promise<Zone[]> {
  if (IS_WEB) return Promise.resolve([]);
  const list = Array.from(nodes);
  return Promise.all(
    list.map(
      (n) =>
        new Promise<Zone | null>((resolve) => {
          const timeout = setTimeout(() => resolve(null), 300);
          try {
            n.measureInWindow?.((x, y, w, h) => {
              clearTimeout(timeout);
              resolve(w > 0 && h > 0 ? { x, y, w, h } : null);
            });
          } catch {
            clearTimeout(timeout);
            resolve(null);
          }
        })
    )
  ).then((zones) => zones.filter((z): z is Zone => z !== null));
}

// ---------------- Comprobación en un punto ----------------

const BLOCKING_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT", "IMG", "BUTTON"]);

function hasOwnText(el: Element) {
  for (const child of Array.from(el.childNodes)) {
    if (child.nodeType === 3 && child.textContent && child.textContent.trim()) return true;
  }
  return false;
}

/** Web: ¿hay letras (o un campo/imagen) cerca de (x, y)? Usa el tamaño real del texto. */
function webHasTextAt(x: number, y: number, r: number): boolean {
  if (typeof document === "undefined" || !document.elementsFromPoint) return false;
  const probes = [
    [x, y],
    [x - r, y - r],
    [x + r, y - r],
    [x - r, y + r],
    [x + r, y + r],
  ];
  for (const [px, py] of probes) {
    const els = document.elementsFromPoint(px, py).slice(0, 10);
    for (const el of els) {
      if (BLOCKING_TAGS.has(el.tagName)) return true;
      if (!hasOwnText(el)) continue;
      // Rectángulos de las letras reales (no de toda la caja del elemento)
      const range = document.createRange();
      range.selectNodeContents(el);
      for (const rect of Array.from(range.getClientRects())) {
        if (
          px >= rect.left - MARGIN &&
          px <= rect.right + MARGIN &&
          py >= rect.top - MARGIN &&
          py <= rect.bottom + MARGIN
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

/** ¿La huellita de radio r en (x, y) quedaría encima de algún texto? */
export function isOverText(x: number, y: number, r: number, zones: Zone[]): boolean {
  if (IS_WEB) return webHasTextAt(x, y, r);
  return zones.some(
    (z) =>
      x + r > z.x - MARGIN &&
      x - r < z.x + z.w + MARGIN &&
      y + r > z.y - MARGIN &&
      y - r < z.y + z.h + MARGIN
  );
}
