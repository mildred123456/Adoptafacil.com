# Funcionalidad de Reporte PDF

## Descripción

Esta funcionalidad permite a los usuarios con roles **ALIADO** y **ADMIN** generar reportes en PDF de las mascotas registradas en el sistema AdoptaFácil.

## Características

### Por Rol

- **ALIADO**: Puede generar un reporte PDF con las mascotas que él mismo ha registrado
- **ADMIN**: Puede generar un reporte PDF con todas las mascotas del sistema (de todos los aliados)

### Funcionalidades del Reporte

- ✅ Tabla con información de mascotas: Nombre, Especie, Raza y Edad
- ✅ Fecha y hora de generación del reporte
- ✅ Información del usuario que genera el reporte
- ✅ Contador total de mascotas
- ✅ Diseño profesional y responsivo
- ✅ Opción para compartir el PDF generado

## Tecnologías Utilizadas

- **expo-print**: Para generar el PDF desde una plantilla HTML
- **expo-file-system**: Para guardar el archivo PDF de forma persistente
- **expo-sharing**: Para compartir el archivo PDF con otras aplicaciones

## Estructura de Archivos

```
utils/
  └── pdfReport.ts          # Utilidad principal para generar PDFs
app/
  └── gestionar-mascotas.tsx # Pantalla con botón de descarga
```

## Uso

### Desde la Interfaz

1. Navega a la pantalla "Gestionar Mascotas"
2. Asegúrate de tener al menos una mascota registrada
3. Presiona el botón **"📄 Descargar Reporte PDF"**
4. El sistema generará el PDF y te preguntará si deseas compartirlo
5. Puedes elegir entre:
   - **Solo guardar**: El archivo se guarda en el dispositivo
   - **Compartir**: Abre el selector de aplicaciones para compartir

### Desde el Código

```typescript
import { generarReportePDF, compartirPDF } from "@/utils/pdfReport";

// Generar el reporte
const rutaPDF = await generarReportePDF({
  mascotas: [
    { nombre: "Firulais", especie: "Perro", raza: "Labrador", edad: "2 años" },
    { nombre: "Michi", especie: "Gato", raza: "Siamés", edad: "1 año" },
  ],
  tituloReporte: "Mi Reporte",
  subtitulo: "Aliado: Juan Pérez",
  nombreArchivo: "reporte_custom.pdf",
});

// Compartir el PDF (opcional)
await compartirPDF(rutaPDF);
```

## Formato del Reporte

El reporte PDF incluye:

### Encabezado

- 🐾 Título del reporte
- Subtítulo (rol y nombre del usuario)
- Fecha y hora de generación

### Información General

- Total de mascotas
- Sistema: AdoptaFácil

### Tabla de Mascotas

| #   | Nombre   | Especie | Raza     | Edad   |
| --- | -------- | ------- | -------- | ------ |
| 1   | Firulais | Perro   | Labrador | 2 años |
| 2   | Michi    | Gato    | Siamés   | 1 año  |

### Pie de Página

- Resumen del total de mascotas
- Copyright y sistema

## Ubicación del Archivo

Los archivos PDF se guardan en:

```
FileSystem.documentDirectory + "reporte_[tipo]_[timestamp].pdf"
```

Donde:

- `[tipo]`: `admin` o `aliado`
- `[timestamp]`: Marca de tiempo única

## Ejemplo de Rutas

- Android: `file:///data/user/0/com.yourapp/files/reporte_aliado_1696345200000.pdf`
- iOS: `file:///var/mobile/Containers/Data/Application/.../Documents/reporte_admin_1696345200000.pdf`

## Manejo de Errores

La utilidad maneja los siguientes casos:

- ❌ No hay mascotas para generar el reporte
- ❌ Error al acceder al directorio de documentos
- ❌ Error al generar el HTML
- ❌ Error al crear el archivo PDF
- ❌ El dispositivo no soporta compartir archivos

Todos los errores se registran en la consola y se muestran al usuario mediante alertas.

## Permisos Necesarios

Esta funcionalidad no requiere permisos adicionales en:

- ✅ Android
- ✅ iOS

Los archivos se guardan en el directorio privado de la aplicación.

## Compatibilidad

- ✅ Expo SDK 50+
- ✅ React Native
- ✅ Android e iOS
- ✅ Web (limitado, depende del navegador)

## Próximas Mejoras

- [ ] Agregar gráficos y estadísticas
- [ ] Permitir filtros personalizados
- [ ] Soporte para múltiples formatos (Excel, CSV)
- [ ] Incluir imágenes de las mascotas en el reporte
- [ ] Programar generación automática de reportes

## Soporte

Para reportar problemas o sugerencias, contacta al equipo de desarrollo de AdoptaFácil.
