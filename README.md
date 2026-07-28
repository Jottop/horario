# Mi Horario Semanal

App de React Native (Expo + TypeScript) para gestionar un calendario semanal de clases:
agregar, editar y eliminar horarios, con persistencia local en el dispositivo.

## Funcionalidades

- Grilla semanal de 07:00 a 22:00. Lunes a Viernes se muestran siempre; Sábado y
  Domingo aparecen automáticamente en cuanto agregás una clase en esos días.
- Tocar el botón **+** para agregar una nueva clase (nombre, día, hora de inicio/fin, color).
- Selector de hora nativo (con intervalos de 15 minutos) en vez de escribir la hora a mano.
- Tocar un bloque existente para editarlo o eliminarlo.
- Menú lateral (ícono ☰ arriba a la izquierda, se abre desde la izquierda) con:
  - **Ajustar colores**: elegí *cualquier* color (sliders RGB + código hex) para las líneas
    de la grilla y para el fondo del calendario, con botón para restablecer los colores originales.
  - **Limpiar horario**: elimina todas las clases del calendario (con confirmación).
- Los datos se guardan automáticamente en el dispositivo (AsyncStorage), no se pierden al cerrar la app.
- Datos de ejemplo precargados la primera vez, basados en un horario típico (podés borrarlos todos,
  o usar "Limpiar horario" desde el menú).

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
nativas nuevas (selector de hora, slider RGB y safe-area) queden en la versión exacta
que espera el SDK de Expo del proyecto:
```bash
npx expo install --fix
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
├── App.tsx                        # Componente raíz: carga/guarda datos, arma la pantalla
├── src/
│   ├── types.ts                   # Tipo ClassEvent, días de la semana (7) y días visibles por defecto
│   ├── constants/theme.ts         # Colores, paleta, opciones de apariencia y medidas de la grilla
│   ├── utils/time.ts              # Conversión de horas y posicionamiento en la grilla
│   ├── utils/storage.ts           # Guardar/cargar eventos y apariencia con AsyncStorage
│   ├── data/seedEvents.ts         # Datos de ejemplo iniciales
│   └── components/
│       ├── WeekCalendar.tsx       # Grilla semanal (días dinámicos + horas + eventos)
│       ├── EventBlock.tsx         # Bloque visual de una clase
│       ├── EventFormModal.tsx     # Formulario modal para crear/editar/eliminar
│       ├── TimePickerField.tsx    # Selector de hora nativo (15 min)
│       ├── SideMenu.tsx           # Menú lateral (Ajustar colores, Limpiar horario)
│       └── ColorPickerModal.tsx   # Selector de color libre (sliders RGB + hex)
```

## Personalizar

- **Rango de horas**: cambiá `GRID_START_HOUR` / `GRID_END_HOUR` en `src/constants/theme.ts`.
- **Intervalo del selector de hora**: cambiá `minuteInterval={15}` en `src/components/TimePickerField.tsx`.
- **Días de la semana**: `DAYS_SHORT` / `DAYS_FULL` en `src/types.ts` ya incluyen los 7 días;
  `DEFAULT_VISIBLE_DAYS` controla cuáles se muestran siempre (por defecto, Lunes-Viernes).
- **Colores de clases disponibles**: agregá o cambiá valores en `PALETTE` en `src/constants/theme.ts`.
- **Colores originales de grilla/fondo** (los que restaura el botón "Restablecer colores"):
  `DEFAULT_APPEARANCE` en `src/constants/theme.ts`.
- **Datos iniciales**: editá o vaciá `src/data/seedEvents.ts` (dejalo como `[]` para arrancar sin nada).

## Notas / posibles mejoras futuras

- Actualmente, si dos clases del mismo día se superponen en horario, sus bloques se dibujan
  uno sobre otro (no hay un algoritmo de layout para eventos solapados). Es un buen próximo paso
  si tu horario real tiene superposiciones.
- Sábado/Domingo se ocultan automáticamente si borrás todas las clases de esos días. Si preferís
  que una vez mostrado un día quede fijo, se puede ajustar guardando esa preferencia por separado.
- La persistencia es local al dispositivo (AsyncStorage). Si más adelante querés sincronizar
  entre dispositivos, se podría reemplazar por un backend (Firebase, Supabase, etc.).
- El selector de color libre no tiene restricción de "solo tonos claros" para el fondo — si elegís
  un color muy oscuro, los textos (que usan un gris oscuro fijo) pueden volverse difíciles de leer.
  Es una decisión de diseño: dar libertad total de color implica que la legibilidad queda en manos
  del usuario. Un verdadero "modo oscuro" (textos que también cambian según el fondo) sería un
  cambio más grande.
- El selector de hora (`@react-native-community/datetimepicker`) y el slider RGB
  (`@react-native-community/slider`) no tienen soporte en la versión web de Expo (`--web`),
  solo funcionan en iOS/Android nativo. Si probás la app en el navegador, esas pantallas
  van a fallar.
