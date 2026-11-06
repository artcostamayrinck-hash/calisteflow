# Guia de Distribuição e Publicação nas Lojas: CalisteFlow

Este documento detalha o processo de empacotamento e distribuição do **CalisteFlow** nas duas principais lojas de aplicativos móveis (Google Play Store e Apple App Store), mantendo a arquitetura **local-first**, leve (< 160 kB gzipped) e sem dependência de servidores centralizados.

---

## 1. Google Play Store via TWA (Trusted Web Activity)

A abordagem recomendada para Android é o uso de **Trusted Web Activity (TWA)** através da ferramenta oficial do Google **Bubblewrap CLI**. O TWA empacota o PWA em um binário nativo Android (.apk / .aab) sem a sobrecarga de um navegador incorporado ou bridge pesada.

### Vantagens do TWA
- **Tamanho do instalador mínimo:** O APK/AAB gerado possui entre 2 MB e 3 MB.
- **Atualização contínua:** Qualquer alteração no deploy web (Vercel) reflete instantaneamente no app dos usuários sem necessidade de aprovação da Google Play a cada release.
- **Integração total com o sistema:** Ícone nativo, tela de splash suave, suporte a App Shortcuts e sem barra de URL do navegador.

### Passo a Passo de Execução com Bubblewrap

```bash
# 1. Instalar o Bubblewrap CLI globalmente
npm install -g @bubblewrap/cli

# 2. Inicializar o projeto a partir do manifesto do CalisteFlow
bubblewrap init --manifest https://calistenflow.vercel.app/manifest.json

# 3. Configurar keystore e assinatura digital
# O Bubblewrap guiará a criação de uma chave .keystore protegida por senha.

# 4. Gerar o Android App Bundle (.aab) para produção
bubblewrap build
```

### Configuração de Associação de Domínio (Digital Asset Links)
Para que o Android oculte a barra de URL e execute o app em tela cheia como aplicativo nativo confiável, o arquivo `assetlinks.json` deve estar disponível publicamente em `https://calistenflow.vercel.app/.well-known/assetlinks.json`:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "app.calisteflow.twa",
      "sha256_cert_fingerprints": [
        "14:6D:E9:7F:0F:52:CE:EB:2B:AE:EF:E4:12:37:31:37:E9:D6:68:3B:1F:56:23:A0:2B:0A:6B:36:DD:01:CE:F0"
      ]
    }
  }
]
```

### Requisitos e Custos na Google Play
- **Taxa de desenvolvedor:** US$ 25 (taxa única).
- **Verificação de identidade:** Documento com foto e comprovante de endereço.
- **Regra de 2023+ para contas pessoais:** Teste fechado obrigatório de 14 dias com pelo menos 12 testadores antes de solicitar publicação na trilha de produção.

---

## 2. Apple App Store via Capacitor

A Apple não suporta TWA. Para disponibilizar o CalisteFlow na App Store, a solução recomendada é o **Capacitor** (da Ionic Team), que empacota o código React/Vite dentro de um container nativo WKWebView de alto desempenho.

### Vantagens do Capacitor
- Código 100% compartilhado com a versão web.
- Acesso a APIs nativas do iOS (Haptics de alta precisão via Taptic Engine, MediaSession nativo no Control Center, Background Audio, Local Notifications locais).
- Armazenamento local persistente seguro via SQLite ou IndexedDB gerenciado pelo Safari WebKit.

### Instalação e Configuração

```bash
# 1. Instalar dependências do Capacitor no projeto
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/haptics

# 2. Inicializar o Capacitor
npx cap init CalisteFlow app.calisteflow.ios --web-dir dist

# 3. Gerar a build do Vite
npm run build

# 4. Adicionar a plataforma iOS
npx cap add ios

# 5. Sincronizar os assets e abrir no Xcode
npx cap sync
npx cap open ios
```

### Mitigação da Diretriz 4.2 da Apple (Minimum Functionality)
A Apple frequentemente rejeita PWAs empacotados que se comportem como "apenas um site na moldura de um app". Para garantir aprovação em 1ª instância:
1. **Diferencial Nativo Ativo:**
   - O CalisteFlow utiliza vibrações Taptic Engine específicas para contagem de reps, recordes pessoais e fim de descanso.
   - Suporte completo a tela bloqueada via Media Session API (pausar, pular série).
   - Funcionamento 100% offline (sem tela branca se abrir o app no modo avião).
2. **Safe Areas & Gestos:**
   - Respeito à Dynamic Island e Home Indicator (`viewport-fit=cover`, `env(safe-area-inset-bottom)`).
   - Zero zoom indesejado por duplo toque.
3. **Privacidade Transparente:**
   - Sem telas de login forçado na abertura.
   - Sem rastreadores de terceiros (zero cookies de publicidade, LGPD compliant).

### Requisitos e Custos na Apple App Store
- **Apple Developer Program:** US$ 99/ano.
- **Hardware:** Computador com macOS atualizado e Xcode 15+.
- **Revisão:** Análise manual por revisor da Apple (geralmente 24 a 48 horas úteis).

---

## 3. Matriz Comparativa de Distribuição

| Critério | PWA Direto (Web) | Google Play (TWA) | Apple App Store (Capacitor) |
| :--- | :--- | :--- | :--- |
| **Custo Inicial** | R$ 0 (Vercel Hobby) | US$ 25 (único) | US$ 99/ano |
| **Tempo de Atualização** | Imediato (Git push) | Imediato (deploy web) | Instantâneo com Live Updates ou 24h via App Store |
| **Descoberta Orgânica** | SEO & Redes | Alta busca na Play Store | Alta busca na App Store |
| **Acesso a Recursos** | Web APIs (Service Worker, MediaSession) | Web APIs + Notificações Android | APIs Nativas + Taptic Engine + WKWebView |
| **Risco de Rejeição** | Zero (total liberdade) | Mínimo (apenas conformidade) | Moderado (Diretriz 4.2 / UI nativa) |
| **Complexidade DevOps** | Baixa | Média (Keytool + CLI) | Média-Alta (Xcode + Certificados) |
