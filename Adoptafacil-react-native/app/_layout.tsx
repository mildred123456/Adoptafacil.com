import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import "react-native-reanimated";

import "@/components/web-alert";
import { CuteAlertHost } from "@/components/cute/CuteAlert";
import CuteLoader from "@/components/cute/CuteLoader";
import PawTrail from "@/components/cute/PawTrail";
import { Palette } from "@/constants/palette";
import { MascotasProvider } from "./(tabs)/settings";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

export const unstable_settings = {
  initialRouteName: "login",
};

// Tema visual de navegación: siempre el estilo tierno claro (también cuando
// el sistema está en modo oscuro, para evitar fondos negros entre pantallas).
const CuteNavTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Palette.primary,
    background: Palette.background,
    card: Palette.background,
    text: Palette.text,
    border: Palette.border,
    notification: Palette.primary,
  },
};

function RootLayoutNav() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Palette.background,
        }}
      >
        <CuteLoader size={36} />
      </View>
    );
  }

  return (
    <ThemeProvider value={CuteNavTheme}>
      {/* Capa decorativa de huellitas (solo visual, no captura toques) */}
      <PawTrail>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen
          name="register-options"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="gestionar-mascotas"
          options={{
            headerShown: false,
            presentation: "card",
          }}
        />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      {/* Avisos tiernos (en la web reemplazan a las alertas del navegador) */}
      <CuteAlertHost />
      </PawTrail>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <MascotasProvider>
        <RootLayoutNav />
      </MascotasProvider>
    </AuthProvider>
  );
}
