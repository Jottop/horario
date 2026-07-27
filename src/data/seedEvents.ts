import { ClassEvent } from '../types';
import { PALETTE } from '../constants/theme';

// Datos aproximados a partir de la imagen de referencia.
// Podés editarlos o borrarlos libremente desde la app.
export const seedEvents: ClassEvent[] = [
  // Lunes
  { id: 'seed-1', title: 'Sistemas Ambientales', dayIndex: 0, startTime: '12:00', endTime: '13:30', color: PALETTE[0] },
  { id: 'seed-2', title: 'Bioestadística', dayIndex: 0, startTime: '14:30', endTime: '17:45', color: PALETTE[3] },

  // Martes
  { id: 'seed-3', title: 'Lab Mary Kalin', dayIndex: 1, startTime: '10:15', endTime: '13:30', color: PALETTE[1] },
  { id: 'seed-4', title: 'Gym', dayIndex: 1, startTime: '14:30', endTime: '15:30', color: PALETTE[1] },

  // Miércoles
  { id: 'seed-5', title: 'Sist. Amb.', dayIndex: 2, startTime: '09:00', endTime: '10:00', color: PALETTE[0] },
  { id: 'seed-6', title: 'Zoología Funcional', dayIndex: 2, startTime: '10:15', endTime: '13:30', color: PALETTE[2] },
  { id: 'seed-7', title: 'Gym', dayIndex: 2, startTime: '14:30', endTime: '15:30', color: PALETTE[1] },
  { id: 'seed-8', title: 'A. Zoología Funcional', dayIndex: 2, startTime: '16:15', endTime: '17:45', color: PALETTE[2] },
  { id: 'seed-9', title: 'Tierra, Mar y Atmósfera', dayIndex: 2, startTime: '18:00', endTime: '19:30', color: PALETTE[4] },

  // Jueves
  { id: 'seed-10', title: 'Sist. Amb.', dayIndex: 3, startTime: '09:00', endTime: '10:00', color: PALETTE[0] },
  { id: 'seed-11', title: 'Zoología Funcional', dayIndex: 3, startTime: '10:15', endTime: '13:30', color: PALETTE[2] },
  { id: 'seed-12', title: 'A. Zoología Funcional', dayIndex: 3, startTime: '16:15', endTime: '17:45', color: PALETTE[2] },
  { id: 'seed-13', title: 'Psicóloga', dayIndex: 3, startTime: '19:00', endTime: '20:00', color: PALETTE[5] },
  { id: 'seed-14', title: 'Gym', dayIndex: 3, startTime: '21:00', endTime: '22:00', color: PALETTE[1] },

  // Viernes
  { id: 'seed-15', title: 'A. Bioestadística', dayIndex: 4, startTime: '10:15', endTime: '11:45', color: PALETTE[3] },
  { id: 'seed-16', title: 'Pasantía', dayIndex: 4, startTime: '14:30', endTime: '17:00', color: PALETTE[1] },
];
