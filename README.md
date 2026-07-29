# Mi Horario Semanal

App de React Native (Expo + TypeScript) para gestionar un calendario semanal de clases:
agregar, editar y eliminar horarios, con persistencia local en el dispositivo.

## Funcionalidades

- **Múltiples horarios completos e independientes** (ej: "Semestre A", "Semestre B"): desde
  el menú lateral > **Horarios** podés crear uno nuevo, cambiar entre ellos, renombrarlos o
  eliminarlos. El título de la app muestra el nombre del horario activo.
- Grilla semanal de 09:00 a 18:00 por defecto. Si una clase empieza antes o termina
  después de ese rango, la grilla se extiende automáticamente para mostrarla completa.
  Lunes a Viernes se muestran siempre; Sábado y Domingo aparecen automáticamente en cuanto
  agregás una clase en esos días.
- Tocar el botón **+** para agregar una nueva clase (nombre, día, hora de inicio/fin, color),
  con la posibilidad de agregar varios horarios (día+hora) a esa misma clase de una vez.
- Selector de hora nativo en formato 24hrs (no se convierte a AM/PM en ningún lado de la app).
  Los números del costado izquierdo de la grilla sí se muestran en formato 12hrs (1-12).
- Tocar un bloque existente para editarlo o eliminarlo.
- No se permite crear una clase que se superponga en horario con otra ya existente el mismo día.
- Menú lateral (ícono ☰ arriba a la izquierda, se abre desde la izquierda) con:
  - **Horarios**: crear, cambiar, renombrar o eliminar horarios completos independientes.
  - **Ajustar colores**: 6 colores pastel predefinidos (pensados para combinar entre sí) para
    las líneas de la grilla y para el fondo del calendario, con vista previa en vivo y botón
    para restablecer los colores originales. El título de la app y los nombres de los días
    cambian junto con el color de grilla elegido.
  - **Capturar horario**: genera una imagen limpia solo de la grilla del calendario (sin
    encabezado ni botones) y la guarda directo en la galería del dispositivo.
  - **Limpiar horario**: elimina todas las clases del horario activo (con confirmación).
- Los datos se guardan automáticamente en el dispositivo (AsyncStorage), no se pierden al cerrar la app.

## Requisitos

- Node.js 18+
- npm o yarn
- La app [Expo Go](https://expo.dev/go) instalada en tu celular (o un emulador Android/iOS)

## Instalación

```bash
cd StudyCalendarApp
npm install
```

**Paso importante:** después de `npm install`, corré esto para que las dependencias
nativas (selector de hora, safe-area) queden en la versión exacta que espera el SDK
de Expo del proyecto:
```bash
npx expo install --fix
```

**Para la función "Capturar horario"** (menú lateral), instalá además estas dos
dependencias con `expo install` (así queda resuelta la versión correcta para tu SDK,
en vez de fijarla a mano):
```bash
npx expo install react-native-view-shot expo-media-library
```

## Ejecución

```bash
npm start
```

Esto abre Metro/Expo. Desde ahí podés:
- Escanear el código QR con la app **Expo Go** en tu celular (Android o iOS), o
- Presionar `a` para abrir en un emulador Android, o `i` para iOS (requiere Xcode/Android Studio), o
- Presionar `w` para probarlo en el navegador.

## Estructura del proyecto

```
StudyCalendarApp/
├── App.tsx                        # Componente raíz: maneja los horarios, carga/guarda datos, arma la pantalla
├── src/
│   ├── types.ts                   # Tipos ClassEvent y Schedule, días de la semana (7) y días visibles por defecto
│   ├── constants/theme.ts         # Colores, paleta, opciones de apariencia y medidas de la grilla
│   ├── utils/time.ts              # Conversión de horas, posicionamiento y detección de solapamiento
│   ├── utils/storage.ts           # Guardar/cargar horarios (Schedule[]), horario activo y apariencia
│   ├── utils/id.ts                # Generador simple de IDs únicos
│   ├── data/seedEvents.ts         # Datos iniciales (vacío: [] por defecto)
│   └── components/
│       ├── WeekCalendar.tsx       # Grilla semanal (días/horas dinámicos + eventos)
│       ├── EventBlock.tsx         # Bloque visual de una clase
│       ├── EventFormModal.tsx     # Formulario modal (múltiples horarios por clase, validación de solapamiento)
│       ├── TimePickerField.tsx    # Selector de hora nativo
│       └── SideMenu.tsx           # Menú lateral (Horarios, Ajustar colores, Capturar horario, Limpiar horario)
```

## Personalizar

- **Rango de horas**: cambiá `GRID_START_HOUR` / `GRID_END_HOUR` en `src/constants/theme.ts`.
- **Días de la semana**: `DAYS_SHORT` / `DAYS_FULL` en `src/types.ts` ya incluyen los 7 días;
  `DEFAULT_VISIBLE_DAYS` controla cuáles se muestran siempre (por defecto, Lunes-Viernes).
- **Colores de clases disponibles**: agregá o cambiá valores en `PALETTE` en `src/constants/theme.ts`.
- **Colores disponibles en "Ajustar colores"**: `GRID_COLOR_OPTIONS` / `BACKGROUND_COLOR_OPTIONS`
  en `src/constants/theme.ts` (6 cada uno). El primero de cada lista es el que se restaura con
  "Restablecer colores" (`DEFAULT_APPEARANCE`).
- **Datos iniciales**: `src/data/seedEvents.ts` está vacío (`[]`); agregá objetos ahí si querés
  que la app arranque con clases precargadas.

## Notas / posibles mejoras futuras

- No se permite crear ni editar una clase si su horario se superpone con otra clase existente en
  el mismo día (validado en `EventFormModal.tsx` con `doTimesOverlap` de `utils/time.ts`), tanto
  contra el resto del calendario como entre los horarios que agregues en el mismo formulario.
- Sábado/Domingo se ocultan automáticamente si borrás todas las clases de esos días. Si hay una
  clase en Domingo, Sábado se muestra igual aunque esté vacío (pero no al revés).
- La persistencia es local al dispositivo (AsyncStorage). Si más adelante querés sincronizar
  entre dispositivos, se podría reemplazar por un backend (Firebase, Supabase, etc.).
- El selector de hora (`@react-native-community/datetimepicker`), el capturador de pantalla
  (`react-native-view-shot`) y el selector de compartir (`expo-sharing`) no tienen soporte en la
  versión web de Expo (`--web`), solo funcionan en iOS/Android nativo. Si probás la app en el
  navegador, esas pantallas/funciones en particular van a fallar.
