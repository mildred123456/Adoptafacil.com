import { useIsFocused } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  StyleSheet,
  View,
  useWindowDimensions,
  type LayoutChangeEvent,
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
import { isOverText, measureTextZones, type Zone } from "./text-zones";

/**
 * Huellitas que caminan "marcadas en el fondo" de una página.
 *
 * Se coloca como ÚLTIMO hijo dentro del contenido que hace scroll
 * (ScrollView) y ocupa todo su alto con position absolute. Así las pisadas
 * se desplazan junto con el contenido al hacer scroll y se reparten a lo
 * largo de toda la página, no solo arriba.
 *
 * - Suaves y discretas: colores clarititos, poca opacidad, pocas a la vez.
 * - No pisan letras ni otras huellitas.
 * - pointerEvents "none": nunca tapan ni bloquean clics.
 * - Solo caminan mientras la pantalla está visible.
 */

const MAX_PARTICLES = 40;
const SIDE_GAP = 10;
const STRIDE = 36;
const PAW_SIZE = 22;
const PUP_SIZE = 15;
const OPACITY = 0.38;
const FIRST_WALK_MS = 1800;
const WALK_EVERY_MS = 20000;

// Tonos muy clarititos que combinan con el fondo rosadito
const SOFT_WALKERS = [
  { color: "#f7b3cd", outline: "#eea0c0" }, // rosita
  { color: "#d2c3f5", outline: "#bfaeee" }, // lavanda
  { color: "#bcdaf5", outline: "#a5c8ec" }, // celeste
  { color: "#f6cfae", outline: "#eebb92" }, // caramelo
];

type Step = { x: number; y: number; rot: number; delay: number };

export default function PawGround() {
  const ref = useRef<View>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const nextId = useRef(0);
  const box = useRef({ w: 0, h: 0 });
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const occupied = useRef<{ x: number; y: number; r: number; until: number }[]>([]);
  const zones = useRef<Zone[]>([]);
  const reduceMotion = useRef(false);
  const focused = useIsFocused();
  const { height: screenH } = useWindowDimensions();

  const onLayout = (e: LayoutChangeEvent) => {
    box.current = { w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height };
  };

  const later = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      timers.current.delete(id);
      fn();
    }, ms);
    timers.current.add(id);
  }, []);

  const remove = useCallback((id: number) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const refreshZones = useCallback(() => {
    measureTextZones()
      .then((z) => (zones.current = z))
      .catch(() => {});
  }, []);

  /** Dibuja la pisada si no pisa letras ni otra huellita (coordenadas de la página). */
  const stepAt = useCallback((p: NewParticle) => {
    if (reduceMotion.current) return;
    const r = pawRadius(p.size);
    const now = Date.now();
    occupied.current = occupied.current.filter((o) => o.until > now);
    if (occupied.current.some((o) => Math.hypot(o.x - p.x, o.y - p.y) < o.r + r + PAW_GAP)) return;

    const place = (ox: number, oy: number) => {
      if (isOverText(ox + p.x, oy + p.y, p.size * 0.6, zones.current)) return;
      occupied.current.push({ x: p.x, y: p.y, r, until: Date.now() + p.duration });
      setParticles((prev) => {
        const next = [...prev, { ...p, id: ++nextId.current }];
        return next.length > MAX_PARTICLES ? next.slice(-MAX_PARTICLES) : next;
      });
    };

    // Posición de esta capa en la ventana, para comparar con los textos
    const node = ref.current as unknown as {
      measureInWindow?: (cb: (x: number, y: number) => void) => void;
    } | null;
    if (node?.measureInWindow) node.measureInWindow((x, y) => place(x, y));
    else place(0, 0);
  }, []);

  /** Ruta tranquila de lado a lado, a una altura dada de la página. */
  const planWalk = useCallback((yMin: number, yMax: number): Step[] => {
    const { w, h } = box.current;
    const fromLeft = Math.random() < 0.5;
    let x = fromLeft ? -16 : w + 16;
    let y = rand(yMin, yMax);
    let heading = (fromLeft ? 0 : Math.PI) + rand(-0.35, 0.35);
    let turn = 0;
    let delay = 0;
    const steps: Step[] = [];

    for (let i = 0; i < 70; i++) {
      turn = turn * 0.8 + rand(-0.08, 0.08);
      heading += turn;
      x += Math.cos(heading) * STRIDE;
      y += Math.sin(heading) * STRIDE;
      // Se mantiene dentro de su franja de la página
      if (y < 24 || y > h - 24) {
        heading = -heading;
        y = Math.min(Math.max(y, 24), h - 24);
      }
      if (x < -30 || x > w + 30) break;

      const side = i % 2 === 0 ? 1 : -1;
      steps.push({
        x: x - Math.sin(heading) * SIDE_GAP * side,
        y: y + Math.cos(heading) * SIDE_GAP * side,
        rot: (heading * 180) / Math.PI + 90,
        delay,
      });
      // Ritmo calmado, con alguna pausa para "olfatear"
      delay += rand(340, 420) + (Math.random() < 0.06 ? rand(800, 1400) : 0);
    }
    return steps;
  }, []);

  const walk = useCallback(() => {
    const { w, h } = box.current;
    if (w < 60 || h < 60) return;

    // Páginas largas: uno o dos animalitos en franjas distintas de la página
    const walkers = h > screenH * 2 ? 2 : 1;
    let longest = 0;
    for (let k = 0; k < walkers; k++) {
      const band = h / walkers;
      const look = pick(SOFT_WALKERS);
      const steps = planWalk(band * k + 30, band * (k + 1) - 30);
      if (steps.length === 0) continue;
      longest = Math.max(longest, steps[steps.length - 1].delay);

      steps.forEach((s) =>
        later(
          () =>
            stepAt({
              x: s.x, y: s.y, dx: 0, dy: 0, size: PAW_SIZE, rotate: s.rot,
              duration: 3200, opacity: OPACITY, kind: "step",
              color: look.color, outline: look.outline,
            }),
          s.delay
        )
      );

      // A veces lo acompaña un cachorrito en un carril paralelo
      if (Math.random() < 0.2 && steps.length > 4) {
        const pup = pick(SOFT_WALKERS);
        const lane = 30 * (Math.random() < 0.5 ? 1 : -1);
        steps.forEach((s, i) => {
          const hd = ((s.rot - 90) * Math.PI) / 180;
          const side = i % 2 === 0 ? 1 : -1;
          const cx = s.x + Math.sin(hd) * SIDE_GAP * side;
          const cy = s.y - Math.cos(hd) * SIDE_GAP * side;
          const off = lane + 6 * side;
          later(
            () =>
              stepAt({
                x: cx - Math.sin(hd) * off, y: cy + Math.cos(hd) * off,
                dx: 0, dy: 0, size: PUP_SIZE, rotate: s.rot,
                duration: 2800, opacity: OPACITY * 0.9, kind: "step",
                color: pup.color, outline: pup.outline,
              }),
            s.delay + 1400
          );
        });
      }
    }

    // Se vuelven a medir los textos mientras camina (por si hay scroll)
    refreshZones();
    for (let ms = 1000; ms < longest + 1500; ms += 1000) later(refreshZones, ms);
  }, [later, planWalk, refreshZones, screenH, stepAt]);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled?.()
      .then((v) => (reduceMotion.current = !!v))
      .catch(() => {});
  }, []);

  // Solo camina mientras la pantalla está a la vista
  useEffect(() => {
    if (!focused) return;
    const pending = timers.current;
    const first = setTimeout(walk, FIRST_WALK_MS);
    const every = setInterval(walk, WALK_EVERY_MS);
    return () => {
      clearTimeout(first);
      clearInterval(every);
      pending.forEach(clearTimeout);
      pending.clear();
    };
  }, [focused, walk]);

  return (
    <View ref={ref} onLayout={onLayout} style={styles.ground}>
      {particles.map((p) => (
        <ParticleView key={p.id} p={p} onDone={remove} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  ground: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: "none",
    overflow: "hidden",
    zIndex: 20,
    elevation: 20,
  },
});
