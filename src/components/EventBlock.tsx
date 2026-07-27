import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { ClassEvent } from '../types';
import { getEventHeight, getEventTop, formatDisplayTime } from '../utils/time';
import { COLORS } from '../constants/theme';

interface Props {
  event: ClassEvent;
  onPress: () => void;
}

export default function EventBlock({ event, onPress }: Props) {
  const top = getEventTop(event.startTime);
  const height = getEventHeight(event.startTime, event.endTime);
  const compact = height < 46;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.block,
        {
          top,
          height,
          backgroundColor: event.color,
        },
      ]}
    >
      <Text style={styles.title} numberOfLines={compact ? 1 : 2}>
        {event.title}
      </Text>
      {!compact && (
        <Text style={styles.time} numberOfLines={1}>
          {formatDisplayTime(event.startTime)} - {formatDisplayTime(event.endTime)}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  block: {
    position: 'absolute',
    left: 2,
    right: 2,
    borderRadius: 8,
    padding: 4,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  title: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.text,
  },
  time: {
    fontSize: 9,
    color: COLORS.text,
    opacity: 0.75,
    marginTop: 2,
  },
});
