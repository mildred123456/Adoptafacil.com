import { LinearGradient } from "expo-linear-gradient";
import { Palette, Radius, Shadow } from "@/constants/palette";
import { router } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import CuteHint from "@/components/cute/CuteHint";
import FloatingCritters from "@/components/cute/FloatingCritters";
import PawGround from "@/components/cute/PawGround";
import { Bob, PopIn } from "@/components/cute/Motion";

export default function RegisterOptionsScreen() {
  const handleOptionSelect = (userType: "amigo" | "aliado") => {
    router.push({
      pathname: "/register",
      params: { userType },
    });
  };

  return (
    <LinearGradient
      colors={[Palette.background, Palette.background]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <FloatingCritters count={10} size={26} opacity={0.3} pawColor={Palette.borderStrong} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentContainer}>
          <Bob>
            <Image
              source={require("@/assets/images/Logo.png")}
              style={styles.logo}
            />
          </Bob>
          <ThemedText style={styles.title}>¿Cómo quieres unirte?</ThemedText>
          <ThemedText style={styles.subtitle}>
            Elige el tipo de cuenta que mejor se adapte a ti
          </ThemedText>

          <CuteHint
            id="register-options"
            text="Toca la opción que va contigo 🐱"
          />
          <View style={styles.optionsWrapper}>
            {/* Opción Amigo AdoptaFácil */}
            <PopIn delay={100}>
            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => handleOptionSelect("amigo")}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <ThemedText style={styles.cardTitle}>
                  🏠 Amigo AdoptaFácil
                </ThemedText>
              </View>
              <View style={styles.cardContent}>
                <ThemedText style={styles.cardDescription}>
                  Para personas que buscan adoptar una mascota y darle un hogar
                  lleno de amor.
                </ThemedText>
                <View style={styles.featuresList}>
                  <ThemedText style={styles.featureItem}>
                    • Buscar mascotas disponibles
                  </ThemedText>
                  <ThemedText style={styles.featureItem}>
                    • Conectar con refugios
                  </ThemedText>
                  <ThemedText style={styles.featureItem}>
                    • Seguimiento de adopciones
                  </ThemedText>
                  <ThemedText style={styles.featureItem}>
                    • Comunidad de adoptantes
                  </ThemedText>
                </View>
              </View>
              <View style={styles.buttonContainer}>
                <View style={styles.registerButton}>
                  <ThemedText style={styles.registerButtonText}>
                    Registrarme como Amigo
                  </ThemedText>
                </View>
              </View>
            </TouchableOpacity>
            </PopIn>

            {/* Opción Aliado AdoptaFácil */}
            <PopIn delay={250}>
            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => handleOptionSelect("aliado")}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <ThemedText style={styles.cardTitle}>
                  🏢 Aliado AdoptaFácil
                </ThemedText>
              </View>
              <View style={styles.cardContent}>
                <ThemedText style={styles.cardDescription}>
                  Para refugios, fundaciones y organizaciones que rescatan y
                  cuidan mascotas.
                </ThemedText>
                <View style={styles.featuresList}>
                  <ThemedText style={styles.featureItem}>
                    • Gestionar mascotas en adopción
                  </ThemedText>
                  <ThemedText style={styles.featureItem}>
                    • Publicar historias de rescate
                  </ThemedText>
                  <ThemedText style={styles.featureItem}>
                    • Recibir donaciones
                  </ThemedText>
                  <ThemedText style={styles.featureItem}>
                    • Red de refugios
                  </ThemedText>
                </View>
              </View>
              <View style={styles.buttonContainer}>
                <View style={[styles.registerButton, styles.aliadoButton]}>
                  <ThemedText style={styles.registerButtonText}>
                    Registrarme como Aliado
                  </ThemedText>
                </View>
              </View>
            </TouchableOpacity>
            </PopIn>
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/login")}
          >
            <ThemedText style={styles.backButtonText}>
              ← Volver al inicio de sesión
            </ThemedText>
          </TouchableOpacity>
        </View>
        {/* Huellitas que caminan por la página (se mueven con el scroll) */}
        <PawGround />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  contentContainer: {
    alignItems: "center",
    width: "100%",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 0,
    resizeMode: "contain",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Palette.primary,
    textAlign: "center",
    marginBottom: 15,
    paddingHorizontal: 15,
    textShadowColor: "transparent",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    lineHeight: 34,
    paddingBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: Palette.textMuted,
    textAlign: "center",
    marginBottom: 35,
    paddingHorizontal: 10,
    textShadowColor: "transparent",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  optionsWrapper: {
    width: "100%",
    maxWidth: 380,
    gap: 20,
  },
  optionCard: {
    backgroundColor: Palette.surface,
    borderRadius: Radius.card,
    padding: 25,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadow.card,
  },
  cardHeader: {
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Palette.text,
    textAlign: "center",
  },
  cardContent: {
    marginBottom: 20,
  },
  cardDescription: {
    fontSize: 16,
    color: Palette.text,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 18,
  },
  featuresList: {
    gap: 6,
  },
  featureItem: {
    fontSize: 14,
    color: Palette.textMuted,
    textAlign: "left",
    lineHeight: 20,
  },
  buttonContainer: {
    alignItems: "center",
  },
  registerButton: {
    width: "100%",
    maxWidth: 240,
    height: 48,
    backgroundColor: Palette.primary,
    borderRadius: Radius.pill,
    justifyContent: "center",
    alignItems: "center",
    ...Shadow.button,
  },
  aliadoButton: {
    backgroundColor: Palette.primary,
    borderRadius: Radius.pill,
    ...Shadow.button,
  },
  registerButtonText: {
    color: Palette.onPrimary,
    fontWeight: "bold",
    fontSize: 16,
  },
  backButton: {
    alignSelf: "center",
    marginTop: 30,
    paddingVertical: 12,
  },
  backButtonText: {
    color: Palette.primary,
    fontSize: 16,
    fontWeight: "600",
    textShadowColor: "transparent",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
