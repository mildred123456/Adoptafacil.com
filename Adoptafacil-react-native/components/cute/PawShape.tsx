import { StyleSheet, View, type ViewStyle } from "react-native";

import { Cute } from "./palette";

type Props = {
  size?: number;
  color?: string;
  /** Contorno opcional para dar contraste sobre fondos claros */
  outline?: string;
  style?: ViewStyle;
};

/**
 * Huellita dibujada con Views (almohadilla + 4 deditos).
 * Solo decorativa: no recibe toques.
 */
export default function PawShape({ size = 24, color = Cute.pink, outline, style }: Props) {
  const toe = size * 0.22;
  const line = outline
    ? { borderWidth: Math.max(1, size * 0.045), borderColor: outline }
    : null;
  const toes = [
    { left: size * 0.04, top: size * 0.3 },
    { left: size * 0.24, top: size * 0.06 },
    { left: size * 0.54, top: size * 0.06 },
    { left: size * 0.74, top: size * 0.3 },
  ];

  return (
    <View style={[{ width: size, height: size }, styles.noTouch, style]}>
      {toes.map((p, i) => (
        <View
          key={i}
          style={[
            styles.part,
            {
              width: toe,
              height: toe * 1.15,
              borderRadius: toe,
              backgroundColor: color,
              left: p.left,
              top: p.top,
            },
            line,
          ]}
        />
      ))}
      <View
        style={[
          styles.part,
          {
            width: size * 0.56,
            height: size * 0.44,
            borderTopLeftRadius: size * 0.3,
            borderTopRightRadius: size * 0.3,
            borderBottomLeftRadius: size * 0.22,
            borderBottomRightRadius: size * 0.22,
            backgroundColor: color,
            left: size * 0.22,
            top: size * 0.5,
          },
          line,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  noTouch: {
    pointerEvents: "none",
  },
  part: {
    position: "absolute",
  },
});
