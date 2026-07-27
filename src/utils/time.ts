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
export function getEventTop(startTime: string): number {
  const startMinutes = timeToMinutes(startTime);
  const gridStartMinutes = GRID_START_HOUR * 60;
  return ((startMinutes - gridStartMinutes) / 60) * HOUR_HEIGHT;
}

/** Alto en px del bloque del evento según su duración */
export function getEventHeight(startTime: string, endTime: string): number {
  const duration = timeToMinutes(endTime) - timeToMinutes(startTime);
  return Math.max((duration / 60) * HOUR_HEIGHT, 28);
}

/** Convierte "14:30" en "2:30 PM" para mostrar en los bloques */
export function formatDisplayTime(time: string): string {
  if (!isValidTime(time)) return time;
  const [hStr, m] = time.split(':');
  let h = parseInt(hStr, 10);
  const period = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${period}`;
}

export function isEndAfterStart(startTime: string, endTime: string): boolean {
  return timeToMinutes(endTime) > timeToMinutes(startTime);
}
