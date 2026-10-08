import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";

import { Palette } from "@/constants/palette";

import PawShape from "./PawShape";
import { CRITTERS } from "./palette";

/**
 * Animalitos y huellitas que flotan de fondo.
 * Se coloca como primer hijo de un contenedor (queda detrás del contenido)
 * y no recibe toques.
 */

const NATIVE = Platform.OS !== "web";

type Props = {
  items?: string[];
  count?: number;
  size?: number;
  opacity?: number;
  /** Color de las huellitas dibujadas (por defecto, el rosado suave de la paleta) */
  pawColor?: string;
};

function Critter({
  index,
  emoji,
  size,
  opacity,
  pawColor,
}: {
  index: number;
  emoji: string | null;
  size: number;
  opacity: number;
  pawColor: string;
}) {
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const d = 2200 + (index % 4) * 450;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(t, {
          toValue: 1,
          duration: d,
          delay: (index * 170) % 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: NATIVE,
        }),
        Animated.timing(t, {
          toValue: 0,
          duration: d,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: NATIVE,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Posiciones "pseudoaleatorias" fijas para que no salten entre renders.
  // Solo en las franjas laterales (izquierda 2–18 %, derecha 80–94 %), así el
  // centro, donde van títulos y textos, queda despejado.
  const left = (index % 2 === 0
    ? `${2 + ((index * 11) % 16)}%`
    : `${80 + ((index * 7) % 14)}%`) as `${number}%`;
  const top = `${((index * 53 + 13) % 76) + 6}%` as const;
  const s = size * (0.75 + ((index * 7) % 5) * 0.12);

  return (
    <Animated.View
      style={[
        styles.critter,
        {
          left,
          top,
          opacity,
          transform: [
            { translateY: t.interpolate({ inputRange: [0, 1], outputRange: [6, -8] }) },
            {
              rotate: t.interpolate({
                inputRange: [0, 1],
                outputRange: index % 2 ? ["-10deg", "8deg"] : ["8deg", "-10deg"],
              }),
            },
          ],
        },
      ]}
    >
      {emoji ? (
        <Animated.Text style={{ fontSize: s, lineHeight: s * 1.25 }}>{emoji}</Animated.Text>
      ) : (
        <PawShape size={s * 0.9} color={pawColor} />
      )}
    </Animated.View>
  );
}

export default function FloatingCritters({
  items = CRITTERS,
  count = 7,
  size = 22,
  opacity = 0.35,
  pawColor = Palette.borderStrong,
}: Props) {
  // En pantallas angostas (celular) hay poco espacio a los lados del texto:
  // menos animalitos y más tenues, para que nada quede montado.
  const { width } = useWindowDimensions();
  if (width < 600) {
    count = Math.ceil(count / 2);
    opacity = opacity * 0.7;
  }
  return (
    <View style={styles.layer}>
      {Array.from({ length: count }, (_, i) => (
        <Critter
          key={i}
          index={i}
          // Cada tercer elemento es una huellita dibujada
          emoji={i % 3 === 2 ? null : items[i % items.length]}
          size={size}
          opacity={opacity}
          pawColor={pawColor}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    pointerEvents: "none",
  },
  critter: {
    position: "absolute",
  },
});
