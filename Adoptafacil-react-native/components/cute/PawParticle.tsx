import { useEffect, useRef } from "react";
import { Animated, Easing, Platform, StyleSheet } from "react-native";

import PawShape from "./PawShape";

/**
 * Pieza común de animación para las huellitas (pisadas y estallidos).
 * La usan PawTrail (capa global del puntero) y PawGround (huellitas que
 * caminan dentro de cada página). Solo decorativo.
 */

const NATIVE = Platform.OS !== "web";

export type Particle = {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  rotate: number;
  duration: number;
  opacity: number;
  kind: "burst" | "step";
  emoji?: string;
  color?: string;
  outline?: string;
};

export type NewParticle = Omit<Particle, "id">;

// Separación mínima (px) entre dos huellitas visibles
export const PAW_GAP = 3;
// Radio que ocupa una huellita (incluye los deditos aunque esté girada)
export const pawRadius = (size: number) => size * 0.55;

export const rand = (a: number, b: number) => a + Math.random() * (b - a);
export const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

export function ParticleView({
  p,
  onDone,
}: {
  p: Particle;
  onDone: (id: number) => void;
}) {
  const t = useRef(new Animated.Value(0)).current;
  const isStep = p.kind === "step";

  useEffect(() => {
    const anim = Animated.timing(t, {
      toValue: 1,
      duration: p.duration,
      easing: isStep ? Easing.linear : Easing.out(Easing.cubic),
      useNativeDriver: NATIVE,
    });
    anim.start(({ finished }) => finished && onDone(p.id));
    return () => anim.stop();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Pisada: aparece "apretando" el suelo (1.35 → 1), se queda y se desvanece
  const opacity = t.interpolate(
    isStep
      ? {
          inputRange: [0, 0.05, 0.55, 1],
          outputRange: [0, p.opacity, p.opacity * 0.85, 0],
        }
      : { inputRange: [0, 0.15, 1], outputRange: [0, p.opacity, 0] }
  );
  const scale = t.interpolate(
    isStep
      ? { inputRange: [0, 0.05, 0.1, 1], outputRange: [1.35, 0.94, 1, 1] }
      : { inputRange: [0, 0.25, 1], outputRange: [0.2, 1.2, 0.7] }
  );
  const translateX = t.interpolate({ inputRange: [0, 1], outputRange: [0, p.dx] });
  const translateY = t.interpolate({ inputRange: [0, 1], outputRange: [0, p.dy] });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: p.x - p.size / 2,
          top: p.y - p.size / 2,
          opacity,
          transform: [
            { translateX },
            { translateY },
            { rotate: `${p.rotate}deg` },
            { scale },
          ],
        },
      ]}
    >
      {p.emoji ? (
        <Animated.Text style={{ fontSize: p.size, lineHeight: p.size * 1.25 }}>
          {p.emoji}
        </Animated.Text>
      ) : (
        <PawShape size={p.size} color={p.color} outline={p.outline} />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  particle: {
    position: "absolute",
    pointerEvents: "none",
  },
});
