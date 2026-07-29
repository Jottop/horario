import { GRID_START_HOUR, HOUR_HEIGHT } from '../constants/theme';

const TIME_REGEX = /^([01]?\d|2[0-3]):([0-5]\d)$/;

export function isValidTime(time: string): boolean {
  return TIME_REGEX.test(time.trim());
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Distancia en px desde el borde superior de la grilla hasta el inicio del evento */
export function getEventTop(startTime: string, gridStartHour: number = GRID_START_HOUR): number {
  const startMinutes = timeToMinutes(startTime);
  const gridStartMinutes = gridStartHour * 60;
  return ((startMinutes - gridStartMinutes) / 60) * HOUR_HEIGHT;
}

/** Alto en px del bloque del evento según su duración */
export function getEventHeight(startTime: string, endTime: string): number {
  const duration = timeToMinutes(endTime) - timeToMinutes(startTime);
  return Math.max((duration / 60) * HOUR_HEIGHT, 28);
}

/** Devuelve la hora en formato 24h tal cual ("14:30"), sin convertir a 12h/AM-PM */
export function formatDisplayTime(time: string): string {
  return isValidTime(time) ? time.trim() : time;
}

export function isEndAfterStart(startTime: string, endTime: string): boolean {
  return timeToMinutes(endTime) > timeToMinutes(startTime);
}

/** Convierte una hora 0-23 a su equivalente 1-12 (para el eje de la grilla). 0 y 12 dan 12. */
export function hourTo12(hour: number): number {
  const mod = hour % 12;
  return mod === 0 ? 12 : mod;
}

/** true si los rangos [startA,endA) y [startB,endB) se superponen en algún punto */
export function doTimesOverlap(startA: string, endA: string, startB: string, endB: string): boolean {
  const a1 = timeToMinutes(startA);
  const a2 = timeToMinutes(endA);
  const b1 = timeToMinutes(startB);
  const b2 = timeToMinutes(endB);
  return a1 < b2 && b1 < a2;
}
