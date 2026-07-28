import React, { useMemo } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ClassEvent, DAYS_SHORT, DEFAULT_VISIBLE_DAYS } from '../types';
import EventBlock from './EventBlock';
import {
  COLORS,
  GRID_START_HOUR,
  GRID_END_HOUR,
  HOUR_HEIGHT,
  TIME_LABEL_WIDTH,
} from '../constants/theme';

interface Props {
  events: ClassEvent[];
  onEventPress: (event: ClassEvent) => void;
  gridColor?: string;
  backgroundColor?: string;
}

export default function WeekCalendar({
  events,
  onEventPress,
  gridColor = COLORS.gridLine,
  backgroundColor = COLORS.background,
}: Props) {
  const hours = useMemo(() => {
    const arr: number[] = [];
    for (let h = GRID_START_HOUR; h < GRID_END_HOUR; h++) arr.push(h);
    return arr;
  }, []);

  // Lunes-Viernes siempre se muestran. Sábado/Domingo se agregan solo si
  // hay al menos una clase cargada en ese día.
  const visibleDayIndices = useMemo(() => {
    const set = new Set<number>(DEFAULT_VISIBLE_DAYS);
    events.forEach((e) => {
      if (e.dayIndex === 5 || e.dayIndex === 6) set.add(e.dayIndex);
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [events]);

  const screenWidth = Dimensions.get('window').width;
  const availableWidth = screenWidth - TIME_LABEL_WIDTH;
  // Las columnas siempre se ajustan al ancho disponible: nunca hace falta
  // scrollear horizontalmente para ver todos los días visibles.
  const dayColumnWidth = availableWidth / visibleDayIndices.length;
  const gridHeight = (GRID_END_HOUR - GRID_START_HOUR) * HOUR_HEIGHT;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Encabezado de días */}
      <View style={[styles.headerRow, { borderBottomColor: gridColor }]}>
        <View style={{ width: TIME_LABEL_WIDTH }} />
        {visibleDayIndices.map((dayIndex) => (
          <View key={dayIndex} style={[styles.dayHeaderCell, { width: dayColumnWidth }]}>
            <Text style={styles.dayHeaderText} numberOfLines={1} adjustsFontSizeToFit>
              {DAYS_SHORT[dayIndex]}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: TIME_LABEL_WIDTH }}>
            {hours.map((h) => (
              <View key={h} style={[styles.hourLabelWrap, { height: HOUR_HEIGHT }]}>
                <Text style={styles.hourLabel}>{h}</Text>
              </View>
            ))}
          </View>

          {visibleDayIndices.map((dayIndex) => (
            <View
              key={dayIndex}
              style={[
                styles.dayColumn,
                { width: dayColumnWidth, height: gridHeight, borderLeftColor: gridColor },
              ]}
            >
              {hours.map((h) => (
                <View
                  key={h}
                  style={[
                    styles.hourLine,
                    { top: (h - GRID_START_HOUR) * HOUR_HEIGHT, backgroundColor: gridColor },
                  ]}
                />
              ))}
              {events
                .filter((e) => e.dayIndex === dayIndex)
                .map((event) => (
                  <EventBlock key={event.id} event={event} onPress={() => onEventPress(event)} />
                ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  dayHeaderCell: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  dayHeaderText: {
    color: COLORS.headerText,
    fontWeight: '600',
    fontSize: 13,
  },
  hourLabelWrap: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  hourLabel: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  dayColumn: {
    position: 'relative',
    borderLeftWidth: 1,
  },
  hourLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
  },
});
