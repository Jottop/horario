import React, { useMemo } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ClassEvent, DAYS_SHORT } from '../types';
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
}

export default function WeekCalendar({ events, onEventPress }: Props) {
  const hours = useMemo(() => {
    const arr: number[] = [];
    for (let h = GRID_START_HOUR; h < GRID_END_HOUR; h++) arr.push(h);
    return arr;
  }, []);

  const screenWidth = Dimensions.get('window').width;
  const availableWidth = screenWidth - TIME_LABEL_WIDTH;
  // Las 5 columnas siempre se ajustan al ancho disponible: nunca hace falta
  // scrollear horizontalmente para ver Viernes.
  const dayColumnWidth = availableWidth / DAYS_SHORT.length;
  const gridHeight = (GRID_END_HOUR - GRID_START_HOUR) * HOUR_HEIGHT;

  return (
    <View style={styles.container}>
      {/* Encabezado de días */}
      <View style={styles.headerRow}>
        <View style={{ width: TIME_LABEL_WIDTH }} />
        {DAYS_SHORT.map((day) => (
          <View key={day} style={[styles.dayHeaderCell, { width: dayColumnWidth }]}>
            <Text style={styles.dayHeaderText} numberOfLines={1} adjustsFontSizeToFit>
              {day}
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

          {DAYS_SHORT.map((day, dayIndex) => (
            <View key={day} style={[styles.dayColumn, { width: dayColumnWidth, height: gridHeight }]}>
              {hours.map((h) => (
                <View key={h} style={[styles.hourLine, { top: (h - GRID_START_HOUR) * HOUR_HEIGHT }]} />
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
    backgroundColor: COLORS.background,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gridLine,
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
    borderLeftColor: COLORS.gridLine,
  },
  hourLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: COLORS.gridLine,
  },
});
