import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type AlertButton,
} from "react-native";

import { Palette, Radius } from "@/constants/palette";
import { cuteFontFamily } from "./web-styles";

/**
 * Aviso tierno (reemplaza a window.alert / window.confirm en la web).
 * <CuteAlertHost /> se monta una vez en el layout; showCuteAlert() lo abre.
 */

const NATIVE = Platform.OS !== "web";

type AlertData = { title: string; message?: string; buttons: AlertButton[] };

let hostCount = 0;
const listeners = new Set<(a: AlertData) => void>();

/** Muestra el aviso. Devuelve false si no hay un host montado todavía. */
export function showCuteAlert(data: AlertData): boolean {
  if (hostCount === 0) return false;
  listeners.forEach((l) => l(data));
  return true;
}

// Estilo según el tipo de aviso: error, éxito o informativo (colores de la paleta)
function moodFor(title: string) {
  const t = title.toLowerCase();
  if (/error|no se pudo|problema|denegad|inválid/.test(t))
    return { emoji: "🙀", tone: Palette.errorText, soft: Palette.errorBg };
  if (/bienvenid|éxito|exitos|✅|listo|generado/.test(t))
    return { emoji: "🐶", tone: Palette.successText, soft: Palette.successBg };
  return { emoji: "🐱", tone: Palette.primary, soft: Palette.primarySoft };
}

export function CuteAlertHost() {
  const [queue, setQueue] = useState<AlertData[]>([]);
  const t = useRef(new Animated.Value(0)).current;
  const current = queue[0];

  useEffect(() => {
    hostCount++;
    const onAlert = (a: AlertData) => setQueue((q) => [...q, a]);
    listeners.add(onAlert);
    return () => {
      hostCount--;
      listeners.delete(onAlert);
    };
  }, []);

  useEffect(() => {
    if (!current) return;
    t.setValue(0);
    Animated.spring(t, {
      toValue: 1,
      friction: 6,
      tension: 80,
      useNativeDriver: NATIVE,
    }).start();
  }, [current, t]);

  if (!current) return null;

  const { emoji, tone, soft } = moodFor(current.title);
  const buttons: AlertButton[] = current.buttons.length
    ? current.buttons
    : [{ text: "Entendido" }];

  const press = (b: AlertButton) => {
    Animated.timing(t, {
      toValue: 0,
      duration: 160,
      easing: Easing.in(Easing.quad),
      useNativeDriver: NATIVE,
    }).start(() => {
      setQueue((q) => q.slice(1));
      try {
        b.onPress?.();
      } catch (error) {
        console.error("Error en botón del aviso:", error);
      }
    });
  };

  return (
    <View style={styles.backdrop}>
      <Animated.View
        accessibilityRole="alert"
        style={[
          styles.card,
          {
            opacity: t,
            transform: [
              { scale: t.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) },
              { translateY: t.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
            ],
          },
        ]}
      >
        <View style={[styles.badge, { borderColor: tone, backgroundColor: soft }]}>
          <Text style={styles.badgeEmoji}>{emoji}</Text>
        </View>
        <Text style={[styles.title, { color: tone }]}>{current.title}</Text>
        {current.message ? <Text style={styles.message}>{current.message}</Text> : null}

        <View style={styles.row}>
          {buttons.map((b, i) => {
            const isCancel = b.style === "cancel";
            const isDanger = b.style === "destructive";
            return (
              <Pressable
                key={`${b.text}-${i}`}
                onPress={() => press(b)}
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.button,
                  isCancel ? styles.cancel : isDanger ? styles.danger : styles.primary,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.buttonText, isCancel && styles.cancelText]}>
                  {b.text ?? "Aceptar"}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.paws}>🐾 🐾 🐾</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10001,
    elevation: 10001,
    backgroundColor: Palette.overlay,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: Palette.surface,
    borderRadius: Radius.card + 6,
    borderWidth: 1,
    borderColor: Palette.border,
    paddingTop: 42,
    paddingBottom: 14,
    paddingHorizontal: 22,
    alignItems: "center",
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  badge: {
    position: "absolute",
    top: -34,
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    backgroundColor: Palette.background,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeEmoji: {
    fontSize: 34,
    lineHeight: 42,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
    fontFamily: cuteFontFamily,
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    color: Palette.text,
    textAlign: "center",
    marginBottom: 18,
    fontFamily: cuteFontFamily,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    alignSelf: "stretch",
  },
  button: {
    flexGrow: 1,
    minWidth: 120,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: Radius.pill,
    alignItems: "center",
  },
  primary: {
    backgroundColor: Palette.primary,
  },
  danger: {
    backgroundColor: Palette.danger,
  },
  cancel: {
    backgroundColor: Palette.secondary,
  },
  pressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: Palette.onPrimary,
    fontWeight: "800",
    fontSize: 15,
    fontFamily: cuteFontFamily,
  },
  cancelText: {
    color: Palette.secondaryText,
  },
  paws: {
    marginTop: 12,
    fontSize: 12,
    opacity: 0.5,
  },
});
