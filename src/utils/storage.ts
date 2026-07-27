import AsyncStorage from '@react-native-async-storage/async-storage';
import { ClassEvent } from '../types';

const STORAGE_KEY = '@study_calendar_events_v1';

export async function loadEvents(): Promise<ClassEvent[] | null> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? (JSON.parse(json) as ClassEvent[]) : null;
  } catch (e) {
    console.error('Error al cargar eventos', e);
    return null;
  }
}

export async function saveEvents(events: ClassEvent[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (e) {
    console.error('Error al guardar eventos', e);
  }
}
