import { LinearGradient } from "expo-linear-gradient";
import { Palette, Radius, Shadow } from "@/constants/palette";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import CuteHint from "@/components/cute/CuteHint";
import FloatingCritters from "@/components/cute/FloatingCritters";
import PawGround from "@/components/cute/PawGround";
import { Bob, PopIn } from "@/components/cute/Motion";
import { authAPI } from "@/api";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: "",
      password: "",
    };

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "El correo es requerido";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Ingresa un correo válido";
      isValid = false;
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login(formData.email, formData.password);
      // Usar el contexto de autenticación para guardar el token y usuario
      await signIn(response.token, response.user);
      // El AuthContext se encargará de redirigir automáticamente
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Error al iniciar sesión"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <LinearGradient
      colors={[Palette.background, Palette.background]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <FloatingCritters count={10} size={26} opacity={0.3} pawColor={Palette.borderStrong} />
      <View style={styles.contentContainer}>
        <Bob>
          <Image
            source={require("@/assets/images/Logo.png")}
            style={styles.logo}
          />
        </Bob>
        <ThemedText style={styles.title}>Iniciar Sesión</ThemedText>
        <ThemedText style={styles.subtitle}>
          Bienvenido de vuelta a AdoptaFácil 🐾
        </ThemedText>

        <PopIn delay={150} style={styles.formContainer}>
          <CuteHint id="login-email" text="¡Escribe aquí tu correo y contraseña! 🐾" />
          <TextInput
            style={[styles.input, errors.email ? styles.inputError : null]}
            placeholder="Correo electrónico"
            placeholderTextColor={Palette.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => {
              setFormData({ ...formData, email: text });
              if (errors.email) {
                setErrors({ ...errors, email: "" });
              }
            }}
          />
          {errors.email ? (
            <ThemedText style={styles.errorText}>{errors.email}</ThemedText>
          ) : null}

          <TextInput
            style={[styles.input, errors.password ? styles.inputError : null]}
            placeholder="Contraseña"
            placeholderTextColor={Palette.textMuted}
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => {
              setFormData({ ...formData, password: text });
              if (errors.password) {
                setErrors({ ...errors, password: "" });
              }
            }}
          />
          {errors.password ? (
            <ThemedText style={styles.errorText}>{errors.password}</ThemedText>
          ) : null}

          <TouchableOpacity
            style={[styles.loginButton, loading ? styles.buttonDisabled : null]}
            onPress={handleLogin}
            disabled={loading}
          >
            <ThemedText style={styles.loginButtonText}>
              {loading ? "Iniciando..." : "Iniciar Sesión"}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotPassword}>
            <ThemedText style={styles.forgotPasswordText}>
              ¿Olvidaste tu contraseña?
            </ThemedText>
          </TouchableOpacity>

          <CuteHint
            id="login-register"
            text="¿Eres nuevo? Crea tu cuenta aquí 🐶"
            delay={1400}
          />
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => router.push("/register-options")}
          >
            <ThemedText style={styles.registerButtonText}>
              ¿No tienes cuenta? Regístrate
            </ThemedText>
          </TouchableOpacity>
        </PopIn>
      </View>
      {/* Huellitas que caminan por la página (se mueven con el scroll) */}
      <PawGround />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    width: "100%",
    paddingHorizontal: 30,
    paddingVertical: 50,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 15,
    resizeMode: "contain",
  },
  title: {
    fontSize: 33,
    fontWeight: "bold",
    color: Palette.primary,
    textAlign: "center",
    marginBottom: 12,
    paddingBottom: 5,
    textShadowColor: "transparent",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: Palette.textMuted,
    textAlign: "center",
    marginBottom: 50,
    textShadowColor: "transparent",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  formContainer: {
    width: "100%",
    maxWidth: 350,
  },
  input: {
    width: "100%",
    height: 60,
    borderWidth: 1.5,
    borderColor: Palette.border,
    backgroundColor: Palette.surface,
    borderRadius: Radius.field,
    paddingHorizontal: 25,
    marginBottom: 20,
    color: Palette.text,
    fontSize: 16,
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButton: {
    width: "100%",
    maxWidth: 240,
    alignSelf: "center",
    height: 52,
    backgroundColor: Palette.primary,
    borderRadius: Radius.pill,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    ...Shadow.button,
  },
  loginButtonText: {
    color: Palette.onPrimary,
    fontWeight: "bold",
    fontSize: 18,
  },
  forgotPassword: {
    alignSelf: "center",
    marginTop: 25,
    paddingVertical: 12,
  },
  forgotPasswordText: {
    color: Palette.textMuted,
    fontSize: 16,
    textShadowColor: "transparent",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  registerButton: {
    alignSelf: "center",
    marginTop: 20,
    paddingVertical: 12,
  },
  registerButtonText: {
    color: Palette.primary,
    fontSize: 16,
    fontWeight: "bold",
    textShadowColor: "transparent",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  inputError: {
    borderColor: Palette.errorText,
    borderWidth: 3,
    backgroundColor: Palette.surface,
  },
  errorText: {
    color: Palette.errorText,
    fontSize: 14,
    marginTop: -15,
    marginBottom: 15,
    marginLeft: 25,
    fontWeight: "600",
    textShadowColor: "transparent",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  buttonDisabled: {
    backgroundColor: Palette.disabledBg,
    opacity: 0.7,
  },
});
