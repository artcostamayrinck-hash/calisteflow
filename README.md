# ⚡ CalisteFlow — Aplicativo Web de Calistenia

Um aplicativo web moderno, responsivo e mobile-first (estilo PWA) desenvolvido em **React**, **TypeScript** e **Tailwind CSS** para gerenciamento de rotinas de calistenia, temporizadores de treino em tempo real e mapas anatômicos visuais.

---

## 🚀 Funcionalidades Principais

1. **Gerenciador de Rotinas:**
   - Seleção de rotinas prontas: *Push Day*, *Pull Day*, *Legs & Core*, *Full Body* e *Elite Skills*.
   - Criação de novas rotinas personalizadas do zero com séries, repetições, tempos de isometria e notas de execução.
   - Opções para duplicar, editar e excluir rotinas.

2. **Modo de Treino com Temporizadores (HUD Imersivo):**
   - Execução de treinos com cronômetro global em tempo real.
   - Temporizador regressivo automático para o tempo de descanso entre as séries (com botões de `+15s`, `-15s` e pular descanso).
   - Cronômetro dedicado para exercícios isométricos baseados em tempo (ex: prancha, L-sit, handstand hold, canoa).
   - Bipes sonoros nos últimos 3 segundos (3, 2, 1) e sinal comemorativo ao finalizar via **Web Audio API** nativa (100% offline).
   - Wake Lock API integrado para manter a tela do celular acesa durante a prática de exercícios.

3. **Instruções Gráficas e Visuais:**
   - Ilustrações e diagramas animados passo a passo demonstrando a postura correta, alinhamento articular e vetores de movimento.
   - Mapa anatômico interativo (Vista Frontal e Posterior) destacando grupos musculares primários (alvo) e secundários (sinergistas).
   - Filtro de exercícios por grupo muscular através do toque no mapa.
   - Lista de erros críticos e dicas de respiração para cada movimento.

4. **Histórico e Dados Locais:**
   - Armazenamento automático via `localStorage` (nenhuma dependência externa necessária).
   - Tela comemorativa de conclusão de treino com confetes dinâmicos, estatísticas de volume, avaliação de esforço percebido (RPE 1-10) e anotações.
   - Aba de histórico com contador de treinos, horas treinadas, total de séries e sequência ativa de dias (*streak* 🔥).

---

## 🛠️ Tecnologias Utilizadas

- **React 19**
- **TypeScript**
- **Tailwind CSS v4** + `@tailwindcss/vite`
- **Vite 8**
- **Lucide React** (Ícones modernos)
- **Canvas-Confetti** (Animação de celebração)
- **Web Audio API** (Sons e bipes offline sem necessidade de arquivos de áudio externos)

---

## 📦 Como Executar Localmente

1. Clone ou baixe o repositório:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd calisteapp
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Para gerar a build de produção:
   ```bash
   npm run build
   ```
