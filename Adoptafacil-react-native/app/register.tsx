import { LinearGradient } from "expo-linear-gradient";
import { Palette, Radius, Shadow } from "@/constants/palette";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
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

export default function RegisterScreen() {
  const { userType } = useLocalSearchParams();
  const { signIn } = useAuth();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contrasena: "",
    confirmarContrasena: "",
    tipoUsuario: userType || "amigo",
  });

  const [errors, setErrors] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contrasena: "",
    confirmarContrasena: "",
  });

  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      nombre: "",
      apellido: "",
      correo: "",
      contrasena: "",
      confirmarContrasena: "",
    };

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
      isValid = false;
    } else if (formData.nombre.trim().length < 2) {
      // El backend exige entre 2 y 50 caracteres
      newErrors.nombre = "El nombre debe tener al menos 2 letras";
      isValid = false;
    }

    // Validar apellido
    if (!formData.apellido.trim()) {
      newErrors.apellido = "El apellido es requerido";
      isValid = false;
    } else if (formData.apellido.trim().length < 2) {
      // El backend exige entre 2 y 50 caracteres
      newErrors.apellido = "El apellido debe tener al menos 2 letras";
      isValid = false;
    }

    // Validar correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.correo.trim()) {
      newErrors.correo = "El correo es requerido";
      isValid = false;
    } else if (!emailRegex.test(formData.correo)) {
      newErrors.correo = "Ingresa un correo válido";
      isValid = false;
    }

    // Validar contraseña
    if (!formData.contrasena) {
      newErrors.contrasena = "La contraseña es requerida";
      isValid = false;
    } else if (formData.contrasena.length < 8) {
      // El backend exige mínimo 8 caracteres (RegisterRequestDTO)
      newErrors.contrasena = "La contraseña debe tener al menos 8 caracteres";
      isValid = false;
    }

    // Validar confirmación
    if (!formData.confirmarContrasena) {
      newErrors.confirmarContrasena = "Confirma tu contraseña";
      isValid = false;
    } else if (formData.contrasena !== formData.confirmarContrasena) {
      newErrors.confirmarContrasena = "Las contraseñas no coinciden";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Mapear el tipo de usuario del frontend al enum del backend
      const role = formData.tipoUsuario === "amigo" ? "CLIENTE" : "ALIADO";

      const userData = {
        name: formData.nombre,
        lastName: formData.apellido,
        email: formData.correo,
        password: formData.contrasena,
        role: role as "CLIENTE" | "ALIADO",
      };

      const response = await authAPI.register(userData);

      // Actualizar el contexto de autenticación inmediatamente
      if (response.token && response.user) {
        await signIn(response.token, response.user);

        // Forzar redirección inmediata después del login exitoso
        router.replace("/(tabs)");
      }

      // Opcional: Mostrar un mensaje de bienvenida más sutil
      setTimeout(() => {
        Alert.alert(
          "¡Bienvenido a AdoptaFácil!",
          `Tu cuenta ha sido creada exitosamente. ¡Comencemos a encontrar tu compañero perfecto!`
        );
      }, 500);
    } catch (error) {
      console.error("Error en registro:", error);
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Error al registrar usuario. Inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: "" });
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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentContainer}>
          <Bob>
            <Image
              source={require("@/assets/images/Logo.png")}
              style={styles.logo}
            />
          </Bob>
          <ThemedText style={styles.title}>
            {formData.tipoUsuario === "amigo"
              ? "Registro Amigo AdoptaFácil"
              : "Registro Aliado AdoptaFácil"}
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            {formData.tipoUsuario === "amigo"
              ? "Únete a AdoptaFácil y encuentra tu compañero perfecto"
              : "Únete a nuestra red de refugios y ayuda a más mascotas"}
          </ThemedText>

          <PopIn delay={150} style={styles.formContainer}>
            <CuteHint id="register-name" text="¡Escribe aquí tu nombre! 🐾" />
            <TextInput
              style={[styles.input, errors.nombre ? styles.inputError : null]}
              placeholder="Nombre"
              placeholderTextColor={Palette.textMuted}
              value={formData.nombre}
              onChangeText={(value) => updateField("nombre", value)}
            />
            {errors.nombre ? (
              <ThemedText style={styles.errorText}>{errors.nombre}</ThemedText>
            ) : null}

            <TextInput
              style={[styles.input, errors.apellido ? styles.inputError : null]}
              placeholder="Apellido"
              placeholderTextColor={Palette.textMuted}
              value={formData.apellido}
              onChangeText={(value) => updateField("apellido", value)}
            />
            {errors.apellido ? (
              <ThemedText style={styles.errorText}>
                {errors.apellido}
              </ThemedText>
            ) : null}

            <TextInput
              style={[styles.input, errors.correo ? styles.inputError : null]}
              placeholder="Correo electrónico"
              placeholderTextColor={Palette.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.correo}
              onChangeText={(value) => updateField("correo", value)}
            />
            {errors.correo ? (
              <ThemedText style={styles.errorText}>{errors.correo}</ThemedText>
            ) : null}

            <TextInput
              style={[
                styles.input,
                errors.contrasena ? styles.inputError : null,
              ]}
              placeholder="Contraseña"
              placeholderTextColor={Palette.textMuted}
              secureTextEntry
              value={formData.contrasena}
              onChangeText={(value) => updateField("contrasena", value)}
            />
            {errors.contrasena ? (
              <ThemedText style={styles.errorText}>
                {errors.contrasena}
              </ThemedText>
            ) : null}

            <TextInput
              style={[
                styles.input,
                errors.confirmarContrasena ? styles.inputError : null,
              ]}
              placeholder="Confirmar contraseña"
              placeholderTextColor={Palette.textMuted}
              secureTextEntry
              value={formData.confirmarContrasena}
              onChangeText={(value) =>
                updateField("confirmarContrasena", value)
              }
            />
            {errors.confirmarContrasena ? (
              <ThemedText style={styles.errorText}>
                {errors.confirmarContrasena}
              </ThemedText>
            ) : null}

            <CuteHint
              id="register-submit"
              text="Cuando termines, haz clic para continuar ✨"
              delay={1400}
            />
            <TouchableOpacity
              style={[
                styles.registerButton,
                loading ? styles.buttonDisabled : null,
              ]}
              onPress={handleRegister}
              disabled={loading}
            >
              <ThemedText style={styles.registerButtonText}>
                {loading ? "Creando cuenta..." : "Crear Cuenta"}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push("/login")}
            >
              <ThemedText style={styles.loginButtonText}>
                ¿Ya tienes cuenta? Inicia Sesión
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.push("/register-options")}
            >
              <ThemedText style={styles.backButtonText}>
                ← Cambiar tipo de registro
              </ThemedText>
            </TouchableOpacity>
          </PopIn>
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
    paddingVertical: 30,
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
    fontSize: 26,
    fontWeight: "bold",
    color: Palette.primary,
    textAlign: "center",
    marginBottom: 8,
    paddingHorizontal: 10,
    textShadowColor: "transparent",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    lineHeight: 32,
    paddingBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: Palette.textMuted,
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 15,
    textShadowColor: "transparent",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    lineHeight: 22,
  },
  formContainer: {
    width: "100%",
    maxWidth: 350,
  },
  input: {
    width: "100%",
    height: 55,
    borderWidth: 1.5,
    borderColor: Palette.border,
    backgroundColor: Palette.surface,
    borderRadius: Radius.field,
    paddingHorizontal: 22,
    marginBottom: 8,
    color: Palette.text,
    fontSize: 16,
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  inputError: {
    borderColor: Palette.errorText,
    borderWidth: 3,
    backgroundColor: Palette.surface,
  },
  errorText: {
    color: Palette.errorText,
    fontSize: 13,
    marginBottom: 12,
    marginLeft: 22,
    fontWeight: "600",
    textShadowColor: "transparent",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  registerButton: {
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
  registerButtonText: {
    color: Palette.onPrimary,
    fontWeight: "bold",
    fontSize: 18,
  },
  loginButton: {
    alignSelf: "center",
    marginTop: 25,
    paddingVertical: 12,
  },
  loginButtonText: {
    color: Palette.primary,
    fontSize: 16,
    fontWeight: "600",
    textShadowColor: "transparent",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  backButton: {
    alignSelf: "center",
    marginTop: 15,
    paddingVertical: 10,
  },
  backButtonText: {
    color: Palette.primary,
    fontSize: 15,
    fontWeight: "600",
    textShadowColor: "transparent",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonDisabled: {
    backgroundColor: Palette.disabledBg,
    opacity: 0.7,
  },
});
