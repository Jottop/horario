import AsyncStorage from '@react-native-async-storage/async-storage';
import { ClassEvent, Schedule } from '../types';

const LEGACY_EVENTS_KEY = '@study_calendar_events_v1';

/** Solo se usa para migrar datos de versiones anteriores (un único horario, sin nombre). */
export async function loadLegacyEvents(): Promise<ClassEvent[] | null> {
  try {
    const json = await AsyncStorage.getItem(LEGACY_EVENTS_KEY);
    return json ? (JSON.parse(json) as ClassEvent[]) : null;
  } catch (e) {
    console.error('Error al cargar eventos (legacy)', e);
    return null;
  }
}

const SCHEDULES_KEY = '@study_calendar_schedules_v1';
const ACTIVE_SCHEDULE_KEY = '@study_calendar_active_schedule_v1';

export async function loadSchedules(): Promise<Schedule[] | null> {
  try {
    const json = await AsyncStorage.getItem(SCHEDULES_KEY);
    return json ? (JSON.parse(json) as Schedule[]) : null;
  } catch (e) {
    console.error('Error al cargar los horarios', e);
    return null;
  }
}

export async function saveSchedules(schedules: Schedule[]): Promise<void> {
  try {
    await AsyncStorage.setItem(SCHEDULES_KEY, JSON.stringify(schedules));
  } catch (e) {
    console.error('Error al guardar los horarios', e);
  }
}

export async function loadActiveScheduleId(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(ACTIVE_SCHEDULE_KEY);
  } catch (e) {
    console.error('Error al cargar el horario activo', e);
    return null;
  }
}

export async function saveActiveScheduleId(id: string): Promise<void> {
  try {
    await AsyncStorage.setItem(ACTIVE_SCHEDULE_KEY, id);
  } catch (e) {
    console.error('Error al guardar el horario activo', e);
  }
}

export interface AppearanceSettings {
  gridColor: string;
  backgroundColor: string;
}

const APPEARANCE_KEY = '@study_calendar_appearance_v1';

export async function loadAppearance(): Promise<AppearanceSettings | null> {
  try {
    const json = await AsyncStorage.getItem(APPEARANCE_KEY);
    return json ? (JSON.parse(json) as AppearanceSettings) : null;
  } catch (e) {
    console.error('Error al cargar apariencia', e);
    return null;
  }
}

export async function saveAppearance(settings: AppearanceSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(APPEARANCE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error al guardar apariencia', e);
  }
}
