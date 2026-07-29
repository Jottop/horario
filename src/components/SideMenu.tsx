import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Schedule } from '../types';
import { COLORS, DEFAULT_APPEARANCE, GRID_COLOR_OPTIONS, BACKGROUND_COLOR_OPTIONS } from '../constants/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  gridColor: string;
  backgroundColor: string;
  onChangeGridColor: (color: string) => void;
  onChangeBackgroundColor: (color: string) => void;
  onClearAll: () => void;
  onScreenshot: () => void;
  schedules: Schedule[];
  activeScheduleId: string;
  onSwitchSchedule: (id: string) => void;
  onCreateSchedule: (name: string) => void;
  onRenameSchedule: (id: string, name: string) => void;
  onDeleteSchedule: (id: string) => void;
}

type MenuScreen = 'main' | 'colors';

const PANEL_WIDTH = Math.min(320, Dimensions.get('window').width * 0.78);

export default function SideMenu({
  visible,
  onClose,
  gridColor,
  backgroundColor,
  onChangeGridColor,
  onChangeBackgroundColor,
  onClearAll,
  onScreenshot,
  schedules,
  activeScheduleId,
  onSwitchSchedule,
  onCreateSchedule,
  onRenameSchedule,
  onDeleteSchedule,
}: Props) {
  const [rendered, setRendered] = useState(false);
  const [screen, setScreen] = useState<MenuScreen>('main');
  const [confirmingClear, setConfirmingClear] = useState(false);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [creatingNew, setCreatingNew] = useState(false);
  const [newScheduleName, setNewScheduleName] = useState('');
  const translateX = useRef(new Animated.Value(-PANEL_WIDTH)).current;

  useEffect(() => {
    if (visible) {
      setRendered(true);
      setScreen('main');
      setConfirmingClear(false);
      setConfirmingDeleteId(null);
      setEditingId(null);
      setCreatingNew(false);
      Animated.timing(translateX, { toValue: 0, duration: 240, useNativeDriver: true }).start();
    } else if (rendered) {
      Animated.timing(translateX, { toValue: -PANEL_WIDTH, duration: 200, useNativeDriver: true }).start(() => {
        setRendered(false);
      });
    }
  }, [visible]);

  function handleClearConfirm() {
    onClearAll();
    setConfirmingClear(false);
    onClose();
  }

  function handleResetColors() {
    onChangeGridColor(DEFAULT_APPEARANCE.gridColor);
    onChangeBackgroundColor(DEFAULT_APPEARANCE.backgroundColor);
  }

  function handleSwitch(id: string) {
    if (id !== activeScheduleId) onSwitchSchedule(id);
  }

  function startRename(s: Schedule) {
    setEditingId(s.id);
    setEditingName(s.name);
  }

  function confirmRename() {
    if (editingId) onRenameSchedule(editingId, editingName);
    setEditingId(null);
  }

  function confirmCreate() {
    onCreateSchedule(newScheduleName);
    setCreatingNew(false);
    setNewScheduleName('');
  }

  return (
    <Modal visible={rendered} animationType="none" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.panel, { width: PANEL_WIDTH, transform: [{ translateX }] }]}>
          <ScrollView>
            {screen === 'main' && (
              <>
                <Text style={styles.title}>Menú</Text>

                <Text style={styles.sectionLabel}>Horarios</Text>
                {schedules.map((s) => (
                  <View key={s.id} style={styles.scheduleBlock}>
                    {editingId === s.id ? (
                      <View style={styles.inlineFormRow}>
                        <TextInput
                          style={styles.inlineInput}
                          value={editingName}
                          onChangeText={setEditingName}
                          autoFocus
                          placeholder="Nombre del horario"
                          placeholderTextColor={COLORS.textLight}
                        />
                        <Pressable onPress={confirmRename} hitSlop={8}>
                          <Text style={styles.inlineActionText}>Guardar</Text>
                        </Pressable>
                        <Pressable onPress={() => setEditingId(null)} hitSlop={8}>
                          <Text style={[styles.inlineActionText, styles.inlineActionMuted]}>Cancelar</Text>
                        </Pressable>
                      </View>
                    ) : (
                      <View style={styles.scheduleRow}>
                        <Pressable style={styles.scheduleMain} onPress={() => handleSwitch(s.id)}>
                          <Text style={[styles.radioDot, s.id === activeScheduleId && { color: COLORS.primary }]}>
                            {s.id === activeScheduleId ? '●' : '○'}
                          </Text>
                          <Text
                            style={[
                              styles.scheduleName,
                              s.id === activeScheduleId && styles.scheduleNameActive,
                            ]}
                            numberOfLines={1}
                          >
                            {s.name}
                          </Text>
                        </Pressable>
                        <Pressable onPress={() => startRename(s)} hitSlop={8}>
                          <Text style={styles.iconButton}>✎</Text>
                        </Pressable>
                        {schedules.length > 1 && (
                          <Pressable onPress={() => setConfirmingDeleteId(s.id)} hitSlop={8}>
                            <Text style={[styles.iconButton, styles.dangerText]}>🗑</Text>
                          </Pressable>
                        )}
                      </View>
                    )}

                    {confirmingDeleteId === s.id && (
                      <View style={styles.confirmBox}>
                        <Text style={styles.confirmText}>
                          ¿Eliminar el horario "{s.name}"? Se perderán todas sus clases.
                        </Text>
                        <View style={styles.confirmActionsRow}>
                          <Pressable
                            style={[styles.smallButton, styles.cancelButton]}
                            onPress={() => setConfirmingDeleteId(null)}
                          >
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                          </Pressable>
                          <Pressable
                            style={[styles.smallButton, styles.dangerButton]}
                            onPress={() => {
                              onDeleteSchedule(s.id);
                              setConfirmingDeleteId(null);
                            }}
                          >
                            <Text style={styles.confirmButtonText}>Sí, eliminar</Text>
                          </Pressable>
                        </View>
                      </View>
                    )}
                  </View>
                ))}

                {!creatingNew ? (
                  <Pressable style={styles.addScheduleRow} onPress={() => setCreatingNew(true)}>
                    <Text style={styles.addScheduleIcon}>+</Text>
                    <Text style={styles.addScheduleButtonText}>Crear nuevo horario</Text>
                  </Pressable>
                ) : (
                  <View style={[styles.inlineFormRow, { marginTop: 4 }]}>
                    <TextInput
                      style={styles.inlineInput}
                      value={newScheduleName}
                      onChangeText={setNewScheduleName}
                      autoFocus
                      placeholder="Ej: Semestre B"
                      placeholderTextColor={COLORS.textLight}
                    />
                    <Pressable onPress={confirmCreate} hitSlop={8}>
                      <Text style={styles.inlineActionText}>Crear</Text>
                    </Pressable>
                    <Pressable onPress={() => setCreatingNew(false)} hitSlop={8}>
                      <Text style={[styles.inlineActionText, styles.inlineActionMuted]}>Cancelar</Text>
                    </Pressable>
                  </View>
                )}

                <View style={styles.sectionDivider} />

                <Pressable style={styles.menuRow} onPress={() => setScreen('colors')}>
                  <Text style={styles.menuRowText}>Ajustar colores</Text>
                  <Text style={styles.chevron}>›</Text>
                </Pressable>

                <Pressable style={styles.menuRow} onPress={onScreenshot}>
                  <Text style={styles.menuRowText}>Capturar horario</Text>
                </Pressable>

                {!confirmingClear ? (
                  <Pressable style={styles.menuRow} onPress={() => setConfirmingClear(true)}>
                    <Text style={[styles.menuRowText, styles.dangerText]}>Limpiar horario</Text>
                  </Pressable>
                ) : (
                  <View style={styles.confirmBox}>
                    <Text style={styles.confirmText}>
                      ¿Eliminar todas las clases del calendario? Esta acción no se puede deshacer.
                    </Text>
                    <View style={styles.confirmActionsRow}>
                      <Pressable style={[styles.smallButton, styles.cancelButton]} onPress={() => setConfirmingClear(false)}>
                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                      </Pressable>
                      <Pressable style={[styles.smallButton, styles.dangerButton]} onPress={handleClearConfirm}>
                        <Text style={styles.confirmButtonText}>Sí, limpiar</Text>
                      </Pressable>
                    </View>
                  </View>
                )}
              </>
            )}

            {screen === 'colors' && (
              <>
                <Pressable style={styles.backRow} onPress={() => setScreen('main')}>
                  <Text style={styles.chevronBack}>‹</Text>
                  <Text style={styles.backText}>Menú</Text>
                </Pressable>

                <Text style={styles.title}>Ajustar colores</Text>

                <Text style={styles.label}>Color de líneas de la grilla</Text>
                <View style={styles.swatchRow}>
                  {GRID_COLOR_OPTIONS.map((c) => (
                    <Pressable
                      key={c}
                      onPress={() => onChangeGridColor(c)}
                      style={[styles.swatch, { backgroundColor: c }, gridColor === c && styles.swatchSelected]}
                    />
                  ))}
                </View>

                <Text style={[styles.label, { marginTop: 20 }]}>Color de fondo</Text>
                <View style={styles.swatchRow}>
                  {BACKGROUND_COLOR_OPTIONS.map((c) => (
                    <Pressable
                      key={c}
                      onPress={() => onChangeBackgroundColor(c)}
                      style={[
                        styles.swatch,
                        styles.swatchBordered,
                        { backgroundColor: c },
                        backgroundColor === c && styles.swatchSelected,
                      ]}
                    />
                  ))}
                </View>

                <Pressable style={styles.resetButton} onPress={handleResetColors}>
                  <Text style={styles.resetButtonText}>Restablecer colores</Text>
                </Pressable>

                <Text style={[styles.label, { marginTop: 20 }]}>Vista previa</Text>
                <View style={[styles.previewBox, { backgroundColor, borderColor: gridColor }]}>
                  {[0.25, 0.5, 0.75].map((f) => (
                    <View
                      key={`h-${f}`}
                      style={[styles.previewHLine, { top: `${f * 100}%`, backgroundColor: gridColor }]}
                    />
                  ))}
                  {[1 / 3, 2 / 3].map((f) => (
                    <View
                      key={`v-${f}`}
                      style={[styles.previewVLine, { left: `${f * 100}%`, backgroundColor: gridColor }]}
                    />
                  ))}
                </View>
              </>
            )}
          </ScrollView>

          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </Pressable>
        </Animated.View>

        <Pressable style={styles.overlayTapArea} onPress={onClose} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.overlay,
  },
  overlayTapArea: {
    flex: 1,
  },
  panel: {
    height: '100%',
    backgroundColor: COLORS.surface,
    padding: 20,
    paddingTop: 48,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: COLORS.gridLine,
    marginVertical: 16,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gridLine,
  },
  menuRowText: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '500',
  },
  chevron: {
    fontSize: 20,
    color: COLORS.textLight,
  },
  dangerText: {
    color: COLORS.danger,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  chevronBack: {
    fontSize: 20,
    color: COLORS.primary,
    marginRight: 4,
  },
  backText: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: '600',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: 10,
  },
  swatchRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  swatchBordered: {
    borderColor: COLORS.gridLine,
  },
  swatchSelected: {
    borderColor: COLORS.primary,
  },
  resetButton: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.gridLine,
    alignItems: 'center',
  },
  resetButtonText: {
    color: COLORS.text,
    fontWeight: '600',
  },
  previewBox: {
    height: 110,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  previewHLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
  },
  previewVLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
  },
  scheduleBlock: {
    marginBottom: 4,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gridLine,
    gap: 10,
  },
  scheduleMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  radioDot: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  scheduleName: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '500',
  },
  scheduleNameActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  iconButton: {
    fontSize: 16,
    color: COLORS.textLight,
    paddingHorizontal: 4,
  },
  inlineFormRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  inlineInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.gridLine,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: COLORS.text,
    backgroundColor: '#FFFFFF',
  },
  inlineActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  inlineActionMuted: {
    color: COLORS.textLight,
    fontWeight: '600',
  },
  addScheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
  },
  addScheduleIcon: {
    fontSize: 18,
    color: COLORS.primary,
    width: 18,
    textAlign: 'center',
  },
  addScheduleButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 15,
  },
  confirmBox: {
    marginTop: 4,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#FBEAEA',
  },
  confirmText: {
    color: COLORS.text,
    fontSize: 13,
    marginBottom: 10,
  },
  confirmActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  smallButton: {
    flex: 1,
    paddingVertical: 10,
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
  dangerButton: {
    backgroundColor: COLORS.danger,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  closeButton: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.gridLine,
    alignItems: 'center',
  },
  closeButtonText: {
    color: COLORS.text,
    fontWeight: '600',
  },
});
