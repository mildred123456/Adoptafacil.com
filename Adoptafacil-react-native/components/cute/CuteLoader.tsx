import { useEffect, useRef } from "react";
import { Animated, Easing, Platform, StyleSheet, View } from "react-native";

import PawShape from "./PawShape";
import { Cute } from "./palette";

/**
 * Indicador de carga tierno: tres animalitos saltando por turnos
 * y huellitas que se encienden debajo. Reemplaza visualmente al
 * ActivityIndicator; no depende de ningún estado de la app.
 */

const NATIVE = Platform.OS !== "web";
const FRIENDS = ["🐶", "🐱", "🐰"];
const PAW_COLORS = [Cute.pink, Cute.lavender, Cute.sky, Cute.mint];

function Hopper({ emoji, index, size }: { emoji: string; index: number; size: number }) {
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(index * 160),
        Animated.timing(t, {
          toValue: 1,
          duration: 320,
          easing: Easing.out(Easing.quad),
          useNativeDriver: NATIVE,
        }),
        Animated.timing(t, {
          toValue: 0,
          duration: 320,
          easing: Easing.in(Easing.quad),
          useNativeDriver: NATIVE,
        }),
        Animated.delay((FRIENDS.length - 1 - index) * 160 + 200),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <View style={styles.hopperCell}>
      <Animated.Text
        style={{
          fontSize: size,
          lineHeight: size * 1.25,
          transform: [
            { translateY: t.interpolate({ inputRange: [0, 1], outputRange: [0, -size * 0.55] }) },
            { rotate: t.interpolate({ inputRange: [0, 1], outputRange: ["0deg", index % 2 ? "-12deg" : "12deg"] }) },
          ],
        }}
      >
        {emoji}
      </Animated.Text>
      <Animated.View
        style={[
          styles.shadow,
          {
            width: size * 0.7,
            transform: [{ scaleX: t.interpolate({ inputRange: [0, 1], outputRange: [1, 0.55] }) }],
            opacity: t.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.12] }),
          },
        ]}
      />
    </View>
  );
}

function PawDots() {
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(t, {
        toValue: PAW_COLORS.length,
        duration: 1600,
        easing: Easing.linear,
        useNativeDriver: NATIVE,
      })
    );
    loop.start();
    return () => loop.stop();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <View style={styles.paws}>
      {PAW_COLORS.map((c, i) => (
        <Animated.View
          key={i}
          style={{
            opacity: t.interpolate({
              inputRange: [i - 1, i, i + 1, i + 2].map((v) => Math.max(0, Math.min(PAW_COLORS.length, v))),
              outputRange: [0.25, 1, 0.25, 0.25],
              extrapolate: "clamp",
            }),
            transform: [{ rotate: i % 2 ? "12deg" : "-12deg" }],
          }}
        >
          <PawShape size={14} color={c} />
        </Animated.View>
      ))}
    </View>
  );
}

export default function CuteLoader({ size = 30 }: { size?: number }) {
  return (
    <View style={styles.wrap} accessibilityRole="progressbar" accessibilityLabel="Cargando">
      <View style={styles.row}>
        {FRIENDS.map((e, i) => (
          <Hopper key={e} emoji={e} index={i} size={size} />
        ))}
      </View>
      <PawDots />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  hopperCell: {
    alignItems: "center",
  },
  shadow: {
    height: 5,
    borderRadius: 5,
    backgroundColor: Cute.lavender,
    marginTop: 2,
  },
  paws: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
});
