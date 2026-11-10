#!/usr/bin/env node
/**
 * CalisteFlow Static Site Generator (SSG) & SEO Pre-Renderer
 * Gera páginas públicas estáticas e pré-renderizadas para todos os 208 exercícios do catálogo,
 * com meta tags dedicadas, dados estruturados JSON-LD (HowTo, ExercisePlan), Open Graph,
 * links internos semânticos e sitemap.xml completo.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = process.cwd();
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const CONTENT_CATALOG = path.join(ROOT_DIR, 'content/exercises-catalog.json');
const BASE_DOMAIN = 'https://calistenflow.vercel.app';

if (!fs.existsSync(DIST_DIR)) {
  console.error('❌ Diretório dist/ não encontrado. Execute "vite build" primeiro.');
  process.exit(1);
}

// 1. Carrega o catálogo de exercícios
let exercises = [];
if (fs.existsSync(CONTENT_CATALOG)) {
  exercises = JSON.parse(fs.readFileSync(CONTENT_CATALOG, 'utf8'));
} else {
  // Fallback: executa o pipeline para gerar o catálogo
  const { execSync } = require('child_process');
  execSync('node scripts/content-pipeline.cjs export', { stdio: 'inherit' });
  exercises = JSON.parse(fs.readFileSync(CONTENT_CATALOG, 'utf8'));
}

console.log(`🚀 [SSG Pre-Renderer] Gerando páginas públicas estáticas para ${exercises.length} exercícios...`);

// 2. Lê o index.html base do build
const baseHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf8');

// Cria mapa para links internos rápidos
const exerciseMap = new Map(exercises.map(e => [e.id, e]));

// 3. Itera e gera cada página individual
let generatedCount = 0;
const sitemapUrls = [
  { loc: `${BASE_DOMAIN}/`, priority: '1.0', changefreq: 'daily' },
  { loc: `${BASE_DOMAIN}/?shortcut=exercises`, priority: '0.9', changefreq: 'weekly' },
  { loc: `${BASE_DOMAIN}/?shortcut=today`, priority: '0.8', changefreq: 'daily' },
  { loc: `${BASE_DOMAIN}/?shortcut=timer`, priority: '0.8', changefreq: 'monthly' },
];

for (const ex of exercises) {
  const exDir = path.join(DIST_DIR, 'exercicios', ex.id);
  fs.mkdirSync(exDir, { recursive: true });

  const pageUrl = `${BASE_DOMAIN}/exercicios/${ex.id}/`;
  sitemapUrls.push({
    loc: pageUrl,
    priority: '0.8',
    changefreq: 'weekly',
  });

  const pageTitle = `${ex.name} • CalisteFlow — Biomecânica & Calistenia`;
  const cleanDesc = ex.description.replace(/"/g, '&quot;');
  const metaDesc = cleanDesc.length > 155 ? `${cleanDesc.slice(0, 152)}...` : cleanDesc;

  // JSON-LD Estruturado (HowTo + ExercisePlan + SoftwareApplication)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'HowTo',
        '@id': `${pageUrl}#howto`,
        name: `Como fazer ${ex.name} com Postura Correta`,
        description: ex.description,
        totalTime: `PT${ex.defaultRestSeconds}S`,
        inLanguage: 'pt-BR',
        step: ex.executionSteps.map(s => ({
          '@type': 'HowToStep',
          name: s.title,
          text: s.description,
          position: s.step,
        })),
      },
      {
        '@type': 'ExercisePlan',
        name: ex.name,
        exerciseType: ex.category,
        workload: `${ex.defaultSets} séries x ${ex.type === 'isometric' ? `${ex.defaultHoldSeconds}s` : `${ex.defaultReps} reps`}`,
      },
      {
        '@type': 'SoftwareApplication',
        name: 'CalisteFlow',
        applicationCategory: 'HealthApplication',
        operatingSystem: 'All',
        inLanguage: 'pt-BR',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'BRL',
        },
      },
    ],
  };

  // Monta HTML Semântico Pré-Renderizado (indexável por buscadores e leitores de tela)
  const regressionsHtml = ex.regressoes.length > 0
    ? `
      <div style="margin-top: 16px; padding: 14px; background: rgba(245, 158, 11, 0.08); border-radius: 12px; border: 1px solid rgba(245, 158, 11, 0.25);">
        <strong style="color: #fbbf24; font-size: 13px; text-transform: uppercase;">Degrau Anterior (Regressões):</strong>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px;">
          ${ex.regressoes.map(rId => {
            const ref = exerciseMap.get(rId);
            const name = ref ? ref.name : rId;
            return `<a href="/exercicios/${rId}/" style="color: #fde68a; text-decoration: none; background: rgba(255,255,255,0.06); padding: 4px 10px; border-radius: 8px; font-size: 12px; border: 1px solid rgba(245,158,11,0.3);">← ${name}</a>`;
          }).join('')}
        </div>
      </div>
    `
    : '';

  const progressionsHtml = ex.progressoes.length > 0
    ? `
      <div style="margin-top: 16px; padding: 14px; background: rgba(16, 185, 129, 0.08); border-radius: 12px; border: 1px solid rgba(16, 185, 129, 0.25);">
        <strong style="color: #34d399; font-size: 13px; text-transform: uppercase;">Próximo Nível (Progressões):</strong>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px;">
          ${ex.progressoes.map(pId => {
            const ref = exerciseMap.get(pId);
            const name = ref ? ref.name : pId;
            return `<a href="/exercicios/${pId}/" style="color: #a7f3d0; text-decoration: none; background: rgba(255,255,255,0.06); padding: 4px 10px; border-radius: 8px; font-size: 12px; border: 1px solid rgba(16,185,129,0.3);">→ ${name}</a>`;
          }).join('')}
        </div>
      </div>
    `
    : '';

  const mistakesHtml = ex.commonMistakes && ex.commonMistakes.length > 0
    ? `
      <div style="margin-top: 24px;">
        <h3 style="font-size: 16px; font-weight: 800; color: #f87171; margin-bottom: 12px;">⚠️ Erros Críticos a Evitar:</h3>
        <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px;">
          ${ex.commonMistakes.map(m => `
            <li style="padding: 12px; background: rgba(239, 68, 68, 0.06); border-radius: 10px; border-left: 3px solid #ef4444; font-size: 13px;">
              <strong style="color: #fca5a5; display: block; margin-bottom: 4px;">❌ Erro: ${m.mistake}</strong>
              <span style="color: #e2e8f0;">💡 Correção: ${m.correction}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    `
    : '';

  const preRenderedContent = `
    <article style="max-width: 760px; margin: 32px auto; padding: 24px; background: #0f172a; border-radius: 24px; border: 1px solid rgba(255,255,255,0.1); color: #f8fafc; font-family: system-ui, -apple-system, sans-serif;">
      <!-- Breadcrumbs -->
      <nav aria-label="Breadcrumb" style="font-size: 12px; color: #94a3b8; margin-bottom: 16px;">
        <a href="/" style="color: #38bdf8; text-decoration: none;">Início</a> &gt;
        <a href="/?shortcut=exercises" style="color: #38bdf8; text-decoration: none;">Biblioteca</a> &gt;
        <span style="color: #cbd5e1;">${ex.name}</span>
      </nav>

      <header style="margin-bottom: 24px;">
        <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px; flex-wrap: wrap;">
          <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); padding: 2px 8px; border-radius: 6px;">
            ${ex.category}
          </span>
          <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); padding: 2px 8px; border-radius: 6px;">
            ${ex.difficulty}
          </span>
          <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; background: rgba(255, 255, 255, 0.08); color: #cbd5e1; padding: 2px 8px; border-radius: 6px;">
            ${ex.padrao || 'Cadeia Fechada'}
          </span>
        </div>
        <h1 style="font-size: 26px; font-weight: 900; margin: 0 0 10px 0; letter-spacing: -0.02em; color: #ffffff;">
          ${ex.name}
        </h1>
        <p style="font-size: 15px; color: #cbd5e1; line-height: 1.6; margin: 0;">
          ${ex.description}
        </p>
      </header>

      <!-- Botão CTA de Ação no PWA -->
      <div style="margin: 20px 0; text-align: center;">
        <a href="/?ex=${ex.id}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); color: #020617; font-weight: 900; font-size: 14px; padding: 12px 28px; border-radius: 14px; text-decoration: none; box-shadow: 0 8px 24px -4px rgba(16,185,129,0.35);">
          🚀 Abrir e Treinar no CalisteFlow (PWA)
        </a>
      </div>

      <!-- Músculos Ativados -->
      <div style="margin: 24px 0; padding: 16px; background: rgba(255,255,255,0.03); border-radius: 16px; border: 1px solid rgba(255,255,255,0.06);">
        <h3 style="font-size: 14px; font-weight: 800; text-transform: uppercase; margin: 0 0 10px 0; color: #38bdf8;">
          🎯 Mapa de Ativação Muscular:
        </h3>
        <p style="font-size: 13px; margin: 0 0 6px 0;">
          <strong style="color: #34d399;">Músculos Alvo (Agonistas):</strong> ${ex.primaryMuscles.join(', ')}
        </p>
        ${ex.secondaryMuscles.length > 0 ? `
          <p style="font-size: 13px; margin: 0;">
            <strong style="color: #22d3ee;">Estabilizadores & Secundários:</strong> ${ex.secondaryMuscles.join(', ')}
          </p>
        ` : ''}
      </div>

      <!-- Fases de Execução -->
      <section style="margin-top: 24px;">
        <h2 style="font-size: 18px; font-weight: 800; color: #ffffff; margin-bottom: 14px;">
          📋 Passo a Passo de Execução Correta:
        </h2>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${ex.executionSteps.map(s => `
            <div style="padding: 14px; background: rgba(255,255,255,0.04); border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);">
              <span style="font-size: 11px; font-weight: 800; color: #38bdf8; text-transform: uppercase;">Passo ${s.step}</span>
              <h4 style="font-size: 15px; font-weight: 700; margin: 4px 0 6px 0; color: #ffffff;">${s.title}</h4>
              <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin: 0;">${s.description}</p>
            </div>
          `).join('')}
        </div>
      </section>

      ${ex.breathingTip ? `
        <div style="margin-top: 20px; padding: 12px 16px; background: rgba(56, 189, 248, 0.08); border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.2); font-size: 13px; color: #7dd3fc;">
          🌬️ <strong>Dica de Respiração:</strong> ${ex.breathingTip}
        </div>
      ` : ''}

      ${mistakesHtml}
      ${regressionsHtml}
      ${progressionsHtml}

      <footer style="margin-top: 32px; pt-4; border-top: 1px solid rgba(255,255,255,0.1); font-size: 12px; color: #64748b; text-align: center;">
        <p>CalisteFlow • Plataforma Local-First de Calistenia • Auditado por Profissional de Educação Física (CREF)</p>
      </footer>
    </article>
  `;

  // Substituição de metadados no HTML base
  let pageHtml = baseHtml;

  // Substitui Title
  pageHtml = pageHtml.replace(/<title>.*?<\/title>/, `<title>${pageTitle}</title>`);

  // Substitui Description
  pageHtml = pageHtml.replace(
    /<meta name="description" content=".*?" \/>/,
    `<meta name="description" content="${metaDesc}" />`
  );

  // Substitui Canonical
  pageHtml = pageHtml.replace(
    /<link rel="canonical" href=".*?" \/>/,
    `<link rel="canonical" href="${pageUrl}" />`
  );

  // Substitui Open Graph
  pageHtml = pageHtml.replace(
    /<meta property="og:url" content=".*?" \/>/,
    `<meta property="og:url" content="${pageUrl}" />`
  );
  pageHtml = pageHtml.replace(
    /<meta property="og:title" content=".*?" \/>/,
    `<meta property="og:title" content="${pageTitle}" />`
  );
  pageHtml = pageHtml.replace(
    /<meta property="og:description" content=".*?" \/>/,
    `<meta property="og:description" content="${metaDesc}" />`
  );

  // Substitui Twitter
  pageHtml = pageHtml.replace(
    /<meta name="twitter:url" content=".*?" \/>/,
    `<meta name="twitter:url" content="${pageUrl}" />`
  );
  pageHtml = pageHtml.replace(
    /<meta name="twitter:title" content=".*?" \/>/,
    `<meta name="twitter:title" content="${pageTitle}" />`
  );
  pageHtml = pageHtml.replace(
    /<meta name="twitter:description" content=".*?" \/>/,
    `<meta name="twitter:description" content="${metaDesc}" />`
  );

  // Ajusta caminhos de assets relativos para páginas em subpastas (/exercicios/:id/)
  pageHtml = pageHtml.replace(/(href|src)="\.\/assets\//g, '$1="../../assets/');
  pageHtml = pageHtml.replace(/(href|src)="\.\//g, '$1="../../');

  // Injeta JSON-LD antes de </head>
  const jsonLdTag = `\n    <script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n    </script>\n  </head>`;
  pageHtml = pageHtml.replace('</head>', jsonLdTag);

  // Injeta conteúdo semântico no <noscript> e como fallback pré-renderizado no #root
  pageHtml = pageHtml.replace(
    /<div id="root">.*?<\/div>/s,
    `<div id="root">\n${preRenderedContent}\n</div>`
  );

  fs.writeFileSync(path.join(exDir, 'index.html'), pageHtml, 'utf8');
  generatedCount++;
}

console.log(`✅ [SSG Pre-Renderer] ${generatedCount} páginas públicas HTML geradas com sucesso em dist/exercicios/!`);

// 4. Gera sitemap.xml dinâmico atualizado
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf8');
const publicSitemap = path.join(ROOT_DIR, 'public/sitemap.xml');
if (fs.existsSync(path.dirname(publicSitemap))) {
  fs.writeFileSync(publicSitemap, sitemapXml, 'utf8');
}
console.log(`🗺️ [Sitemap] sitemap.xml gerado com ${sitemapUrls.length} URLs (incluindo todos os 208 exercícios)!`);

// 5. Gera robots.txt otimizado
const robotsTxt = `User-agent: *
Allow: /
Allow: /exercicios/

Sitemap: ${BASE_DOMAIN}/sitemap.xml
`;

fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robotsTxt, 'utf8');
const publicRobots = path.join(ROOT_DIR, 'public/robots.txt');
if (fs.existsSync(path.dirname(publicRobots))) {
  fs.writeFileSync(publicRobots, robotsTxt, 'utf8');
}
console.log(`🤖 [Robots] robots.txt atualizado com permissão para crawlers.`);
