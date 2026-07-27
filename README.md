# Mi Horario Semanal

App de React Native (Expo + TypeScript) para gestionar un calendario semanal de clases:
agregar, editar y eliminar horarios, con persistencia local en el dispositivo.

## Funcionalidades

- Grilla semanal (Lunes a Viernes) de 07:00 a 22:00, con bloques de clase coloreados.
- Tocar el botón **+** para agregar una nueva clase (nombre, día, hora de inicio/fin, color).
- Tocar un bloque existente para editarlo o eliminarlo.
- Los datos se guardan automáticamente en el dispositivo (AsyncStorage), no se pierden al cerrar la app.
- Datos de ejemplo precargados la primera vez, basados en un horario típico (podés borrarlos todos).

## Requisitos

- Node.js 18+
- npm o yarn
- La app [Expo Go](https://expo.dev/go) instalada en tu celular (o un emulador Android/iOS)

## Instalación

```bash
cd StudyCalendarApp
npm install
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
│   ├── types.ts                   # Tipo ClassEvent y nombres de los días
│   ├── constants/theme.ts         # Colores, paleta y medidas de la grilla
│   ├── utils/time.ts              # Conversión de horas y posicionamiento en la grilla
│   ├── utils/storage.ts           # Guardar/cargar eventos con AsyncStorage
│   ├── data/seedEvents.ts         # Datos de ejemplo iniciales
│   └── components/
│       ├── WeekCalendar.tsx       # Grilla semanal (días + horas + eventos)
│       ├── EventBlock.tsx         # Bloque visual de una clase
│       └── EventFormModal.tsx     # Formulario modal para crear/editar/eliminar
```

## Personalizar

- **Rango de horas**: cambiá `GRID_START_HOUR` / `GRID_END_HOUR` en `src/constants/theme.ts`.
- **Días de la semana**: cambiá `DAYS_SHORT` / `DAYS_FULL` en `src/types.ts` (por ejemplo, para agregar sábado y domingo).
- **Colores disponibles**: agregá o cambiá valores en `PALETTE` en `src/constants/theme.ts`.
- **Datos iniciales**: editá o vaciá `src/data/seedEvents.ts` (dejalo como `[]` para arrancar sin nada).

## Notas / posibles mejoras futuras

- Actualmente, si dos clases del mismo día se superponen en horario, sus bloques se dibujan
  uno sobre otro (no hay un algoritmo de layout para eventos solapados). Es un buen próximo paso
  si tu horario real tiene superposiciones.
- La persistencia es local al dispositivo (AsyncStorage). Si más adelante querés sincronizar
  entre dispositivos, se podría reemplazar por un backend (Firebase, Supabase, etc.).
