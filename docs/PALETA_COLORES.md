# 🎨 Paleta de Colores - AdoptaFácil

## Descripción

Paleta de colores suaves y elegantes utilizada en la aplicación AdoptaFácil, enfocada en tr### React Native

````javascript
// Ejemplo de estilos consistentes para login, home, mascotas y settings
const styles = StyleSheet.create({
  // Páginas principales - Contenedores
  container: {
    flex: 1,
    backgroundColor: "#f7fafc", // page-bg
  },
  heroSection: {
    padding: 20,
    paddingVertical: 30,
    alignItems: "center",
  },
  contentSection: {
    flex: 1,
    padding: 20,
  },

  // Hero titles (mascotas, home)
  heroTitle: {
    fontSize: 28,
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 22,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // Inputs principales (mascotas, settings)
  inputMain: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 15,
    color: "#2d3748",
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  // Inputs sobre gradiente (login, home hero)
  inputHero: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 15,
    color: "#ffffff",
    fontSize: 16,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // Pickers redondeados (mascotas)
  pickerContainer: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 25,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  // Cards principales (mascotas, home)
  cardMain: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: "center",
  },

  // Estados de carga (mascotas)
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    margin: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  // Estados de error (mascotas)
  errorContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 15,
    margin: 20,
    borderWidth: 1,
    borderColor: "#fed7d7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  // Login
  input: {
    backgroundColor: "rgba(255,255,255,0.9)", confianza, calidez y profesionalismo para una app de adopción de mascotas.

## 🎯 Colores Principales

### Gradientes

| Nombre                   | Código HEX                | Descripción                    | Uso                                              |
| ------------------------ | ------------------------- | ------------------------------ | ------------------------------------------------ |
| **Gradiente Principal**  | `#02d36bff` → `#0000c5ff` | Verde brillante → Azul intenso | Login, header, barra de pestañas, secciones hero |
| **Gradiente Secundario** | `#68d391` → `#63b3ed`     | Verde esmeralda → Azul claro   | Acentos y elementos destacados                   |

## 📝 Colores de Texto

| Nombre               | Código HEX  | Descripción          | Uso                                  |
| -------------------- | ----------- | -------------------- | ------------------------------------ |
| **Texto Principal**  | `#0e0f11ff` | Azul oscuro login    | Títulos principales en login         |
| **Texto Secundario** | `#2a3038ff` | Azul medio login     | Subtítulos en login                  |
| **Texto Input**      | `#2d3748`   | Gris oscuro elegante | Texto en campos de entrada           |
| **Placeholder**      | `#718096`   | Gris claro           | Placeholder en campos de entrada     |
| **Texto Blanco**     | `#ffffffff` | Blanco puro          | Texto sobre botones y fondos oscuros |

## 🎨 Colores de Acento

| Nombre                | Código HEX | Descripción           | Uso                                                      |
| --------------------- | ---------- | --------------------- | -------------------------------------------------------- |
| **Verde Principal**   | `#68d391`  | Verde esmeralda suave | Estadísticas, elementos destacados, iconos gestión/ayuda |
| **Azul Principal**    | `#63b3ed`  | Azul cielo claro      | Acentos secundarios, iconos configuración                |
| **Púrpura Principal** | `#a78bfa`  | Lavanda suave         | Acentos terciarios, iconos notificaciones                |
| **Azul Botón**        | `#bee3f8`  | Azul pastel           | Botones secundarios, badges                              |
| **Gris Flecha**       | `#a0aec0`  | Gris claro navegación | Flechas de navegación, elementos secundarios             |

## 🚨 Colores de Estado

| Nombre                  | Código HEX | Descripción    | Uso                               |
| ----------------------- | ---------- | -------------- | --------------------------------- |
| **Rosa Peligro Suave**  | `#fed7d7`  | Rosa muy claro | Fondos y bordes de estado peligro |
| **Rojo Peligro**        | `#e53e3e`  | Rojo vibrante  | Textos principales de peligro     |
| **Rojo Peligro Oscuro** | `#c53030`  | Rojo oscuro    | Textos secundarios de peligro     |
| **Rojo Error Input**    | `#ff6b6b`  | Rojo coral     | Bordes de inputs con error        |
| **Rojo Error Texto**    | `#ff4757`  | Rojo brillante | Texto de error en inputs          |

## 🏠 Colores de Fondo

| Nombre                      | Código HEX | Descripción     | Uso                                       |
| --------------------------- | ---------- | --------------- | ----------------------------------------- |
| **Fondo Principal**         | `#f7fafc`  | Gris muy claro  | Fondo general de la app                   |
| **Fondo Secciones**         | `#f8f9fa`  | Gris claro      | Secciones de contenido, campos de entrada |
| **Fondo Input**             | `#f8f9fa`  | Gris claro      | Fondo de campos de entrada                |
| **Fondo Blanco**            | `#ffffff`  | Blanco puro     | Tarjetas, elementos destacados            |
| **Fondo Footer**            | `#f7fafc`  | Gris muy claro  | Footer de la aplicación                   |
| **Fondo Verde Claro Suave** | `#f0fff4`  | Verde muy claro | Sección destacados/mascotas               |

## 🔘 Colores de Componentes

### Botones

| Componente           | Color de Fondo | Color de Texto | Descripción                         |
| -------------------- | -------------- | -------------- | ----------------------------------- |
| **Botón Primario**   | `#00b746bf`    | `#ffffff`      | Botón de login, llamadas a acción   |
| **Botón Secundario** | `#ffffff`      | `#4a5568`      | Botones secundarios con borde       |
| **Botón Registro**   | `transparent`  | `#68d391`      | Botón de registro en login          |
| **Botón Olvidaste**  | `transparent`  | `#63b3ed`      | Botón de recuperación de contraseña |

### Tarjetas, Formularios y Componentes sobre Gradientes

| Componente                | Fondo (background)       | Borde (border)          | Texto (text)     | Placeholder             | Descripción                         |
| ------------------------- | ------------------------ | ----------------------- | ---------------- | ----------------------- | ----------------------------------- |
| **Tarjeta Hero/Búsqueda** | `rgba(255,255,255,0.15)` | `rgba(255,255,255,0.3)` | `#2d3748`/`#fff` | `rgba(255,255,255,0.7)` | Tarjeta sobre gradiente (ej. home)  |
| **Input Hero**            | `rgba(255,255,255,0.2)`  | `rgba(255,255,255,0.4)` | `#fff`           | `rgba(255,255,255,0.7)` | Input sobre gradiente (ej. home)    |
| **Input Login**           | `rgba(255,255,255,0.9)`  | `rgba(255,255,255,0.3)` | `#2d3748`        | `#718096`               | Input sobre fondo claro (login)     |
| **Error Input**           | `rgba(255,255,255,0.95)` | `#ff6b6b` (borde)       | `#ff4757`        |                         | Input con error (login)             |
| **Tarjetas**              | `#ffffff`                | `#e2e8f0`               | `#2d3748`        |                         | Tarjetas de categorías, información |
| **Contenedores**          | `#f8f9fa`                | N/A                     |                  |                         | Secciones de contenido              |
| **Campos de entrada**     | `#f8f9fa`                | `#e2e8f0`               | `#2d3748`        | `#718096`               | Campos de login, búsqueda           |

### Configuración y Settings

| Componente               | Fondo (background) | Borde (border) | Texto (text) | Icono (icon) | Descripción                           |
| ------------------------ | ------------------ | -------------- | ------------ | ------------ | ------------------------------------- |
| **Opción Settings**      | `#ffffff`          | `#e2e8f0`      | `#2d3748`    | N/A          | Opciones de configuración normales    |
| **Icono Gestionar**      | `#68d391`          | N/A            | `#ffffff`    | 🐾           | Fondo icono para gestión de mascotas  |
| **Icono Configuración**  | `#63b3ed`          | N/A            | `#ffffff`    | ⚙️           | Fondo icono para configuración cuenta |
| **Icono Notificaciones** | `#a78bfa`          | N/A            | `#ffffff`    | 🔔           | Fondo icono para notificaciones       |
| **Icono Ayuda**          | `#68d391`          | N/A            | `#ffffff`    | ❓           | Fondo icono para ayuda y soporte      |
| **Opción Logout**        | `#ffffff`          | `#fed7d7`      | `#e53e3e`    | 🚪           | Opción cerrar sesión (estado peligro) |
| **Flecha Navegación**    | N/A                | N/A            | `#a0aec0`    | ▶️           | Indicador de navegación               |
| **Flecha Logout**        | N/A                | N/A            | `#e53e3e`    | 🚪           | Indicador para cerrar sesión          |

### Estados de Peligro

| Componente             | Color de Fondo | Color de Borde | Color de Texto Principal | Color de Texto Secundario | Descripción                 |
| ---------------------- | -------------- | -------------- | ------------------------ | ------------------------- | --------------------------- |
| **Logout Container**   | `#ffffff`      | `#fed7d7`      | `#e53e3e`                | `#c53030`                 | Contenedor de cerrar sesión |
| **Logout Icon Bg**     | `#fed7d7`      | N/A            | N/A                      | N/A                       | Fondo icono cerrar sesión   |
| **Error Input Border** | N/A            | `#ff6b6b`      | `#ff4757`                | N/A                       | Borde de input con error    |

## 🧩 Sombra y Elevación

Usa `shadowColor: "#000"` y `elevation` para dar profundidad a tarjetas y botones, especialmente en formularios y hero cards.

## 🌈 Combinaciones Recomendadas

### Para Texto sobre Fondos Claros

- Texto principal: `#0e0f11ff`
- Texto secundario: `#2a3038ff`
- Texto input: `#2d3748`
- Placeholder: `#718096`

### Para Texto sobre Gradientes

- Texto principal: `#ffffff`
- Texto secundario: `rgba(255, 255, 255, 0.8)`
- Texto auxiliar: `rgba(255, 255, 255, 0.6)`

## 📊 Estadísticas y Métricas

| Elemento            | Color                           | Tamaño | Peso   |
| ------------------- | ------------------------------- | ------ | ------ |
| **Números grandes** | `#68d391`, `#63b3ed`, `#a78bfa` | 24px   | bold   |
| **Etiquetas**       | `#718096`                       | 12px   | normal |
| **Títulos**         | `#2d3748`                       | 32px   | bold   |

## 🎯 Principios de Diseño

### Accesibilidad

- Contraste mínimo de 4.5:1 entre texto y fondo
- Colores diferenciables para usuarios con daltonismo
- Textos claros y legibles en todos los fondos

### Consistencia

- Uso consistente de colores en componentes similares
- Jerarquía visual clara con colores
- Paleta limitada para mantener coherencia

### Usabilidad

- Colores intuitivos (verde = éxito, azul = confianza)
- Estados hover/focus claramente diferenciados
- Feedback visual claro en interacciones

## 🚀 Implementación

### CSS/React Native

```javascript
// Ejemplo de estilos consistentes para login, home y settings
const styles = StyleSheet.create({
  // Login
  input: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderColor: "rgba(255,255,255,0.3)",
    color: "#2d3748",
    // ...otros estilos
  },
  inputError: {
    borderColor: "#ff6b6b",
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  // Home Hero
  heroSearchCard: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderColor: "rgba(255,255,255,0.3)",
    // ...otros estilos
  },
  heroInput: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderColor: "rgba(255,255,255,0.4)",
    color: "#fff",
    // ...otros estilos
  },
  // Tarjetas generales
  card: {
    backgroundColor: "#ffffff",
    borderColor: "#e2e8f0",
    color: "#2d3748",
    // ...otros estilos
  },
  // Settings - Iconos circulares
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  // Settings - Opciones de configuración
  optionContainer: {
    backgroundColor: "#ffffff",
    borderColor: "#e2e8f0",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  // Settings - Estado de peligro (logout)
  logoutContainer: {
    backgroundColor: "#ffffff",
    borderColor: "#fed7d7",
  },
  logoutTitle: {
    color: "#e53e3e",
  },
  logoutDescription: {
    color: "#c53030",
  },
});
````

### Variables CSS

```css
:root {
  /* Gradientes */
  --gradient-main-from: #02d36bff;
  --gradient-main-to: #0000c5ff;
  --gradient-secondary-from: #68d391;
  --gradient-secondary-to: #63b3ed;

  /* Páginas principales - Hero sections */
  --hero-title-color: #ffffff;
  --hero-subtitle-color: rgba(255, 255, 255, 0.8);
  --hero-text-shadow: rgba(0, 0, 0, 0.3);

  /* Páginas principales - Inputs y formularios */
  --input-bg-main: #f8f9fa;
  --input-bg-hero: rgba(255, 255, 255, 0.2);
  --input-border-main: #e2e8f0;
  --input-border-hero: rgba(255, 255, 255, 0.4);
  --input-text-main: #2d3748;
  --input-text-hero: #ffffff;
  --input-placeholder-main: #718096;
  --input-placeholder-hero: rgba(255, 255, 255, 0.7);

  /* Páginas principales - Cards y contenedores */
  --card-bg: #ffffff;
  --card-border: #e2e8f0;
  --card-shadow: rgba(0, 0, 0, 0.1);
  --page-bg: #f7fafc;
  --section-bg: #f8f9fa;
  --featured-bg: #f0fff4;

  /* Estados de carga y error */
  --loading-bg: #ffffff;
  --loading-text: #2d3748;
  --loading-indicator: #68d391;
  --error-bg: #ffffff;
  --error-border: #fed7d7;
  --error-text: #e53e3e;

  /* Botones */
  --color-btn-primary-bg: #00b746bf;
  --color-btn-primary-text: #ffffffff;
  --color-btn-register-text: #68d391;
  --color-btn-forgot-text: #63b3ed;

  /* Inputs */
  --color-input-bg: rgba(255, 255, 255, 0.9);
  --color-input-bg-hero: rgba(255, 255, 255, 0.2);
  --color-input-border: rgba(255, 255, 255, 0.3);
  --color-input-border-hero: rgba(255, 255, 255, 0.4);
  --color-input-error-bg: rgba(255, 255, 255, 0.95);
  --color-input-error-border: #ff6b6b;
  --color-input-text: #2d3748;
  --color-input-text-hero: #fff;
  --color-input-placeholder: #718096;
  --color-input-placeholder-hero: rgba(255, 255, 255, 0.7);

  /* Textos */
  --color-title: #0e0f11ff;
  --color-subtitle: #2a3038ff;
  --color-text-primary: #2d3748;
  --color-text-placeholder: #718096;
  --color-text-white: #ffffff;

  /* Fondos */
  --color-bg-main: #f7fafc;
  --color-bg-section: #f8f9fa;
  --color-bg-white: #ffffff;
  --color-bg-featured: #f0fff4;

  /* Bordes y tarjetas */
  --color-border-card: #e2e8f0;
  --color-card-bg-hero: rgba(255, 255, 255, 0.15);
  --color-card-border-hero: rgba(255, 255, 255, 0.3);

  /* Acentos */
  --color-accent-green: #68d391;
  --color-accent-blue: #63b3ed;
  --color-accent-purple: #a78bfa;
  --color-accent-blue-light: #bee3f8;
  --color-navigation-arrow: #a0aec0;

  /* Estados de peligro */
  --color-danger-bg: #fed7d7;
  --color-danger-text: #e53e3e;
  --color-danger-text-dark: #c53030;
  --color-error-border: #ff6b6b;
  --color-error-text: #ff4757;

  /* Settings - Iconos */
  --color-icon-management: #68d391;
  --color-icon-settings: #63b3ed;
  --color-icon-notifications: #a78bfa;
  --color-icon-help: #68d391;
  --color-icon-logout: #fed7d7;
}
```

## 📝 Notas de Uso

- **Mantener consistencia**: Usar siempre la misma paleta en toda la aplicación

- **Formularios y tarjetas sobre gradientes**: Usa los estilos de fondo y borde con opacidad para lograr contraste y elegancia.
- **Inputs**: Diferencia los inputs sobre gradiente (home hero) y sobre fondo claro (login) usando los colores definidos.
- **Errores**: Aplica los colores de error en borde y fondo para inputs inválidos.
- **Sombra y elevación**: Úsalos para dar profundidad y resaltar componentes interactivos.
- **Iconos circulares**: En settings usar fondos de acento con sombra sutil para elementos interactivos.
- **Estados de peligro**: Para logout y elementos críticos, usa colores de peligro pero mantén elegancia.
- **Navegación visual**: Usa flechas y elementos direccionales para guiar al usuario.
- **Extensibilidad**: La paleta permite agregar variaciones manteniendo la armonía.
- **Accesibilidad**: Colores probados para cumplir estándares WCAG 2.1.
- **Escalabilidad**: Paleta diseñada para crecer con la aplicación.

## 🎯 Patrones de Implementación

### Páginas Principales - Estructura de Diseño

#### Home Screen (index.tsx)

- **Hero section**: Gradiente principal con inputs transparentes
- **Categorías**: Fondo (`#f8f9fa`) con tarjetas blancas
- **Featured**: Fondo verde claro (`#f0fff4`) con estadísticas coloridas

#### Login Screen (login.tsx)

- **Inputs**: Fondo semi-transparente sobre gradiente
- **Errores**: Bordes rojos (`#ff6b6b`) con textos de error (`#ff4757`)
- **Botones**: Primario verde (`#00b746bf`), secundarios transparentes

#### Mascotas Screen (mascotas.tsx)

- **Hero section**: Solo título y subtítulo con gradiente principal
- **Filtros**: Fondo claro (`#f8f9fa`) con bordes (`#e2e8f0`), selects redondeados
- **Cards**: Fondo blanco con sombra, fotos 100x100 con borde blanco
- **Loading/Error**: Cards blancos con bordes apropiados para cada estado

### Settings Screen

- **Contenedor principal**: `#f7fafc` (bg-main)
- **Opciones normales**: Fondo blanco (`#ffffff`) con borde (`#e2e8f0`)
- **Iconos circulares**: Fondos de acento (`#68d391`, `#63b3ed`, `#a78bfa`) con sombra
- **Logout**: Fondo blanco con borde rosa (`#fed7d7`) y textos rojos
- **Navegación**: Flechas grises (`#a0aec0`) para indicar acción

### Home Screen

- **Hero section**: Gradiente principal con inputs transparentes
- **Categorías**: Fondo (`#f8f9fa`) con tarjetas blancas
- **Featured**: Fondo verde claro (`#f0fff4`) con estadísticas coloridas

### Login Screen

- **Inputs**: Fondo semi-transparente sobre gradiente
- **Errores**: Bordes rojos (`#ff6b6b`) con textos de error (`#ff4757`)
- **Botones**: Primario verde (`#00b746bf`), secundarios transparentes

---

_Paleta creada para AdoptaFácil - Conectando mascotas con hogares amorosos_ 🐾
