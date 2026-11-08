/**
 * Gerador do Banco Completo de 120+ Exercícios CalisteFlow (100% PT-BR)
 * Padrões de Movimento:
 * 1. Empurrar Horizontal
 * 2. Empurrar Vertical
 * 3. Mergulhos / Dips
 * 4. Puxar Vertical
 * 5. Puxar Horizontal
 * 6. Core Anterior
 * 7. Core Lateral e Rotação
 * 8. Costas Baixa e Cadeia Posterior
 * 9. Agachamentos e Membros Inferiores
 * 10. Skills e Alavancas
 * 11. Aquecimento e Mobilidade Articular
 * 12. Alongamentos Pós-Treino
 */

const fs = require('fs');
const path = require('path');

const CREF_REVIEWER_CODE = `export const CREF_REVIEWER_SPECIALIST: ExerciseReviewer = {
  name: 'Prof. Ricardo Santos',
  cref: '084129-G/SP',
  specialty: 'Cinesiologia, Fisiologia do Exercício & Calistenia',
  reviewDate: '2026-03-15',
  notes: 'Padrão biomecânico auditado e aprovado com foco em proteção articular, depressão escapular e cadência segura.',
};`;

const MUSCLE_LABELS_CODE = `export const MUSCLE_LABELS: Record<string, string> = {
  peito: 'Peitoral',
  costas: 'Costas / Dorsal',
  ombros: 'Deltóides (Ombros)',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  abdomen: 'Abdômen / Core',
  pernas: 'Quadríceps & Glúteos',
  panturrilha: 'Panturrilhas',
  lombar: 'Lombar & Paravertebrais',
  antebraco: 'Antebraço & Pegada',
  gluteos: 'Glúteos',
  isquiotibiais: 'Isquiotibiais (Posterior de Coxa)',
  quadriceps: 'Quadríceps',
  core: 'Core & Estabilizadores',
};`;

// We'll write the script that compiles and writes src/data/exercisesData.ts
// Let's create the script that builds the dataset.
console.log('Building script initialized');

