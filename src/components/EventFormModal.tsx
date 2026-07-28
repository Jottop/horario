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
import { isEndAfterStart, doTimesOverlap } from '../utils/time';
import TimePickerField from './TimePickerField';

interface Props {
  visible: boolean;
  initialEvent: ClassEvent | null;
  /** Todas las clases existentes, para validar que no se superpongan horarios */
  events: ClassEvent[];
  onClose: () => void;
  /** Puede devolver varios eventos a la vez (uno por cada horario agregado al crear una clase nueva) */
  onSave: (events: ClassEvent[]) => void;
  onDelete: (id: string) => void;
}

interface ScheduleSlot {
  key: string;
  dayIndex: number;
  startTime: string;
  endTime: string;
}

function makeId(): string {
  return `evt-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function makeSlot(dayIndex = 0): ScheduleSlot {
  return { key: makeId(), dayIndex, startTime: '09:00', endTime: '10:00' };
}

export default function EventFormModal({ visible, initialEvent, events, onClose, onSave, onDelete }: Props) {
  const isEditing = !!initialEvent;

  const [title, setTitle] = useState('');
  const [slots, setSlots] = useState<ScheduleSlot[]>([makeSlot()]);
  const [color, setColor] = useState(PALETTE[0]);
  const [error, setError] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    if (visible) {
      setTitle(initialEvent?.title ?? '');
      setColor(initialEvent?.color ?? PALETTE[0]);
      setError('');
      setConfirmingDelete(false);
      if (initialEvent) {
        // Editar: siempre un único horario, el del bloque que se tocó.
        setSlots([
          {
            key: initialEvent.id,
            dayIndex: initialEvent.dayIndex,
            startTime: initialEvent.startTime,
            endTime: initialEvent.endTime,
          },
        ]);
      } else {
        setSlots([makeSlot()]);
      }
    }
  }, [visible, initialEvent]);

  function updateSlot(key: string, changes: Partial<ScheduleSlot>) {
    setSlots((prev) => prev.map((s) => (s.key === key ? { ...s, ...changes } : s)));
  }

  function addSlot() {
    const lastDay = slots[slots.length - 1]?.dayIndex ?? 0;
    setSlots((prev) => [...prev, makeSlot(Math.min(lastDay + 1, 6))]);
  }

  function removeSlot(key: string) {
    setSlots((prev) => (prev.length > 1 ? prev.filter((s) => s.key !== key) : prev));
  }

  function handleSave() {
    if (!title.trim()) {
      setError('Ingresa un nombre para la clase.');
      return;
    }
    for (const slot of slots) {
      if (!isEndAfterStart(slot.startTime, slot.endTime)) {
        setError('La hora de fin debe ser posterior a la de inicio en todos los horarios.');
        return;
      }
    }

    // Que no se superpongan entre sí los horarios que se están agregando ahora mismo
    for (let i = 0; i < slots.length; i++) {
      for (let j = i + 1; j < slots.length; j++) {
        if (
          slots[i].dayIndex === slots[j].dayIndex &&
          doTimesOverlap(slots[i].startTime, slots[i].endTime, slots[j].startTime, slots[j].endTime)
        ) {
          setError(`Los horarios ${i + 1} y ${j + 1} se superponen entre sí.`);
          return;
        }
      }
    }

    // Que no se superpongan con una clase ya existente (excluyendo la que se está editando)
    for (const slot of slots) {
      const conflict = events.find(
        (e) =>
          e.id !== initialEvent?.id &&
          e.dayIndex === slot.dayIndex &&
          doTimesOverlap(slot.startTime, slot.endTime, e.startTime, e.endTime)
      );
      if (conflict) {
        setError(`Ya existe "${conflict.title}" ese día en ese horario.`);
        return;
      }
    }

    const newEvents: ClassEvent[] = slots.map((slot, idx) => ({
      id: isEditing && idx === 0 ? initialEvent!.id : makeId(),
      title: title.trim(),
      dayIndex: slot.dayIndex,
      startTime: slot.startTime,
      endTime: slot.endTime,
      color,
    }));
    onSave(newEvents);
  }

  function handleConfirmDelete() {
    if (!initialEvent) return;
    onDelete(initialEvent.id);
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
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

            {slots.map((slot, idx) => (
              <View key={slot.key} style={styles.slotBlock}>
                {slots.length > 1 && (
                  <View style={styles.slotHeaderRow}>
                    <Text style={styles.slotHeaderText}>Horario {idx + 1}</Text>
                    <Pressable onPress={() => removeSlot(slot.key)} hitSlop={8}>
                      <Text style={styles.removeSlotText}>Quitar ✕</Text>
                    </Pressable>
                  </View>
                )}

                <Text style={styles.label}>Día</Text>
                <View style={styles.chipRow}>
                  {DAYS_FULL.map((day, dayIdx) => (
                    <Pressable
                      key={day}
                      onPress={() => updateSlot(slot.key, { dayIndex: dayIdx })}
                      style={[styles.chip, slot.dayIndex === dayIdx && styles.chipSelected]}
                    >
                      <Text style={[styles.chipText, slot.dayIndex === dayIdx && styles.chipTextSelected]}>
                        {day.slice(0, 3)}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <View style={styles.timeRow}>
                  <View style={styles.timeField}>
                    <Text style={styles.label}>Inicio</Text>
                    <TimePickerField
                      value={slot.startTime}
                      onChange={(t) => updateSlot(slot.key, { startTime: t })}
                    />
                  </View>
                  <View style={styles.timeField}>
                    <Text style={styles.label}>Fin</Text>
                    <TimePickerField
                      value={slot.endTime}
                      onChange={(t) => updateSlot(slot.key, { endTime: t })}
                    />
                  </View>
                </View>
              </View>
            ))}

            {!isEditing && (
              <Pressable style={styles.addSlotButton} onPress={addSlot}>
                <Text style={styles.addSlotButtonText}>+ Agregar otro horario</Text>
              </Pressable>
            )}

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
                  ¿Seguro que quieres eliminar "{initialEvent?.title}"?
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
  backdrop: {
    flex: 1,
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
  slotBlock: {
    marginTop: 8,
    paddingTop: 8,
  },
  slotHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.gridLine,
    paddingTop: 12,
  },
  slotHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  removeSlotText: {
    fontSize: 13,
    color: COLORS.danger,
    fontWeight: '600',
  },
  addSlotButton: {
    marginTop: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
  },
  addSlotButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
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
