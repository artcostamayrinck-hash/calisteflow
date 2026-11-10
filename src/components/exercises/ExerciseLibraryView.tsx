import { useState, useMemo, useRef, useEffect } from 'react';
import type { Exercise, MuscleGroup, MovementPattern, ExerciseDifficulty, EquipmentType, ExercisePhase } from '../../types';
import { BASE_EXERCISES, MUSCLE_LABELS, MUSCLE_DEFINITIONS, getExerciseById, CREF_REVIEWER_SPECIALIST } from '../../data/exercisesData';
import { MuscleMap } from '../visuals/MuscleMap';
import { ExerciseVideoPlayer } from '../workout/ExerciseVideoPlayer';
import { ExerciseMedia } from '../visuals/figure/ExerciseMedia';
import { ExerciseGalleryModal } from '../visuals/figure/ExerciseGalleryModal';
import { StyleComparisonGalleryModal } from '../visuals/figure/StyleComparisonGalleryModal';
import { BiomechanicsInspectorModal } from '../visuals/figure/BiomechanicsInspectorModal';
import { soundManager } from '../../utils/audio';
import { useBodyScrollLock } from '../../utils/useBodyScrollLock';
import { isFuzzyMatch } from '../../utils/fuzzySearch';
import {
  getFavoriteExerciseIds,
  toggleFavoriteExercise,
  getRecentExerciseIds,
  addRecentExercise,
} from '../../utils/storage';
import { SkillTreeModal } from '../skills/SkillTreeModal';
import {
  Search,
  Filter,
  Dumbbell,
  Sparkles,
  X,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Timer,
  Activity,
  Layers,
  Star,
  Clock,
  Flame,
  Target,
  Compass,
} from 'lucide-react';

interface ExerciseLibraryViewProps {
  initialExerciseId?: string | null;
  onSelectExerciseToSwap?: (exercise: Exercise) => void;
}

type ModalTab = 'como_fazer' | 'erros' | 'regressoes' | 'progressoes' | 'variacoes' | 'adaptacoes' | 'revisao';

const MOVEMENT_PATTERN_LABELS: Record<MovementPattern, string> = {
  'empurrar-horizontal': 'Empurrar Horizontal',
  'empurrar-vertical': 'Empurrar Vertical',
  'mergulhos': 'Mergulhos',
  'puxar-vertical': 'Puxar Vertical',
  'puxar-horizontal': 'Puxar Horizontal',
  'core-anterior': 'Core Anterior',
  'core-lateral': 'Core Lateral',
  'costas-baixa': 'Cadeia Posterior',
  'agachamento-pernas': 'Pernas & Agachamentos',
  'skills': 'Skills & Isometrias',
  'aquecimento': 'Aquecimento & Mobilidade',
  'alongamento': 'Alongamento & Relaxamento'
};

export const PHASE_LABELS: Record<ExercisePhase, { label: string; short: string; description: string }> = {
  aquecimento: {
    label: 'Aquecimento',
    short: 'Aquec.',
    description: 'Mobilidade articular e ativação neuromuscular'
  },
  treino: {
    label: 'Treino',
    short: 'Treino',
    description: 'Força, hipertrofia e habilidades'
  },
  alongamento: {
    label: 'Alongamento',
    short: 'Along.',
    description: 'Flexibilidade e relaxamento miofascial'
  }
};

export type WarmupJointRegion = 'Todos' | 'punho' | 'ombro' | 'escapula' | 'coluna' | 'quadril' | 'tornozelo' | 'cardio';

export const WARMUP_JOINT_LABELS: Record<WarmupJointRegion, string> = {
  Todos: 'Todas as Articulações',
  punho: 'Punhos & Mãos',
  ombro: 'Ombros & Manguito',
  escapula: 'Escápulas & Serrátil',
  coluna: 'Coluna & Torácica',
  quadril: 'Quadril & Pelve',
  tornozelo: 'Tornozelos & Pés',
  cardio: 'Cardio & Geral'
};

export const WARMUP_EXERCISE_JOINTS: Record<string, WarmupJointRegion[]> = {
  'circulos-punho': ['punho'],
  'flexao-extensao-punho-chao': ['punho'],
  'circulos-ombro': ['ombro'],
  'passagem-ombro-toalha': ['ombro'],
  'wall-angels': ['ombro', 'escapula', 'coluna'],
  'elevacao-y-deitado': ['ombro', 'escapula'],
  'rotacao-externa-ombro-toalha': ['ombro'],
  'retracao-protracao-escapular': ['escapula'],
  'flexao-escapular': ['escapula'],
  'retracao-escapular-barra': ['escapula', 'ombro'],
  'dead-hang': ['escapula', 'ombro'],
  'gato-vaca': ['coluna'],
  'rotacao-toracica': ['coluna', 'escapula'],
  'dead-hang-passivo': ['coluna', 'ombro'],
  'alongamento-rotacao-coluna': ['coluna', 'quadril'],
  'postura-crianca': ['coluna', 'quadril', 'ombro'],
  'bird-dog': ['coluna', 'escapula'],
  'superman': ['coluna', 'escapula'],
  'greatest-stretch': ['quadril', 'coluna', 'tornozelo'],
  'rotacao-quadril-9090': ['quadril'],
  'agachamento-profundo-assistido': ['quadril', 'tornozelo'],
  'ativacao-gluteo-ponte': ['quadril'],
  'ponte-gluteo': ['quadril'],
  'balanco-pernas-dinamico': ['quadril'],
  'mobilidade-tornozelo-parede': ['tornozelo'],
  'aquecimento-cardio-leve': ['cardio']
};

export type StretchTargetGroup =
  | 'Todos'
  | 'peitoral'
  | 'dorsal'
  | 'ombros'
  | 'triceps'
  | 'quadriceps'
  | 'isquiotibiais'
  | 'gluteos'
  | 'panturrilha'
  | 'coluna';

export const STRETCH_TARGET_LABELS: Record<StretchTargetGroup, string> = {
  Todos: 'Todos os Músculos',
  peitoral: 'Peitoral',
  dorsal: 'Dorsal & Costas',
  ombros: 'Ombros',
  triceps: 'Tríceps & Braços',
  quadriceps: 'Quadríceps',
  isquiotibiais: 'Isquiotibiais (Posterior)',
  gluteos: 'Glúteos & Pelve',
  panturrilha: 'Panturrilha',
  coluna: 'Coluna & Lombar'
};

export const STRETCH_EXERCISE_TARGETS: Record<string, StretchTargetGroup[]> = {
  'alongamento-peitoral-parede': ['peitoral', 'ombros'],
  'alongamento-dorsal-barra': ['dorsal', 'ombros'],
  'alongamento-triceps-acima': ['triceps', 'dorsal'],
  'alongamento-ombro-posterior': ['ombros'],
  'alongamento-flexores-quadril': ['quadriceps', 'gluteos'],
  'alongamento-quadriceps': ['quadriceps'],
  'alongamento-isquiotibiais': ['isquiotibiais', 'coluna'],
  'alongamento-panturrilha': ['panturrilha'],
  'alongamento-gluteo-pombo': ['gluteos'],
  'alongamento-borboleta': ['gluteos'],
  'alongamento-rotacao-coluna': ['coluna', 'gluteos'],
  'postura-crianca': ['coluna', 'dorsal', 'gluteos'],
  'dead-hang-passivo': ['dorsal', 'coluna', 'ombros'],
  'greatest-stretch': ['isquiotibiais', 'quadriceps', 'coluna']
};

const DIFFICULTY_ORDER: Record<ExerciseDifficulty, number> = {
  'Iniciante': 1,
  'Intermediário': 2,
  'Avançado': 3,
  'Elite': 4
};

function sortExerciseGroup(list: Exercise[], muscles: MuscleGroup[], isPrimaryGroup: boolean): Exercise[] {
  return [...list].sort((a, b) => {
    // 1. Quantidade de músculos selecionados contemplados (mais primeiro em multi-seleção)
    if (muscles.length > 1) {
      const aMatches = muscles.filter(m => (isPrimaryGroup ? a.primaryMuscles : a.secondaryMuscles).includes(m)).length;
      const bMatches = muscles.filter(m => (isPrimaryGroup ? b.primaryMuscles : b.secondaryMuscles).includes(m)).length;
      if (bMatches !== aMatches) return bMatches - aMatches;
    }

    // 2. Nível de dificuldade (Iniciante -> Intermediário -> Avançado -> Elite)
    const diffA = DIFFICULTY_ORDER[a.difficulty] || 99;
    const diffB = DIFFICULTY_ORDER[b.difficulty] || 99;
    if (diffA !== diffB) return diffA - diffB;

    // 3. Ordem da cadeia de progressão (regressões antes de progressões)
    if (b.regressoes?.includes(a.id)) return -1;
    if (a.regressoes?.includes(b.id)) return 1;
    if (a.progressoes?.includes(b.id)) return -1;
    if (b.progressoes?.includes(a.id)) return 1;

    const regA = a.regressoes?.length || 0;
    const regB = b.regressoes?.length || 0;
    if (regA !== regB) return regA - regB;

    // 4. Ordem alfabética por nome
    return a.name.localeCompare(b.name, 'pt-BR');
  });
}

export const ExerciseLibraryView = ({
  initialExerciseId = null,
  onSelectExerciseToSwap
}: ExerciseLibraryViewProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPattern, setSelectedPattern] = useState<MovementPattern | 'Todos'>('Todos');
  const [selectedPhase, setSelectedPhase] = useState<ExercisePhase>(() => {
    try {
      const saved = localStorage.getItem('calisteflow_library_phase');
      if (saved === 'aquecimento' || saved === 'treino' || saved === 'alongamento') {
        return saved as ExercisePhase;
      }
    } catch (e) {}
    return 'treino';
  });
  const [selectedWarmupJoint, setSelectedWarmupJoint] = useState<WarmupJointRegion>('Todos');
  const [selectedStretchTarget, setSelectedStretchTarget] = useState<StretchTargetGroup>('Todos');

  const handlePhaseChange = (phase: ExercisePhase) => {
    soundManager.triggerHaptic([25]);
    setSelectedPhase(phase);
    try {
      localStorage.setItem('calisteflow_library_phase', phase);
    } catch (e) {}
  };

  const phaseCounts = useMemo(() => {
    const aq = BASE_EXERCISES.filter(ex => ex.fase === 'aquecimento').length;
    const tr = BASE_EXERCISES.filter(ex => ex.fase === 'treino').length;
    const al = BASE_EXERCISES.filter(ex => ex.fase === 'alongamento').length;
    return { aquecimento: aq, treino: tr, alongamento: al };
  }, []);
  const [selectedDifficulty, setSelectedDifficulty] = useState<ExerciseDifficulty | 'Todos'>('Todos');
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType | 'Todos'>('Todos');
  const [selectedJointSafety, setSelectedJointSafety] = useState<'punho' | 'ombro' | 'joelho' | 'lombar' | 'sem-equipamento' | 'Todos'>('Todos');
  const [selectedMuscles, setSelectedMuscles] = useState<MuscleGroup[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(24);

  // D2: Estado de Favoritos e Recentes
  const [quickFilter, setQuickFilter] = useState<'todos' | 'favoritos' | 'recentes'>('todos');
  const [favoriteIds, setFavoriteIds] = useState<string[]>(getFavoriteExerciseIds);
  const [recentIds, setRecentIds] = useState<string[]>(getRecentExerciseIds);

  // D14: Modal da Árvore de Habilidades
  const [showSkillTree, setShowSkillTree] = useState<boolean>(false);
  // Galeria de Revisão Biomecânica de Animações
  const [showAnimationGallery, setShowAnimationGallery] = useState<boolean>(false);
  const [showStyleGallery, setShowStyleGallery] = useState<boolean>(false);

  const listTopRef = useRef<HTMLDivElement>(null);
  const prevFilterKeyRef = useRef<string>('');

  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(() => {
    if (initialExerciseId) {
      return getExerciseById(initialExerciseId) || null;
    }
    return null;
  });

  useBodyScrollLock(Boolean(selectedExercise), () => setSelectedExercise(null));

  const [activeTab, setActiveTab] = useState<ModalTab>('como_fazer');
  const [showInteractiveMap, setShowInteractiveMap] = useState<boolean>(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [showBiomechanicsModal, setShowBiomechanicsModal] = useState<boolean>(false);

  const handleToggleFavorite = (e: React.MouseEvent, exerciseId: string) => {
    e.stopPropagation();
    soundManager.triggerHaptic([35]);
    const updated = toggleFavoriteExercise(exerciseId);
    setFavoriteIds(updated);
  };

  const handleSelectMuscle = (m: MuscleGroup) => {
    soundManager.triggerHaptic([20]);
    setSelectedMuscles(prev => {
      const isAlreadySelected = prev.includes(m);
      const next = isAlreadySelected ? prev.filter(item => item !== m) : [...prev, m];
      // Ao selecionar ou alterar um músculo, aplicar o filtro em TODOS os padrões
      if (next.length > 0 && selectedPattern !== 'Todos') {
        setSelectedPattern('Todos');
      }
      return next;
    });
  };

  // Filtragem e particionamento ordenado: Alvo (Grupo 1) e Secundário (Grupo 2) com D1 Fuzzy Match
  const { primaryExercises, secondaryExercises, hiddenByPatternCount } = useMemo(() => {
    const query = searchQuery.trim();

    const matchesGeneralFilters = (ex: Exercise, checkPattern = true) => {
      // D2: Filtro rápido de Favoritos ou Recentes
      if (quickFilter === 'favoritos' && !favoriteIds.includes(ex.id)) {
        return false;
      }
      if (quickFilter === 'recentes' && !recentIds.includes(ex.id)) {
        return false;
      }

      if (query) {
        const nameMatch = isFuzzyMatch(ex.name, query);
        const descMatch = isFuzzyMatch(ex.description, query);
        const synonymMatch = ex.sinonimos?.some(s => isFuzzyMatch(s, query));
        const muscleMatch = ex.primaryMuscles.some(m => {
          const def = MUSCLE_DEFINITIONS[m];
          const labelMatch = isFuzzyMatch(def?.name || MUSCLE_LABELS[m] || m, query);
          const synMatch = def?.synonyms?.some(syn => isFuzzyMatch(syn, query));
          return labelMatch || synMatch;
        });
        const patternMatch = ex.padrao ? isFuzzyMatch(MOVEMENT_PATTERN_LABELS[ex.padrao] || ex.padrao, query) : false;

        if (!nameMatch && !descMatch && !synonymMatch && !muscleMatch && !patternMatch) {
          return false;
        }
      }

      // Filtro de Fase Obrigatório: O exercício deve pertencer à fase ativa (primária ou secundária)
      const belongsToPhase = ex.fase === selectedPhase || ex.fasesSecundarias?.includes(selectedPhase);
      if (!belongsToPhase) {
        return false;
      }

      // Sub-filtro específico por fase
      if (checkPattern) {
        if (selectedPhase === 'treino' && selectedPattern !== 'Todos' && ex.padrao !== selectedPattern) {
          return false;
        }
        if (selectedPhase === 'aquecimento' && selectedWarmupJoint !== 'Todos') {
          const joints = WARMUP_EXERCISE_JOINTS[ex.id] || [];
          if (!joints.includes(selectedWarmupJoint)) {
            return false;
          }
        }
        if (selectedPhase === 'alongamento' && selectedStretchTarget !== 'Todos') {
          const targets = STRETCH_EXERCISE_TARGETS[ex.id] || [];
          const matchesMuscle = ex.primaryMuscles.includes(selectedStretchTarget as MuscleGroup) ||
                                ex.secondaryMuscles.includes(selectedStretchTarget as MuscleGroup);
          if (!targets.includes(selectedStretchTarget) && !matchesMuscle) {
            return false;
          }
        }
      }

      if (selectedDifficulty !== 'Todos' && ex.difficulty !== selectedDifficulty) {
        return false;
      }

      if (selectedEquipment !== 'Todos') {
        const equips = ex.equipamento || ['nenhum'];
        if (!equips.includes(selectedEquipment)) {
          return false;
        }
      }

      if (selectedJointSafety !== 'Todos') {
        if (!ex.adaptacoes || !ex.adaptacoes[selectedJointSafety]) {
          return false;
        }
      }

      return true;
    };

    if (selectedMuscles.length === 0) {
      const allFiltered = BASE_EXERCISES.filter(ex => matchesGeneralFilters(ex, true));
      return {
        primaryExercises: allFiltered,
        secondaryExercises: [] as Exercise[],
        hiddenByPatternCount: 0
      };
    }

    const rawPrimary: Exercise[] = [];
    const rawSecondary: Exercise[] = [];

    BASE_EXERCISES.forEach(ex => {
      if (!matchesGeneralFilters(ex, true)) return;

      const isPrim = selectedMuscles.some(m => ex.primaryMuscles.includes(m));
      const isSec = selectedMuscles.some(m => ex.secondaryMuscles.includes(m));

      if (isPrim) {
        rawPrimary.push(ex);
      } else if (isSec) {
        rawSecondary.push(ex);
      }
    });

    const primarySorted = sortExerciseGroup(rawPrimary, selectedMuscles, true);
    const secondarySorted = sortExerciseGroup(rawSecondary, selectedMuscles, false);

    let hiddenCount = 0;
    if (selectedPhase === 'treino' && selectedPattern !== 'Todos') {
      hiddenCount = BASE_EXERCISES.filter(ex => {
        const matchesMuscle = selectedMuscles.some(m => ex.primaryMuscles.includes(m) || ex.secondaryMuscles.includes(m));
        const matchesOthers = matchesGeneralFilters(ex, false);
        return matchesMuscle && matchesOthers && ex.padrao !== selectedPattern;
      }).length;
    }

    return {
      primaryExercises: primarySorted,
      secondaryExercises: secondarySorted,
      hiddenByPatternCount: hiddenCount
    };
  }, [
    searchQuery,
    selectedPhase,
    selectedPattern,
    selectedWarmupJoint,
    selectedStretchTarget,
    selectedDifficulty,
    selectedEquipment,
    selectedJointSafety,
    selectedMuscles,
    quickFilter,
    favoriteIds,
    recentIds
  ]);

  // Detecção de resultados da busca em outras fases
  const otherPhaseMatches = useMemo(() => {
    const q = searchQuery.trim();
    if (!q || primaryExercises.length > 0 || secondaryExercises.length > 0) {
      return null;
    }
    const checkMatch = (ex: Exercise) => {
      return isFuzzyMatch(ex.name, q) ||
        isFuzzyMatch(ex.description, q) ||
        Boolean(ex.sinonimos?.some(s => isFuzzyMatch(s, q)));
    };
    const resultsByPhase: Partial<Record<ExercisePhase, number>> = {};
    (['aquecimento', 'treino', 'alongamento'] as const).forEach(ph => {
      if (ph !== selectedPhase) {
        const count = BASE_EXERCISES.filter(ex =>
          (ex.fase === ph || ex.fasesSecundarias?.includes(ph)) && checkMatch(ex)
        ).length;
        if (count > 0) resultsByPhase[ph] = count;
      }
    });
    return Object.keys(resultsByPhase).length > 0 ? resultsByPhase : null;
  }, [searchQuery, selectedPhase, primaryExercises.length, secondaryExercises.length]);

  // Efeito para rolar suavemente ao topo da lista ao alterar filtros
  useEffect(() => {
    const currentKey = `${selectedPhase}|${[...selectedMuscles].sort().join(',')}|${selectedPattern}|${selectedWarmupJoint}|${selectedStretchTarget}|${selectedDifficulty}|${selectedEquipment}|${selectedJointSafety}|${searchQuery}|${quickFilter}`;
    if (prevFilterKeyRef.current && prevFilterKeyRef.current !== currentKey) {
      listTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setVisibleCount(24);
    }
    prevFilterKeyRef.current = currentKey;
  }, [selectedPhase, selectedMuscles, selectedPattern, selectedWarmupJoint, selectedStretchTarget, selectedDifficulty, selectedEquipment, selectedJointSafety, searchQuery, quickFilter]);

  const workoutPatterns: Array<MovementPattern | 'Todos'> = [
    'Todos',
    'empurrar-horizontal',
    'empurrar-vertical',
    'mergulhos',
    'puxar-vertical',
    'puxar-horizontal',
    'core-anterior',
    'core-lateral',
    'costas-baixa',
    'agachamento-pernas',
    'skills'
  ];

  const warmupJoints: WarmupJointRegion[] = [
    'Todos',
    'punho',
    'ombro',
    'escapula',
    'coluna',
    'quadril',
    'tornozelo',
    'cardio'
  ];

  const stretchTargets: StretchTargetGroup[] = [
    'Todos',
    'peitoral',
    'dorsal',
    'ombros',
    'triceps',
    'quadriceps',
    'isquiotibiais',
    'gluteos',
    'panturrilha',
    'coluna'
  ];

  const handleOpenExerciseModal = (ex: Exercise, defaultTab: ModalTab = 'como_fazer') => {
    soundManager.triggerHaptic([20]);
    const updated = addRecentExercise(ex.id);
    setRecentIds(updated);
    setSelectedExercise(ex);
    setActiveTab(defaultTab);
  };

  const handleNavigateToExerciseId = (id: string, defaultTab: ModalTab = 'como_fazer') => {
    const target = getExerciseById(id);
    if (target) {
      soundManager.triggerHaptic([25]);
      const updated = addRecentExercise(target.id);
      setRecentIds(updated);
      setSelectedExercise(target);
      setActiveTab(defaultTab);
    }
  };

  const renderExerciseCard = (ex: Exercise) => (
    <div
      key={ex.id}
      className="glass-card rounded-3xl p-5 shadow-xl hover:border-white/15 transition-all duration-300 flex flex-col justify-between space-y-4"
    >
      <div>
        {/* Chips de Metadados e Botão de Favoritar */}
        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Badge de Fase */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                ex.fase === 'aquecimento'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : ex.fase === 'alongamento'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {ex.fase === 'aquecimento' && <Flame className="w-3 h-3 text-amber-400" />}
              {ex.fase === 'treino' && <Target className="w-3 h-3 text-emerald-400" />}
              {ex.fase === 'alongamento' && <Activity className="w-3 h-3 text-cyan-400" />}
              <span>{ex.fase === 'aquecimento' ? 'Aquecimento' : ex.fase === 'alongamento' ? 'Alongamento' : 'Treino'}</span>
            </span>

            {ex.fasesSecundarias && ex.fasesSecundarias.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold text-slate-400 bg-white/5 border border-white/5">
                +{ex.fasesSecundarias.map(s => s === 'aquecimento' ? 'Aquec.' : s === 'alongamento' ? 'Along.' : 'Treino').join(', ')}
              </span>
            )}

            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-white/5 text-slate-300 border border-white/10">
              {ex.padrao ? MOVEMENT_PATTERN_LABELS[ex.padrao] || ex.category : ex.category}
            </span>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-slate-300">
              {ex.difficulty}
            </span>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-slate-400">
              {ex.type === 'isometric' ? 'Isometria' : 'Repetições'}
            </span>
            {ex.cadencia && (
              <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                <Timer className="w-3 h-3 text-cyan-400" /> {ex.cadencia}
              </span>
            )}
          </div>
          
          {/* Botão Favorito D2 */}
          <button
            type="button"
            onClick={e => handleToggleFavorite(e, ex.id)}
            aria-label={favoriteIds.includes(ex.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            className={`p-2 rounded-xl transition active:scale-90 ${
              favoriteIds.includes(ex.id)
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 glow-amber'
                : 'text-slate-400 hover:text-white bg-white/5 border border-white/5'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${favoriteIds.includes(ex.id) ? 'fill-amber-300 text-amber-300' : ''}`} />
          </button>
        </div>

        {/* Título & Descrição */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-bold text-slate-100">{ex.name}</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">{ex.description}</p>
          </div>
          {ex.videoThumbnail ? (
            <img
              src={ex.videoThumbnail}
              alt={ex.name}
              loading="lazy"
              className="w-14 h-14 rounded-2xl object-cover bg-black/40 border border-white/10 shrink-0 shadow-md"
            />
          ) : (
            <ExerciseMedia exercise={ex} mode="card" className="w-14 h-14" />
          )}
        </div>

        {/* Músculos Alvo e Secundários com Destaque para o Músculo Filtrado */}
        <div className="flex flex-wrap gap-1 mt-3">
          {ex.primaryMuscles.map(m => {
            const isFiltered = selectedMuscles.includes(m);
            return (
              <span
                key={m}
                className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition ${
                  isFiltered
                    ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400 font-bold glow-emerald'
                    : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                }`}
              >
                Alvo: {MUSCLE_LABELS[m] || m}
              </span>
            );
          })}
          {selectedMuscles.length > 0 &&
            ex.secondaryMuscles
              .filter(m => selectedMuscles.includes(m))
              .map(m => (
                <span
                  key={`sec-filtered-${m}`}
                  className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-500/25 text-cyan-200 border border-cyan-400 glow-cyan"
                >
                  Secundário: {MUSCLE_LABELS[m] || m}
                </span>
              ))}
          {ex.secondaryMuscles
            .filter(m => !selectedMuscles.includes(m))
            .slice(0, 2)
            .map(m => (
              <span key={m} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800 text-slate-400">
                {MUSCLE_LABELS[m] || m}
              </span>
            ))}
        </div>
      </div>

      {/* Ações do Card */}
      <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium">
          {ex.executionSteps.length} passos biomecânicos
        </span>
        <div className="flex items-center gap-2">
          {onSelectExerciseToSwap && (
            <button
              onClick={() => onSelectExerciseToSwap(ex)}
              className="px-3 py-2 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-md active:scale-95 transition"
            >
              Selecionar
            </button>
          )}
          <button
            onClick={() => handleOpenExerciseModal(ex)}
            className="px-4 py-2 rounded-2xl glass-card text-emerald-300 hover:text-white hover:bg-white/[0.08] text-xs font-bold border border-white/10 flex items-center gap-1.5 transition active:scale-95 glow-emerald min-h-[44px]"
          >
            <Sparkles className="w-3.5 h-3.5" /> Detalhes & Progressões
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 safe-dock-pb">
      {/* Banner de Cabeçalho */}
      <div className="relative glass-card rounded-3xl p-5 sm:p-7 overflow-hidden border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="space-y-1.5 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            <Sparkles className="w-3.5 h-3.5" /> 208 Exercícios • 3 Fases: Aquecimento, Treino e Alongamento
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight flex items-center gap-2">
            <Dumbbell className="w-7 h-7 text-emerald-400" />
            Biblioteca & Progressões
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg leading-relaxed font-medium">
            Progressões calistênicas do iniciante à elite com biomecânica detalhada, erros comuns, critérios de avanço e adaptações para dores e ambiente.
          </p>
        </div>
      </div>

      {/* Abas Segmentadas de Fase: Aquecimento, Treino, Alongamento */}
      <div
        role="tablist"
        aria-label="Fase da Biblioteca"
        className="grid grid-cols-3 gap-1.5 p-1.5 rounded-3xl glass-card border border-white/10 shadow-lg"
      >
        {(['aquecimento', 'treino', 'alongamento'] as const).map(ph => {
          const isSelected = selectedPhase === ph;
          const count = phaseCounts[ph];
          const info = PHASE_LABELS[ph];
          return (
            <button
              key={ph}
              role="tab"
              id={`tab-${ph}`}
              aria-selected={isSelected}
              aria-controls={`panel-${ph}`}
              onClick={() => handlePhaseChange(ph)}
              className={`relative py-3 px-2 sm:px-4 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-200 active:scale-95 min-h-[48px] ${
                isSelected
                  ? ph === 'aquecimento'
                    ? 'bg-gradient-to-b from-amber-500/25 to-orange-500/15 text-amber-200 border border-amber-400/40 shadow-md shadow-amber-500/10'
                    : ph === 'alongamento'
                    ? 'bg-gradient-to-b from-cyan-500/25 to-teal-500/15 text-cyan-200 border border-cyan-400/40 shadow-md shadow-cyan-500/10'
                    : 'bg-gradient-to-b from-emerald-500/25 to-teal-500/15 text-emerald-200 border border-emerald-400/40 shadow-md shadow-emerald-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-1.5">
                {ph === 'aquecimento' && <Flame className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />}
                {ph === 'treino' && <Target className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />}
                {ph === 'alongamento' && <Activity className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />}
                <span className="text-xs sm:text-sm font-black tracking-tight">{info.label}</span>
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                    isSelected
                      ? ph === 'aquecimento'
                        ? 'bg-amber-400/20 text-amber-300'
                        : ph === 'alongamento'
                        ? 'bg-cyan-400/20 text-cyan-300'
                        : 'bg-emerald-400/20 text-emerald-300'
                      : 'bg-white/10 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </div>
              <span className="hidden sm:inline text-[10px] text-slate-400 truncate max-w-full font-medium">
                {info.description}
              </span>
            </button>
          );
        })}
      </div>

      {/* Barra de Busca com Sinônimos */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome, sinônimo ou músculo (ex: barra fixa, chin-up, flexão diamante, psoas)..."
            className="w-full pl-11 pr-10 py-3.5 rounded-2xl glass-card text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-emerald-500/60 placeholder:text-slate-500 shadow-md transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
              aria-label="Limpar busca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Banner de Aviso: Termo Encontrado em Outras Fases */}
        {otherPhaseMatches && (
          <div className="glass-card p-4 rounded-3xl border border-cyan-500/30 bg-cyan-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-cyan-200 shadow-lg animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                Nenhum exercício encontrado em <strong>{PHASE_LABELS[selectedPhase].label}</strong> para "{searchQuery}". Encontrado em outras fases:
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              {(Object.entries(otherPhaseMatches) as [ExercisePhase, number][]).map(([ph, count]) => (
                <button
                  key={ph}
                  type="button"
                  onClick={() => {
                    soundManager.triggerHaptic([20]);
                    handlePhaseChange(ph);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-400 text-slate-950 font-black text-xs hover:bg-cyan-300 transition active:scale-95 shadow-md flex items-center gap-1.5 min-h-[38px]"
                >
                  <span>Ver em {PHASE_LABELS[ph].label}</span>
                  <span className="font-mono font-bold">({count})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* D2: Filtros Rápidos (Todos / Favoritos / Recentes) e D14: Atalho da Árvore de Skills */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-0.5 no-scrollbar">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                soundManager.triggerHaptic([20]);
                setQuickFilter('todos');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
                quickFilter === 'todos'
                  ? 'bg-white/15 text-white border border-white/20'
                  : 'text-slate-400 hover:text-white bg-white/5 border border-white/5'
              }`}
            >
              Todos ({BASE_EXERCISES.length})
            </button>
            <button
              type="button"
              onClick={() => {
                soundManager.triggerHaptic([20]);
                setQuickFilter('favoritos');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 active:scale-95 ${
                quickFilter === 'favoritos'
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 glow-amber'
                  : 'text-slate-400 hover:text-amber-300 bg-white/5 border border-white/5'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Favoritos ({favoriteIds.length})</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundManager.triggerHaptic([20]);
                setQuickFilter('recentes');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 active:scale-95 ${
                quickFilter === 'recentes'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 glow-cyan'
                  : 'text-slate-400 hover:text-cyan-300 bg-white/5 border border-white/5'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Recentes ({recentIds.length})</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              soundManager.triggerHaptic([30]);
              setShowSkillTree(true);
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-300 border border-purple-500/30 hover:brightness-110 flex items-center gap-1.5 shrink-0 active:scale-95 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Árvore de Skills</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.triggerHaptic([30]);
              setShowAnimationGallery(true);
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/30 hover:brightness-110 flex items-center gap-1.5 shrink-0 active:scale-95 transition"
            title="Abrir Galeria de Animações Biomecânicas"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Galeria Biomecânica</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.triggerHaptic([30]);
              setShowStyleGallery(true);
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 hover:brightness-110 flex items-center gap-1.5 shrink-0 active:scale-95 transition"
            title="Comparar os 5 Estilos de Figura e Personalizar Avatar"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Estilos & Avatar</span>
          </button>
        </div>

        {/* Sub-Filtros Contextuais por Fase */}
        {selectedPhase === 'treino' && (
          <div className="relative">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none px-0.5">
              {workoutPatterns.map(pat => {
                const label = pat === 'Todos' ? 'Todos os Padrões' : MOVEMENT_PATTERN_LABELS[pat];
                const isSelected = selectedPattern === pat;
                return (
                  <button
                    key={pat}
                    onClick={() => {
                      soundManager.triggerHaptic([20]);
                      setSelectedPattern(pat);
                    }}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 min-h-[44px] ${
                      isSelected
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                        : 'glass-card text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <div className="pointer-events-none absolute left-0 top-0 bottom-1 w-2.5 bg-gradient-to-r from-slate-950 to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-1 w-5 bg-gradient-to-l from-slate-950 to-transparent" />
          </div>
        )}

        {selectedPhase === 'aquecimento' && (
          <div className="relative">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none px-0.5">
              {warmupJoints.map(joint => {
                const label = WARMUP_JOINT_LABELS[joint];
                const isSelected = selectedWarmupJoint === joint;
                return (
                  <button
                    key={joint}
                    onClick={() => {
                      soundManager.triggerHaptic([20]);
                      setSelectedWarmupJoint(joint);
                    }}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 min-h-[44px] ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-500 to-orange-400 text-slate-950 shadow-lg shadow-amber-500/20 font-black'
                        : 'glass-card text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <div className="pointer-events-none absolute left-0 top-0 bottom-1 w-2.5 bg-gradient-to-r from-slate-950 to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-1 w-5 bg-gradient-to-l from-slate-950 to-transparent" />
          </div>
        )}

        {selectedPhase === 'alongamento' && (
          <div className="relative">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none px-0.5">
              {stretchTargets.map(tgt => {
                const label = STRETCH_TARGET_LABELS[tgt];
                const isSelected = selectedStretchTarget === tgt;
                return (
                  <button
                    key={tgt}
                    onClick={() => {
                      soundManager.triggerHaptic([20]);
                      setSelectedStretchTarget(tgt);
                    }}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 min-h-[44px] ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 shadow-lg shadow-cyan-500/20 font-black'
                        : 'glass-card text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <div className="pointer-events-none absolute left-0 top-0 bottom-1 w-2.5 bg-gradient-to-r from-slate-950 to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-1 w-5 bg-gradient-to-l from-slate-950 to-transparent" />
          </div>
        )}

        {/* Barra de Controle de Filtros Avançados & Mapa */}
        <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                soundManager.triggerHaptic([20]);
                setShowAdvancedFilters(!showAdvancedFilters);
              }}
              className={`px-3.5 py-2 rounded-2xl glass-card text-xs font-bold flex items-center gap-1.5 transition active:scale-95 ${
                showAdvancedFilters ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' : 'text-slate-300'
              }`}
            >
              <Filter className="w-3.5 h-3.5 text-emerald-400" />
              <span>Filtros Específicos</span>
              {showAdvancedFilters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            <button
              onClick={() => {
                soundManager.triggerHaptic([20]);
                setShowInteractiveMap(!showInteractiveMap);
              }}
              className="px-3.5 py-2 rounded-2xl glass-card text-slate-300 text-xs font-bold flex items-center gap-2 hover:bg-white/[0.08] transition active:scale-95"
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Mapa Muscular Anatômico 2D</span>
              {showInteractiveMap ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {selectedMuscles.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {selectedMuscles.map(m => (
                  <div
                    key={`badge-${m}`}
                    className="flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/30 text-amber-300 px-3 py-1.5 rounded-2xl text-xs font-bold glow-amber"
                  >
                    <span>Músculo: {MUSCLE_LABELS[m] || m}</span>
                    <button
                      onClick={() => handleSelectMuscle(m)}
                      className="hover:text-white ml-1 p-0.5 rounded-full"
                      aria-label={`Remover filtro de ${MUSCLE_LABELS[m] || m}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {selectedMuscles.length > 1 && (
                  <button
                    onClick={() => setSelectedMuscles([])}
                    className="text-[11px] text-slate-400 hover:text-white underline ml-1"
                  >
                    Limpar todos
                  </button>
                )}
              </div>
            )}
          </div>

          {selectedMuscles.length > 0 ? (
            <span className="text-xs text-slate-300 shrink-0 font-medium font-mono flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">{primaryExercises.length} alvo</span>
              <span className="text-slate-500">•</span>
              <span className="text-cyan-400 font-bold">{secondaryExercises.length} secundários</span>
            </span>
          ) : (
            <span className="text-xs text-slate-400 shrink-0 font-medium font-mono">
              {primaryExercises.length} exercícios encontrados
            </span>
          )}
        </div>

        {/* Gaveta de Filtros Avançados */}
        {showAdvancedFilters && (
          <div className="glass-panel border border-white/10 rounded-3xl p-4 sm:p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Nível */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Nível de Experiência:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(['Todos', 'Iniciante', 'Intermediário', 'Avançado', 'Elite'] as const).map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedDifficulty(lvl)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      selectedDifficulty === lvl
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-white/[0.05] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Equipamento */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Equipamento Disponível:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(['Todos', 'nenhum', 'barra', 'paralelas', 'argolas', 'banco', 'parede', 'cadeira', 'toalha'] as const).map(eq => (
                  <button
                    key={eq}
                    onClick={() => setSelectedEquipment(eq)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                      selectedEquipment === eq
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-white/[0.05] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {eq === 'nenhum' ? 'Sem Equipamento (Solo)' : eq}
                  </button>
                ))}
              </div>
            </div>

            {/* Limitações Articulares com Adaptações Prontas */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Possui Adaptação Segura Para:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(['Todos', 'punho', 'ombro', 'joelho', 'lombar', 'sem-equipamento'] as const).map(safety => (
                  <button
                    key={safety}
                    onClick={() => setSelectedJointSafety(safety)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      selectedJointSafety === safety
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'bg-white/[0.05] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {safety === 'Todos' ? 'Qualquer articulação' : `Dor no ${safety}`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mapa Muscular Interativo */}
        {showInteractiveMap && (
          <div className="glass-panel border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                Toque no músculo para filtrar exercícios alvo:
              </span>
              {selectedMuscles.length > 0 && (
                <button
                  onClick={() => setSelectedMuscles([])}
                  className="text-xs text-emerald-400 hover:underline font-bold"
                >
                  Limpar seleção ({selectedMuscles.length})
                </button>
              )}
            </div>
            <MuscleMap
              selectedMuscles={selectedMuscles}
              onSelectMuscle={handleSelectMuscle}
              size="md"
            />
          </div>
        )}
      </div>

      {/* Âncora de Rolagem do Topo da Lista */}
      <div ref={listTopRef} />

      {/* Banner de Aviso: Exercícios Ocultos pelo Filtro de Padrão */}
      {hiddenByPatternCount > 0 && (
        <div className="glass-card p-4 rounded-3xl border border-amber-500/30 bg-amber-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200 shadow-lg">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Padrão <strong>{selectedPattern === 'Todos' ? '' : MOVEMENT_PATTERN_LABELS[selectedPattern]}</strong> ativo:{' '}
              <strong>{hiddenByPatternCount}</strong> exercício{hiddenByPatternCount > 1 ? 's deste músculo estão ocultos' : ' deste músculo está oculto'} em outros padrões de movimento.
            </span>
          </div>
          <button
            onClick={() => {
              soundManager.triggerHaptic([20]);
              setSelectedPattern('Todos');
            }}
            className="px-3.5 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs hover:bg-amber-300 transition shrink-0 active:scale-95 shadow-md"
          >
            Ver todos os padrões
          </button>
        </div>
      )}

      {/* Grade de Exercícios: Agrupamento em Alvo e Secundário */}
      <div className="space-y-8 pb-[calc(2rem+env(safe-area-inset-bottom))]">
        {/* Caso 1: Músculo(s) Selecionado(s) - Dividir em Grupo Alvo e Grupo Secundário */}
        {selectedMuscles.length > 0 && (
          <>
            {/* GRUPO 1: ALVO (MÚSCULO PRIMÁRIO) */}
            {primaryExercises.length > 0 && (
              <section aria-labelledby="section-primary-muscles" className="space-y-4">
                <div className="flex items-center justify-between gap-3 border-b border-emerald-500/20 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 glow-emerald" aria-hidden="true" />
                    <h2 id="section-primary-muscles" className="text-sm sm:text-base font-black text-slate-100 tracking-tight">
                      Alvo: {selectedMuscles.map(m => MUSCLE_LABELS[m] || m).join(', ')} ({primaryExercises.length})
                    </h2>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                    Músculo Principal
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {primaryExercises.slice(0, visibleCount).map(ex => renderExerciseCard(ex))}
                </div>
              </section>
            )}

            {/* GRUPO 2: TRABALHA COMO SECUNDÁRIO */}
            {secondaryExercises.length > 0 && (
              <section aria-labelledby="section-secondary-muscles" className="space-y-4 pt-4">
                <div className="flex items-center justify-between gap-3 border-b border-cyan-500/20 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-cyan-400 glow-cyan" aria-hidden="true" />
                    <h2 id="section-secondary-muscles" className="text-sm sm:text-base font-black text-slate-100 tracking-tight">
                      Trabalha como secundário ({secondaryExercises.length})
                    </h2>
                  </div>
                  <span className="text-[11px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                    Sinergista / Suporte
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {secondaryExercises.slice(0, visibleCount).map(ex => renderExerciseCard(ex))}
                </div>
              </section>
            )}

            {/* Botão de Paginação / Carregar Mais no modo muscular */}
            {(primaryExercises.length > visibleCount || secondaryExercises.length > visibleCount) && (
              <div className="pt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount(v => v + 24)}
                  className="px-6 py-3 rounded-2xl glass-card text-emerald-300 font-bold text-xs border border-emerald-500/30 hover:bg-emerald-500/10 active:scale-95 transition min-h-[48px] flex items-center gap-2 shadow-lg glow-emerald"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Carregar Mais Exercícios ({Math.max(0, primaryExercises.length - visibleCount) + Math.max(0, secondaryExercises.length - visibleCount)} restantes)
                </button>
              </div>
            )}

            {/* Aviso quando ambos os grupos ficam vazios */}
            {primaryExercises.length === 0 && secondaryExercises.length === 0 && (
              <div className="glass-card rounded-3xl p-8 sm:p-10 border border-white/10 text-center space-y-4 shadow-2xl">
                <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
                  <Activity className="w-8 h-8" />
                </div>
                <div className="space-y-1.5 max-w-md mx-auto">
                  <h3 className="text-lg font-bold text-slate-100">
                    Nenhum exercício encontrado para esta combinação
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Não há exercícios cadastrados que atendam simultaneamente aos filtros ativos para {selectedMuscles.map(m => MUSCLE_LABELS[m] || m).join(', ')}. Tente desativar filtros de equipamento, dificuldade ou padrão de movimento.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      soundManager.triggerHaptic([20]);
                      setSelectedMuscles([]);
                      setSelectedPattern('Todos');
                      setSelectedWarmupJoint('Todos');
                      setSelectedStretchTarget('Todos');
                      setSelectedDifficulty('Todos');
                      setSelectedEquipment('Todos');
                      setSelectedJointSafety('Todos');
                      setSearchQuery('');
                    }}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition"
                  >
                    Limpar todos os filtros
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Caso 2: Nenhum Músculo Selecionado - Lista Unificada Padrão */}
        {selectedMuscles.length === 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {primaryExercises.slice(0, visibleCount).map(ex => renderExerciseCard(ex))}
            </div>

            {primaryExercises.length > visibleCount && (
              <div className="pt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount(v => v + 24)}
                  className="px-6 py-3 rounded-2xl glass-card text-emerald-300 font-bold text-xs border border-emerald-500/30 hover:bg-emerald-500/10 active:scale-95 transition min-h-[48px] flex items-center gap-2 shadow-lg glow-emerald"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Carregar Mais Exercícios ({primaryExercises.length - visibleCount} restantes)
                </button>
              </div>
            )}

            {primaryExercises.length === 0 && (
              <div className="p-12 text-center glass-card rounded-3xl border border-white/10 space-y-3">
                <Dumbbell className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-200">Nenhum exercício encontrado</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Tente buscar com outro termo ou limpe os filtros de padrão de movimento, nível ou equipamento.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      
      {/* MODAL MULTI-ABAS DE DETALHES COMPLETOS DO EXERCÍCIO */}
      {selectedExercise && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedExercise(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[min(92dvh,calc(100dvh-2rem))] sm:max-h-[88dvh] glass-panel border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Cabeçalho do Modal */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between shrink-0 glass-panel">
              <div className="pr-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                  {selectedExercise.padrao ? MOVEMENT_PATTERN_LABELS[selectedExercise.padrao] || selectedExercise.category : selectedExercise.category} • {selectedExercise.difficulty}
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-100 tracking-tight leading-snug">
                  {selectedExercise.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedExercise(null)}
                className="p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-white/[0.08] transition shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Abas Superiores de Navegação */}
            <div className="flex items-center gap-1 overflow-x-auto px-4 py-2.5 border-b border-white/[0.08] bg-black/20 scrollbar-none shrink-0">
              <button
                onClick={() => setActiveTab('como_fazer')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap min-h-[40px] flex items-center gap-1.5 ${
                  activeTab === 'como_fazer' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5" /> Como Fazer
              </button>
              <button
                onClick={() => setActiveTab('erros')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap min-h-[40px] flex items-center gap-1.5 ${
                  activeTab === 'erros' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" /> Erros Comuns
              </button>
              <button
                onClick={() => setActiveTab('regressoes')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap min-h-[40px] flex items-center gap-1.5 ${
                  activeTab === 'regressoes' ? 'bg-cyan-400 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Regressões
              </button>
              <button
                onClick={() => setActiveTab('progressoes')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap min-h-[40px] flex items-center gap-1.5 ${
                  activeTab === 'progressoes' ? 'bg-purple-400 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ArrowRight className="w-3.5 h-3.5" /> Progressões
              </button>
              <button
                onClick={() => setActiveTab('variacoes')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap min-h-[40px] flex items-center gap-1.5 ${
                  activeTab === 'variacoes' ? 'bg-teal-400 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> Variações
              </button>
              <button
                onClick={() => setActiveTab('adaptacoes')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap min-h-[40px] flex items-center gap-1.5 ${
                  activeTab === 'adaptacoes' ? 'bg-rose-400 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Adaptações
              </button>
              <button
                onClick={() => setActiveTab('revisao')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap min-h-[40px] flex items-center gap-1.5 ${
                  activeTab === 'revisao' ? 'bg-indigo-400 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Auditoria CREF
              </button>
              <button
                type="button"
                onClick={() => {
                  soundManager.triggerHaptic([25]);
                  setShowBiomechanicsModal(true);
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-black transition whitespace-nowrap min-h-[40px] flex items-center gap-1.5 bg-[#00FF66]/15 border border-[#00FF66]/40 text-[#00FF66] hover:bg-[#00FF66]/25 shadow-sm active:scale-95"
                title="Abrir análise técnica de biomecânica, keyframes e ativação muscular"
              >
                <Compass className="w-3.5 h-3.5" /> 📐 Biomecânica
              </button>
            </div>

            {/* Conteúdo da Aba */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-5">
              {/* Visualização de Vídeo ou SVG Biomecânico */}
              <ExerciseVideoPlayer exercise={selectedExercise} autoLoop={true} />

              {/* ABA 1: COMO FAZER */}
              {activeTab === 'como_fazer' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium bg-white/[0.03] p-4 rounded-2xl border border-white/5">
                    {selectedExercise.description}
                  </p>

                  {/* Passos de Execução */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">
                      Passo a Passo Biomecânico
                    </h4>
                    {selectedExercise.executionSteps.map(step => (
                      <div
                        key={step.step}
                        className="glass-card p-3.5 rounded-2xl border border-white/5 flex items-start gap-3"
                      >
                        <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                          {step.step}
                        </span>
                        <div>
                          <h5 className="text-xs font-bold text-slate-100">{step.title}</h5>
                          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Dica de Respiração */}
                  {selectedExercise.breathingTip && (
                    <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 text-xs">
                      <span className="font-bold">Respiração Ideal: </span>
                      {selectedExercise.breathingTip}
                    </div>
                  )}

                  {/* Metadados de Prescrição */}
                  <div className="p-4 glass-card rounded-2xl border border-white/10 text-xs flex items-center justify-around text-center shadow-md">
                    <div>
                      <div className="text-slate-400 text-[11px] font-semibold">Séries Padrão</div>
                      <div className="text-base font-black text-slate-100 font-mono mt-0.5">{selectedExercise.defaultSets}</div>
                    </div>
                    <div className="border-r border-white/10 h-7" />
                    <div>
                      <div className="text-slate-400 text-[11px] font-semibold">
                        {selectedExercise.type === 'isometric' ? 'Isometria' : 'Repetições'}
                      </div>
                      <div className="text-base font-black text-slate-100 font-mono mt-0.5">
                        {selectedExercise.type === 'isometric'
                          ? `${selectedExercise.defaultHoldSeconds}s`
                          : `${selectedExercise.defaultReps} reps`}
                      </div>
                    </div>
                    <div className="border-r border-white/10 h-7" />
                    <div>
                      <div className="text-slate-400 text-[11px] font-semibold">Descanso</div>
                      <div className="text-base font-black text-slate-100 font-mono mt-0.5">
                        {selectedExercise.defaultRestSeconds}s
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ABA 2: ERROS COMUNS */}
              {activeTab === 'erros' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 mb-2">
                    Principais Falhas Técnicas & Como Corrigir
                  </h4>
                  {selectedExercise.commonMistakes.map((m, idx) => (
                    <div
                      key={idx}
                      className="glass-card p-4 rounded-2xl border border-rose-500/20 bg-rose-500/[0.04] space-y-2"
                    >
                      <div className="flex items-start gap-2 text-rose-300 text-xs font-bold">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                        <span>Erro: {m.mistake}</span>
                      </div>
                      <div className="flex items-start gap-2 text-emerald-300 text-xs pl-6">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                        <span>Correção: {m.correction}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ABA 3: REGRESSÕES */}
              {activeTab === 'regressoes' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 mb-1">
                    Regressões Diretas (Mais Fáceis)
                  </h4>
                  <p className="text-xs text-slate-400 mb-3">
                    Se este exercício estiver gerando fadiga excessiva ou perda de alinhamento, dê um passo atrás em:
                  </p>
                  {selectedExercise.regressoes && selectedExercise.regressoes.length > 0 ? (
                    <div className="space-y-2">
                      {selectedExercise.regressoes.map(regId => {
                        const target = getExerciseById(regId);
                        if (!target) return null;
                        return (
                          <div
                            key={regId}
                            className="glass-card p-3.5 rounded-2xl border border-white/10 flex items-center justify-between gap-3 hover:border-cyan-400/40 transition"
                          >
                            <div>
                              <div className="text-xs font-bold text-slate-100">{target.name}</div>
                              <div className="text-[11px] text-slate-400">{target.difficulty} • {target.category}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              {onSelectExerciseToSwap && (
                                <button
                                  onClick={() => onSelectExerciseToSwap(target)}
                                  className="px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
                                >
                                  Trocar no Treino
                                </button>
                              )}
                              <button
                                onClick={() => handleNavigateToExerciseId(regId, 'como_fazer')}
                                className="px-3 py-1.5 rounded-xl glass-card text-xs font-semibold text-cyan-300 hover:text-white"
                              >
                                Ver Guia
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-6 text-center glass-card rounded-2xl text-xs text-slate-400">
                      Este é o exercício base fundamental deste padrão motor.
                    </div>
                  )}
                </div>
              )}

              {/* ABA 4: PROGRESSÕES */}
              {activeTab === 'progressoes' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 mb-1">
                    Próximas Progressões de Força
                  </h4>
                  {selectedExercise.criterioAvanco && (
                    <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-200 text-xs mb-3">
                      <span className="font-bold">Critério Para Avançar: </span>
                      {selectedExercise.criterioAvanco}
                    </div>
                  )}
                  {selectedExercise.progressoes && selectedExercise.progressoes.length > 0 ? (
                    <div className="space-y-2">
                      {selectedExercise.progressoes.map(progId => {
                        const target = getExerciseById(progId);
                        if (!target) return null;
                        return (
                          <div
                            key={progId}
                            className="glass-card p-3.5 rounded-2xl border border-white/10 flex items-center justify-between gap-3 hover:border-purple-400/40 transition"
                          >
                            <div>
                              <div className="text-xs font-bold text-slate-100">{target.name}</div>
                              <div className="text-[11px] text-slate-400">{target.difficulty} • {target.category}</div>
                            </div>
                            <button
                              onClick={() => handleNavigateToExerciseId(progId, 'como_fazer')}
                              className="px-3 py-1.5 rounded-xl glass-card text-xs font-semibold text-purple-300 hover:text-white flex items-center gap-1"
                            >
                              Ver Desafio <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-6 text-center glass-card rounded-2xl text-xs text-slate-400">
                      🏆 Você está no topo da cadeia evolutiva deste movimento!
                    </div>
                  )}
                </div>
              )}

              {/* ABA 5: VARIAÇÕES */}
              {activeTab === 'variacoes' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 mb-1">
                    Variações de Estímulo & Ângulo
                  </h4>
                  <p className="text-xs text-slate-400 mb-3">
                    Modificações de pegada, ritmo e apoio para quebrar platôs musculares:
                  </p>
                  {selectedExercise.variacoes && selectedExercise.variacoes.length > 0 ? (
                    <div className="space-y-2">
                      {selectedExercise.variacoes.map(varId => {
                        const target = getExerciseById(varId);
                        if (!target) return null;
                        return (
                          <div
                            key={varId}
                            className="glass-card p-3.5 rounded-2xl border border-white/10 flex items-center justify-between gap-3 hover:border-teal-400/40 transition"
                          >
                            <div>
                              <div className="text-xs font-bold text-slate-100">{target.name}</div>
                              <div className="text-[11px] text-slate-400">{target.difficulty}</div>
                            </div>
                            <button
                              onClick={() => handleNavigateToExerciseId(varId, 'como_fazer')}
                              className="px-3 py-1.5 rounded-xl glass-card text-xs font-semibold text-teal-300 hover:text-white"
                            >
                              Explorar
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-6 text-center glass-card rounded-2xl text-xs text-slate-400">
                      Nenhuma variação secundária cadastrada.
                    </div>
                  )}
                </div>
              )}

              {/* ABA 6: ADAPTAÇÕES POR DOR / LIMITAÇÃO */}
              {activeTab === 'adaptacoes' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 mb-1">
                    Adaptações Clínicas & Articulares
                  </h4>
                  <p className="text-xs text-slate-400 mb-3">
                    Alternativas para treinar com segurança sem interromper o hábito:
                  </p>
                  {selectedExercise.adaptacoes && Object.keys(selectedExercise.adaptacoes).length > 0 ? (
                    <div className="space-y-3">
                      {Object.entries(selectedExercise.adaptacoes).map(([joint, altIds]) => (
                        <div key={joint} className="glass-card p-3.5 rounded-2xl border border-white/10 space-y-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                            Se sentir desconforto em: {joint}
                          </span>
                          <div className="space-y-1.5 pl-2">
                            {altIds && altIds.map(altId => {
                              const target = getExerciseById(altId);
                              if (!target) return null;
                              return (
                                <div key={altId} className="flex items-center justify-between gap-2">
                                  <span className="text-xs text-slate-200">{target.name}</span>
                                  <button
                                    onClick={() => handleNavigateToExerciseId(altId, 'como_fazer')}
                                    className="text-[11px] text-emerald-400 hover:underline font-bold"
                                  >
                                    Ver versão segura
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center glass-card rounded-2xl text-xs text-slate-400">
                      Exercício suave com baixo risco biomecânico documentado.
                    </div>
                  )}
                </div>
              )}

              {/* ABA 7: AUDITORIA CREF & SEGURANÇA */}
              {activeTab === 'revisao' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {/* Selo CREF */}
                  <div className="glass-card p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <span>Revisão Biomecânica Profissional</span>
                    </div>
                    <div className="text-xs text-slate-200">
                      <strong>Especialista Responsável:</strong> {selectedExercise.reviewedBy?.name || CREF_REVIEWER_SPECIALIST.name}
                    </div>
                    <div className="text-xs text-slate-300">
                      <strong>Registro CREF:</strong> {selectedExercise.reviewedBy?.cref || CREF_REVIEWER_SPECIALIST.cref}
                    </div>
                    <div className="text-xs text-slate-400">
                      <strong>Especialidade:</strong> {selectedExercise.reviewedBy?.specialty || CREF_REVIEWER_SPECIALIST.specialty}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Data da Revisão: {selectedExercise.reviewedBy?.reviewDate || CREF_REVIEWER_SPECIALIST.reviewDate}
                    </div>
                  </div>

                  {/* Avisos de Segurança */}
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-200 text-xs space-y-1.5">
                    <span className="font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400" /> Diretrizes de Proteção:
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-300">
                      <li>Interrompa imediatamente se sentir dor aguda, estalo ou pinçamento articular.</li>
                      <li>Nunca sacrifique a amplitude limpa por número de repetições.</li>
                      <li>Consulte um profissional de Educação Física ou Fisioterapia antes de treinar skills de alta compressão.</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Rodapé do Modal com Safe Area */}
            <div className="p-4 pb-[max(1rem,calc(env(safe-area-inset-bottom,0px)+0.75rem))] border-t border-white/10 glass-panel flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                ID: {selectedExercise.id}
              </span>
              <button
                onClick={() => setSelectedExercise(null)}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 glow-emerald min-h-[44px]"
              >
                Fechar Guia
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal Árvore de Habilidades Calistênicas (D14) */}
      {showSkillTree && (
        <SkillTreeModal
          onClose={() => setShowSkillTree(false)}
          onOpenExerciseDetails={handleNavigateToExerciseId}
        />
      )}

      {/* Modal Galeria de Animações Biomecânicas */}
      {showAnimationGallery && (
        <ExerciseGalleryModal
          isOpen={showAnimationGallery}
          onClose={() => setShowAnimationGallery(false)}
        />
      )}

      {/* Modal Galeria de Estilos & Personalização de Avatar */}
      {showStyleGallery && (
        <StyleComparisonGalleryModal
          isOpen={showStyleGallery}
          onClose={() => setShowStyleGallery(false)}
        />
      )}

      {/* Modal Inspetor Técnico de Biomecânica */}
      {showBiomechanicsModal && selectedExercise && (
        <BiomechanicsInspectorModal
          exercise={selectedExercise}
          isOpen={showBiomechanicsModal}
          onClose={() => setShowBiomechanicsModal(false)}
        />
      )}
    </div>
  );
};
