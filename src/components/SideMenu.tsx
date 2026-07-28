import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { COLORS, GRID_COLOR_OPTIONS, BACKGROUND_COLOR_OPTIONS } from '../constants/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  gridColor: string;
  backgroundColor: string;
  onChangeGridColor: (color: string) => void;
  onChangeBackgroundColor: (color: string) => void;
}

export default function SideMenu({
  visible,
  onClose,
  gridColor,
  backgroundColor,
  onChangeGridColor,
  onChangeBackgroundColor,
}: Props) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>       
        <View style={styles.panel}>
          <ScrollView>
            <Text style={styles.title}>Menú</Text>

            <Text style={styles.sectionTitle}>Diseño</Text>

            <Text style={styles.label}>Color de líneas de la grilla</Text>
            <View style={styles.swatchRow}>
              {GRID_COLOR_OPTIONS.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => onChangeGridColor(c)}
                  style={[
                    styles.swatch,
                    { backgroundColor: c },
                    gridColor === c && styles.swatchSelected,
                  ]}
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
          </ScrollView>

          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </Pressable>
        </View>
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
    width: '78%',
    maxWidth: 320,
    height: '100%',
    backgroundColor: COLORS.surface,
    padding: 20,
    paddingTop: 48,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 12,
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
  closeButton: {
    marginTop: 20,
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
