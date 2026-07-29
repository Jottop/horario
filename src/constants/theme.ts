export const COLORS = {
  background: '#FFFFFF',
  surface: '#FDFBF8',
  gridLine: '#B49A7C',
  headerText: '#B08968',
  text: '#3A3A3A',
  textLight: '#9A9A9A',
  primary: '#5B8FF9',
  danger: '#E0645F',
  overlay: 'rgba(0,0,0,0.4)',
};

// Paleta pastel inspirada en la imagen de referencia
export const PALETTE = [
  '#F7B6C2', // rosa
  '#AFD9F5', // celeste
  '#FCEC9E', // amarillo
  '#F8C99B', // naranja
  '#BEE3C6', // verde
  '#b5b3f8', // lavanda azulado
  '#B5E4DA', // menta
  '#D8C7F2', // lavanda
  '#e9ed98',
  '#d2c09a',
  
];

// Layout de la grilla horaria. Estos son los límites POR DEFECTO: si una clase empieza
// antes de GRID_START_HOUR o termina después de GRID_END_HOUR, WeekCalendar extiende
// la grilla dinámicamente para que esa clase se vea completa.
export const GRID_START_HOUR = 9; // 09:00
export const GRID_END_HOUR = 19; // 19:00
export const HOUR_HEIGHT = 60; // px por hora
export const TIME_LABEL_WIDTH = 28; // px

// Apariencia personalizable (menú lateral > Ajustar colores).
// El primero de cada lista es el valor original (el que restaura "Restablecer colores").
export const DEFAULT_APPEARANCE = {
  gridColor: COLORS.gridLine,
  backgroundColor: COLORS.background,
};

// 6 colores pastel (un poco más oscuros para buen contraste, ya que también se usan
// en el título y los nombres de los días) para las líneas de la grilla, pensados para
// combinar bien con cualquiera de los 6 fondos de BACKGROUND_COLOR_OPTIONS.
export const GRID_COLOR_OPTIONS = [
  '#B49A7C', // tostado (original)
  '#7FA8C9', // celeste
  '#A98BB0', // lavanda
  '#7FA873', // verde
  '#BC8078', // terracota
  '#7A7A7A', // gris
];

// 6 fondos claros, cada uno emparejado en tono con la línea de grilla del mismo índice
// (aunque el usuario puede combinarlos libremente).
export const BACKGROUND_COLOR_OPTIONS = [
  '#FFFFFF', // blanco (original)
  '#EAF2F8', // celeste muy claro
  '#F5EEF8', // lavanda muy claro
  '#EDF5EA', // verde muy claro
  '#FBEEEA', // terracota muy claro
  '#F2F2F2', // gris muy claro
];
