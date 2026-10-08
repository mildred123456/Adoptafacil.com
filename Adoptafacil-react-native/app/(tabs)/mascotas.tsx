import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Palette, Radius, Shadow } from "@/constants/palette";
import {
  View,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  Text,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "@/components/themed-text";
import CuteHint from "@/components/cute/CuteHint";
import FloatingCritters from "@/components/cute/FloatingCritters";
import PawGround from "@/components/cute/PawGround";
import { PopIn } from "@/components/cute/Motion";
import CuteLoader from "@/components/cute/CuteLoader";
import { useMascotas } from "./settings";
import { Mascota } from "@/types";
import axios, { isAxiosError } from "axios";
import { BASE_URL } from "@/config";
import { tokenStorage } from "@/api";

export default function MascotasScreen() {
  const { mascotas, setMascotas } = useMascotas();
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    searchTerm: "",
    selectedEspecie: "all",
    selectedEdad: "all",
  });

  // Cargar mascotas desde el backend al montar el componente
  useEffect(() => {
    cargarMascotasPublicas();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Carga las mascotas públicas disponibles para adopción
   * Intenta varios enfoques: público sin auth, con auth, y fallback a datos locales
   */
  const cargarMascotasPublicas = async () => {
    try {
      setCargando(true);
      setError(null);

      let response;
      let mascotasData = [];

      // Estrategia 1: Intentar endpoint público sin autenticación
      try {
        console.log("🔍 Intentando endpoint público sin autenticación...");
        response = await axios.get(`${BASE_URL}/mascotas/publicas`, {
          timeout: 10000,
        });
        mascotasData = response.data;
        console.log(
          "✅ Endpoint público exitoso:",
          mascotasData.length,
          "mascotas"
        );
      } catch (publicError: any) {
        console.log(
          "❌ Endpoint público falló:",
          publicError.response?.status || publicError.message
        );

        // Estrategia 2: Intentar endpoint para todas las mascotas (admin/all)
        try {
          console.log("🔍 Intentando endpoint de todas las mascotas...");
          const token = await tokenStorage.getToken();

          if (token) {
            console.log(
              "✅ Token encontrado, intentando cargar todas las mascotas"
            );

            // Intentar primero el endpoint admin que trae todas las mascotas
            try {
              response = await axios.get(`${BASE_URL}/mascotas/admin/all`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                timeout: 10000,
              });
              mascotasData = response.data;
              console.log(
                "✅ Endpoint admin/all exitoso:",
                mascotasData.length,
                "mascotas (todas del sistema)"
              );
            } catch (adminError: any) {
              console.log(
                "❌ Endpoint admin/all falló:",
                adminError.response?.status || adminError.message
              );
              console.log("🔄 Fallback: intentando endpoint general...");

              // Fallback al endpoint general
              response = await axios.get(`${BASE_URL}/mascotas`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                timeout: 10000,
              });
              mascotasData = response.data;
              console.log(
                "✅ Endpoint general exitoso:",
                mascotasData.length,
                "mascotas (filtradas por usuario)"
              );
            }
          } else {
            console.log("❌ No hay token de autenticación disponible");
            throw new Error("No hay token de autenticación disponible");
          }
        } catch (authError: any) {
          console.log(
            "❌ Endpoints autenticados fallaron:",
            authError.response?.status || authError.message
          );

          // Log más detallado del error de autenticación
          if (authError.response?.status === 403) {
            console.log(
              "🔒 Error 403: Acceso denegado - Token inválido o permisos insuficientes"
            );
          } else if (authError.response?.status === 401) {
            console.log(
              "🔒 Error 401: No autorizado - Token expirado o inválido"
            );
          } else if (authError.code === "ECONNABORTED") {
            console.log("⏰ Error: Tiempo de espera agotado");
          } else if (authError.request && !authError.response) {
            console.log("🌐 Error: No se pudo conectar con el servidor");
          }

          // Estrategia 3: Usar datos existentes del contexto como fallback
          if (mascotas && mascotas.length > 0) {
            console.log(
              "📋 Usando datos existentes del contexto:",
              mascotas.length,
              "mascotas"
            );
            setCargando(false);
            return; // No actualizar si ya hay datos
          } else {
            // Estrategia 4: Crear datos de ejemplo para demostración
            console.log("📋 Creando datos de ejemplo para demostración");
            console.log(
              "⚠️ Nota: El backend puede no estar disponible o no tener endpoint público"
            );
            mascotasData = [
              {
                id: 1,
                nombre: "Firulais",
                especie: "Perro",
                raza: "Labrador Retriever",
                edad: "2",
                sexo: "Macho",
                ciudad: "Bogotá",
                descripcion:
                  "Perro muy amigable y juguetón, ideal para familias",
                fechaNacimiento: "2022-01-15",
                imagenes: ["https://placedog.net/500/500?id=1"],
              },
              {
                id: 2,
                nombre: "Michi",
                especie: "Gato",
                raza: "Siamés",
                edad: "1",
                sexo: "Hembra",
                ciudad: "Medellín",
                descripcion: "Gata muy cariñosa y tranquila",
                fechaNacimiento: "2023-06-10",
                imagenes: ["https://cdn2.thecatapi.com/images/9j5.jpg"],
              },
              {
                id: 3,
                nombre: "Luna",
                especie: "Gato",
                raza: "Persa",
                edad: "3",
                sexo: "Hembra",
                ciudad: "Cali",
                descripcion: "Gata elegante y de carácter dulce",
                fechaNacimiento: "2021-08-20",
                imagenes: ["https://cdn2.thecatapi.com/images/MTY3ODIyMQ.jpg"],
              },
              {
                id: 4,
                nombre: "Max",
                especie: "Perro",
                raza: "Golden Retriever",
                edad: "4",
                sexo: "Macho",
                ciudad: "Barranquilla",
                descripcion: "Perro leal y protector, excelente compañero",
                fechaNacimiento: "2020-03-12",
                imagenes: ["https://placedog.net/500/500?id=4"],
              },
            ];
          }
        }
      }

      // Mapear los datos al formato de la interfaz
      const mascotasFormateadas: Mascota[] = mascotasData.map((m: any) => {
        let imagenes: string[] = [];

        console.log(`🔍 Procesando mascota ${m.nombre}:`, {
          tieneImagenes: !!m.imagenes,
          cantidadImagenes: m.imagenes?.length || 0,
          primeraImagen: m.imagenes?.[0],
          imagenSimple: m.imagen,
          estructura: Object.keys(m),
        });

        // Procesar imágenes
        if (m.imagenes && Array.isArray(m.imagenes) && m.imagenes.length > 0) {
          imagenes = m.imagenes.slice(0, 3).map((img: any) => {
            const imagePath = img.imagenPath || img;
            console.log(`🖼️ Construyendo URL para imagen: ${imagePath}`);
            return construirURLImagen(imagePath);
          });
        } else if (m.imagen) {
          imagenes = [construirURLImagen(m.imagen)];
        } else if (typeof m.imagenes === "string") {
          imagenes = [m.imagenes];
        } else {
          console.log(`⚠️ Sin imágenes para ${m.nombre}, usando placeholder`);
          imagenes = [
            "https://via.placeholder.com/300x300.png?text=Sin+Imagen",
          ];
        }

        const mascotaFormateada: Mascota = {
          id: m.id,
          nombre: m.nombre || "Sin nombre",
          especie: m.especie || "No especificado",
          raza: m.raza || "Mestizo",
          edad: m.edad ? `${m.edad}` : "No especificado",
          sexo: m.sexo || "No especificado",
          ciudad: m.ciudad || "No especificado",
          descripcion: m.descripcion || "",
          fechaNacimiento: m.fechaNacimiento || "",
          imagenes: imagenes,
        };

        // Si viene información del propietario (del endpoint admin), agregarla
        if (m.person) {
          console.log(`👤 Propietario encontrado para ${m.nombre}:`, {
            nombre: m.person.name,
            apellido: m.person.lastName,
            email: m.person.email,
          });

          mascotaFormateada.propietario = {
            nombre:
              `${m.person.name || ""} ${m.person.lastName || ""}`.trim() ||
              "Nombre no disponible",
            email: m.person.email || "Email no disponible",
          };
        }

        return mascotaFormateada;
      });

      console.log("📊 Mascotas formateadas:", mascotasFormateadas.length);
      setMascotas(mascotasFormateadas);
    } catch (error: any) {
      console.error("💥 Error general cargando mascotas:", {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        url: error.config?.url,
      });

      // Manejo de errores específicos similar a gestionar-mascotas.tsx
      if (isAxiosError(error)) {
        if (error.response?.status === 403) {
          setError(
            "No tienes permisos para ver las mascotas. Es posible que necesites iniciar sesión."
          );
          console.log("🔒 Error 403: Acceso denegado");
        } else if (error.response?.status === 401) {
          setError(
            "Sesión expirada o no autorizado. Inicia sesión para ver las mascotas."
          );
          console.log("🔒 Error 401: No autorizado");
        } else if (error.response?.status === 404) {
          setError("Endpoint no encontrado. Mostrando datos de demostración.");
          console.log("📍 Error 404: Endpoint no existe");
        } else if (error.code === "ECONNABORTED") {
          setError(
            "Tiempo de espera agotado. Verifica tu conexión a internet."
          );
          console.log("⏰ Error: Timeout");
        } else if (error.request && !error.response) {
          setError(
            "No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose."
          );
          console.log("🌐 Error de conexión: Sin respuesta del servidor");
        } else {
          setError(
            "Error al cargar las mascotas. Mostrando datos de demostración."
          );
          console.log("❓ Error HTTP desconocido:", error.response?.status);
        }
      } else {
        setError(
          "Error inesperado al cargar las mascotas. Mostrando datos de demostración."
        );
        console.log("❓ Error no-HTTP:", error.message);
      }

      // Fallback final: datos de demostración con más información
      const datosDemostracion: Mascota[] = [
        {
          id: 999,
          nombre: "Demo Pet",
          especie: "Perro",
          raza: "Mestizo",
          edad: "2",
          sexo: "Macho",
          ciudad: "Demo City",
          descripcion: "Mascota de demostración - Backend no disponible",
          fechaNacimiento: "2022-01-01",
          imagenes: ["https://placedog.net/300/300?id=999"],
        },
        {
          id: 998,
          nombre: "Demo Cat",
          especie: "Gato",
          raza: "Común Europeo",
          edad: "1",
          sexo: "Hembra",
          ciudad: "Demo Town",
          descripcion: "Gata de demostración - Datos de prueba",
          fechaNacimiento: "2023-01-01",
          imagenes: ["https://cdn2.thecatapi.com/images/demo.jpg"],
        },
      ];
      setMascotas(datosDemostracion);
    } finally {
      setCargando(false);
    }
  };

  /**
   * Construye una URL completa para acceder a las imágenes del servidor
   */
  const construirURLImagen = (imagePath: string): string => {
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    if (imagePath.startsWith("/uploads/")) {
      return `${BASE_URL.replace("/api", "")}${imagePath}`;
    }
    if (imagePath.startsWith("uploads/")) {
      return `${BASE_URL.replace("/api", "")}/${imagePath}`;
    }
    if (!imagePath.startsWith("/") && !imagePath.includes("/")) {
      return `${BASE_URL.replace("/api", "")}/uploads/${imagePath}`;
    }
    const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `${BASE_URL.replace("/api", "")}${cleanPath}`;
  };

  // Detectar si las edades parecen estar en meses
  const datasetSeemsInMonths = useMemo(() => {
    if (!mascotas || mascotas.length === 0) return true;
    const countGreaterThan24 = mascotas.reduce((acc, m) => {
      const n = Number(m.edad) || 0;
      return acc + (n > 24 ? 1 : 0);
    }, 0);
    return countGreaterThan24 >= mascotas.length / 2;
  }, [mascotas]);

  // Normalizar a meses
  const ageToMonths = useCallback(
    (ageRaw: number | string) => {
      const n = Number(ageRaw) || 0;
      return datasetSeemsInMonths ? n : n * 12;
    },
    [datasetSeemsInMonths]
  );

  // Listas únicas
  const availableEspecies = useMemo(
    () => Array.from(new Set(mascotas.map((m) => m.especie))).filter(Boolean),
    [mascotas]
  );

  // Filtrado
  const filteredPets = useMemo(() => {
    return mascotas.filter((pet) => {
      const term = filters.searchTerm.trim().toLowerCase();

      const searchTermMatch =
        !term ||
        pet.nombre?.toLowerCase().includes(term) ||
        pet.descripcion?.toLowerCase().includes(term) ||
        pet.raza?.toLowerCase().includes(term) ||
        pet.especie?.toLowerCase().includes(term);

      const especieMatch =
        filters.selectedEspecie === "all" ||
        pet.especie === filters.selectedEspecie;

      const edadMeses = ageToMonths(pet.edad);
      const edadMatch =
        filters.selectedEdad === "all" ||
        (filters.selectedEdad === "joven" && edadMeses <= 24) ||
        (filters.selectedEdad === "adulto" &&
          edadMeses > 24 &&
          edadMeses <= 84) ||
        (filters.selectedEdad === "senior" && edadMeses > 84);

      return searchTermMatch && especieMatch && edadMatch;
    });
  }, [filters, mascotas, ageToMonths]);

  return (
    // Toda la página hace scroll junta (encabezado, filtros y tarjetas)
    <ScrollView style={styles.container}>
      {/* Hero Section con gradiente solo para título y subtítulo */}
      <LinearGradient
        colors={[Palette.surfacePink, Palette.surfacePink]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroSection}
      >
        <FloatingCritters count={8} size={22} opacity={0.35} />
        <ThemedText style={styles.title}>Mascotas Disponibles</ThemedText>
        <ThemedText style={styles.subtitle}>
          Estos son nuestros animales en busca de un hogar, amor y mucho cariño!
        </ThemedText>
      </LinearGradient>

      {/* Mostrar estado de carga */}
      {cargando && (
        <View style={styles.loadingContainer}>
          <CuteLoader />
          <Text style={styles.loadingText}>Cargando mascotas...</Text>
        </View>
      )}

      {/* Mostrar error si existe */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.retryText} onPress={cargarMascotasPublicas}>
            Tocar para reintentar
          </Text>
        </View>
      )}

      {/* Mostrar contenido solo si no está cargando */}
      {!cargando && (
        <View style={styles.contentSection}>
          {/* Filtros */}
          <View style={styles.filtros}>
            <CuteHint
              id="pets-filters"
              text="Escribe o elige filtros para encontrar a tu amigo 🐾"
            />
            <TextInput
              style={styles.input}
              placeholder="Buscar por nombre, raza o descripción..."
              placeholderTextColor={Palette.textMuted}
              value={filters.searchTerm}
              onChangeText={(t) => setFilters((p) => ({ ...p, searchTerm: t }))}
            />

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={filters.selectedEspecie}
                style={styles.picker}
                onValueChange={(v) =>
                  setFilters((p) => ({ ...p, selectedEspecie: v }))
                }
              >
                <Picker.Item label="Todas las especies" value="all" />
                {availableEspecies.map((e) => (
                  <Picker.Item key={e} label={e} value={e} />
                ))}
              </Picker>
            </View>

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={filters.selectedEdad}
                style={styles.picker}
                onValueChange={(v) =>
                  setFilters((p) => ({ ...p, selectedEdad: v }))
                }
              >
                <Picker.Item label="Todas las edades" value="all" />
                <Picker.Item label="Joven (0-2 años)" value="joven" />
                <Picker.Item label="Adulto (2-7 años)" value="adulto" />
                <Picker.Item label="Senior (7+ años)" value="senior" />
              </Picker>
            </View>
          </View>

          {/* Lista (cuadrícula de 2 columnas dentro del scroll de la página) */}
          <View style={styles.cardsContainer}>
            {filteredPets.length === 0 ? (
              <View style={[styles.emptyContainer, styles.emptyFull]}>
                <ThemedText style={styles.emptyEmoji}>🐶🔍🐱</ThemedText>
                <ThemedText style={styles.emptyText}>
                  No se encontraron mascotas con esos criterios
                </ThemedText>
              </View>
            ) : (
              filteredPets.map((mascota, index) => (
              <PopIn
                key={String(mascota.id)}
                delay={Math.min(index, 8) * 70}
                style={styles.cardPop}
              >
              <View style={styles.card}>
                <Image
                  source={{ uri: mascota.imagenes?.[0] }}
                  style={styles.foto}
                />
                <View style={styles.info}>
                  <ThemedText style={styles.nombre}>
                    {mascota.nombre}
                  </ThemedText>
                  <ThemedText style={styles.detalle}>
                    {mascota.especie} •{" "}
                    {edadToFriendlyString(ageToMonths(mascota.edad))}
                  </ThemedText>
                  <ThemedText style={styles.detalle}>{mascota.raza}</ThemedText>
                  {mascota.ciudad && (
                    <ThemedText style={styles.detalle}>
                      📍 {mascota.ciudad}
                    </ThemedText>
                  )}
                </View>
              </View>
              </PopIn>
              ))
            )}
          </View>
        </View>
      )}
      {/* Huellitas que caminan por la página (se mueven con el scroll) */}
      <PawGround />
    </ScrollView>
  );
}

function edadToFriendlyString(meses: number) {
  if (meses <= 1) return `${meses} mes`;
  if (meses < 12) return `${meses} meses`;
  const años = Math.floor(meses / 12);
  return años === 1 ? `${años} año` : `${años} años`;
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
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: Palette.primary,
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: "transparent",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Palette.textMuted,
    textAlign: "center",
    lineHeight: 22,
    textShadowColor: "transparent",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  contentSection: {
    flex: 1,
    padding: 20,
  },
  filtros: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    backgroundColor: Palette.surface,
    borderRadius: Radius.card,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadow.card,
  },
  input: {
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
  pickerContainer: {
    backgroundColor: Palette.surface,
    borderWidth: 1.5,
    borderColor: Palette.border,
    borderRadius: Radius.field,
    marginBottom: 8,
    height: 46,
    justifyContent: "center",
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    overflow: "hidden",
  },
  picker: {
    color: Palette.text,
    height: 42,
    borderWidth: 0,
    backgroundColor: "transparent",
    paddingHorizontal: 12,
    fontSize: 15,
  },
  cardsContainer: {
    paddingBottom: 30,
    // Cuadrícula: 2 columnas en celular; en pantallas anchas caben más
    // tarjetas por fila (cada una mide como máximo 260 px) y quedan centradas
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  cardPop: {
    width: "50%",
    maxWidth: 260,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  card: {
    flex: 1,
    width: "100%",
    marginVertical: 8,
    backgroundColor: Palette.surface,
    borderRadius: Radius.card,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: Palette.border,
    alignItems: "center",
    minWidth: 140,
    maxWidth: 220,
    ...Shadow.card,
  },
  foto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    backgroundColor: Palette.surfacePink,
    borderWidth: 4,
    borderColor: Palette.border,
  },
  info: {
    alignItems: "center",
  },
  nombre: {
    fontSize: 18,
    fontWeight: "600",
    color: Palette.text,
    marginBottom: 6,
    textAlign: "center",
  },
  detalle: {
    fontSize: 14,
    color: Palette.textMuted,
    textAlign: "center",
    marginBottom: 2,
  },
  // El aviso de "sin resultados" ocupa todo el ancho de la cuadrícula
  emptyFull: {
    width: "100%",
    marginHorizontal: 0,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: Palette.surface,
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: Palette.border,
    borderStyle: "dashed",
    margin: 8,
    ...Shadow.card,
  },
  emptyEmoji: {
    fontSize: 34,
    lineHeight: 44,
    marginBottom: 8,
  },
  emptyText: {
    color: Palette.textMuted,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    backgroundColor: Palette.surface,
    borderRadius: Radius.card,
    margin: 20,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadow.card,
  },
  loadingText: {
    color: Palette.text,
    fontSize: 16,
    marginTop: 10,
    fontWeight: "500",
  },
  errorContainer: {
    backgroundColor: Palette.surface,
    padding: 20,
    borderRadius: Radius.card,
    margin: 20,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadow.card,
  },
  errorText: {
    color: Palette.errorText,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "500",
  },
  retryText: {
    color: Palette.errorText,
    fontSize: 14,
    textAlign: "center",
    textDecorationLine: "underline",
    fontWeight: "600",
  },
});
