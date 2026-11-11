/**
 * Galeria Interativa de Comparação dos 4 Estilos de Figura e Variações de Avatar
 * Permite visualizar simultaneamente a mesma pose (ex: Flexão Inclinada) nos 4 estilos:
 * 1. Manequim Neutro
 * 2. Anatômico Simplificado
 * 3. Silhueta Sólida
 * 4. Contorno (Neon 2px)
 * Com controles ao vivo de modelo (masculino/feminino/neutro), biotipo, tom de pele, roupa, cabelo e modo daltônico.
 */

import React, { useState, useMemo } from 'react';
import {
  X,
  Check,
  Sliders,
  Shield,
  ZoomIn,
  ZoomOut,
  Layers,
} from 'lucide-react';
import { useBodyScrollLock } from '../../../utils/useBodyScrollLock';
import { getAvatarSettings, saveAvatarSettings } from '../../../utils/appSettings';
import type {
  FigureStyle,
  AvatarGender,
  AvatarBiotype,
  AvatarSkinTone,
  AvatarHairStyle,
  AvatarClothing,
  AvatarSettings,
} from './types';
import { SKIN_TONE_PALETTES } from './constants';
import { getAnimationDefForExercise } from './poseDatabase';
import { ExerciseFigure } from './ExerciseFigure';

interface StyleComparisonGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialExerciseId?: string;
}

export const StyleComparisonGalleryModal: React.FC<StyleComparisonGalleryModalProps> = ({
  isOpen,
  onClose,
  initialExerciseId = 'flexao-inclinada',
}) => {
  useBodyScrollLock(isOpen, onClose);

  // Estado local sincronizado com as configurações salvas do usuário
  const [avatar, setAvatar] = useState<AvatarSettings>(() => getAvatarSettings());
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(initialExerciseId);
  const [isTest120px, setIsTest120px] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Exercícios disponíveis para teste da pose
  const demoExercises = useMemo(() => [
    { id: 'flexao-inclinada', name: 'Flexão Inclinada (Apoio em Caixa)' },
    { id: 'pushup', name: 'Flexão de Braços Tradicional' },
    { id: 'squat', name: 'Agachamento Livre' },
    { id: 'pullup', name: 'Barra Fixa (Pronada)' },
    { id: 'plank', name: 'Prancha Isométrica' },
    { id: 'dip', name: 'Mergulho em Paralelas' },
  ], []);

  const activeDemo = useMemo(() => {
    return (
      demoExercises.find(e => e.id === selectedExerciseId) ||
      demoExercises[0]
    );
  }, [demoExercises, selectedExerciseId]);

  const animationDef = useMemo(() => {
    return getAnimationDefForExercise(activeDemo.id, activeDemo.name);
  }, [activeDemo]);

  if (!isOpen) return null;

  const updateAvatar = <K extends keyof AvatarSettings>(key: K, value: AvatarSettings[K]) => {
    setAvatar(prev => {
      const next = { ...prev, [key]: value };
      saveAvatarSettings(next);
      return next;
    });
    setSaveSuccessMsg('Preferência salva!');
    setTimeout(() => setSaveSuccessMsg(null), 2000);
  };

  const setPreferredStyle = (style: FigureStyle) => {
    updateAvatar('preferredStyle', style);
  };

  const styleCards: {
    id: FigureStyle;
    title: string;
    subtitle: string;
    tag: string;
    desc: string;
    recommendedFor: string;
  }[] = [
    {
      id: 'mannequin',
      title: 'Manequim Neutro',
      subtitle: 'Padrão em Listas & Miniaturas',
      tag: 'Minimalista',
      desc: 'Figura lisa em cinza-azulado com juntas esféricas marcadas nos pontos de articulação. Sem distração facial.',
      recommendedFor: 'Listas densas, biblioteca e rápida identificação da postura.',
    },
    {
      id: 'anatomical',
      title: 'Anatômico Simplificado',
      subtitle: 'Padrão em Detalhes & Progressões',
      tag: 'Completo',
      desc: 'Pele com iluminação vertical coerente, vestimenta atlética personalizável e ativação muscular dinâmica em esmeralda e ciano.',
      recommendedFor: 'Telas de detalhe, aprendizado técnico e visualização dos músculos alvo.',
    },
    {
      id: 'silhouette',
      title: 'Silhueta Sólida',
      subtitle: 'Modo Treino de Alto Contraste',
      tag: 'Alto Contraste',
      desc: 'Forma geométrica pura em tom de marfim/giz sobre fundo escuro. Sem linhas internas para legibilidade máxima.',
      recommendedFor: 'Treino ativo ao sol, telas pequenas e visualização periférica.',
    },
    {
      id: 'outline',
      title: 'Contorno (Neon 2px)',
      subtitle: 'Traço Ciano Futurista',
      tag: 'Wireframe',
      desc: 'Traço vetorizado de 2 px com nós luminosos nas juntas. Cumpre rigorosamente contraste AA mesmo em 120 px.',
      recommendedFor: 'Visual moderno e elegante com consumo visual ultraleve.',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-6xl glass-panel border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[94vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between shrink-0 glass-panel">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-black text-slate-100">
                  Estilos de Figura & Personalização
                </h2>
                {saveSuccessMsg && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-in fade-in">
                    ✓ Salvo
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                A mesma pose biomecânica renderizada simultaneamente nos 5 estilos com suporte a variações
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition"
            aria-label="Fechar galeria de estilos"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area: Configs Bar + 5 Styles Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Seção de Controles Interativos Globais */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4 shadow-inner">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>Painel de Variações em Tempo Real (Ajustes → Avatar)</span>
              </div>

              {/* Botão de Teste em 120px */}
              <button
                type="button"
                onClick={() => setIsTest120px(prev => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                  isTest120px
                    ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {isTest120px ? <ZoomIn className="w-3.5 h-3.5" /> : <ZoomOut className="w-3.5 h-3.5" />}
                <span>{isTest120px ? 'Tamanho Normal' : 'Testar em 120 px (Miniatura)'}</span>
              </button>
            </div>

            {/* Linha de Controles: Pose, Gênero, Biotipo, Roupa, Tom de Pele, Modo Daltônico */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
              {/* 1. Pose Demonstrativa */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Pose de Teste
                </label>
                <select
                  value={selectedExerciseId}
                  onChange={e => setSelectedExerciseId(e.target.value)}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-400"
                >
                  {demoExercises.map(ex => (
                    <option key={ex.id} value={ex.id}>
                      {ex.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Modelo / Gênero */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Modelo (Gênero)
                </label>
                <div className="grid grid-cols-3 gap-1 bg-slate-900/80 p-1 rounded-xl border border-white/10 text-xs">
                  {(['masculino', 'feminino', 'neutro'] as AvatarGender[]).map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => updateAvatar('gender', g)}
                      className={`py-1 rounded-lg font-bold text-[11px] capitalize transition ${
                        avatar.gender === g
                          ? 'bg-emerald-500 text-slate-950 shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Biotipo */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Biotipo
                </label>
                <div className="grid grid-cols-4 gap-1 bg-slate-900/80 p-1 rounded-xl border border-white/10 text-xs">
                  {(['magro', 'medio', 'atletico', 'maior'] as AvatarBiotype[]).map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => updateAvatar('biotype', b)}
                      className={`py-1 rounded-lg font-bold text-[10px] capitalize transition ${
                        avatar.biotype === b
                          ? 'bg-emerald-500 text-slate-950 shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {b === 'atletico' ? 'Atlét.' : b}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Roupa */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Vestimenta
                </label>
                <div className="grid grid-cols-3 gap-1 bg-slate-900/80 p-1 rounded-xl border border-white/10 text-xs">
                  {(['bermuda', 'regata', 'camiseta'] as AvatarClothing[]).map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => updateAvatar('clothing', c)}
                      className={`py-1 rounded-lg font-bold text-[10px] capitalize transition ${
                        avatar.clothing === c
                          ? 'bg-emerald-500 text-slate-950 shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {c === 'bermuda' ? 'Nu' : c}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Tom de Pele */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Tom de Pele
                </label>
                <div className="flex items-center justify-between gap-1 bg-slate-900/80 p-1.5 rounded-xl border border-white/10">
                  {(Object.keys(SKIN_TONE_PALETTES) as AvatarSkinTone[]).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => updateAvatar('skinTone', t)}
                      title={SKIN_TONE_PALETTES[t].name}
                      style={{ backgroundColor: SKIN_TONE_PALETTES[t].skinTop }}
                      className={`w-5 h-5 rounded-full border-2 transition transform ${
                        avatar.skinTone === t
                          ? 'border-white scale-110 shadow-md ring-2 ring-emerald-400'
                          : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* 6. Cabelo */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Cabelo
                </label>
                <div className="grid grid-cols-4 gap-1 bg-slate-900/80 p-1 rounded-xl border border-white/10 text-xs">
                  {(['curto', 'longo', 'preso', 'careca'] as AvatarHairStyle[]).map(h => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => updateAvatar('hairStyle', h)}
                      className={`py-1 rounded-lg font-bold text-[10px] capitalize transition ${
                        avatar.hairStyle === h
                          ? 'bg-emerald-500 text-slate-950 shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              {/* 7. Modo Daltônico com Listras */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Modo Daltônico
                </label>
                <button
                  type="button"
                  onClick={() => updateAvatar('colorBlindMode', !avatar.colorBlindMode)}
                  className={`w-full py-1.5 px-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
                    avatar.colorBlindMode
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{avatar.colorBlindMode ? 'Laranja/Azul' : 'Padrão'}</span>
                  <span className={`w-2.5 h-2.5 rounded-full ${avatar.colorBlindMode ? 'bg-amber-400 shadow' : 'bg-slate-600'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Grid dos 5 Estilos com a Mesma Pose */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Comparativo da Mesma Pose ({activeDemo.name}) nos 5 Estilos
              </h3>
              <span className="text-xs text-slate-400">
                Estilo ativo padrão: <strong className="text-emerald-400 capitalize">{avatar.preferredStyle}</strong>
              </span>
            </div>

            <div className={`grid gap-4 ${isTest120px ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'}`}>
              {styleCards.map(s => {
                const isSelected = avatar.preferredStyle === s.id;

                return (
                  <div
                    key={s.id}
                    className={`glass-card rounded-2xl border transition overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-500/60 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    {/* Header do Card */}
                    <div className="p-3.5 border-b border-white/5 flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-sm text-slate-100">{s.title}</span>
                          <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/[0.06] text-slate-300 border border-white/10">
                            {s.tag}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{s.subtitle}</p>
                      </div>

                      {isSelected && (
                        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          <Check className="w-3 h-3" /> Padrão
                        </span>
                      )}
                    </div>

                    {/* Palco SVG da Figura no Estilo Correspondente */}
                    <div className={`p-3 flex items-center justify-center bg-slate-950/40 ${isTest120px ? 'min-h-[140px]' : ''}`}>
                      <div className={`${isTest120px ? 'w-[120px] h-[90px]' : 'w-full max-w-[380px]'} aspect-[4/3] rounded-xl overflow-hidden border border-white/10 shadow-md`}>
                        <ExerciseFigure
                          animationDef={animationDef}
                          style={s.id}
                          avatarSettings={avatar}
                          showControls={false}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Descrição e Botão de Ação */}
                    {!isTest120px && (
                      <div className="p-3.5 border-t border-white/5 space-y-3">
                        <p className="text-xs text-slate-300 leading-relaxed">{s.desc}</p>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          <strong className="text-slate-300">Uso ideal:</strong> {s.recommendedFor}
                        </div>

                        <button
                          type="button"
                          onClick={() => setPreferredStyle(s.id)}
                          className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border ${
                            isSelected
                              ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-extrabold cursor-default'
                              : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200 hover:text-white'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-4 h-4 stroke-[3]" /> Estilo Definido como Padrão
                            </>
                          ) : (
                            'Definir como Estilo Padrão'
                          )}
                        </button>
                      </div>
                    )}

                    {/* Botão compacto se em modo teste 120px */}
                    {isTest120px && (
                      <div className="p-2 border-t border-white/5">
                        <button
                          type="button"
                          onClick={() => setPreferredStyle(s.id)}
                          className={`w-full py-1 rounded-lg text-[10px] font-bold border transition ${
                            isSelected
                              ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                              : 'bg-white/5 text-slate-300 hover:text-white border-white/10'
                          }`}
                        >
                          {isSelected ? '✓ Padrão' : 'Escolher'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 glass-panel flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Todos os estilos cumprem contraste AA em fundo escuro e são legíveis em 120 px.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black transition active:scale-95 shadow-lg shadow-emerald-500/20"
          >
            Pronto
          </button>
        </div>
      </div>
    </div>
  );
};
