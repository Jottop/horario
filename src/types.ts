export interface ClassEvent {
  id: string;
  title: string;
  /** 0 = Lunes, 1 = Martes, 2 = Miércoles, 3 = Jueves, 4 = Viernes, 5 = Sábado, 6 = Domingo */
  dayIndex: number;
  /** Formato 24h "HH:MM" */
  startTime: string;
  /** Formato 24h "HH:MM" */
  endTime: string;
  /** Color hexadecimal de fondo del bloque */
  color: string;
}

// Los 7 días están disponibles al crear una clase (Sábado y Domingo incluidos),
// pero el calendario solo muestra Lunes-Viernes por defecto (ver DEFAULT_VISIBLE_DAYS).
// Sábado/Domingo aparecen automáticamente en la grilla en cuanto haya una clase ahí.
export const DAYS_SHORT = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
export const DAYS_FULL = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
export const DEFAULT_VISIBLE_DAYS = [0, 1, 2, 3, 4];
