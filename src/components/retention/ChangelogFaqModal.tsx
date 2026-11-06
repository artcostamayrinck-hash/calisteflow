import React, { useState } from 'react';
import { soundManager } from '../../utils/audio';
import {
  Sparkles,
  HelpCircle,
  X,
  ChevronDown,
  ChevronUp,
  History,
  CheckCircle2,
} from 'lucide-react';

interface ChangelogFaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'faq' | 'changelog';
}

export const ChangelogFaqModal: React.FC<ChangelogFaqModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'faq',
}) => {
  const [activeTab, setActiveTab] = useState<'faq' | 'changelog'>(initialTab);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  if (!isOpen) return null;

  const faqs = [
    {
      q: 'O CalisteFlow funciona 100% offline sem internet?',
      a: 'Sim! Todos os dados de rotinas, histórico, mapa muscular e biblioteca de exercícios ficam gravados diretamente no armazenamento local do seu aparelho (LocalStorage/IndexedDB). Você pode treinar na praça, praia ou academia sem sinal.',
    },
    {
      q: 'Qual a diferença entre queimação muscular e dor de lesão?',
      a: 'A queimação muscular durante as repetições finais é resultado do acúmulo de íons e metabólitos no músculo trabalhado, sendo normal e saudável. Já pontadas agudas em articulações (ombros, punhos, joelhos ou lombar) são sinais de perigo: PARE o exercício imediatamente.',
    },
    {
      q: 'Como instalar o aplicativo na tela inicial do iPhone (iOS)?',
      a: 'No Safari, toque no botão de Compartilhar (ícone com quadrado e seta para cima no rodapé do navegador) e selecione "Adicionar à Tela de Início". O app abrirá em tela cheia como um aplicativo nativo.',
    },
    {
      q: 'Como instalar no Android?',
      a: 'No Google Chrome, toque nos três pontinhos no canto superior direito e selecione "Instalar aplicativo" ou toque no banner de instalação que surge na parte inferior da tela.',
    },
    {
      q: 'Como funciona o Streak Flexível?',
      a: 'No CalisteFlow, dias programados de descanso ativo e treinos curtos (de 10 ou 15 minutos) NÃO quebram sua sequência de treinos. Nós valorizamos a recuperação fisiológica tanto quanto o esforço.',
    },
    {
      q: 'Posso usar móveis comuns em casa para treinar?',
      a: 'Sim! Consulte nosso Guia de Execução Segura: sempre trave cadeiras firmemente contra a parede para fazer dips ou búlgaros, e certifique-se de que portas com toalha fechem na direção contrária à tração.',
    },
    {
      q: 'Como recuperar meu progresso se eu fechar o app no meio do treino?',
      a: 'O CalisteFlow possui salvamento contínuo em segundo plano. Ao reabrir o app, você verá um banner no topo permitindo retomar exatamente da série e segundo onde parou.',
    },
  ];

  const changelog = [
    {
      version: 'v1.7.0 (Atual)',
      date: 'Novembro 2026',
      title: 'Segurança, Conteúdo & Gestão de Risco (G1)',
      items: [
        'Aviso de saúde obrigatório na primeira abertura sem promessas médicas.',
        'Guia completo de Execução Segura com Semáforo da Dor e checklist de móveis.',
        '5 programas estruturados por público: Iniciante Absoluto, Mulheres, 40+, Retorno e Casa.',
        'Auditoria e registro de revisão técnica cinesiológica por profissional CREF nos exercícios.',
      ],
    },
    {
      version: 'v1.6.0',
      date: 'Novembro 2026',
      title: 'Redesign da Home & Ergonomia Mobile (F1)',
      items: [
        'Nova aba Home com botão primário "Treinar Agora" (1 toque para iniciar).',
        'Dock de navegação moderna com 5 abas e botão central elevado.',
        'Modo Mão Esquerda (inversão tátil) e Modo Texto Grande para treino.',
        'Microinterações táteis hápticas e respeito integral a prefers-reduced-motion.',
      ],
    },
    {
      version: 'v1.5.0',
      date: 'Novembro 2026',
      title: 'Questionário Inicial de Onboarding (Fase 3.5)',
      items: [
        'Fluxo de 8 perguntas com auto-save de rascunho.',
        'Calibração de objetivos, mini-teste de repetições e proteção para articulações.',
        'Tela de revisão final com edição rápida antes de gerar a semana.',
      ],
    },
    {
      version: 'v1.4.0',
      date: 'Novembro 2026',
      title: 'Vídeos Biomecânicos em Loop & Câmera Lenta',
      items: [
        'Player contínuo com alternância entre vídeo real e anatomia vetorial.',
        'Modo Slow-Motion (0.5x) para estudo preciso de trajetória articular.',
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-xl glass-panel border border-white/10 rounded-3xl shadow-2xl p-5 sm:p-7 flex flex-col space-y-4 max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 glow-cyan">
              <Sparkles className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 block">
                Central de Ajuda
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-100 tracking-tight">
                {activeTab === 'faq' ? 'Perguntas Frequentes (FAQ)' : 'Novidades & Atualizações'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl glass-card text-slate-400 hover:text-white border border-white/10 transition active:scale-95"
            aria-label="Fechar central"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-900/60 border border-white/5 shrink-0">
          <button
            onClick={() => {
              soundManager.triggerHaptic([15]);
              setActiveTab('faq');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95 ${
              activeTab === 'faq'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 glow-emerald'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Perguntas (FAQ)</span>
          </button>
          <button
            onClick={() => {
              soundManager.triggerHaptic([15]);
              setActiveTab('changelog');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95 ${
              activeTab === 'changelog'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 glow-emerald'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Novidades (Changelog)</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
          {activeTab === 'faq' ? (
            <div className="space-y-2">
              {faqs.map((faq, idx) => {
                const isExpanded = expandedFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl glass-card border border-white/5 overflow-hidden transition"
                  >
                    <button
                      onClick={() => {
                        soundManager.triggerHaptic([15]);
                        setExpandedFaqIndex(isExpanded ? null : idx);
                      }}
                      className="w-full p-3.5 text-left flex items-center justify-between gap-3 text-slate-200 font-bold hover:text-white"
                    >
                      <span className="leading-snug">{faq.q}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="px-3.5 pb-3.5 text-slate-400 leading-relaxed text-[11px] border-t border-white/5 pt-2">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {changelog.map((entry, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl glass-card border border-white/5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-extrabold text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                      {entry.version}
                    </span>
                    <span className="text-[10px] text-slate-500">{entry.date}</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-100">{entry.title}</h4>
                  <ul className="space-y-1 text-[11px] text-slate-400 pl-1">
                    {entry.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-white/10 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-200 font-bold text-xs transition active:scale-95"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
