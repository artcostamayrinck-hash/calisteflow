import React, { useState } from 'react';
import { soundManager } from '../../utils/audio';
import {
  ShieldCheck,
  AlertTriangle,
  Heart,
  X,
  Home as HomeIcon,
  Users,
  ClipboardCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useBodyScrollLock } from '../../utils/useBodyScrollLock';

interface SafeExecutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAudienceProgram?: (audienceId: string) => void;
}

type SafetyTab = 'golden_rules' | 'home_improv' | 'audiences' | 'cref_checklist';

export const SafeExecutionModal: React.FC<SafeExecutionModalProps> = ({
  isOpen,
  onClose,
  onSelectAudienceProgram,
}) => {
  const [activeTab, setActiveTab] = useState<SafetyTab>('golden_rules');
  useBodyScrollLock(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl glass-panel border border-white/10 rounded-3xl shadow-2xl p-5 sm:p-7 flex flex-col space-y-4 max-h-[min(92dvh,calc(100dvh-2rem))] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 glow-emerald">
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                Guia Biomecânico & Saúde
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-100 tracking-tight">
                Execução Segura na Calistenia
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              soundManager.triggerHaptic([20]);
              onClose();
            }}
            className="p-2 rounded-2xl glass-card text-slate-400 hover:text-white border border-white/10 transition active:scale-95"
            aria-label="Fechar Guia de Execução Segura"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 rounded-2xl bg-slate-900/60 border border-white/5 shrink-0">
          {[
            { id: 'golden_rules' as const, label: 'Regras de Ouro', icon: Heart },
            { id: 'home_improv' as const, label: 'Móveis & Casa', icon: HomeIcon },
            { id: 'audiences' as const, label: 'Por Público', icon: Users },
            { id: 'cref_checklist' as const, label: 'Checklist CREF', icon: ClipboardCheck },
          ].map(t => {
            const isActive = activeTab === t.id;
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  soundManager.triggerHaptic([20]);
                  setActiveTab(t.id);
                }}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95 ${isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 glow-emerald'
                    : 'text-slate-400 hover:text-slate-200'
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="truncate">{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Tab Content */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-1 text-xs sm:text-sm text-slate-300">
          {/* TAB 1: REGRAS DE OURO */}
          {activeTab === 'golden_rules' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-200 space-y-2">
                <div className="flex items-center gap-2 font-black text-rose-400 text-xs sm:text-sm">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>O Semáforo da Dor: Como interpretar os sinais do corpo</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold shrink-0">🟢 Verde:</span>
                    <span><strong>Queimação Muscular Localizada:</strong> É o acúmulo temporário de lactato e metabólitos no ventre muscular. É seguro e esperado.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold shrink-0">🟡 Amarelo:</span>
                    <span><strong>Desconforto ou Perda da Forma:</strong> Se a coluna arquear ou o ombro subir na orelha, finalize a série imediatamente. Não faça repetições feias.</span>
                  </div>
                  <div className="flex items-start gap-2 text-rose-300">
                    <span className="text-rose-400 font-bold shrink-0">🔴 Vermelho:</span>
                    <span><strong>Dor Aguda, Pontada ou Choque Articular:</strong> Pare imediatamente. Não treine &quot;em cima da dor&quot;. Lesões de tendão demoram meses para cicatrizar.</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl glass-card border border-white/5 space-y-1.5">
                  <h4 className="font-bold text-slate-100 flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Aquecimento Articular Mandatório
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Dedique 3 a 5 minutos para mobilizar punhos, escápulas e quadris antes do primeiro exercício. Tendões e ligamentos são avasculares e precisam de temperatura elevada para ganhar elasticidade.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl glass-card border border-white/5 space-y-1.5">
                  <h4 className="font-bold text-slate-100 flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Padrão Respiratório Consciente
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Expire pela boca no momento da subida/força concêntrica (ao empurrar ou puxar). Inspire pelo nariz na fase controlada da descida. Evite apneia prolongada que eleva a pressão arterial.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TREINO EM CASA & MÓVEIS */}
          {activeTab === 'home_improv' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 text-xs">
                A calistenia caseira é extremamente acessível, mas requer atenção redobrada à estabilidade dos apoios para prevenir quedas.
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl glass-card border border-white/5 space-y-1.5">
                  <span className="font-bold text-slate-100 text-xs flex items-center gap-2">
                    🪑 1. Cadeira para Dips e Búlgaros
                  </span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    <strong>Regra:</strong> A cadeira DEVE estar encostada firmemente contra uma parede. NUNCA a utilize em piso liso ou com tapete solto. Teste se as pernas da cadeira suportam seu peso sem estalar antes de iniciar.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl glass-card border border-white/5 space-y-1.5">
                  <span className="font-bold text-slate-100 text-xs flex items-center gap-2">
                    🚪 2. Porta Fechada com Toalha (Remada Australiana)
                  </span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    <strong>Regra:</strong> A porta deve fechar na direção <em>oposta</em> à que você está puxando, para que a sua força feche a porta em vez de abri-la. Tranque a fechadura e avise as outras pessoas da casa para não tocarem na maçaneta.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl glass-card border border-white/5 space-y-1.5">
                  <span className="font-bold text-slate-100 text-xs flex items-center gap-2">
                    🪑 3. Mesa de Jantar para Remada Invertida
                  </span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    <strong>Regra:</strong> Só utilize mesas de madeira maciça ou metal de 4 pés pesadas. Teste colocando livros pesados na outra extremidade ou peça para alguém segurar a mesa enquanto você realiza o movimento embaixo dela.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROGRAMAS ESTRUTURADOS POR PÚBLICO */}
          {activeTab === 'audiences' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <p className="text-xs text-slate-400">
                O CalisteFlow possui rotinas adaptadas para necessidades corporais e momentos de vida específicos:
              </p>

              <div className="space-y-2.5">
                {[
                  {
                    id: 'prog-iniciante-absoluto',
                    title: 'Iniciante Absoluto',
                    badge: 'Zero Equipamento',
                    desc: 'Foco em flexões inclinadas na parede/mesa e agachamento assistido para quem nunca treinou e quer construir base sem dor.',
                  },
                  {
                    id: 'prog-mulheres-funcional',
                    title: 'Mulheres: Força Funcional & Postura',
                    badge: 'Glúteos & Core',
                    desc: 'Prioriza cadeia posterior, estabilização escapular e progressão segura rumo às primeiras barras e flexões completas.',
                  },
                  {
                    id: 'prog-40-longevidade',
                    title: '40+ Longevidade Articular & Controle',
                    badge: 'Baixo Impacto',
                    desc: 'Cadência lenta e controlada (3 segundos na descida), sem impacto, com proteção para bursas e discos intervertebrais.',
                  },
                  {
                    id: 'prog-retorno-pausa',
                    title: 'Retorno Pós-Pausa',
                    badge: 'Volume 50%',
                    desc: 'Volume calibrado para reativar as vias neuromusculares de quem parou por semanas, sem causar dor muscular tardia debilitante.',
                  },
                  {
                    id: 'prog-casa-improvisos',
                    title: 'Em Casa com Móveis Seguros',
                    badge: 'Cadeiras & Portas',
                    desc: 'Treino inteligente utilizando apoios domésticos testados, com instruções precisas de segurança contra tombamento.',
                  },
                ].map(aud => (
                  <div
                    key={aud.id}
                    className="p-3.5 rounded-2xl glass-card border border-white/5 flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-xs text-slate-100">{aud.title}</span>
                        <span className="text-[10px] font-extrabold px-2 py-0.2 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          {aud.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{aud.desc}</p>
                    </div>

                    {onSelectAudienceProgram && (
                      <button
                        type="button"
                        onClick={() => {
                          soundManager.triggerHaptic([30]);
                          onSelectAudienceProgram(aud.id);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-emerald-500/20 text-emerald-300 font-bold text-[11px] shrink-0 border border-white/5 active:scale-95 transition"
                      >
                        Ver Treino
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CHECKLIST CREF PARA PROFISSIONAIS */}
          {activeTab === 'cref_checklist' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>
                  Checklist Técnico de Cinesiologia e Biomecânica para auditoria por Profissionais de Educação Física (CREF):
                </span>
              </div>

              <div className="space-y-2">
                {[
                  {
                    num: '1',
                    title: 'Alinhamento Axial e Pélvico',
                    criterion: 'Verificar se a coluna mantém curvaturas fisiológicas, com ativação do transverso abdominal e leve retroversão pélvica em pranchas e flexões.',
                  },
                  {
                    num: '2',
                    title: 'Ritmo Escapuloumeral e Depressão',
                    criterion: 'Garantir que as escápulas iniciem o movimento de puxada e que permaneçam deprimidas (ombros longe das orelhas) durante mergulhos e flexões.',
                  },
                  {
                    num: '3',
                    title: 'Trajetória dos Cotovelos no Empurrar',
                    criterion: 'Ângulo de 45° a 60° em relação à caixa torácica. Evitar a abdução a 90° que causa impacto e atrito na bursa subacromial.',
                  },
                  {
                    num: '4',
                    title: 'Alinhamento dos Joelhos no Agachar',
                    criterion: 'Ausência total de valgo dinâmico (joelhos colapsando para dentro). Os joelhos devem rastrear paralelamente a linha dos 2º e 3º dedos do pé.',
                  },
                  {
                    num: '5',
                    title: 'Cadência Excêntrica Controlada',
                    criterion: 'Garantir tempo sob tensão de no mínimo 2 a 3 segundos na descida, sem rebote ou choque mecânico em tendões terminais.',
                  },
                  {
                    num: '6',
                    title: 'Critério de Progressão Fechada',
                    criterion: 'O aluno só deve avançar de alavanca (ex.: da flexão normal para a diamante) após dominar 3 séries de 12 repetições estritas sem perda de forma.',
                  },
                ].map(item => (
                  <div
                    key={item.num}
                    className="p-3 rounded-2xl glass-card border border-white/5 flex items-start gap-3"
                  >
                    <span className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-400 font-mono font-black text-xs flex items-center justify-center shrink-0 border border-emerald-500/30">
                      {item.num}
                    </span>
                    <div>
                      <span className="font-bold text-xs text-slate-100 block">{item.title}</span>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        {item.criterion}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-[11px] text-slate-400">
                Responsável Técnico: <strong>Prof. Ricardo Santos</strong> • CREF 084129-G/SP (Especialista em Cinesiologia e Calistenia).
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-white/10 flex justify-end shrink-0">
          <button
            type="button"
            onClick={() => {
              soundManager.triggerHaptic([20]);
              onClose();
            }}
            className="min-h-[48px] px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 font-black text-xs hover:brightness-110 active:scale-95 transition shadow-lg shadow-emerald-500/25 glow-emerald"
          >
            Entendido, Treinar com Segurança
          </button>
        </div>
      </div>
    </div>
  );
};

