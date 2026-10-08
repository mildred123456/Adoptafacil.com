import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { Palette } from "@/constants/palette";
import { cuteFontFamily } from "./web-styles";

/**
 * Globito de ayuda con flechita animada que guía al usuario
 * ("¡Escribe aquí tu nombre! 🐾", "Aquí puedes buscar", ...).
 *
 * - Se muestra en línea (ocupa su propio espacio), así que nunca queda
 *   encima de botones ni campos.
 * - Solo la ✕ recibe toques; el resto del globo tiene pointerEvents "none".
 * - Al cerrarlo se recuerda en el dispositivo con una clave propia
 *   ("cute-hint-closed:<id>"), separada de los datos de la app.
 */

const NATIVE = Platform.OS !== "web";
const KEY = (id: string) => `cute-hint-closed:${id}`;
// Memoria de la sesión para no volver a pedir el almacenamiento
const closedThisSession = new Set<string>();

type Arrow = "down" | "up";

type Props = {
  id: string;
  text: string;
  arrow?: Arrow;
  delay?: number;
  align?: "center" | "flex-start" | "flex-end";
  style?: StyleProp<ViewStyle>;
};

/** Flechita de chevrones que se encienden en cascada y rebota */
function Chevrons({ arrow }: { arrow: Arrow }) {
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(t, {
        toValue: 1,
        duration: 1100,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: NATIVE,
      })
    );
    loop.start();
    return () => loop.stop();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const dir = arrow === "down" ? 1 : -1;
  const order = arrow === "down" ? [0, 1] : [1, 0];

  return (
    <Animated.View
      style={[
        styles.chevrons,
        {
          transform: [
            {
              translateY: t.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 6 * dir, 0],
              }),
            },
          ],
        },
      ]}
    >
      {order.map((o, i) => (
        <Animated.View
          key={i}
          style={[
            styles.chevron,
            {
              transform: [{ rotate: arrow === "down" ? "45deg" : "-135deg" }],
              opacity: t.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: o === 0 ? [1, 0.35, 1] : [0.35, 1, 0.35],
              }),
            },
          ]}
        />
      ))}
    </Animated.View>
  );
}

export default function CuteHint({
  id,
  text,
  arrow = "down",
  delay = 500,
  align = "center",
  style,
}: Props) {
  const [visible, setVisible] = useState(false);
  const appear = useRef(new Animated.Value(0)).current;
  const wiggle = useRef(new Animated.Value(0)).current;

  // ¿Ya lo cerró antes? (si falla el almacenamiento, simplemente se muestra)
  useEffect(() => {
    let alive = true;
    if (closedThisSession.has(id)) return;
    AsyncStorage.getItem(KEY(id))
      .catch(() => null)
      .then((v) => {
        if (alive && v !== "1") setVisible(true);
      });
    return () => {
      alive = false;
    };
  }, [id]);

  // Entrada con rebote + meneo suave de vez en cuando para llamar la atención
  useEffect(() => {
    if (!visible) return;
    Animated.spring(appear, {
      toValue: 1,
      delay,
      friction: 5,
      tension: 70,
      useNativeDriver: NATIVE,
    }).start();
    const swing = (v: number) =>
      Animated.timing(wiggle, { toValue: v, duration: 110, useNativeDriver: NATIVE });
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(4200),
        swing(1),
        swing(-1),
        swing(0.5),
        swing(0),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  const close = () => {
    closedThisSession.add(id);
    AsyncStorage.setItem(KEY(id), "1").catch(() => {});
    Animated.timing(appear, {
      toValue: 0,
      duration: 220,
      easing: Easing.in(Easing.quad),
      useNativeDriver: NATIVE,
    }).start(() => setVisible(false));
  };

  if (!visible) return null;

  const bubble = (
    <Animated.View
      style={[
        styles.bubble,
        {
          transform: [
            {
              rotate: wiggle.interpolate({
                inputRange: [-1, 1],
                outputRange: ["-3deg", "3deg"],
              }),
            },
          ],
        },
      ]}
    >
      <Text style={styles.text}>{text}</Text>
      <Pressable
        onPress={close}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Cerrar ayuda"
        style={({ pressed }) => [styles.close, pressed && styles.closePressed]}
      >
        <Text style={styles.closeText}>✕</Text>
      </Pressable>
    </Animated.View>
  );

  return (
    <Animated.View
      style={[
        styles.wrap,
        { alignItems: align },
        style,
        {
          opacity: appear,
          transform: [
            { scale: appear.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) },
            {
              translateY: appear.interpolate({
                inputRange: [0, 1],
                outputRange: [arrow === "down" ? -8 : 8, 0],
              }),
            },
          ],
        },
      ]}
    >
      {arrow === "up" && <Chevrons arrow="up" />}
      {bubble}
      {arrow === "down" && <Chevrons arrow="down" />}
    </Animated.View>
  );
}

const PINK = Palette.primary;

const styles = StyleSheet.create({
  wrap: {
    pointerEvents: "box-none",
    marginVertical: 6,
  },
  bubble: {
    pointerEvents: "box-none",
    flexDirection: "row",
    alignItems: "center",
    maxWidth: 330,
    backgroundColor: Palette.surface,
    borderWidth: 2,
    borderColor: Palette.border,
    borderRadius: 20,
    paddingVertical: 8,
    paddingLeft: 14,
    paddingRight: 8,
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  text: {
    pointerEvents: "none",
    flexShrink: 1,
    color: Palette.text,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 19,
    fontFamily: cuteFontFamily,
  },
  close: {
    marginLeft: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Palette.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  closePressed: {
    backgroundColor: Palette.border,
    transform: [{ scale: 0.9 }],
  },
  closeText: {
    color: PINK,
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 14,
  },
  chevrons: {
    pointerEvents: "none",
    alignItems: "center",
    height: 22,
    justifyContent: "center",
  },
  chevron: {
    width: 10,
    height: 10,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: PINK,
    borderRadius: 2,
    marginVertical: -2,
  },
});
