import React, { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import WeekCalendar from './src/components/WeekCalendar';
import EventFormModal from './src/components/EventFormModal';
import SideMenu from './src/components/SideMenu';
import { ClassEvent, Schedule } from './src/types';
import {
  loadSchedules,
  saveSchedules,
  loadActiveScheduleId,
  saveActiveScheduleId,
  loadLegacyEvents,
  loadAppearance,
  saveAppearance,
} from './src/utils/storage';
import { seedEvents } from './src/data/seedEvents';
import { COLORS, DEFAULT_APPEARANCE } from './src/constants/theme';
import { makeId } from './src/utils/id';

function AppContent() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [activeScheduleId, setActiveScheduleId] = useState<string>('');
  const [loaded, setLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ClassEvent | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [gridColor, setGridColor] = useState(DEFAULT_APPEARANCE.gridColor);
  const [backgroundColor, setBackgroundColor] = useState(DEFAULT_APPEARANCE.backgroundColor);
  const isFirstRun = useRef(true);
  const calendarShotRef = useRef<View>(null);

  const activeSchedule = schedules.find((s) => s.id === activeScheduleId) ?? null;
  const events = activeSchedule?.events ?? [];

  // Cargar horarios y apariencia guardados al iniciar. Si no hay horarios (primera vez,
  // o versión anterior de la app que guardaba un único horario sin nombre), se migran
  // esos datos a un horario nuevo llamado "Mi Horario" para no perder nada.
  useEffect(() => {
    (async () => {
      const [storedSchedules, storedActiveId, storedAppearance] = await Promise.all([
        loadSchedules(),
        loadActiveScheduleId(),
        loadAppearance(),
      ]);

      if (storedSchedules && storedSchedules.length > 0) {
        setSchedules(storedSchedules);
        const activeStillExists = storedSchedules.some((s) => s.id === storedActiveId);
        setActiveScheduleId(activeStillExists ? storedActiveId! : storedSchedules[0].id);
      } else {
        const legacyEvents = await loadLegacyEvents();
        const initialSchedule: Schedule = {
          id: makeId('sched'),
          name: 'Mi Horario',
          events: legacyEvents ?? seedEvents,
        };
        setSchedules([initialSchedule]);
        setActiveScheduleId(initialSchedule.id);
      }

      if (storedAppearance) {
        setGridColor(storedAppearance.gridColor);
        setBackgroundColor(storedAppearance.backgroundColor);
      }
      setLoaded(true);
    })();
  }, []);

  // Guardar horarios y el horario activo cada vez que cambian (evita guardar en el primer render)
  useEffect(() => {
    if (!loaded) return;
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    saveSchedules(schedules);
    saveActiveScheduleId(activeScheduleId);
  }, [schedules, activeScheduleId, loaded]);

  // Guardar apariencia cada vez que cambia
  useEffect(() => {
    if (!loaded) return;
    saveAppearance({ gridColor, backgroundColor });
  }, [gridColor, backgroundColor, loaded]);

  /** Aplica una transformación a la lista de clases del horario actualmente activo */
  function updateActiveEvents(updater: (prev: ClassEvent[]) => ClassEvent[]) {
    setSchedules((prev) =>
      prev.map((s) => (s.id === activeScheduleId ? { ...s, events: updater(s.events) } : s))
    );
  }

  function handleAddPress() {
    setEditingEvent(null);
    setModalVisible(true);
  }

  function handleEventPress(event: ClassEvent) {
    setEditingEvent(event);
    setModalVisible(true);
  }

  function handleSave(newEvents: ClassEvent[], originalIds: string[]) {
    updateActiveEvents((prev) => {
      // Se quitan TODOS los ids originales del grupo que se estaba editando (incluso los
      // que el usuario haya quitado con "Quitar" y ya no estén en newEvents), y se agregan
      // los eventos finales. Al crear una clase nueva, originalIds llega vacío.
      const originalIdsSet = new Set(originalIds);
      const kept = prev.filter((e) => !originalIdsSet.has(e.id));
      return [...kept, ...newEvents];
    });
    setModalVisible(false);
  }

  function handleDelete(id: string) {
    updateActiveEvents((prev) => prev.filter((e) => e.id !== id));
    setModalVisible(false);
  }

  function handleClearAll() {
    updateActiveEvents(() => []);
  }

  function handleSwitchSchedule(id: string) {
    setActiveScheduleId(id);
  }

  function handleCreateSchedule(name: string) {
    const newSchedule: Schedule = { id: makeId('sched'), name: name.trim() || 'Nuevo horario', events: [] };
    setSchedules((prev) => [...prev, newSchedule]);
    setActiveScheduleId(newSchedule.id);
  }

  function handleRenameSchedule(id: string, name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    setSchedules((prev) => prev.map((s) => (s.id === id ? { ...s, name: trimmed } : s)));
  }

  function handleDeleteSchedule(id: string) {
    setSchedules((prev) => {
      const remaining = prev.filter((s) => s.id !== id);
      if (remaining.length === 0) return prev; // nunca se borra el último horario
      if (id === activeScheduleId) {
        setActiveScheduleId(remaining[0].id);
      }
      return remaining;
    });
  }

  function handleScreenshot() {
    setMenuVisible(false);
    // Se espera a que el menú termine de cerrarse antes de capturar,
    // para que no quede ni un resto de su animación en la imagen.
    setTimeout(async () => {
      try {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permiso necesario', 'Necesitamos acceso a tu galería para guardar la captura.');
          return;
        }
        const uri = await captureRef(calendarShotRef, { format: 'png', quality: 1 });
        if (!uri) return;
        await MediaLibrary.saveToLibraryAsync(uri);
        Alert.alert('Listo', 'La captura del horario se guardó en tu galería.');
      } catch (e) {
        console.error('Error al capturar el horario', e);
        Alert.alert('Error', 'No se pudo guardar la captura.');
      }
    }, 300);
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <View style={[styles.titleBar, { borderBottomColor: gridColor }]}>
        <Pressable style={styles.menuButton} onPress={() => setMenuVisible(true)} hitSlop={12}>
          <Text style={styles.menuIcon}>☰</Text>
        </Pressable>
        <Text style={[styles.title, { color: gridColor }]} numberOfLines={1}>
          {activeSchedule?.name ?? 'Mi Horario Semanal'}
        </Text>
        <View style={styles.menuButton} />
      </View>

      <WeekCalendar
        ref={calendarShotRef}
        events={events}
        onEventPress={handleEventPress}
        gridColor={gridColor}
        backgroundColor={backgroundColor}
      />

      <Pressable style={styles.fab} onPress={handleAddPress}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      <EventFormModal
        visible={modalVisible}
        initialEvent={editingEvent}
        events={events}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        onDelete={handleDelete}
      />

      <SideMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        gridColor={gridColor}
        backgroundColor={backgroundColor}
        onChangeGridColor={setGridColor}
        onChangeBackgroundColor={setBackgroundColor}
        onClearAll={handleClearAll}
        onScreenshot={handleScreenshot}
        schedules={schedules}
        activeScheduleId={activeScheduleId}
        onSwitchSchedule={handleSwitchSchedule}
        onCreateSchedule={handleCreateSchedule}
        onRenameSchedule={handleRenameSchedule}
        onDeleteSchedule={handleDeleteSchedule}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  titleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  menuButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    fontSize: 20,
    color: COLORS.text,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '400',
    marginTop: -2,
  },
});
