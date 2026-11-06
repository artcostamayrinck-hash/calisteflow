# Checklist de Lançamento e Garantia de Qualidade: CalisteFlow

Este documento reúne o protocolo de validação pré-lançamento para garantir estabilidade, segurança jurídica, conformidade com LGPD/GDPR e excelência na experiência do usuário sob condições reais de treino.

---

## 1. Checklist Técnico de Produção

### A. Meta Tags, SEO e PWA Manifest
- [x] **Viewport Mobile-First:** `width=device-width, initial-scale=1.0, viewport-fit=cover` (zoom habilitado, safe areas ativadas).
- [x] **Meta Description Otimizada:** Descrição clara e concisa em português (`pt-BR`).
- [x] **Open Graph & Twitter Cards:** `og:title`, `og:description`, `og:image`, `og:type=website` para prévias atraentes ao compartilhar links no WhatsApp e redes sociais.
- [x] **Web App Manifest:** Nome curto, cores de tema (`#020617`), ícones maskable/any e App Shortcuts configurados (`shortcuts`).
- [x] **Lighthouse Score Alvo:** Performance >= 95, Acessibilidade >= 95, Boas Práticas >= 95, PWA Instalável = 100.

### B. Safe Areas e Ergonomia iOS/Android
- [x] Barra inferior (`BottomNav`) com `padding-bottom: max(16px, env(safe-area-inset-bottom))`.
- [x] Alvos de toque com altura mínima de **48px** e espaçamento adequado para dedos úmidos.
- [x] Contraste de cores nível WCAG AA (texto claro sobre fundos escuros slate-950/slate-900).
- [x] Respeito à preferência de sistema `prefers-reduced-motion`.

### C. Resiliência Offline e Dados
- [x] Service Worker configurado para cache de recursos essenciais (Cache-First para assets versionados, Network-First para HTML).
- [x] Fallback offline completo: todas as rotinas, biblioteca de exercícios, mapa muscular e temporizador funcionam sem internet.
- [x] Salvamento automático de progresso a cada série registrada no `localStorage`.
- [x] Banner de recuperação automática de treino caso o aplicativo seja encerrado inesperadamente.
- [x] Backup e restauração JSON em **Histórico > Exportar/Importar Dados**.

---

## 2. Termo de Saúde e Política de Privacidade (Resumo LGPD / GDPR)

### Política de Privacidade 100% Client-Side
1. **Zero Coleta de Dados Pessoais:** O CalisteFlow não armazena nome, e-mail, telefone, peso, fotos ou localização do usuário em nenhum servidor.
2. **Armazenamento Estritamente Local:** Todo o histórico de treinos, rotinas customizadas, streaks e perfil são gravados única e exclusivamente no armazenamento do próprio navegador do usuário (`localStorage`).
3. **Telemetria de Erros e Feedback:**
   - O botão "Reportar Erro" coleta apenas dados técnicos anônimos (versão do app, tipo de dispositivo, resolução de tela, navegador e status online/offline).
   - Nenhuma informação de identificação pessoal (PII) é transmitida.
4. **Direito de Eliminação:** O usuário pode a qualquer momento apagar todos os dados do app clicando em "Limpar Dados" nas configurações ou limpando os dados do navegador.

### Termo de Segurança & Isenção Médica
- O CalisteFlow exibe na primeira abertura um **Termo de Conscientização de Saúde**.
- O app não substitui acompanhamento médico, fisioterápico ou de um profissional de Educação Física habilitado (CREF).
- Regra de ouro da dor: o usuário é expressamente orientado a interromper imediatamente qualquer movimento ao sinal de "dor de pontada" em articulações ou tendões.
- Os exercícios de calistenia contam com indicações de cuidados articulares e notas de execução biomecânica revisadas por profissional com registro CREF.

---

## 3. Protocolo de Testes Beta com 5 Usuários Reais

Para validar o aplicativo em condições reais de calistenia antes de divulgar massivamente, conduzir o seguinte roteiro com 5 perfis distintos:

| Perfil | Dispositivo | Cenário de Teste | Critério de Sucesso |
| :--- | :--- | :--- | :--- |
| **Usuário 1 (Iniciante)** | Android de entrada (Motorola/Samsung básico) | 1º Treino em casa no quarto | Concluir onboarding em < 2 min; entender descansos sem travar o celular. |
| **Usuário 2 (Intermediário)** | iPhone com Safari (Modo PWA Tela Cheia) | Treino em praça pública sob luz solar forte | Legibilidade do cronômetro a 1,5m de distância; contraste sob luz do sol. |
| **Usuário 3 (Avançado)** | iPhone ou Android recente | Treino de alta intensidade com mãos suadas | Alvos de toque de 48px respondem com facilidade; vibração de fim de descanso é perceptível. |
| **Usuário 4 (Offline)** | Qualquer smartphone | Treino em modo avião (sem sinal) | App abre instantaneamente; sons e cronômetro funcionam 100%; treino salvo no histórico. |
| **Usuário 5 (Interrupção)** | Celular durante chamada/notificação | Fechar o navegador no meio de uma série | Ao reabrir, banner amarelo surge permitindo retomar exatamente da série onde parou. |

### Roteiro de Perguntas Pós-Treino (Entrevista de 3 Minutos)
1. "Você sentiu necessidade de tirar a atenção do exercício para mexer no celular?"
2. "O volume e a vibração foram suficientes para saber quando o descanso acabou?"
3. "Você conseguiu entender as orientações posturais de cada exercício?"
4. "Houve alguma dúvida sobre quando parar se sentisse desconforto físico?"
