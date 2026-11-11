import type { WorkoutStats, WorkoutSession, PersonalRecord } from '../types';
import type { Achievement, UserProgramEnrollment, UserSkillProgress } from '../types/gamification';

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  category: Achievement['category'];
  icon: string;
  badgeColor: string;
  criterionText: string;
  xpReward: number;
  evaluate: (context: {
    stats: WorkoutStats;
    history: WorkoutSession[];
    prs: Record<string, PersonalRecord>;
    skills: Record<string, UserSkillProgress>;
    programs: UserProgramEnrollment[];
  }) => {
    unlocked: boolean;
    currentValue: number;
    targetValue: number;
    progressPercent: number;
  };
}

export const ACHIEVEMENTS_DEFINITIONS: AchievementDefinition[] = [
  {
    id: 'ach_first_workout',
    title: 'Primeiro Passo',
    description: 'Concluiu seu primeiro treino oficial no CalisteFlow.',
    category: 'treino',
    icon: '🚀',
    badgeColor: 'from-emerald-400 to-teal-500',
    criterionText: 'Concluir 1 sessão de treino no Modo Treinamento',
    xpReward: 100,
    evaluate: ({ history }) => {
      const count = history.length;
      return {
        unlocked: count >= 1,
        currentValue: count,
        targetValue: 1,
        progressPercent: Math.min(100, (count / 1) * 100),
      };
    },
  },
  {
    id: 'ach_first_pushup',
    title: 'Força no Solo',
    description: 'Registrou sua primeira série válida de flexões de braço.',
    category: 'forca',
    icon: '⚡',
    badgeColor: 'from-amber-400 to-orange-500',
    criterionText: 'Completar ao menos 1 repetição de flexão em sessão registrada',
    xpReward: 150,
    evaluate: ({ history }) => {
      const hasPushup = history.some(s =>
        s.exercises?.some(
          e =>
            (e.exerciseId.includes('pushup') || e.exerciseId.includes('flexao')) &&
            e.sets?.some(st => (st.completedReps || 0) > 0)
        )
      );
      return {
        unlocked: hasPushup,
        currentValue: hasPushup ? 1 : 0,
        targetValue: 1,
        progressPercent: hasPushup ? 100 : 0,
      };
    },
  },
  {
    id: 'ach_first_pullup',
    title: 'Erguendo o Próprio Peso',
    description: 'Registrou sua primeira repetição válida na barra fixa.',
    category: 'forca',
    icon: '🧗',
    badgeColor: 'from-cyan-400 to-blue-500',
    criterionText: 'Completar ao menos 1 repetição de barra fixa em treino registrado',
    xpReward: 250,
    evaluate: ({ history }) => {
      const hasPullup = history.some(s =>
        s.exercises?.some(
          e =>
            (e.exerciseId === 'pullup' || e.exerciseId.includes('barra-fixa')) &&
            e.sets?.some(st => (st.completedReps || 0) > 0)
        )
      );
      return {
        unlocked: hasPullup,
        currentValue: hasPullup ? 1 : 0,
        targetValue: 1,
        progressPercent: hasPullup ? 100 : 0,
      };
    },
  },
  {
    id: 'ach_10_workouts',
    title: 'Calistênico Dedicado',
    description: 'Completou 10 sessões oficiais de treino.',
    category: 'treino',
    icon: '🔥',
    badgeColor: 'from-rose-500 to-red-600',
    criterionText: 'Alcançar 10 treinos concluídos no histórico',
    xpReward: 300,
    evaluate: ({ history }) => {
      const count = history.length;
      return {
        unlocked: count >= 10,
        currentValue: count,
        targetValue: 10,
        progressPercent: Math.min(100, Math.round((count / 10) * 100)),
      };
    },
  },
  {
    id: 'ach_50_workouts',
    title: 'Corpo de Ferro',
    description: 'Completou 50 sessões oficiais de treinamento.',
    category: 'treino',
    icon: '🛡️',
    badgeColor: 'from-amber-500 to-yellow-600',
    criterionText: 'Alcançar 50 treinos concluídos no histórico',
    xpReward: 1000,
    evaluate: ({ history }) => {
      const count = history.length;
      return {
        unlocked: count >= 50,
        currentValue: count,
        targetValue: 50,
        progressPercent: Math.min(100, Math.round((count / 50) * 100)),
      };
    },
  },
  {
    id: 'ach_streak_7d',
    title: 'Ritmo Inabalável',
    description: 'Manteve 7 dias consecutivos de consistência ou treinos programados.',
    category: 'consistencia',
    icon: '📅',
    badgeColor: 'from-emerald-400 to-green-600',
    criterionText: 'Alcançar streak de 7 dias',
    xpReward: 250,
    evaluate: ({ stats }) => {
      const streak = stats.currentStreakDays || 0;
      return {
        unlocked: streak >= 7,
        currentValue: streak,
        targetValue: 7,
        progressPercent: Math.min(100, Math.round((streak / 7) * 100)),
      };
    },
  },
  {
    id: 'ach_streak_30d',
    title: 'Disciplina Espartana',
    description: '30 dias ininterruptos de consistência nos treinos e hábitos de calistenia.',
    category: 'consistencia',
    icon: '👑',
    badgeColor: 'from-purple-500 to-indigo-600',
    criterionText: 'Alcançar streak de 30 dias',
    xpReward: 800,
    evaluate: ({ stats }) => {
      const streak = stats.currentStreakDays || 0;
      return {
        unlocked: streak >= 30,
        currentValue: streak,
        targetValue: 30,
        progressPercent: Math.min(100, Math.round((streak / 30) * 100)),
      };
    },
  },
  {
    id: 'ach_first_pr',
    title: 'Superando Limites',
    description: 'Bateu seu primeiro Recorde Pessoal (PR) em repetições ou tempo.',
    category: 'forca',
    icon: '🏆',
    badgeColor: 'from-amber-400 to-yellow-500',
    criterionText: 'Registrar ao menos 1 recorde pessoal na aba de PRs',
    xpReward: 200,
    evaluate: ({ prs }) => {
      const count = Object.keys(prs).length;
      return {
        unlocked: count >= 1,
        currentValue: count,
        targetValue: 1,
        progressPercent: count >= 1 ? 100 : 0,
      };
    },
  },
  {
    id: 'ach_5_prs',
    title: 'Colecionador de PRs',
    description: 'Conquistou recordes pessoais em 5 exercícios diferentes.',
    category: 'forca',
    icon: '🌟',
    badgeColor: 'from-cyan-400 to-teal-500',
    criterionText: 'Possuir 5 recordes pessoais distintos ativos',
    xpReward: 500,
    evaluate: ({ prs }) => {
      const count = Object.keys(prs).length;
      return {
        unlocked: count >= 5,
        currentValue: count,
        targetValue: 5,
        progressPercent: Math.min(100, Math.round((count / 5) * 100)),
      };
    },
  },
  {
    id: 'ach_first_skill',
    title: 'Novo Repertório',
    description: 'Dominou sua primeira habilidade na Árvore de Skills.',
    category: 'habilidade',
    icon: '🥋',
    badgeColor: 'from-blue-500 to-indigo-600',
    criterionText: 'Atingir o status "Dominado" em ao menos 1 skill',
    xpReward: 300,
    evaluate: ({ skills }) => {
      const mastered = Object.values(skills).filter(s => s.status === 'mastered').length;
      return {
        unlocked: mastered >= 1,
        currentValue: mastered,
        targetValue: 1,
        progressPercent: mastered >= 1 ? 100 : 0,
      };
    },
  },
  {
    id: 'ach_3_skills',
    title: 'Polímata da Calistenia',
    description: 'Dominou 3 habilidades motoras distintas.',
    category: 'habilidade',
    icon: '🎯',
    badgeColor: 'from-purple-500 to-pink-600',
    criterionText: 'Dominar 3 habilidades na árvore de progressões',
    xpReward: 600,
    evaluate: ({ skills }) => {
      const mastered = Object.values(skills).filter(s => s.status === 'mastered').length;
      return {
        unlocked: mastered >= 3,
        currentValue: mastered,
        targetValue: 3,
        progressPercent: Math.min(100, Math.round((mastered / 3) * 100)),
      };
    },
  },
  {
    id: 'ach_first_program',
    title: 'Compromisso Selado',
    description: 'Concluiu com sucesso um programa estruturado de várias semanas.',
    category: 'treino',
    icon: '📜',
    badgeColor: 'from-emerald-500 to-teal-600',
    criterionText: 'Completar 1 programa estruturado oficial',
    xpReward: 700,
    evaluate: ({ programs }) => {
      const completed = programs.filter(p => p.status === 'completed').length;
      return {
        unlocked: completed >= 1,
        currentValue: completed,
        targetValue: 1,
        progressPercent: completed >= 1 ? 100 : 0,
      };
    },
  },
  {
    id: 'ach_centurion_pushups',
    title: 'Centurião das Flexões',
    description: 'Acumulou mais de 100 repetições de flexões somadas nos treinos.',
    category: 'forca',
    icon: '💯',
    badgeColor: 'from-orange-500 to-amber-600',
    criterionText: 'Acumular 100 repetições totais de flexão no histórico',
    xpReward: 350,
    evaluate: ({ history }) => {
      let totalReps = 0;
      for (const s of history) {
        if (!s.exercises) continue;
        for (const e of s.exercises) {
          if (e.exerciseId.includes('pushup') || e.exerciseId.includes('flexao')) {
            for (const st of e.sets || []) {
              totalReps += st.completedReps || 0;
            }
          }
        }
      }
      return {
        unlocked: totalReps >= 100,
        currentValue: totalReps,
        targetValue: 100,
        progressPercent: Math.min(100, Math.round((totalReps / 100) * 100)),
      };
    },
  },
  {
    id: 'ach_lever_master',
    title: 'Mestre das Alavancas',
    description: 'Dominou Front Lever, Back Lever ou Planche.',
    category: 'habilidade',
    icon: '🏛️',
    badgeColor: 'from-indigo-600 to-violet-800',
    criterionText: 'Dominar ao menos 1 movimento estático de elite',
    xpReward: 1200,
    evaluate: ({ skills }) => {
      const leverSkills = ['sk_front_lever', 'sk_back_lever', 'sk_planche', 'sk_human_flag'];
      const hasMastered = leverSkills.some(id => skills[id]?.status === 'mastered');
      return {
        unlocked: hasMastered,
        currentValue: hasMastered ? 1 : 0,
        targetValue: 1,
        progressPercent: hasMastered ? 100 : 0,
      };
    },
  },
  {
    id: 'ach_posture_guardian',
    title: 'Guardião da Articulação',
    description: 'Concluiu 5 sessões contendo mobilidade ou alongamentos restaurativos.',
    category: 'mobilidade',
    icon: '🧘',
    badgeColor: 'from-teal-400 to-emerald-500',
    criterionText: 'Completar 5 sessões de mobilidade ou recuperação ativa',
    xpReward: 300,
    evaluate: ({ history }) => {
      const mobilitySessions = history.filter(s =>
        s.exercises?.some(
          e =>
            e.exerciseId.includes('alongamento') ||
            e.exerciseId.includes('mobilidade') ||
            e.exerciseId.includes('punho') ||
            e.exerciseId.includes('dead-hang')
        )
      ).length;
      return {
        unlocked: mobilitySessions >= 5,
        currentValue: mobilitySessions,
        targetValue: 5,
        progressPercent: Math.min(100, Math.round((mobilitySessions / 5) * 100)),
      };
    },
  },
  {
    id: 'ach_explosive_master',
    title: 'Disparo Balístico',
    description: 'Dominou flexões com palmas ou barra fixa explosiva ao peito.',
    category: 'forca',
    icon: '💥',
    badgeColor: 'from-yellow-400 to-red-500',
    criterionText: 'Dominar ao menos 1 skill explosiva',
    xpReward: 500,
    evaluate: ({ skills }) => {
      const explosiveSkills = ['sk_clap_pushup', 'sk_high_pullup', 'sk_muscleup'];
      const hasExplosive = explosiveSkills.some(id => skills[id]?.status === 'mastered');
      return {
        unlocked: hasExplosive,
        currentValue: hasExplosive ? 1 : 0,
        targetValue: 1,
        progressPercent: hasExplosive ? 100 : 0,
      };
    },
  },
];
