import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { COLORS, DEFAULT_APPEARANCE, GRID_COLOR_OPTIONS, BACKGROUND_COLOR_OPTIONS } from '../constants/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  gridColor: string;
  backgroundColor: string;
  onChangeGridColor: (color: string) => void;
  onChangeBackgroundColor: (color: string) => void;
  onClearAll: () => void;
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
}: Props) {
  const [rendered, setRendered] = useState(false);
  const [screen, setScreen] = useState<MenuScreen>('main');
  const [confirmingClear, setConfirmingClear] = useState(false);
  const translateX = useRef(new Animated.Value(-PANEL_WIDTH)).current;

  useEffect(() => {
    if (visible) {
      setRendered(true);
      setScreen('main');
      setConfirmingClear(false);
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

  return (
    <Modal visible={rendered} animationType="none" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.panel, { width: PANEL_WIDTH, transform: [{ translateX }] }]}>
          <ScrollView>
            {screen === 'main' && (
              <>
                <Text style={styles.title}>Menú</Text>

                <Pressable style={styles.menuRow} onPress={() => setScreen('colors')}>
                  <Text style={styles.menuRowText}>Ajustar colores</Text>
                  <Text style={styles.chevron}>›</Text>
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
