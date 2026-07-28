export const COLORS = {
  background: '#FFFFFF',
  surface: '#FDFBF8',
  gridLine: '#EAD9C7',
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
  '#B5E4DA', // menta
  '#D8C7F2', // lavanda
];

// Layout de la grilla horaria
export const GRID_START_HOUR = 7; // 07:00
export const GRID_END_HOUR = 22; // 22:00
export const HOUR_HEIGHT = 60; // px por hora
export const TIME_LABEL_WIDTH = 28; // px

// Apariencia personalizable (menú lateral > Diseño)
export const DEFAULT_APPEARANCE = {
  gridColor: COLORS.gridLine,
  backgroundColor: COLORS.background,
};

// Opciones de color para las líneas de la grilla
export const GRID_COLOR_OPTIONS = [
  '#EAD9C7', // tostado (default)
  '#D9D9D6',
  '#B5B3AA',
  '#8FA8C7',
  '#C7A6C2',
  '#2C2C2A',
];

// Opciones de color de fondo (tonos claros, para que el texto oscuro siga siendo legible)
export const BACKGROUND_COLOR_OPTIONS = [
  '#FFFFFF', // blanco (default)
  '#FDFBF8',
  '#F5F5F0',
  '#EAF3FB',
  '#FDF2E9',
  '#F3EAF7',
];
