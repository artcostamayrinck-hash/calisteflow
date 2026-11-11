import React, { useState } from 'react';
import type {
  UserOnboardingProfile,
  FitnessGoal,
  ExerciseDifficulty,
  EquipmentType,
  JointLimitation,
} from '../../types';
import { getStoredUserProfile, saveUserProfile } from '../../utils/storage';
import { soundManager } from '../../utils/audio';
import { useBodyScrollLock } from '../../utils/useBodyScrollLock';
import {
  X,
  User,
  Target,
  Dumbbell,
  Clock,
  Calendar,
  ShieldCheck,
  Save,
  Sparkles,
  Check,
  Sliders,
} from 'lucide-react';

interface TrainingProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: (profile: UserOnboardingProfile) => void;
}

const FITNESS_GOALS_LIST: Array<{ id: FitnessGoal; label: string; desc: string; emoji: string }> = [
  { id: 'forca', label: 'Força Máxima', desc: 'Progredir para cargas pesadas e skills estáticas', emoji: '⚡' },
  { id: 'hipertrofia', label: 'Hipertrofia Muscular', desc: 'Construção e volume muscular com peso corporal', emoji: '💪' },
  { id: 'resistencia', label: 'Resistência Muscular', desc: 'Altas repetições e resistência sob fadiga', emoji: '🔥' },
  { id: 'skills', label: 'Skills de Calistenia', desc: 'Handstand, Muscle-up, Front Lever, Planche', emoji: '🤸' },
  { id: 'condicionamento', label: 'Condicionamento & Queima', desc: 'Metabolismo acelerado e circuitos aeróbicos', emoji: '🏃' },
  { id: 'mobilidade', label: 'Mobilidade & Saúde Articular', desc: 'Flexibilidade ativa, postura e alívio de dores', emoji: '🧘' },
];

const DIFFICULTY_LEVELS: Array<{ id: ExerciseDifficulty; label: string; desc: string }> = [
  { id: 'Iniciante', label: 'Iniciante', desc: 'Desenvolvendo força básica (até 5 flexões ou 1 barra)' },
  { id: 'Intermediário', label: 'Intermediário', desc: 'Executa 10-15 flexões e 5-8 barras fixas com boa forma' },
  { id: 'Avançado', label: 'Avançado', desc: 'Domina flexões diamante, barras peito e paralelas com carga' },
  { id: 'Elite', label: 'Elite', desc: 'Executa Muscle-ups limpos, L-sit avançado e transições complexas' },
];

const EQUIPMENT_OPTIONS: Array<{ id: EquipmentType; label: string; icon: string }> = [
  { id: 'nenhum', label: 'Apenas Solo (Sem Equipamentos)', icon: '🥋' },
  { id: 'barra', label: 'Barra Fixa', icon: '🪵' },
  { id: 'paralelas', label: 'Barras Paralelas / Dips', icon: '🪜' },
  { id: 'argolas', label: 'Argolas Olímpicas', icon: '⭕' },
  { id: 'elastico', label: 'Elásticos / Minibands', icon: '🪢' },
  { id: 'banco', label: 'Banco / Sofá Firme', icon: '🛋️' },
  { id: 'parede', label: 'Parede Livre', icon: '🧱' },
  { id: 'cadeira', label: 'Cadeira Resistente', icon: '🪑' },
  { id: 'toalha', label: 'Toalha de Apoio', icon: '🧣' },
];

const JOINT_LIMITATIONS_LIST: Array<{ id: JointLimitation; label: string; tip: string }> = [
  { id: 'punho', label: 'Punhos / Mãos', tip: 'Evita hiperflexão dorsal sob carga e handstand direto' },
  { id: 'ombro', label: 'Ombros / Manguito', tip: 'Evita mergulhos profundos e sobrecargas no extremo de amplitude' },
  { id: 'joelho', label: 'Joelhos / Patela', tip: 'Substitui pistol squats e saltos de alto impacto' },
  { id: 'lombar', label: 'Coluna Lombar', tip: 'Filtra alavancas de retroversão forçada como dragon flag completo' },
];

export const TrainingProfileModal: React.FC<TrainingProfileModalProps> = ({
  isOpen,
  onClose,
  onProfileUpdated,
}) => {
  useBodyScrollLock(isOpen, onClose);

  const [stored] = useState<UserOnboardingProfile>(() => {
    const current = getStoredUserProfile();
    return (
      current || {
        goal: 'hipertrofia',
        secondaryGoals: ['forca'],
        level: 'Iniciante',
        equipments: ['nenhum', 'barra'],
        daysSelected: [1, 3, 5],
        durationMinutes: 30,
        focusMode: 'auto',
        limitations: [],
        preferences: {
          focusStyle: 'equilibrado',
          preferredRestSeconds: 60,
          includeWarmup: true,
          includeStretching: true,
        },
      }
    );
  });

  const [goal, setGoal] = useState<FitnessGoal>(stored.goal || 'hipertrofia');
  const [secondaryGoals, setSecondaryGoals] = useState<FitnessGoal[]>(stored.secondaryGoals || ['forca']);
  const [level, setLevel] = useState<ExerciseDifficulty>(
    stored.level === 'Nunca treinei' ? 'Iniciante' : (stored.level as ExerciseDifficulty) || 'Iniciante'
  );
  const [equipments, setEquipments] = useState<EquipmentType[]>(stored.equipments || ['nenhum']);
  const [durationMinutes, setDurationMinutes] = useState<15 | 20 | 30 | 45 | 60>(stored.durationMinutes || 30);
  const [frequencyDays, setFrequencyDays] = useState<number>(stored.daysSelected?.length || 3);
  const [limitations, setLimitations] = useState<JointLimitation[]>(stored.limitations || []);
  const [focusStyle, setFocusStyle] = useState<'equilibrado' | 'superiores' | 'inferiores' | 'skills_isometria'>(
    stored.preferences?.focusStyle || 'equilibrado'
  );
  const [preferredRestSeconds, setPreferredRestSeconds] = useState<number>(
    stored.preferences?.preferredRestSeconds || 60
  );
  const [includeWarmup, setIncludeWarmup] = useState<boolean>(stored.preferences?.includeWarmup ?? true);
  const [includeStretching, setIncludeStretching] = useState<boolean>(stored.preferences?.includeStretching ?? true);

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const toggleSecondaryGoal = (g: FitnessGoal) => {
    soundManager.triggerHaptic([15]);
    if (g === goal) return;
    setSecondaryGoals(prev => (prev.includes(g) ? prev.filter(item => item !== g) : [...prev, g]));
  };

  const toggleEquipment = (eq: EquipmentType) => {
    soundManager.triggerHaptic([15]);
    setEquipments(prev => {
      if (eq === 'nenhum') {
        return prev.includes('nenhum') && prev.length > 1 ? prev.filter(e => e !== 'nenhum') : ['nenhum'];
      }
      const withoutNenhum = prev.filter(e => e !== 'nenhum');
      return withoutNenhum.includes(eq)
        ? withoutNenhum.filter(e => e !== eq).length > 0
          ? withoutNenhum.filter(e => e !== eq)
          : ['nenhum']
        : [...withoutNenhum, eq];
    });
  };

  const toggleLimitation = (lim: JointLimitation) => {
    soundManager.triggerHaptic([20]);
    setLimitations(prev => (prev.includes(lim) ? prev.filter(l => l !== lim) : [...prev, lim]));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.triggerHaptic([40]);

    // Calcular dias selecionados baseado na frequência escolhida (ex: 3 dias -> Seg, Qua, Sex)
    const frequencyMap: Record<number, number[]> = {
      2: [2, 4], // Ter, Qui
      3: [1, 3, 5], // Seg, Qua, Sex
      4: [1, 2, 4, 5], // Seg, Ter, Qui, Sex
      5: [1, 2, 3, 4, 5], // Seg a Sex
      6: [1, 2, 3, 4, 5, 6], // Seg a Sáb
    };
    const daysSelected = frequencyMap[frequencyDays] || [1, 3, 5];

    const updatedProfile: UserOnboardingProfile = {
      ...stored,
      goal,
      secondaryGoals,
      level,
      equipments,
      durationMinutes,
      daysSelected,
      limitations,
      preferences: {
        focusStyle,
        preferredRestSeconds,
        includeWarmup,
        includeStretching,
      },
      updatedAt: new Date().toISOString(),
    };

    saveUserProfile(updatedProfile);
    if (onProfileUpdated) {
      onProfileUpdated(updatedProfile);
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 700);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
    >
      <div
        className="w-full max-w-2xl max-h-[min(92dvh,calc(100dvh-2rem))] sm:max-h-[88dvh] glass-panel border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between shrink-0 glass-panel">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 glow-emerald">
              <User className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block">
                CalisteFlow 2.0 • Local-First
              </span>
              <h2 id="profile-modal-title" className="text-base sm:text-lg font-black text-slate-100 tracking-tight">
                Meu Perfil de Treinamento
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-white/[0.08] transition min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Fechar perfil"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo com Rolagem */}
        <form onSubmit={handleSave} className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Mensagem de privacidade */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3 text-xs text-slate-400">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              Suas preferências ficam salvas exclusivamente na memória local do seu dispositivo. Nenhum dado pessoal invasivo é transmitido ou vendido.
            </span>
          </div>

          {/* 1. Nível de Experiência */}
          <div className="space-y-2.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              1. Nível de Experiência na Calistenia
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DIFFICULTY_LEVELS.map(lvl => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => {
                    soundManager.triggerHaptic([15]);
                    setLevel(lvl.id);
                  }}
                  className={`p-3 rounded-2xl border text-left transition active:scale-98 ${
                    level === lvl.id
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-white glow-emerald shadow-md'
                      : 'bg-white/[0.03] border-white/5 text-slate-300 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm">{lvl.label}</span>
                    {level === lvl.id && <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">{lvl.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Objetivo Principal e Secundários */}
          <div className="space-y-2.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" />
              2. Objetivo Principal do Treino
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {FITNESS_GOALS_LIST.map(g => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    soundManager.triggerHaptic([20]);
                    setGoal(g.id);
                    setSecondaryGoals(prev => prev.filter(item => item !== g.id));
                  }}
                  className={`p-3 rounded-2xl border text-left transition active:scale-98 ${
                    goal === g.id
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-white glow-cyan shadow-md'
                      : 'bg-white/[0.03] border-white/5 text-slate-300 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm flex items-center gap-2">
                      <span>{g.emoji}</span>
                      {g.label}
                    </span>
                    {goal === g.id && <Check className="w-4 h-4 text-cyan-400 stroke-[3]" />}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">{g.desc}</p>
                </button>
              ))}
            </div>

            {/* Objetivos Secundários */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-400 block mb-1.5">
                Objetivos Secundários (Toque para marcar/desmarcar):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {FITNESS_GOALS_LIST.filter(g => g.id !== goal).map(g => {
                  const isSelected = secondaryGoals.includes(g.id);
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => toggleSecondaryGoal(g.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 glow-purple'
                          : 'bg-white/[0.04] text-slate-400 border border-white/5 hover:text-white'
                      }`}
                    >
                      <span>{g.emoji}</span>
                      <span>{g.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. Equipamentos Disponíveis */}
          <div className="space-y-2.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-amber-400" />
              3. Equipamentos que Você Possui
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {EQUIPMENT_OPTIONS.map(eq => {
                const isSelected = equipments.includes(eq.id);
                return (
                  <button
                    key={eq.id}
                    type="button"
                    onClick={() => toggleEquipment(eq.id)}
                    className={`p-2.5 rounded-2xl border text-left transition active:scale-95 flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-sm'
                        : 'bg-white/[0.03] border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-lg shrink-0">{eq.icon}</span>
                    <span className="text-xs font-bold leading-tight">{eq.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Tempo Disponível por Sessão & Frequência Semanal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tempo Disponível */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-400" />
                4. Tempo por Treino
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {([15, 20, 30, 45, 60] as const).map(mins => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => {
                      soundManager.triggerHaptic([15]);
                      setDurationMinutes(mins);
                    }}
                    className={`py-2 rounded-xl text-xs font-black transition active:scale-95 ${
                      durationMinutes === mins
                        ? 'bg-teal-400 text-slate-950 font-black shadow'
                        : 'bg-white/[0.04] text-slate-400 border border-white/5 hover:text-white'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            {/* Frequência Semanal */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                5. Dias por Semana
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[2, 3, 4, 5, 6].map(days => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => {
                      soundManager.triggerHaptic([15]);
                      setFrequencyDays(days);
                    }}
                    className={`py-2 rounded-xl text-xs font-black transition active:scale-95 ${
                      frequencyDays === days
                        ? 'bg-emerald-500 text-slate-950 font-black shadow'
                        : 'bg-white/[0.04] text-slate-400 border border-white/5 hover:text-white'
                    }`}
                  >
                    {days}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 5. Preferências de Treinamento */}
          <div className="space-y-3 p-4 rounded-3xl bg-white/[0.02] border border-white/5">
            <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              6. Preferências de Treinamento
            </span>

            {/* Foco de Distribuição */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-1.5">Divisão Preferida:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {[
                  { id: 'equilibrado', label: 'Equilibrado' },
                  { id: 'superiores', label: 'Foco Superiores' },
                  { id: 'inferiores', label: 'Foco Pernas' },
                  { id: 'skills_isometria', label: 'Skills & Isometrias' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFocusStyle(opt.id as any)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition ${
                      focusStyle === opt.id
                        ? 'bg-purple-500/25 border border-purple-500/50 text-purple-300'
                        : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Descanso Padrão */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-1.5">Descanso Entre Séries:</span>
              <div className="flex gap-2">
                {[30, 45, 60, 90, 120].map(sec => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setPreferredRestSeconds(sec)}
                    className={`flex-1 py-1 rounded-xl text-[11px] font-bold font-mono transition ${
                      preferredRestSeconds === sec
                        ? 'bg-cyan-500 text-slate-950 font-black'
                        : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>

            {/* Inclusão de Aquecimento e Alongamento */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIncludeWarmup(!includeWarmup)}
                className={`p-2.5 rounded-2xl border text-xs font-bold flex items-center justify-between transition ${
                  includeWarmup
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-white/[0.02] border-white/5 text-slate-400'
                }`}
              >
                <span>Aquecimento Articular</span>
                <span className={`w-3.5 h-3.5 rounded-full ${includeWarmup ? 'bg-emerald-400' : 'bg-slate-700'}`} />
              </button>

              <button
                type="button"
                onClick={() => setIncludeStretching(!includeStretching)}
                className={`p-2.5 rounded-2xl border text-xs font-bold flex items-center justify-between transition ${
                  includeStretching
                    ? 'bg-teal-500/15 border-teal-500/40 text-teal-300'
                    : 'bg-white/[0.02] border-white/5 text-slate-400'
                }`}
              >
                <span>Alongamento Final</span>
                <span className={`w-3.5 h-3.5 rounded-full ${includeStretching ? 'bg-teal-400' : 'bg-slate-700'}`} />
              </button>
            </div>
          </div>

          {/* 6. Limitações Articulares (Segurança CREF) */}
          <div className="space-y-2.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-400" />
              7. Desconfortos ou Limitações Articulares
            </label>
            <p className="text-[11px] text-slate-400">
              Selecione caso sinta dor ou recomendação médica em alguma região. O gerador filtrará automaticamente exercícios com torque articular excessivo.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {JOINT_LIMITATIONS_LIST.map(lim => {
                const isSelected = limitations.includes(lim.id);
                return (
                  <button
                    key={lim.id}
                    type="button"
                    onClick={() => toggleLimitation(lim.id)}
                    className={`p-3 rounded-2xl border text-left transition active:scale-95 ${
                      isSelected
                        ? 'bg-rose-500/20 border-rose-500/50 text-rose-200'
                        : 'bg-white/[0.03] border-white/5 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{lim.label}</span>
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                          isSelected ? 'bg-rose-500 text-white font-black' : 'border border-white/20'
                        }`}
                      >
                        {isSelected ? '✓' : ''}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">{lim.tip}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rodapé do Form */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3 sticky bottom-0 bg-slate-950/90 py-3 -mx-4 px-4 sm:-mx-6 sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl glass-card text-xs font-bold text-slate-300 hover:text-white"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className={`px-6 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl transition active:scale-95 ${
                savedSuccess
                  ? 'bg-emerald-400 text-slate-950 glow-emerald'
                  : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 shadow-emerald-500/25 hover:brightness-110'
              }`}
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Perfil Salvo com Sucesso!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar Perfil de Treino</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

