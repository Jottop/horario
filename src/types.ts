export interface ClassEvent {
  id: string;
  title: string;
  /** 0 = Lunes, 1 = Martes, 2 = Miércoles, 3 = Jueves, 4 = Viernes */
  dayIndex: number;
  /** Formato 24h "HH:MM" */
  startTime: string;
  /** Formato 24h "HH:MM" */
  endTime: string;
  /** Color hexadecimal de fondo del bloque */
  color: string;
}

export const DAYS_SHORT = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'];
export const DAYS_FULL = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
