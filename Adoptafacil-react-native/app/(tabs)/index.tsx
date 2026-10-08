import { LinearGradient } from "expo-linear-gradient";
import { Palette, Radius, Shadow } from "@/constants/palette";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Footer from "@/components/footer";
import { ThemedText } from "@/components/themed-text";
import CuteHint from "@/components/cute/CuteHint";
import FloatingCritters from "@/components/cute/FloatingCritters";
import PawGround from "@/components/cute/PawGround";
import { Bob, PopIn } from "@/components/cute/Motion";
import { ThemedView } from "@/components/themed-view";

export default function HomeScreen() {
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
        <ThemedText style={styles.heroTitle}>
          Bienvenido a AdoptaFácil
        </ThemedText>
        <ThemedText style={styles.heroSubtitle}>
          Encuentra a tu nuevo mejor amigo. Conectamos mascotas necesitadas con
          hogares amorosos desde 2025
        </ThemedText>
      </LinearGradient>

      {/* Sección de búsqueda con fondo verde */}
      <PopIn delay={80}>
      <ThemedView style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <ThemedText style={styles.searchTitle}>
            ✨ Encuentra tu compañero ideal
          </ThemedText>
          <CuteHint id="home-search" text="Aquí puedes buscar por raza o ciudad 🔍" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por raza (Ej: Perro, Gato)"
            placeholderTextColor={Palette.textMuted}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Ciudad"
            placeholderTextColor={Palette.textMuted}
          />
          <TouchableOpacity style={styles.searchButton}>
            <ThemedText style={styles.searchButtonText}>Buscar 🐾</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
      </PopIn>

      {/* Sección de categorías */}
      <PopIn delay={200}>
      <ThemedView style={styles.categoriesSection}>
        <ThemedText style={styles.categoriesTitle}>
          Explora por{" "}
          <ThemedText style={styles.highlightedText}>categoría</ThemedText>
        </ThemedText>
        <ThemedText style={styles.categoriesSubtitle}>
          Descubre mascotas increíbles esperando un hogar lleno de amor
        </ThemedText>
        <CuteHint
          id="home-categories"
          text="Toca una categoría para explorar 🐶🐱"
          delay={900}
        />
        <View style={styles.cardsContainer}>
          <TouchableOpacity style={styles.card}>
            <Bob distance={5} duration={1100}>
              <ThemedText style={styles.cardEmoji}>🐶</ThemedText>
            </Bob>
            <ThemedText style={styles.cardText}>Perros</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card}>
            <Bob distance={5} duration={1100} delay={400}>
              <ThemedText style={styles.cardEmoji}>🐱</ThemedText>
            </Bob>
            <ThemedText style={styles.cardText}>Gatos</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
      </PopIn>

      {/* Sección de destacados */}
      <PopIn delay={320}>
      <ThemedView style={styles.featuredSection}>
        <TouchableOpacity style={styles.featuredBadge}>
          <ThemedText style={styles.featuredBadgeText}>
            ⭐ Destacados de la semana ⭐
          </ThemedText>
        </TouchableOpacity>

        <ThemedText style={styles.featuredTitle}>
          Mascotas que buscan{"\n"}
          <ThemedText style={styles.featuredTitleGreen}>un hogar </ThemedText>
          <ThemedText style={styles.featuredTitleBlue}>lleno </ThemedText>
          <ThemedText style={styles.featuredTitlePurple}>de amor</ThemedText>
        </ThemedText>

        <ThemedText style={styles.featuredSubtitle}>
          Aquí tienes una muestra de nuestras mascotas más recientes que buscan
          un hogar lleno de amor.{" "}
          <ThemedText style={styles.featuredHighlight}>
            ¿Serás tú su nueva familia?
          </ThemedText>
        </ThemedText>

        {/* Estadísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <ThemedText style={styles.statNumber}>150+</ThemedText>
            <ThemedText style={styles.statLabel}>
              Mascotas{"\n"}disponibles
            </ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={styles.statNumberBlue}>100%</ThemedText>
            <ThemedText style={styles.statLabel}>
              Verificadas{"\n"}y sanas
            </ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={styles.statNumberPurple}>24/7</ThemedText>
            <ThemedText style={styles.statLabel}>
              Soporte{"\n"}post-adopción
            </ThemedText>
          </View>
        </View>
      </ThemedView>
      </PopIn>

      {/* Footer */}
      <Footer />
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
    textShadowColor: "transparent",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  searchSection: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    padding: 20,
  },
  searchContainer: {
    backgroundColor: Palette.surface,
    borderRadius: Radius.card,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Palette.border,
    alignItems: "center",
    ...Shadow.card,
  },
  searchTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Palette.text,
    marginBottom: 15,
    textAlign: "center",
  },
  searchInput: {
    width: "100%",
    backgroundColor: Palette.surface,
    borderWidth: 1.5,
    borderColor: Palette.border,
    borderRadius: Radius.field,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
    color: Palette.text,
    fontSize: 15,
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchButton: {
    width: "100%",
    maxWidth: 200,
    height: 40,
    backgroundColor: Palette.primary,
    borderRadius: Radius.pill,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    ...Shadow.button,
  },
  searchButtonText: {
    color: Palette.onPrimary,
    fontWeight: "600",
    fontSize: 15,
  },
  categoriesSection: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    backgroundColor: Palette.background,
    padding: 18,
    alignItems: "center",
  },
  categoriesTitle: {
    fontSize: 24,
    color: Palette.text,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "600",
  },
  highlightedText: {
    fontSize: 24,
    color: Palette.primary,
  },
  categoriesSubtitle: {
    fontSize: 16,
    color: Palette.textMuted,
    textAlign: "center",
    marginBottom: 20,
  },
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  card: {
    backgroundColor: Palette.surface,
    padding: 18,
    borderRadius: Radius.card,
    alignItems: "center",
    width: "40%",
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadow.card,
  },
  cardEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  cardText: {
    color: Palette.text,
    fontWeight: "600",
  },
  // Nuevos estilos para la sección featured
  featuredSection: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    backgroundColor: Palette.background,
    padding: 18,
    alignItems: "center",
  },
  featuredBadge: {
    backgroundColor: Palette.surfaceLilac,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 30,
    shadowColor: Palette.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  featuredBadgeText: {
    color: Palette.secondaryText,
    fontWeight: "bold",
    fontSize: 14,
  },
  featuredTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Palette.text,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 40,
  },
  featuredTitleGreen: {
    color: Palette.primary,
    fontSize: 20,
  },
  featuredTitleBlue: {
    color: Palette.primary,
    fontSize: 20,
  },
  featuredTitlePurple: {
    color: Palette.primary,
    fontSize: 20,
  },
  featuredSubtitle: {
    fontSize: 16,
    color: Palette.textMuted,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  featuredHighlight: {
    color: Palette.primary,
    fontWeight: "bold",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 10,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: Palette.primary,
    marginBottom: 3,
  },
  statNumberBlue: {
    fontSize: 24,
    fontWeight: "bold",
    color: Palette.primary,
    marginBottom: 3,
  },
  statNumberPurple: {
    fontSize: 24,
    fontWeight: "bold",
    color: Palette.primary,
    marginBottom: 3,
  },
  statLabel: {
    fontSize: 12,
    color: Palette.textMuted,
    textAlign: "center",
    lineHeight: 16,
  },
});
