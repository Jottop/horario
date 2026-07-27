import React, { useEffect, useRef, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import WeekCalendar from './src/components/WeekCalendar';
import EventFormModal from './src/components/EventFormModal';
import { ClassEvent } from './src/types';
import { loadEvents, saveEvents } from './src/utils/storage';
import { seedEvents } from './src/data/seedEvents';
import { COLORS } from './src/constants/theme';

export default function App() {
  const [events, setEvents] = useState<ClassEvent[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ClassEvent | null>(null);
  const isFirstRun = useRef(true);

  // Cargar eventos guardados al iniciar (o usar datos semilla la primera vez)
  useEffect(() => {
    (async () => {
      const stored = await loadEvents();
      setEvents(stored ?? seedEvents);
      setLoaded(true);
    })();
  }, []);

  // Guardar cada vez que cambian los eventos (evita guardar en el primer render)
  useEffect(() => {
    if (!loaded) return;
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    saveEvents(events);
  }, [events, loaded]);

  function handleAddPress() {
    setEditingEvent(null);
    setModalVisible(true);
  }

  function handleEventPress(event: ClassEvent) {
    setEditingEvent(event);
    setModalVisible(true);
  }

  function handleSave(event: ClassEvent) {
    setEvents((prev) => {
      const exists = prev.some((e) => e.id === event.id);
      return exists ? prev.map((e) => (e.id === event.id ? event : e)) : [...prev, event];
    });
    setModalVisible(false);
  }

  function handleDelete(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setModalVisible(false);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.titleBar}>
        <Text style={styles.title}>Horario Cami</Text>
      </View>

      <WeekCalendar events={events} onEventPress={handleEventPress} />

      <Pressable style={styles.fab} onPress={handleAddPress}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      <EventFormModal
        visible={modalVisible}
        initialEvent={editingEvent}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  titleBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gridLine,
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
