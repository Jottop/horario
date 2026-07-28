import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ClassEvent, DAYS_FULL } from '../types';
import { COLORS, PALETTE } from '../constants/theme';
import { isEndAfterStart } from '../utils/time';
import TimePickerField from './TimePickerField';

interface Props {
  visible: boolean;
  initialEvent: ClassEvent | null;
  onClose: () => void;
  onSave: (event: ClassEvent) => void;
  onDelete: (id: string) => void;
}

function makeId(): string {
  return `evt-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

export default function EventFormModal({ visible, initialEvent, onClose, onSave, onDelete }: Props) {
  const isEditing = !!initialEvent;

  const [title, setTitle] = useState('');
  const [dayIndex, setDayIndex] = useState(0);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [color, setColor] = useState(PALETTE[0]);
  const [error, setError] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    if (visible) {
      setTitle(initialEvent?.title ?? '');
      setDayIndex(initialEvent?.dayIndex ?? 0);
      setStartTime(initialEvent?.startTime ?? '09:00');
      setEndTime(initialEvent?.endTime ?? '10:00');
      setColor(initialEvent?.color ?? PALETTE[0]);
      setError('');
      setConfirmingDelete(false);
    }
  }, [visible, initialEvent]);

  function handleSave() {
    if (!title.trim()) {
      setError('Ingresá un nombre para la clase.');
      return;
    }
    if (!isEndAfterStart(startTime, endTime)) {
      setError('La hora de fin debe ser posterior a la de inicio.');
      return;
    }

    const event: ClassEvent = {
      id: initialEvent?.id ?? makeId(),
      title: title.trim(),
      dayIndex,
      startTime,
      endTime,
      color,
    };
    onSave(event);
  }

  function handleConfirmDelete() {
    if (!initialEvent) return;
    onDelete(initialEvent.id);
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <Text style={styles.heading}>{isEditing ? 'Editar clase' : 'Nueva clase'}</Text>

            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Ej: Zoología Funcional"
              placeholderTextColor={COLORS.textLight}
            />

            <Text style={styles.label}>Día</Text>
            <View style={styles.chipRow}>
              {DAYS_FULL.map((day, idx) => (
                <Pressable
                  key={day}
                  onPress={() => setDayIndex(idx)}
                  style={[styles.chip, dayIndex === idx && styles.chipSelected]}
                >
                  <Text style={[styles.chipText, dayIndex === idx && styles.chipTextSelected]}>
                    {day.slice(0, 3)}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.timeRow}>
              <View style={styles.timeField}>
                <Text style={styles.label}>Inicio</Text>
                <TimePickerField value={startTime} onChange={setStartTime} />
              </View>
              <View style={styles.timeField}>
                <Text style={styles.label}>Fin</Text>
                <TimePickerField value={endTime} onChange={setEndTime} />
              </View>
            </View>

            <Text style={styles.label}>Color</Text>
            <View style={styles.chipRow}>
              {PALETTE.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => setColor(c)}
                  style={[
                    styles.swatch,
                    { backgroundColor: c },
                    color === c && styles.swatchSelected,
                  ]}
                />
              ))}
            </View>

            {!!error && <Text style={styles.error}>{error}</Text>}

            <View style={styles.actionsRow}>
              <Pressable style={[styles.button, styles.cancelButton]} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>
              <Pressable style={[styles.button, styles.saveButton]} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </Pressable>
            </View>

            {isEditing && !confirmingDelete && (
              <Pressable style={styles.deleteButton} onPress={() => setConfirmingDelete(true)}>
                <Text style={styles.deleteButtonText}>Eliminar clase</Text>
              </Pressable>
            )}

            {isEditing && confirmingDelete && (
              <View style={styles.confirmBox}>
                <Text style={styles.confirmText}>
                  ¿Seguro que querés eliminar "{initialEvent?.title}"?
                </Text>
                <View style={styles.actionsRow}>
                  <Pressable
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => setConfirmingDelete(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.confirmDeleteButton]}
                    onPress={handleConfirmDelete}
                  >
                    <Text style={styles.saveButtonText}>Sí, eliminar</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '85%',
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gridLine,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: COLORS.text,
    backgroundColor: '#FFFFFF',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.gridLine,
    backgroundColor: '#FFFFFF',
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 13,
    color: COLORS.text,
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  timeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timeField: {
    flex: 1,
  },
  swatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  swatchSelected: {
    borderColor: COLORS.text,
  },
  error: {
    color: COLORS.danger,
    marginTop: 12,
    fontSize: 13,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.gridLine,
  },
  cancelButtonText: {
    color: COLORS.text,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  deleteButton: {
    marginTop: 14,
    alignItems: 'center',
    paddingVertical: 10,
  },
  deleteButtonText: {
    color: COLORS.danger,
    fontWeight: '600',
  },
  confirmBox: {
    marginTop: 14,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#FBEAEA',
  },
  confirmText: {
    color: COLORS.text,
    fontSize: 14,
    marginBottom: 4,
  },
  confirmDeleteButton: {
    backgroundColor: COLORS.danger,
  },
});
