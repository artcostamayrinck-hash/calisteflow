/**
 * PWA Service Worker Registration & Lifecycle Manager
 * Gerencia ciclo de vida do Service Worker, detecção de versão em espera (waiting)
 * e aplicação segura de atualizações sem quebrar a sessão do usuário.
 */

type UpdateListener = (waitingWorker: ServiceWorker) => void;

class PWAManager {
  private registration: ServiceWorkerRegistration | null = null;
  private waitingWorker: ServiceWorker | null = null;
  private updateListeners: Set<UpdateListener> = new Set();
  private isRefreshing: boolean = false;

  /**
   * Registra o Service Worker no navegador
   */
  public async register(): Promise<ServiceWorkerRegistration | null> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return null;
    }

    try {
      const isGhPages = window.location.pathname.startsWith('/calisteflow') || window.location.hostname.includes('github.io');
      const swUrl = isGhPages ? '/calisteflow/sw.js' : './sw.js';
      const scope = isGhPages ? '/calisteflow/' : './';
      const reg = await navigator.serviceWorker.register(swUrl, { scope });
      this.registration = reg;

      // 1. Caso já exista um worker aguardando na inicialização (ex: aba reaberta)
      if (reg.waiting) {
        this.setWaitingWorker(reg.waiting);
      }

      // 2. Monitorar novas instalações encontradas
      reg.addEventListener('updatefound', () => {
        const installingWorker = reg.installing;
        if (!installingWorker) return;

        installingWorker.addEventListener('statechange', () => {
          // Se completou a instalação e já existe um controlador ativo, significa que é uma nova versão!
          if (
            installingWorker.state === 'installed' &&
            navigator.serviceWorker.controller
          ) {
            this.setWaitingWorker(installingWorker);
          }
        });
      });

      // 3. Ouvir quando o novo Service Worker assume o controle da página
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!this.isRefreshing) {
          this.isRefreshing = true;
          window.location.reload();
        }
      });

      return reg;
    } catch (error) {
      console.warn('[PWAManager] Falha ao registrar Service Worker:', error);
      return null;
    }
  }

  /**
   * Define o worker aguardando e notifica os ouvintes da UI
   */
  private setWaitingWorker(worker: ServiceWorker) {
    this.waitingWorker = worker;
    this.notifyUpdateAvailable(worker);
    // Notifica também via evento global para compatibilidade com UpdatePromptBanner
    window.dispatchEvent(new CustomEvent('sw_update_available', { detail: { worker } }));
  }

  /**
   * Inscreve um ouvinte para quando uma atualização for detectada
   */
  public onUpdateAvailable(listener: UpdateListener): () => void {
    this.updateListeners.add(listener);
    // Se já houver um worker aguardando no momento da inscrição, notifica imediatamente
    if (this.waitingWorker) {
      listener(this.waitingWorker);
    }
    return () => {
      this.updateListeners.delete(listener);
    };
  }

  private notifyUpdateAvailable(worker: ServiceWorker) {
    this.updateListeners.forEach((listener) => {
      try {
        listener(worker);
      } catch (err) {
        console.error('[PWAManager] Erro no listener de atualização:', err);
      }
    });
  }

  /**
   * Força uma checagem de nova versão junto ao servidor/CDN
   */
  public async checkForUpdate(): Promise<boolean> {
    if (!this.registration) return false;
    try {
      await this.registration.update();
      return !!this.registration.waiting;
    } catch (err) {
      console.warn('[PWAManager] Erro ao checar atualização:', err);
      return false;
    }
  }

  /**
   * Aciona a atualização: instrui o worker em espera a executar skipWaiting
   */
  public applyUpdate(): boolean {
    if (!this.waitingWorker) {
      // Fallback: se não tiver referência direta, recarrega
      window.location.reload();
      return true;
    }
    this.waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    return true;
  }

  /**
   * Retorna se há um worker pronto aguardando confirmação do usuário
   */
  public hasPendingUpdate(): boolean {
    return !!this.waitingWorker;
  }
}

export const pwaManager = new PWAManager();

