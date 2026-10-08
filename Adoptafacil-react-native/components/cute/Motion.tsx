import { useEffect, useRef, type ReactNode } from "react";
import {
  Animated,
  Easing,
  Platform,
  type StyleProp,
  type ViewStyle,
} from "react-native";

/**
 * Pequeños envoltorios de animación, solo decorativos.
 * No reciben ni alteran props de lógica de sus hijos.
 */

const NATIVE = Platform.OS !== "web";

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  delay?: number;
};

/** Aparece con un rebote suave (entrada de tarjetas y secciones). */
export function PopIn({ children, style, delay = 0 }: Props) {
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(t, {
      toValue: 1,
      delay,
      friction: 6,
      tension: 60,
      useNativeDriver: NATIVE,
    }).start();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: t.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0, 1, 1] }),
          transform: [
            { translateY: t.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) },
            { scale: t.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

/** Flota arriba y abajo sin parar (logos, emojis). */
export function Bob({
  children,
  style,
  delay = 0,
  distance = 6,
  duration = 1600,
}: Props & { distance?: number; duration?: number }) {
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(t, {
          toValue: 1,
          duration,
          delay,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: NATIVE,
        }),
        Animated.timing(t, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: NATIVE,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [
            {
              translateY: t.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -distance],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

/** Se menea de vez en cuando (campanita, iconos). */
export function Wiggle({ children, style, delay = 0 }: Props) {
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const swing = (to: number) =>
      Animated.timing(t, { toValue: to, duration: 90, useNativeDriver: NATIVE });
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(2600 + delay),
        swing(1),
        swing(-1),
        swing(0.7),
        swing(-0.7),
        swing(0),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [
            {
              rotate: t.interpolate({
                inputRange: [-1, 1],
                outputRange: ["-18deg", "18deg"],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
