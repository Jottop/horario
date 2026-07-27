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
  MIN_DAY_COLUMN_WIDTH,
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
  const dayColumnWidth = Math.max(availableWidth / DAYS_SHORT.length, MIN_DAY_COLUMN_WIDTH);
  const gridHeight = (GRID_END_HOUR - GRID_START_HOUR) * HOUR_HEIGHT;
  const needsHorizontalScroll = dayColumnWidth * DAYS_SHORT.length > availableWidth + 1;

  const daysContent = (
    <View style={{ flexDirection: 'row' }}>
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
  );

  return (
    <View style={styles.container}>
      {/* Encabezado de días (fijo, no scrollea verticalmente) */}
      <View style={styles.headerRow}>
        <View style={{ width: TIME_LABEL_WIDTH }} />
        {needsHorizontalScroll ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} scrollEnabled={false}>
            {DAYS_SHORT.map((day) => (
              <View key={day} style={[styles.dayHeaderCell, { width: dayColumnWidth }]}>
                <Text style={styles.dayHeaderText}>{day}</Text>
              </View>
            ))}
          </ScrollView>
        ) : (
          DAYS_SHORT.map((day) => (
            <View key={day} style={[styles.dayHeaderCell, { width: dayColumnWidth }]}>
              <Text style={styles.dayHeaderText}>{day}</Text>
            </View>
          ))
        )}
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
          {needsHorizontalScroll ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {daysContent}
            </ScrollView>
          ) : (
            daysContent
          )}
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
