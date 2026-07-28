import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { COLORS } from '../constants/theme';
import { formatDisplayTime } from '../utils/time';

interface Props {
  /** Hora actual en formato 24h "HH:MM" */
  value: string;
  onChange: (time: string) => void;
}

function timeStringToDate(time: string): Date {
  const [h, m] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(h || 0, m || 0, 0, 0);
  return date;
}

export default function TimePickerField({ value, onChange }: Props) {
  // En iOS el selector queda "abierto" en la pantalla (modo spinner);
  // en Android se abre como un diálogo nativo al tocar el campo.
  const [showPicker, setShowPicker] = useState(false);

  function handleChange(event: DateTimePickerEvent, selectedDate?: Date) {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (event.type === 'dismissed' || !selectedDate) return;
    const h = selectedDate.getHours();
    const m = selectedDate.getMinutes();
    onChange(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  }

  return (
    <View>
      <Pressable style={styles.field} onPress={() => setShowPicker(true)}>
        <Text style={styles.fieldText}>{formatDisplayTime(value)}</Text>
      </Pressable>
      {showPicker && (
        <DateTimePicker
          value={timeStringToDate(value)}
          mode="time"
          minuteInterval={15}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    borderWidth: 1,
    borderColor: COLORS.gridLine,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  fieldText: {
    fontSize: 15,
    color: COLORS.text,
  },
});
