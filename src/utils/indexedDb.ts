/**
 * CalisteFlow IndexedDB Storage Engine
 * Fornece persistência assíncrona de alta capacidade para sessões, rotinas e backups,
 * superando os limites de 5MB e purgas agressivas do Safari iOS.
 */

const DB_NAME = 'calisteflow_db_v2';
const DB_VERSION = 2;

export interface MigrationResult {
  success: boolean;
  migratedSessions: number;
  migratedRoutines: number;
  error?: string;
  rollbackPerformed?: boolean;
}

class CalisteFlowIDB {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<IDBDatabase | null> | null = null;

  public async getDB(): Promise<IDBDatabase | null> {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return null;
    }
    if (this.db) return this.db;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve) => {
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;

          if (!db.objectStoreNames.contains('sessions')) {
            const sessionsStore = db.createObjectStore('sessions', { keyPath: 'id' });
            sessionsStore.createIndex('date', 'date', { unique: false });
          }

          if (!db.objectStoreNames.contains('routines')) {
            db.createObjectStore('routines', { keyPath: 'id' });
          }

          if (!db.objectStoreNames.contains('backups')) {
            db.createObjectStore('backups', { keyPath: 'key' });
          }

          if (!db.objectStoreNames.contains('kv_store')) {
            db.createObjectStore('kv_store', { keyPath: 'key' });
          }
        };

        request.onsuccess = (event) => {
          this.db = (event.target as IDBOpenDBRequest).result;
          resolve(this.db);
        };

        request.onerror = (err) => {
          console.warn('[IDB] Erro ao abrir IndexedDB, usando fallback localStorage:', err);
          resolve(null);
        };
      } catch (err) {
        console.warn('[IDB] IndexedDB indisponível:', err);
        resolve(null);
      }
    });

    return this.initPromise;
  }

  public async put<T>(storeName: string, item: T): Promise<boolean> {
    const db = await this.getDB();
    if (!db) return false;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        store.put(item);

        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
  }

  public async get<T>(storeName: string, key: IDBValidKey): Promise<T | null> {
    const db = await this.getDB();
    if (!db) return null;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.get(key);

        req.onsuccess = () => resolve(req.result ? (req.result as T) : null);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }

  public async getAll<T>(storeName: string): Promise<T[]> {
    const db = await this.getDB();
    if (!db) return [];

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.getAll();

        req.onsuccess = () => resolve(Array.isArray(req.result) ? (req.result as T[]) : []);
        req.onerror = () => resolve([]);
      } catch {
        resolve([]);
      }
    });
  }

  public async delete(storeName: string, key: IDBValidKey): Promise<boolean> {
    const db = await this.getDB();
    if (!db) return false;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        store.delete(key);

        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
  }

  /**
   * Migração segura do localStorage com backup prévio e rollback automático
   */
  public async migrateFromLocalStorage(): Promise<MigrationResult> {
    if (typeof window === 'undefined') {
      return { success: false, migratedSessions: 0, migratedRoutines: 0, error: 'Sem janela' };
    }

    const migrationDoneKey = 'calistheflow_idb_migrated_v2';
    if (localStorage.getItem(migrationDoneKey) === 'true') {
      return { success: true, migratedSessions: 0, migratedRoutines: 0 };
    }

    // 1. Snapshot de segurança antes da migração
    const rawHistory = localStorage.getItem('calistheflow_history_v1');
    const rawRoutines = localStorage.getItem('calistheflow_routines_v1');
    const backupSnapshot = {
      timestamp: Date.now(),
      history: rawHistory,
      routines: rawRoutines,
    };
    try {
      localStorage.setItem('calistheflow_migration_pre_snapshot_v2', JSON.stringify(backupSnapshot));
    } catch {
      // ignore quota
    }

    try {
      const db = await this.getDB();
      if (!db) {
        return { success: false, migratedSessions: 0, migratedRoutines: 0, error: 'IDB indisponível' };
      }

      let countSessions = 0;
      let countRoutines = 0;

      // Migrar Histórico
      if (rawHistory) {
        const sessions = JSON.parse(rawHistory);
        if (Array.isArray(sessions)) {
          for (const s of sessions) {
            if (s && s.id) {
              await this.put('sessions', s);
              countSessions++;
            }
          }
        }
      }

      // Migrar Rotinas
      if (rawRoutines) {
        const routines = JSON.parse(rawRoutines);
        if (Array.isArray(routines)) {
          for (const r of routines) {
            if (r && r.id) {
              await this.put('routines', r);
              countRoutines++;
            }
          }
        }
      }

      // Marcação de conclusão bem-sucedida
      localStorage.setItem(migrationDoneKey, 'true');
      console.log(`[IDB] Migração concluída com sucesso: ${countSessions} sessões, ${countRoutines} rotinas.`);
      return { success: true, migratedSessions: countSessions, migratedRoutines: countRoutines };
    } catch (err: any) {
      console.error('[IDB] Falha na migração. Executando rollback:', err);

      // Rollback: restaura estado do snapshot
      try {
        if (backupSnapshot.history) localStorage.setItem('calistheflow_history_v1', backupSnapshot.history);
        if (backupSnapshot.routines) localStorage.setItem('calistheflow_routines_v1', backupSnapshot.routines);
      } catch (rollbackErr) {
        console.error('[IDB] Falha no rollback:', rollbackErr);
      }

      return {
        success: false,
        migratedSessions: 0,
        migratedRoutines: 0,
        error: String(err?.message || err),
        rollbackPerformed: true,
      };
    }
  }
}

export const idbStorage = new CalisteFlowIDB();

