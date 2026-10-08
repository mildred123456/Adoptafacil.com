import { ThemedText } from "@/components/themed-text";
import { Palette, Radius, Shadow } from "@/constants/palette";
import CuteHint from "@/components/cute/CuteHint";
import FloatingCritters from "@/components/cute/FloatingCritters";
import PawGround from "@/components/cute/PawGround";
import { PopIn } from "@/components/cute/Motion";
import { ThemedView } from "@/components/themed-view";
import { useState, createContext, useContext } from "react";
import { Mascota } from "@/types";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { LinearGradient } from "expo-linear-gradient";

// Creamos un contexto para compartir el estado de mascotas en toda la app
const MascotasContext = createContext<{
  mascotas: Mascota[];
  setMascotas: React.Dispatch<React.SetStateAction<Mascota[]>>;
} | null>(null);

// Hook personalizado para acceder fácilmente al contexto de mascotas
export function useMascotas() {
  const ctx = useContext(MascotasContext);
  if (!ctx)
    throw new Error("useMascotas debe usarse dentro de MascotasProvider");
  return ctx;
}

export function MascotasProvider({ children }: { children: React.ReactNode }) {
  const [mascotas, setMascotas] = useState<Mascota[]>([
    {
      id: 1,
      nombre: "Firulais",
      especie: "Perro",
      raza: "Labrador",
      edad: "2 años",
      imagenes: ["https://placedog.net/500/500?id=1"],
    },
    {
      id: 2,
      nombre: "Michi",
      especie: "Gato",
      raza: "Siamés",
      edad: "1 año",
      imagenes: ["https://cdn2.thecatapi.com/images/9j5.jpg"],
    },
  ]);

  // El Provider permite que cualquier componente hijo acceda a "mascotas" y "setMascotas"
  return (
    <MascotasContext.Provider value={{ mascotas, setMascotas }}>
      {children}
    </MascotasContext.Provider>
  );
}

export default function ConfiguracionScreen() {
  const router = useRouter();
  const { signOut, user } = useAuth();

  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro que deseas cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar Sesión",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
          } catch {
            Alert.alert("Error", "No se pudo cerrar sesión");
          }
        },
      },
    ]);
  };

  // Verificar si el usuario tiene permisos para gestionar mascotas
  const tienePermisosGestionMascotas =
    user?.role?.roleType === "ADMIN" || user?.role?.roleType === "ALIADO";

  const settingsOptions = [
    // Solo mostrar "Gestionar mascotas" para ADMIN y ALIADO
    ...(tienePermisosGestionMascotas
      ? [
          {
            title: "Gestionar mascotas",
            description: "Agregar, editar o eliminar mascotas",
            icon: "🐾",
            iconBg: Palette.primarySoft,
            onPress: () => {
              router.push("../gestionar-mascotas");
            },
          },
        ]
      : []),
    {
      title: "Configuración de Cuenta",
      description: "Cambiar contraseña, email, etc.",
      icon: "⚙️",
      iconBg: Palette.primarySoft,
      onPress: () => {
        console.log("Navigate to Configuración de Cuenta");
      },
    },
    {
      title: "Notificaciones",
      description: "Configurar preferencias de notificaciones",
      icon: "🔔",
      iconBg: Palette.primarySoft,
      onPress: () => {
        console.log("Navigate to Notificaciones");
      },
    },
    {
      title: "Ayuda y Soporte",
      description: "Centro de ayuda y contacto",
      icon: "❓",
      iconBg: Palette.primarySoft,
      onPress: () => {
        console.log("Navigate to Ayuda y Soporte");
      },
    },
    {
      title: "Cerrar Sesión",
      description: `Usuario: ${user?.email || "Desconocido"}`,
      icon: "🚪",
      iconBg: Palette.errorBg,
      onPress: handleLogout,
      isLogout: true,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section con gradiente */}
      <LinearGradient
        colors={[Palette.surfacePink, Palette.surfacePink]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroSection}
      >
        <FloatingCritters count={8} size={22} opacity={0.35} />
        <ThemedText style={styles.heroTitle}>Personalizar cuenta</ThemedText>
        <ThemedText style={styles.heroSubtitle}>
          Personaliza tu experiencia y gestiona tu cuenta de AdoptaFácil
        </ThemedText>
      </LinearGradient>

      {/* Sección de contenido */}
      <PopIn delay={120}>
      <ThemedView style={styles.contentSection}>
        <CuteHint
          id="settings-options"
          text="Toca una opción para ajustar tu cuenta ⚙️"
        />
        {settingsOptions.map((option, index) => {
          // Cerrar sesión tendrá un estilo especial
          const isLogout = "isLogout" in option && option.isLogout;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionContainer,
                isLogout && styles.logoutContainer,
              ]}
              onPress={option.onPress}
            >
              <View style={styles.optionContent}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: option.iconBg },
                  ]}
                >
                  <ThemedText style={styles.iconText}>{option.icon}</ThemedText>
                </View>
                <View style={styles.textContainer}>
                  <ThemedText
                    type="subtitle"
                    style={[styles.optionTitle, isLogout && styles.logoutTitle]}
                  >
                    {option.title}
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.optionDescription,
                      isLogout && styles.logoutDescription,
                    ]}
                  >
                    {option.description}
                  </ThemedText>
                </View>
                <View style={styles.arrowContainer}>
                  <ThemedText
                    style={[styles.arrow, isLogout && styles.logoutArrow]}
                  >
                    {isLogout ? "🚪" : "›"}
                  </ThemedText>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ThemedView>
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
  optionContainer: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    backgroundColor: Palette.surface,
    padding: 20,
    marginBottom: 12,
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadow.card,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    shadowColor: Palette.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  iconText: {
    fontSize: 22,
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    color: Palette.text,
  },
  optionDescription: {
    fontSize: 14,
    color: Palette.textMuted,
    lineHeight: 20,
  },
  arrowContainer: {
    marginLeft: 10,
  },
  arrow: {
    fontSize: 28,
    color: Palette.primary,
    lineHeight: 30,
    fontWeight: "700",
  },
  logoutContainer: {
    backgroundColor: Palette.surface,
    borderColor: Palette.errorBg,
    marginTop: 10,
  },
  logoutTitle: {
    color: Palette.errorText,
  },
  logoutDescription: {
    color: Palette.errorText,
  },
  logoutArrow: {
    color: Palette.errorText,
  },
});
