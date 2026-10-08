import { ThemedText } from "@/components/themed-text";
import { Palette, Radius, Shadow } from "@/constants/palette";
import CuteHint from "@/components/cute/CuteHint";
import FloatingCritters from "@/components/cute/FloatingCritters";
import PawGround from "@/components/cute/PawGround";
import { PopIn } from "@/components/cute/Motion";
import { ScrollView, View, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function RefugiosScreen() {
  const refugios = [
    {
      id: 1,
      nombre: "Refugio Huellitas",
      descripcion: "Rescatamos perros y gatos en situación de calle.",
    },
    {
      id: 2,
      nombre: "Fundación Patitas",
      descripcion: "Cuidamos y damos en adopción a mascotas abandonadas.",
    },
    {
      id: 3,
      nombre: "Adopta Amor",
      descripcion:
        "Tu apoyo nos permite alimentar y vacunar a cientos de animales.",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section con gradiente solo para título y subtítulo */}
      <LinearGradient
        colors={[Palette.surfacePink, Palette.surfacePink]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroSection}
      >
        <FloatingCritters count={8} size={22} opacity={0.35} />
        <ThemedText style={styles.heroTitle}>Apoya a los Refugios</ThemedText>
        <ThemedText style={styles.heroSubtitle}>
          Tu donación ayuda a salvar vidas y mantener a los animales seguros
        </ThemedText>
      </LinearGradient>

      {/* Sección de contenido */}
      <PopIn delay={120} style={styles.contentSection}>
        <CuteHint
          id="shelters-donate"
          text="Toca «Contactar 💌» para comunicarte con un refugio"
        />
        {refugios.map((refugio) => (
          <View key={refugio.id} style={styles.card}>
            <ThemedText style={styles.cardTitle}>{refugio.nombre}</ThemedText>
            <ThemedText style={styles.cardDesc}>
              {refugio.descripcion}
            </ThemedText>

            <TouchableOpacity style={styles.donateButton}>
              <ThemedText style={styles.donateButtonText}>Contactar 💌</ThemedText>
            </TouchableOpacity>
          </View>
        ))}
      </PopIn>
      {/* Huellitas que caminan por la página (se mueven con el scroll) */}
      <PawGround />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  heroSection: {
    padding: 20,
    paddingVertical: 34,
    alignItems: "center",
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: "hidden",
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "600",
    color: Palette.primary,
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: "transparent",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 16,
    color: Palette.textMuted,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 10,
    textShadowColor: "transparent",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  contentSection: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    padding: 20,
  },
  card: {
    backgroundColor: Palette.surface,
    borderRadius: Radius.card,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadow.card,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Palette.text,
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 15,
    color: Palette.textMuted,
    marginBottom: 16,
    lineHeight: 20,
  },
  donateButton: {
    alignSelf: "center",
    minWidth: 160,
    backgroundColor: Palette.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: Radius.pill,
    alignItems: "center",
    ...Shadow.button,
  },
  donateButtonText: {
    color: Palette.onPrimary,
    fontWeight: "600",
    fontSize: 15,
  },
});
