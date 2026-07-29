import React, { useMemo } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ClassEvent, DAYS_SHORT, DEFAULT_VISIBLE_DAYS } from '../types';
import EventBlock from './EventBlock';
import { timeToMinutes, hourTo12 } from '../utils/time';
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
  // La grilla arranca/termina en GRID_START_HOUR-GRID_END_HOUR por defecto, pero se
  // extiende si alguna clase empieza antes o termina después de ese rango.
  const { gridStartHour, gridEndHour } = useMemo(() => {
    let start = GRID_START_HOUR;
    let end = GRID_END_HOUR;
    events.forEach((e) => {
      const startHour = Math.floor(timeToMinutes(e.startTime) / 60);
      const endHour = Math.ceil(timeToMinutes(e.endTime) / 60);
      if (startHour < start) start = startHour;
      if (endHour > end) end = endHour;
    });
    return { gridStartHour: start, gridEndHour: end };
  }, [events]);

  const hours = useMemo(() => {
    const arr: number[] = [];
    for (let h = gridStartHour; h < gridEndHour; h++) arr.push(h);
    return arr;
  }, [gridStartHour, gridEndHour]);

  // Lunes-Viernes siempre se muestran. Sábado se agrega si tiene alguna clase,
  // o si Domingo tiene alguna clase (Domingo "arrastra" a Sábado, pero no al revés).
  const visibleDayIndices = useMemo(() => {
    const hasSaturday = events.some((e) => e.dayIndex === 5);
    const hasSunday = events.some((e) => e.dayIndex === 6);
    const set = new Set<number>(DEFAULT_VISIBLE_DAYS);
    if (hasSaturday || hasSunday) set.add(5);
    if (hasSunday) set.add(6);
    return Array.from(set).sort((a, b) => a - b);
  }, [events]);

  const screenWidth = Dimensions.get('window').width;
  const availableWidth = screenWidth - TIME_LABEL_WIDTH;
  // Las columnas siempre se ajustan al ancho disponible: nunca hace falta
  // scrollear horizontalmente para ver todos los días visibles.
  const dayColumnWidth = availableWidth / visibleDayIndices.length;
  const gridHeight = (gridEndHour - gridStartHour) * HOUR_HEIGHT;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Encabezado de días */}
      <View style={[styles.headerRow, { borderBottomColor: gridColor }]}>
        <View style={{ width: TIME_LABEL_WIDTH }} />
        {visibleDayIndices.map((dayIndex) => (
          <View key={dayIndex} style={[styles.dayHeaderCell, { width: dayColumnWidth }]}>
            <Text style={[styles.dayHeaderText, { color: gridColor }]} numberOfLines={1} adjustsFontSizeToFit>
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
                <Text style={[styles.hourLabel, { color: gridColor }]}>{hourTo12(h)}</Text>
              </View>
            ))}
          </View>

          {visibleDayIndices.map((dayIndex, i) => (
            <View
              key={dayIndex}
              style={[
                styles.dayColumn,
                {
                  width: dayColumnWidth,
                  height: gridHeight,
                  borderLeftColor: gridColor,
                  borderBottomColor: gridColor,
                  ...(i === visibleDayIndices.length - 1
                    ? { borderRightWidth: 1, borderRightColor: gridColor }
                    : null),
                },
              ]}
            >
              {hours.map((h) => (
                <View
                  key={h}
                  style={[
                    styles.hourLine,
                    { top: (h - gridStartHour) * HOUR_HEIGHT, backgroundColor: gridColor },
                  ]}
                />
              ))}
              {events
                .filter((e) => e.dayIndex === dayIndex)
                .map((event) => (
                  <EventBlock
                    key={event.id}
                    event={event}
                    onPress={() => onEventPress(event)}
                    gridStartHour={gridStartHour}
                  />
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
    paddingTop: 8,
  },
  dayHeaderCell: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  dayHeaderText: {
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
    borderBottomWidth: 1,
  },
  hourLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
  },
});
