# Sistema de Autenticación con Guards de Rutas

## 🔒 Descripción

Se ha implementado un sistema completo de autenticación con **protección de rutas** que:

1. ✅ **Redirige siempre al login** al iniciar la aplicación
2. ✅ **Protege todas las rutas** fuera de auth (tabs, gestionar-mascotas, modal)
3. ✅ **Solo permite acceso** después de autenticarse correctamente
4. ✅ **Persiste la sesión** usando AsyncStorage
5. ✅ **Cierra sesión** con confirmación y limpieza de datos

---

## 📁 Archivos Modificados/Creados

### 1. **`contexts/AuthContext.tsx`** ⭐ (NUEVO)

Contexto global que maneja el estado de autenticación en toda la app.

#### Características:

- **Estado global**: `isAuthenticated`, `isLoading`, `user`
- **Funciones**: `signIn()`, `signOut()`
- **Protección automática**: Verifica las rutas usando `useSegments()`
- **Redirección automática**:
  - Si NO está autenticado → redirige a `/login`
  - Si SÍ está autenticado → redirige a `/(tabs)`

#### Código Principal:

```tsx
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const segments = useSegments();

  // Verificar autenticación al iniciar
  useEffect(() => {
    checkAuth();
  }, []);

  // Proteger rutas basado en autenticación
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup =
      segments[0] === "(tabs)" ||
      segments[0] === "gestionar-mascotas" ||
      segments[0] === "modal";

    if (!isAuthenticated && inAuthGroup) {
      // Usuario NO autenticado → redirigir a login
      router.replace("/login");
    } else if (
      isAuthenticated &&
      !inAuthGroup &&
      segments[0] !== "register" &&
      segments[0] !== "register-options"
    ) {
      // Usuario autenticado en login → redirigir a tabs
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, segments, isLoading]);
}
```

---

### 2. **`app/_layout.tsx`** (MODIFICADO)

Envuelve toda la app con `AuthProvider` y muestra spinner mientras carga.

#### Cambios:

```tsx
function RootLayoutNav() {
  const { isLoading } = useAuth();

  // Mostrar spinner mientras verifica autenticación
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#02d36bff" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Todas las pantallas */}
      </Stack>
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
```

#### Configuración inicial:

```tsx
export const unstable_settings = {
  initialRouteName: "login", // Siempre inicia en login
};
```

---

### 3. **`app/login.tsx`** (MODIFICADO)

Usa el contexto de autenticación para guardar token y usuario.

#### Cambios en `handleLogin()`:

```tsx
const handleLogin = async () => {
  if (!validateForm()) return;

  setLoading(true);
  try {
    const response = await authAPI.login(formData.email, formData.password);

    // Usar el contexto para guardar token y usuario
    await signIn(response.token, response.user);

    // AuthContext se encarga de redirigir automáticamente a /(tabs)
  } catch (error) {
    Alert.alert("Error", error.message);
  } finally {
    setLoading(false);
  }
};
```

✅ **Se eliminó** el `useEffect` que verificaba autenticación (ahora lo hace `AuthContext`)  
✅ **Se eliminó** `router.replace("/(tabs)")` (lo hace automáticamente el contexto)

---

### 4. **`app/(tabs)/settings.tsx`** (MODIFICADO)

Agregado botón de "Cerrar Sesión" con confirmación.

#### Nuevas funcionalidades:

1. **Hook de autenticación**:

```tsx
const { signOut, user } = useAuth();
```

2. **Función de cierre de sesión**:

```tsx
const handleLogout = () => {
  Alert.alert("Cerrar Sesión", "¿Estás seguro que deseas cerrar sesión?", [
    { text: "Cancelar", style: "cancel" },
    {
      text: "Cerrar Sesión",
      style: "destructive",
      onPress: async () => {
        await signOut();
        // AuthContext limpia todo y redirige a /login
      },
    },
  ]);
};
```

3. **Nueva opción en el menú**:

```tsx
{
  title: "Cerrar Sesión",
  description: `Usuario: ${user?.email || "Desconocido"}`,
  onPress: handleLogout,
  isLogout: true,  // Para aplicar estilo especial (rojo)
}
```

4. **Estilos especiales para logout**:

```tsx
logoutContainer: {
  backgroundColor: "#fee",
  borderColor: "#f87171",
},
logoutTitle: {
  color: "#dc2626",
},
logoutDescription: {
  color: "#991b1b",
}
```

---

## 🔄 Flujo de Autenticación

### Al Iniciar la App:

1. **\_layout.tsx** renderiza `AuthProvider`
2. **AuthContext** ejecuta `checkAuth()`:
   - Lee token y usuario de AsyncStorage
   - Si existen → `setIsAuthenticated(true)`
   - Si NO existen → `setIsAuthenticated(false)`
3. **AuthContext** verifica `segments` (ruta actual):
   - Si NO autenticado + intenta acceder a tabs → redirige a `/login`
   - Si autenticado + está en login → redirige a `/(tabs)`
4. Mientras `isLoading === true` → muestra `ActivityIndicator`

### Al Hacer Login:

1. Usuario ingresa credenciales en `login.tsx`
2. Se llama `authAPI.login(email, password)`
3. Backend retorna `{ token, user }`
4. Se llama `signIn(token, user)` del contexto
5. **AuthContext**:
   - Guarda token en AsyncStorage
   - Guarda user en AsyncStorage
   - `setIsAuthenticated(true)`
6. `useEffect` detecta cambio en `isAuthenticated`
7. Redirige automáticamente a `/(tabs)`

### Al Cerrar Sesión:

1. Usuario presiona "Cerrar Sesión" en settings
2. Muestra confirmación con `Alert.alert`
3. Si confirma → se llama `signOut()`
4. **AuthContext**:
   - Elimina token de AsyncStorage
   - Elimina user de AsyncStorage
   - `setIsAuthenticated(false)`
5. Redirige automáticamente a `/login`

---

## 🛡️ Rutas Protegidas

### Rutas que REQUIEREN autenticación:

- `/(tabs)/*` - Todas las pestañas (index, mascotas, refugios, etc.)
- `/gestionar-mascotas` - CRUD de mascotas
- `/modal` - Modal de ejemplo

### Rutas PÚBLICAS (no requieren auth):

- `/login` - Pantalla de inicio de sesión
- `/register` - Registro de usuario
- `/register-options` - Opciones de registro (Cliente/Aliado)

### Lógica de protección:

```tsx
const inAuthGroup =
  segments[0] === "(tabs)" ||
  segments[0] === "gestionar-mascotas" ||
  segments[0] === "modal";

if (!isAuthenticated && inAuthGroup) {
  router.replace("/login"); // ❌ NO puede acceder
}
```

---

## 🧪 Cómo Probar

### 1. Primera vez (sin sesión):

```bash
# Ejecutar la app
npm start
```

✅ Debería abrir **siempre en /login**  
✅ No debería poder acceder a tabs sin autenticarse

### 2. Intentar acceder a tabs sin login:

- Navegar manualmente a `/(tabs)` → ❌ Redirige a `/login`
- Navegar a `/gestionar-mascotas` → ❌ Redirige a `/login`

### 3. Login exitoso:

```
Email: aliado@example.com
Password: password123
```

✅ Presionar "Iniciar Sesión"  
✅ Automáticamente redirige a `/(tabs)`  
✅ Puede navegar a todas las pestañas  
✅ Puede acceder a "Gestionar mascotas"

### 4. Cerrar app y volver a abrir:

✅ Si había iniciado sesión → abre en `/(tabs)` (sesión persistida)  
✅ Si no había sesión → abre en `/login`

### 5. Cerrar sesión:

1. Ir a **Settings**
2. Scroll al final → "Cerrar Sesión" (opción roja)
3. Presionar → muestra confirmación
4. Confirmar → ✅ Redirige a `/login`
5. Intentar volver a tabs → ❌ No puede, redirige a login

---

## 🔑 Usuarios de Prueba

El backend tiene estos usuarios pre-cargados (seeder):

| Email                 | Password      | Rol     |
| --------------------- | ------------- | ------- |
| `admin@example.com`   | `password123` | ADMIN   |
| `cliente@example.com` | `password123` | CLIENTE |
| `aliado@example.com`  | `password123` | ALIADO  |

---

## ✅ Características Implementadas

- ✅ Autenticación con JWT
- ✅ Persistencia de sesión (AsyncStorage)
- ✅ Protección automática de rutas
- ✅ Redirección inteligente (login ↔ tabs)
- ✅ Spinner de carga al verificar sesión
- ✅ Cierre de sesión con confirmación
- ✅ Limpieza completa de datos al logout
- ✅ Muestra email del usuario en settings
- ✅ Estilos especiales para "Cerrar Sesión"
- ✅ Interceptor de axios para agregar token automáticamente
- ✅ Manejo de errores 401 (token expirado)

---

## 📝 Notas Importantes

1. **AuthContext debe envolver toda la app** en `_layout.tsx`
2. **No usar `router.push()` para login/logout** → el contexto maneja todo
3. **Siempre usar `useAuth()`** para acceder a estado de autenticación
4. **Las rutas se protegen automáticamente** con `useSegments()`
5. **AsyncStorage persiste la sesión** entre cierres de app

---

## 🐛 Solución de Problemas

### La app no redirige a login:

- ✅ Verificar que `AuthProvider` envuelva `RootLayoutNav` en `_layout.tsx`
- ✅ Verificar que `initialRouteName: "login"` esté en `unstable_settings`

### No puede acceder después de login:

- ✅ Verificar que `authAPI.login()` retorne `{ token, user }`
- ✅ Verificar que `signIn()` se llame correctamente en `login.tsx`
- ✅ Revisar console.log en AsyncStorage

### El token no se envía al backend:

- ✅ Verificar interceptor en `api.ts` (`config.headers.Authorization`)
- ✅ Verificar que `tokenStorage.getToken()` retorne el token

### La sesión no persiste:

- ✅ Verificar que `tokenStorage.setToken()` y `userStorage.setUser()` se ejecuten
- ✅ Revisar permisos de AsyncStorage

---

## 🚀 Próximos Pasos (Opcional)

- [ ] Agregar refresh token para renovar sesión
- [ ] Implementar "Recordarme" (Remember Me)
- [ ] Agregar timeout de sesión (auto-logout)
- [ ] Implementar cambio de contraseña
- [ ] Agregar verificación de email
- [ ] Implementar recuperación de contraseña

---

## 👨‍💻 Desarrollador

**Implementado**: Sistema completo de autenticación con guards de rutas  
**Fecha**: 2025  
**Framework**: React Native + Expo Router + TypeScript
