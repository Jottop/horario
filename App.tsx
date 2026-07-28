import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import WeekCalendar from './src/components/WeekCalendar';
import EventFormModal from './src/components/EventFormModal';
import SideMenu from './src/components/SideMenu';
import { ClassEvent } from './src/types';
import { loadEvents, saveEvents, loadAppearance, saveAppearance } from './src/utils/storage';
import { seedEvents } from './src/data/seedEvents';
import { COLORS, DEFAULT_APPEARANCE } from './src/constants/theme';

function AppContent() {
  const [events, setEvents] = useState<ClassEvent[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ClassEvent | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [gridColor, setGridColor] = useState(DEFAULT_APPEARANCE.gridColor);
  const [backgroundColor, setBackgroundColor] = useState(DEFAULT_APPEARANCE.backgroundColor);
  const isFirstRun = useRef(true);

  // Cargar eventos y apariencia guardados al iniciar (o usar valores por defecto la primera vez)
  useEffect(() => {
    (async () => {
      const [storedEvents, storedAppearance] = await Promise.all([loadEvents(), loadAppearance()]);
      setEvents(storedEvents ?? seedEvents);
      if (storedAppearance) {
        setGridColor(storedAppearance.gridColor);
        setBackgroundColor(storedAppearance.backgroundColor);
      }
      setLoaded(true);
    })();
  }, []);

  // Guardar eventos cada vez que cambian (evita guardar en el primer render)
  useEffect(() => {
    if (!loaded) return;
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    saveEvents(events);
  }, [events, loaded]);

  // Guardar apariencia cada vez que cambia
  useEffect(() => {
    if (!loaded) return;
    saveAppearance({ gridColor, backgroundColor });
  }, [gridColor, backgroundColor, loaded]);

  function handleAddPress() {
    setEditingEvent(null);
    setModalVisible(true);
  }

  function handleEventPress(event: ClassEvent) {
    setEditingEvent(event);
    setModalVisible(true);
  }

  function handleSave(newEvents: ClassEvent[]) {
    setEvents((prev) => {
      // Los ids que ya existían en prev corresponden a horarios editados (se reemplazan);
      // los ids nuevos corresponden a horarios agregados (se suman).
      const incomingIds = new Set(newEvents.map((e) => e.id));
      const kept = prev.filter((e) => !incomingIds.has(e.id));
      return [...kept, ...newEvents];
    });
    setModalVisible(false);
  }

  function handleDelete(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setModalVisible(false);
  }

  function handleClearAll() {
    setEvents([]);
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <View style={[styles.titleBar, { borderBottomColor: gridColor }]}>
        <Pressable style={styles.menuButton} onPress={() => setMenuVisible(true)} hitSlop={12}>
          <Text style={styles.menuIcon}>☰</Text>
        </Pressable>
        <Text style={[styles.title, { color: gridColor }]}>Mi Horario Semanal</Text>
        <View style={styles.menuButton} />
      </View>

      <WeekCalendar
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
