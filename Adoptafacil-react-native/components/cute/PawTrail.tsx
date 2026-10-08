import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  AccessibilityInfo,
  Platform,
  StyleSheet,
  View,
  useWindowDimensions,
  type GestureResponderEvent,
} from "react-native";

import {
  PAW_GAP,
  ParticleView,
  pawRadius,
  pick,
  rand,
  type NewParticle,
  type Particle,
} from "./PawParticle";
import { SPARKLES } from "./palette";
import { isOverText } from "./text-zones";
import { injectCuteWebStyles } from "./web-styles";

/**
 * Capa decorativa global de lo que sigue al PUNTERO (fija a la pantalla):
 *
 * - Toque / clic: estallido de huellita + corazoncitos.
 * - Mouse (web): rastro suave de huellitas detrás de la flecha.
 * - Scroll (web): burbujitas que suben desde las esquinas.
 *
 * Las huellitas que caminan solas ya NO están aquí: viven dentro de cada
 * página (PawGround) para que se desplacen con el contenido al hacer scroll.
 *
 * La capa tiene pointerEvents "none" y el handler de captura devuelve false:
 * nunca bloquea clics ni le quita un toque a botones, inputs o listas.
 */

const NATIVE = Platform.OS !== "web";
const MAX_PARTICLES = 60;

// Colores del estallido del clic
const BURST_COLORS = [
  { color: "#ec7fae", outline: "#c2417f" }, // rosita
  { color: "#a48ce8", outline: "#6f55c9" }, // lavanda
  { color: "#6fb3ea", outline: "#3f82bf" }, // celeste
  { color: "#f0a36b", outline: "#c46f33" }, // caramelo
];

export default function PawTrail({ children }: { children: ReactNode }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const nextId = useRef(0);
  const { width, height } = useWindowDimensions();
  const size = useRef({ width, height });
  size.current = { width, height };
  const reduceMotion = useRef(false);

  const add = useCallback((list: NewParticle[]) => {
    if (reduceMotion.current) return;
    setParticles((prev) => {
      const next = prev.concat(list.map((p) => ({ ...p, id: ++nextId.current })));
      return next.length > MAX_PARTICLES ? next.slice(-MAX_PARTICLES) : next;
    });
  }, []);

  const remove = useCallback((id: number) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  }, []);

  /**
   * Espacios ocupados por huellitas que siguen visibles en esta capa.
   * Una huellita nueva solo se dibuja si no se cruza con ninguna de ellas.
   */
  const occupied = useRef<{ x: number; y: number; r: number; until: number }[]>([]);

  const isFree = useCallback((x: number, y: number, r: number) => {
    const now = Date.now();
    occupied.current = occupied.current.filter((o) => o.until > now);
    return !occupied.current.some(
      (o) => Math.hypot(o.x - x, o.y - y) < o.r + r + PAW_GAP
    );
  }, []);

  const occupy = useCallback((x: number, y: number, r: number, ms: number) => {
    occupied.current.push({ x, y, r, until: Date.now() + ms });
  }, []);

  const burst = useCallback(
    (x: number, y: number) => {
      const w = pick(BURST_COLORS);
      const list: NewParticle[] = [];
      // La huellita del clic solo aparece si no pisa otra huellita
      if (isFree(x, y, pawRadius(30))) {
        occupy(x, y, pawRadius(30), 900);
        list.push({
          x, y, dx: 0, dy: -18, size: 30, rotate: rand(-20, 20),
          duration: 900, opacity: 0.9, kind: "burst",
          color: w.color, outline: w.outline,
        });
      }
      const n = 6;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + rand(-0.3, 0.3);
        const d = rand(45, 80);
        list.push({
          x, y, dx: Math.cos(a) * d, dy: Math.sin(a) * d - 25,
          size: rand(12, 19), rotate: rand(-30, 30),
          duration: rand(750, 1100), opacity: 1, kind: "burst",
          emoji: pick(SPARKLES),
        });
      }
      add(list);
    },
    [add, isFree, occupy]
  );

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled?.()
      .then((v) => (reduceMotion.current = !!v))
      .catch(() => {});
    injectCuteWebStyles();
  }, []);

  // Interacciones del mouse / scroll (solo web)
  useEffect(() => {
    if (NATIVE || typeof document === "undefined") return;
    let last = { x: -999, y: -999, t: 0 };
    let side = 1;
    let lastScroll = 0;

    const onMove = (e: MouseEvent) => {
      const now = Date.now();
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 46 || now - last.t < 70) return;
      const ang = Math.atan2(dy, dx);
      side = -side;
      const ox = -Math.sin(ang) * 8 * side;
      const oy = Math.cos(ang) * 8 * side;
      // El rastro sigue al cursor y nunca desaparece dentro de tarjetas o
      // formularios: sobre letras solo se vuelve más transparente.
      // La huellita nace un poco detrás de la flecha, nunca sobre su punta
      const x = e.clientX - Math.cos(ang) * 22 + ox;
      const y = e.clientY - Math.sin(ang) * 22 + oy;
      const pawSize = 16;
      const r = pawRadius(pawSize);
      last = { x: e.clientX, y: e.clientY, t: now };
      if (!isFree(x, y, r)) return;
      const overText = isOverText(x, y, pawSize * 0.6, []);
      occupy(x, y, r, 1300);
      add([
        {
          x, y, dx: 0, dy: 0, size: pawSize,
          rotate: (ang * 180) / Math.PI + 90, duration: 1300,
          opacity: overText ? 0.22 : 0.5, kind: "step",
          color: side > 0 ? "#ec7fae" : "#a48ce8",
        },
      ]);
    };

    // El estallido del clic sale junto a la flecha, sin taparle la punta
    const onDown = (e: PointerEvent) => burst(e.clientX + 18, e.clientY + 26);

    const onScroll = () => {
      const now = Date.now();
      if (now - lastScroll < 320) return;
      lastScroll = now;
      const { width: w, height: h } = size.current;
      const left = Math.random() > 0.5;
      add([
        {
          x: left ? rand(18, 60) : rand(w - 60, w - 18), y: h - 30,
          dx: rand(-20, 20), dy: -rand(160, 260), size: rand(16, 22),
          rotate: rand(-15, 15), duration: 1700, opacity: 0.85,
          kind: "burst", emoji: pick(["💗", "🫧", "🐾", "🌸"]),
        },
      ]);
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("scroll", onScroll, { capture: true });
    };
  }, [add, burst, isFree, occupy]);

  // Nativo: observa el inicio de cada toque y devuelve false (no lo captura)
  const observeTouch = useCallback(
    (e: GestureResponderEvent) => {
      burst(e.nativeEvent.pageX, e.nativeEvent.pageY);
      return false;
    },
    [burst]
  );

  return (
    <View
      style={styles.root}
      onStartShouldSetResponderCapture={NATIVE ? observeTouch : undefined}
    >
      {children}
      <View style={styles.overlay}>
        {particles.map((p) => (
          <ParticleView key={p.id} p={p} onDone={remove} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: "none",
    zIndex: 9999,
    elevation: 9999,
    overflow: "hidden",
  },
});
