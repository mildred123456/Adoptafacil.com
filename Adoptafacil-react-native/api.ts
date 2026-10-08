import axios, { isAxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL, API_TIMEOUT, APP_CONFIG } from "./config";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Log de la configuración inicial
console.log("=== API CONFIGURATION ===");
console.log("BASE_URL:", BASE_URL);
console.log("API_TIMEOUT:", API_TIMEOUT);
console.log("========================");

// Token storage utilities
export const tokenStorage = {
  setToken: async (token: string) => {
    try {
      await AsyncStorage.setItem(APP_CONFIG.JWT_TOKEN_KEY, token);
    } catch (error) {
      console.error("Error storing token:", error);
    }
  },

  getToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(APP_CONFIG.JWT_TOKEN_KEY);
    } catch (error) {
      console.error("Error retrieving token:", error);
      return null;
    }
  },

  removeToken: async () => {
    try {
      await AsyncStorage.removeItem(APP_CONFIG.JWT_TOKEN_KEY);
    } catch (error) {
      console.error("Error removing token:", error);
    }
  },
};

// User data storage utilities
export const userStorage = {
  setUser: async (user: any) => {
    try {
      await AsyncStorage.setItem(
        APP_CONFIG.USER_DATA_KEY,
        JSON.stringify(user)
      );
    } catch (error) {
      console.error("Error storing user:", error);
    }
  },

  getUser: async (): Promise<any | null> => {
    try {
      const userData = await AsyncStorage.getItem(APP_CONFIG.USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error retrieving user:", error);
      return null;
    }
  },

  removeUser: async () => {
    try {
      await AsyncStorage.removeItem(APP_CONFIG.USER_DATA_KEY);
    } catch (error) {
      console.error("Error removing user:", error);
    }
  },
};

// Request interceptor to add token to requests
api.interceptors.request.use(
  async (config) => {
    console.log(
      "Making request to:",
      `${config.baseURL || ""}${config.url || ""}`
    );
    const token = await tokenStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.error("API Error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    });

    if (error.response?.status === 401) {
      // Token expired or invalid, clear storage
      await tokenStorage.removeToken();
      await userStorage.removeUser();
      // You might want to redirect to login here
    }
    return Promise.reject(error);
  }
);

/**
 * Convierte el error de login/registro en un mensaje claro para el usuario.
 * Antes: sin respuesta del servidor salía un texto genérico, y si el backend
 * respondía con un JSON se mostraba "[object Object]".
 */
function authErrorMessage(error: any, accion: string): string {
  // El servidor no respondió (apagado, sin conexión, CORS, etc.)
  if (!error.response) {
    return `No pudimos conectarnos con el servidor para ${accion} 🐾. Verifica que el backend esté encendido e inténtalo de nuevo.`;
  }

  const { status, data } = error.response;

  // El backend responde textos claros ("El email ya está registrado", "Credenciales inválidas", "Rol inválido")
  if (typeof data === "string" && data.trim()) {
    if (status === 409) return "Este correo ya está registrado 🐶. Prueba iniciar sesión o usa otro correo.";
    if (status === 401) return "Correo o contraseña incorrectos 🐱. Revísalos e inténtalo otra vez.";
    if (status === 500) return `El servidor tuvo un problema al ${accion}. Inténtalo de nuevo en un momento.`;
    return data;
  }

  // Respuesta JSON (p. ej. validaciones de Spring)
  if (data && typeof data === "object") {
    if (typeof data.message === "string" && data.message.trim()) return data.message;
    if (Array.isArray(data.errors) && data.errors.length) {
      return data.errors
        .map((e: any) => e?.defaultMessage || e?.message || String(e))
        .join("\n");
    }
  }

  if (status === 400) {
    return "Revisa los datos: el nombre y el apellido necesitan al menos 2 letras, el correo debe ser válido y la contraseña al menos 8 caracteres.";
  }
  return `No se pudo ${accion} (error ${status}). Inténtalo de nuevo.`;
}

// Mascotas API
export const mascotasAPI = {
  // Get all mascotas
  getAll: async () => {
    try {
      const response = await api.get("/mascotas");
      return response.data;
    } catch (error) {
      console.error("Error fetching mascotas:", error);
      throw error;
    }
  },

  // Get mascota by ID
  getById: async (id: number) => {
    try {
      const response = await api.get(`/mascotas/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching mascota:", error);
      throw error;
    }
  },

  // Search mascotas by name
  searchByName: async (name: string) => {
    try {
      const response = await api.get("/mascotas", { params: { nombre: name } });
      return response.data;
    } catch (error) {
      console.error("Error searching mascotas:", error);
      throw error;
    }
  },

  // Create new mascota
  create: async (
    mascotaData: {
      nombre: string;
      especie: string;
      raza: string;
      edad: number;
      fechaNacimiento: string;
      sexo: string;
      ciudad: string;
      descripcion?: string;
      idPerson: number;
    },
    imagenes?: any[]
  ) => {
    try {
      const formData = new FormData();

      // Append all required fields
      formData.append("nombre", mascotaData.nombre);
      formData.append("especie", mascotaData.especie);
      formData.append("raza", mascotaData.raza);
      formData.append("edad", mascotaData.edad.toString());
      formData.append("fechaNacimiento", mascotaData.fechaNacimiento);
      formData.append("sexo", mascotaData.sexo);
      formData.append("ciudad", mascotaData.ciudad);
      formData.append("idPerson", mascotaData.idPerson.toString());

      if (mascotaData.descripcion) {
        formData.append("descripcion", mascotaData.descripcion);
      }

      if (imagenes && imagenes.length > 0) {
        imagenes.forEach((imagen) => {
          formData.append("imagenes", imagen);
        });
      }

      const response = await api.post("/mascotas", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating mascota:", error);
      throw error;
    }
  },

  // Update mascota
  update: async (
    id: number,
    mascotaData: {
      nombre: string;
      especie: string;
      raza: string;
      edad: number;
      fechaNacimiento: string;
      sexo: string;
      ciudad: string;
      descripcion?: string;
      idPerson: number;
    },
    imagenes?: any[]
  ) => {
    try {
      const formData = new FormData();

      formData.append("nombre", mascotaData.nombre);
      formData.append("especie", mascotaData.especie);
      formData.append("raza", mascotaData.raza);
      formData.append("edad", mascotaData.edad.toString());
      formData.append("fechaNacimiento", mascotaData.fechaNacimiento);
      formData.append("sexo", mascotaData.sexo);
      formData.append("ciudad", mascotaData.ciudad);
      formData.append("idPerson", mascotaData.idPerson.toString());

      if (mascotaData.descripcion) {
        formData.append("descripcion", mascotaData.descripcion);
      }

      if (imagenes && imagenes.length > 0) {
        imagenes.forEach((imagen) => {
          formData.append("imagenes", imagen);
        });
      }

      const response = await api.put(`/mascotas/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating mascota:", error);
      throw error;
    }
  },

  // Delete mascota
  delete: async (id: number) => {
    try {
      await api.delete(`/mascotas/${id}`);
    } catch (error) {
      console.error("Error deleting mascota:", error);
      throw error;
    }
  },
};

// Persons API
export const personsAPI = {
  // Get all persons
  getAll: async () => {
    try {
      const response = await api.get("/persons");
      return response.data;
    } catch (error) {
      console.error("Error fetching persons:", error);
      throw error;
    }
  },

  // Get person by ID
  getById: async (id: number) => {
    try {
      const response = await api.get(`/persons/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching person:", error);
      throw error;
    }
  },

  // Get person by email
  getByEmail: async (email: string) => {
    try {
      const response = await api.get(`/persons/email/${email}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching person by email:", error);
      throw error;
    }
  },

  // Get persons by role
  getByRole: async (roleType: string) => {
    try {
      const response = await api.get(`/persons/role/${roleType}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching persons by role:", error);
      throw error;
    }
  },

  // Create new person
  create: async (person: any) => {
    try {
      const response = await api.post("/persons", person);
      return response.data;
    } catch (error) {
      console.error("Error creating person:", error);
      throw error;
    }
  },

  // Update person
  update: async (id: number, person: any) => {
    try {
      const response = await api.put(`/persons/${id}`, person);
      return response.data;
    } catch (error) {
      console.error("Error updating person:", error);
      throw error;
    }
  },

  // Delete person
  delete: async (id: number) => {
    try {
      await api.delete(`/persons/${id}`);
    } catch (error) {
      console.error("Error deleting person:", error);
      throw error;
    }
  },
};

// Donaciones API
export const donacionesAPI = {
  // Get all donaciones
  getAll: async () => {
    try {
      const response = await api.get("/donaciones");
      return response.data;
    } catch (error) {
      console.error("Error fetching donaciones:", error);
      throw error;
    }
  },

  // Get donacion by ID
  getById: async (id: number) => {
    try {
      const response = await api.get(`/donaciones/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching donacion:", error);
      throw error;
    }
  },

  // Get donaciones by donante ID
  getByDonante: async (donanteId: number) => {
    try {
      const response = await api.get(`/donaciones/donante/${donanteId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching donaciones by donante:", error);
      throw error;
    }
  },

  // Create new donacion
  create: async (donacion: any) => {
    try {
      const response = await api.post("/donaciones", donacion);
      return response.data;
    } catch (error) {
      console.error("Error creating donacion:", error);
      throw error;
    }
  },

  // Delete donacion
  delete: async (id: number) => {
    try {
      await api.delete(`/donaciones/${id}`);
    } catch (error) {
      console.error("Error deleting donacion:", error);
      throw error;
    }
  },
};

// Solicitudes API
export const solicitudesAPI = {
  // Get all solicitudes
  getAll: async () => {
    try {
      const response = await api.get("/solicitudes");
      return response.data;
    } catch (error) {
      console.error("Error fetching solicitudes:", error);
      throw error;
    }
  },

  // Create new solicitud
  create: async (solicitud: any) => {
    try {
      const response = await api.post("/solicitudes", solicitud);
      return response.data;
    } catch (error) {
      console.error("Error creating solicitud:", error);
      throw error;
    }
  },

  // Update solicitud estado
  updateEstado: async (id: number, estado: string, comentario?: string) => {
    try {
      const response = await api.put(`/solicitudes/${id}/estado`, null, {
        params: { estado, comentario },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating solicitud estado:", error);
      throw error;
    }
  },
};

// Authentication API
export const authAPI = {
  // Test connectivity
  testConnection: async () => {
    try {
      console.log("Testing connection to:", BASE_URL + "/auth/test");
      const response = await api.get("/auth/test");
      console.log("Connection test successful:", response.data);
      return response.data;
    } catch (error) {
      console.error("Connection test failed:", error);
      if (isAxiosError(error)) {
        console.error("Error details:", {
          message: error.message,
          code: error.code,
          response: error.response?.data,
        });
      }
      throw error;
    }
  },

  // Login user
  login: async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      if (response.data.token) {
        // Store token and user data
        await tokenStorage.setToken(response.data.token);
        await userStorage.setUser(response.data.user);
      }

      return response.data;
    } catch (error) {
      console.error("Error logging in:", error);
      if (isAxiosError(error)) {
        throw new Error(authErrorMessage(error, "iniciar sesión"));
      }
      throw error;
    }
  },

  // Register user
  register: async (userData: {
    name: string;
    lastName: string;
    email: string;
    password: string;
    role: "CLIENTE" | "ALIADO";
  }) => {
    try {
      const response = await api.post("/auth/register", userData);

      if (response.data.token) {
        // Store token and user data
        await tokenStorage.setToken(response.data.token);
        await userStorage.setUser(response.data.user);
      }

      return response.data;
    } catch (error) {
      console.error("Error registering user:", error);
      if (isAxiosError(error)) {
        throw new Error(authErrorMessage(error, "registrar tu cuenta"));
      }
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      await tokenStorage.removeToken();
      await userStorage.removeUser();
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    const token = await tokenStorage.getToken();
    return !!token;
  },

  // Get current user data
  getCurrentUser: async () => {
    return await userStorage.getUser();
  },
};

// You can add more API modules here for other controllers like donaciones, solicitudes, etc.

export default api;
