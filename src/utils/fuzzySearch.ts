/**
 * Utilitário de busca com tolerância a digitação (Fuzzy Search) para a biblioteca de exercícios
 */

export function normalizeSearchText(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Distância de Levenshtein entre duas strings
 */
function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const row = Array.from({ length: b.length + 1 }, (_, i) => i);

  for (let i = 1; i <= a.length; i++) {
    let prev = i;
    for (let j = 1; j <= b.length; j++) {
      const val = a[i - 1] === b[j - 1] ? row[j - 1] : Math.min(row[j - 1], prev, row[j]) + 1;
      row[j - 1] = prev;
      prev = val;
    }
    row[b.length] = prev;
  }

  return row[b.length];
}

/**
 * Compara se um termo de busca tem match fuzzy com o texto alvo
 */
export function isFuzzyMatch(targetText: string, query: string): boolean {
  const normTarget = normalizeSearchText(targetText);
  const normQuery = normalizeSearchText(query);

  if (!normQuery) return true;
  if (!normTarget) return false;

  // 1. Casamento direto por inclusão (mais rápido e comum)
  if (normTarget.includes(normQuery)) return true;

  const targetWords = normTarget.split(/[\s\-_/()+,]+/);
  const queryWords = normQuery.split(/[\s\-_/()+,]+/);

  // Cada palavra digitada pelo usuário precisa dar match em pelo menos uma palavra do texto alvo
  return queryWords.every(qWord => {
    if (!qWord) return true;
    if (qWord.length <= 2) {
      return targetWords.some(tWord => tWord.includes(qWord));
    }

    // Match se qualquer palavra começar com a query ou contiver a query
    if (targetWords.some(tWord => tWord.includes(qWord) || qWord.includes(tWord))) {
      return true;
    }

    // Tolerância de Levenshtein proporcional ao tamanho
    const maxDist = qWord.length <= 4 ? 1 : 2;
    return targetWords.some(tWord => {
      // Se os tamanhos forem muito discrepantes, testa prefixo
      if (tWord.length > qWord.length) {
        const prefix = tWord.slice(0, qWord.length);
        if (levenshtein(prefix, qWord) <= 1) return true;
      }
      return levenshtein(tWord, qWord) <= maxDist;
    });
  });
}
