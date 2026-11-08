const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const publicAssetsDir = path.resolve(__dirname, '../public/assets/img');
const srcAssetsDir = path.resolve(__dirname, '../src/assets/img');
const publicDir = path.resolve(__dirname, '../public');

fs.mkdirSync(publicAssetsDir, { recursive: true });
fs.mkdirSync(srcAssetsDir, { recursive: true });

// Symmetrical, refined CalisteFlow "CF + Pull-up Bar" Monogram
function generateMonogramSvg({
  width = 1024,
  height = 1024,
  includeBackground = true,
  bgColor = '#020617',
  scale = 1.0,
  simplifiedBar = false,
  barThickness = 48,
  glow = true
}) {
  // Letters: C from 180 to 480, F from 520 to 844. Centered at 512. Width = 664.
  // Height: y from 260 to 860. Height = 600.
  // Bar: y from 160 to 208. Height = 48. Posts: x=130 and x=894.
  const transform = scale !== 1.0
    ? `transform="translate(${512 * (1 - scale)}, ${512 * (1 - scale)}) scale(${scale})"`
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="${width}" height="${height}">
  <defs>
    <linearGradient id="cfCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22D3EE" />
      <stop offset="60%" stop-color="#18EEFF" />
      <stop offset="100%" stop-color="#38BDF8" />
    </linearGradient>
    <filter id="cfGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  ${includeBackground ? `<rect width="1024" height="1024" fill="${bgColor}" />` : ''}

  <g ${transform} id="monogram-symbol">
    ${/* PULL-UP BAR RIG (Pórtico independente - sem tocar nas letras) */ ''}
    <!-- Barra fixa horizontal -->
    <rect x="112" y="160" width="800" height="${barThickness}" rx="24" fill="url(#cfCyanGrad)" />

    ${!simplifiedBar ? `
    <!-- Apoio vertical esquerdo (poste esquerdo) -->
    <rect x="156" y="120" width="36" height="120" rx="18" fill="url(#cfCyanGrad)" opacity="0.95" />
    <!-- Apoio vertical direito (poste direito) -->
    <rect x="832" y="120" width="36" height="120" rx="18" fill="url(#cfCyanGrad)" opacity="0.95" />
    <!-- Flange de fixação / anel esquerdo -->
    <rect x="148" y="196" width="52" height="18" rx="6" fill="#38BDF8" opacity="0.8" />
    <!-- Flange de fixação / anel direito -->
    <rect x="824" y="196" width="52" height="18" rx="6" fill="#38BDF8" opacity="0.8" />
    ` : ''}

    ${/* MONOGRAM LETTERS: C and F with uniform 104px thickness */ ''}
    <!-- Letra C -->
    <path
      d="
        M 480 258
        L 340 258
        A 170 170 0 0 0 170 428
        L 170 690
        A 170 170 0 0 0 340 860
        L 480 860
        A 14 14 0 0 0 494 846
        L 494 770
        A 14 14 0 0 0 480 756
        L 340 756
        A 66 66 0 0 1 274 690
        L 274 428
        A 66 66 0 0 1 340 362
        L 480 362
        A 14 14 0 0 0 494 348
        L 494 272
        A 14 14 0 0 0 480 258
        Z
      "
      fill="url(#cfCyanGrad)"
    />

    <!-- Letra F -->
    <path
      d="
        M 524 258
        L 830 258
        A 14 14 0 0 1 844 272
        L 844 348
        A 14 14 0 0 1 830 362
        L 628 362
        L 628 494
        L 776 494
        A 14 14 0 0 1 790 508
        L 790 584
        A 14 14 0 0 1 776 598
        L 628 598
        L 628 846
        A 14 14 0 0 1 614 860
        L 538 860
        A 14 14 0 0 1 524 846
        L 524 258
        Z
      "
      fill="url(#cfCyanGrad)"
    />
  </g>
</svg>`;
}

// Social Share Open Graph Card (1200x630)
function generateOgCardSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#020617" />
      <stop offset="50%" stop-color="#060913" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <radialGradient id="cyanGlow" cx="22%" cy="50%" r="45%">
      <stop offset="0%" stop-color="#22D3EE" stop-opacity="0.18" />
      <stop offset="100%" stop-color="#020617" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="cfCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22D3EE" />
      <stop offset="60%" stop-color="#18EEFF" />
      <stop offset="100%" stop-color="#38BDF8" />
    </linearGradient>
    <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#E2E8F0" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bgGrad)" />
  <rect width="1200" height="630" fill="url(#cyanGlow)" />

  <!-- Subtle grid accent lines -->
  <line x1="80" y1="80" x2="1120" y2="80" stroke="#1e293b" stroke-width="1" opacity="0.6" />
  <line x1="80" y1="550" x2="1120" y2="550" stroke="#1e293b" stroke-width="1" opacity="0.6" />

  <!-- Monogram Symbol Left Side (scaled down to fit 380x380 at x=100, y=125) -->
  <g transform="translate(100, 125) scale(0.37)">
    <!-- Barra fixa horizontal -->
    <rect x="112" y="160" width="800" height="52" rx="26" fill="url(#cfCyanGrad)" />
    <!-- Apoios verticais -->
    <rect x="156" y="120" width="36" height="120" rx="18" fill="url(#cfCyanGrad)" opacity="0.95" />
    <rect x="832" y="120" width="36" height="120" rx="18" fill="url(#cfCyanGrad)" opacity="0.95" />
    <rect x="148" y="196" width="52" height="18" rx="6" fill="#38BDF8" opacity="0.8" />
    <rect x="824" y="196" width="52" height="18" rx="6" fill="#38BDF8" opacity="0.8" />

    <!-- Letra C -->
    <path
      d="
        M 480 258 L 340 258 A 170 170 0 0 0 170 428 L 170 690 A 170 170 0 0 0 340 860 L 480 860
        A 14 14 0 0 0 494 846 L 494 770 A 14 14 0 0 0 480 756 L 340 756 A 66 66 0 0 1 274 690
        L 274 428 A 66 66 0 0 1 340 362 L 480 362 A 14 14 0 0 0 494 348 L 494 272 A 14 14 0 0 0 480 258 Z
      "
      fill="url(#cfCyanGrad)"
    />

    <!-- Letra F -->
    <path
      d="
        M 524 258 L 830 258 A 14 14 0 0 1 844 272 L 844 348 A 14 14 0 0 1 830 362 L 628 362
        L 628 494 L 776 494 A 14 14 0 0 1 790 508 L 790 584 A 14 14 0 0 1 776 598 L 628 598
        L 628 846 A 14 14 0 0 1 614 860 L 538 860 A 14 14 0 0 1 524 846 L 524 258 Z
      "
      fill="url(#cfCyanGrad)"
    />
  </g>

  <!-- Vertical Divider -->
  <line x1="510" y1="170" x2="510" y2="460" stroke="#334155" stroke-width="2" opacity="0.6" />

  <!-- Typography Right Side (in modern curved sans) -->
  <g transform="translate(560, 210)">
    <!-- Brand Name: CalisteFlow -->
    <text x="0" y="70" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-weight="900" font-size="76" letter-spacing="-2" fill="#FFFFFF">
      Caliste<tspan fill="#22D3EE">Flow</tspan>
    </text>

    <!-- Category Pill Badge -->
    <g transform="translate(0, 105)">
      <rect width="360" height="34" rx="17" fill="rgba(34, 211, 238, 0.12)" stroke="rgba(34, 211, 238, 0.3)" stroke-width="1.5" />
      <text x="16" y="22" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="800" font-size="13" letter-spacing="2" fill="#22D3EE">
        CALISTENIA &amp; POSTURA BIOMECÂNICA
      </text>
    </g>

    <!-- Subtitle / Value Proposition -->
    <text x="0" y="195" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="500" font-size="22" fill="#94A3B8" letter-spacing="-0.3">
      Treinos Guiados • Cronômetro Inteligente
    </text>
    <text x="0" y="230" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="700" font-size="22" fill="#38BDF8" letter-spacing="-0.3">
      100% Offline • Sem Anúncios • Local-First
    </text>

    <!-- Safe / Health Disclaimer Tag -->
    <text x="0" y="295" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="500" font-size="13" fill="#64748B">
      ✓ Revisão Técnica Biomecânica CREF • Adaptações de Proteção Articular
    </text>
  </g>
</svg>`;
}

function createIco(png16Buffer, png32Buffer) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 (ICO)
  header.writeUInt16LE(2, 4); // 2 images

  const entry1 = Buffer.alloc(16);
  entry1.writeUInt8(16, 0); // Width 16
  entry1.writeUInt8(16, 1); // Height 16
  entry1.writeUInt8(0, 2);  // Palette 0
  entry1.writeUInt8(0, 3);  // Reserved
  entry1.writeUInt16LE(1, 4); // Color planes 1
  entry1.writeUInt16LE(32, 6); // Bits per pixel 32
  entry1.writeUInt32LE(png16Buffer.length, 8); // Size of image
  const offset1 = 6 + 16 * 2;
  entry1.writeUInt32LE(offset1, 12); // Offset of image

  const entry2 = Buffer.alloc(16);
  entry2.writeUInt8(32, 0); // Width 32
  entry2.writeUInt8(32, 1); // Height 32
  entry2.writeUInt8(0, 2);  // Palette 0
  entry2.writeUInt8(0, 3);  // Reserved
  entry2.writeUInt16LE(1, 4); // Color planes 1
  entry2.writeUInt16LE(32, 6); // Bits per pixel 32
  entry2.writeUInt32LE(png32Buffer.length, 8); // Size of image
  const offset2 = offset1 + png16Buffer.length;
  entry2.writeUInt32LE(offset2, 12); // Offset of image

  return Buffer.concat([header, entry1, entry2, png16Buffer, png32Buffer]);
}

async function main() {
  console.log('[BRAND] Generating redesigned master SVG files...');

  // 1. Standard Master Monogram with solid dark background (#020617)
  const masterSvg = generateMonogramSvg({ width: 1024, height: 1024, includeBackground: true, bgColor: '#020617' });
  // 2. Transparent Master Monogram
  const transparentSvg = generateMonogramSvg({ width: 1024, height: 1024, includeBackground: false });
  // 3. Maskable Monogram (symbol inside central 60%, scale=0.60)
  const maskableSvg = generateMonogramSvg({ width: 512, height: 512, includeBackground: true, bgColor: '#020617', scale: 0.60 });
  // 4. Simplified Favicon SVG (bolder bar for small pixel scales)
  const faviconSvg = generateMonogramSvg({ width: 48, height: 48, includeBackground: false, simplifiedBar: true, barThickness: 68 });
  // 5. OG Social Card (1200x630)
  const ogCardSvg = generateOgCardSvg();

  // Save SVGs
  const svgOutputs = [
    { name: 'logo-cf.svg', content: masterSvg },
    { name: 'logo.svg', content: transparentSvg },
    { name: 'favicon.svg', content: faviconSvg },
    { name: 'og-image.svg', content: ogCardSvg }
  ];

  for (const item of svgOutputs) {
    fs.writeFileSync(path.join(publicAssetsDir, item.name), item.content, 'utf8');
    fs.writeFileSync(path.join(srcAssetsDir, item.name), item.content, 'utf8');
    fs.writeFileSync(path.join(publicDir, item.name), item.content, 'utf8');
  }
  console.log('✓ Master SVG files saved to public/ and assets/img/');

  // 6. Render Raster PNGs using Sharp
  console.log('[BRAND] Rendering high-resolution raster PNGs with Sharp...');
  const masterBuf = Buffer.from(masterSvg);
  const transBuf = Buffer.from(transparentSvg);
  const maskableBuf = Buffer.from(maskableSvg);
  const faviconBuf = Buffer.from(faviconSvg);
  const ogCardBuf = Buffer.from(ogCardSvg);

  // logo-1024.png & logo.png (transparent)
  const png1024Solid = await sharp(masterBuf).png().toBuffer();
  const png1024Trans = await sharp(transBuf).png().toBuffer();

  // icon-512.png (solid) & icon-192.png (solid)
  const icon512Solid = await sharp(masterBuf).resize(512, 512).png().toBuffer();
  const icon192Solid = await sharp(masterBuf).resize(192, 192).png().toBuffer();

  // icon-maskable-512.png
  const iconMaskable512 = await sharp(maskableBuf).resize(512, 512).png().toBuffer();

  // logo-512.png (trans) & logo-256.png (trans) & logo-header-256.png
  const logo512Trans = await sharp(transBuf).resize(512, 512).png().toBuffer();
  const logo256Trans = await sharp(transBuf).resize(256, 256).png().toBuffer();

  // apple-touch-icon.png (180x180 solid)
  const appleTouchIcon180 = await sharp(masterBuf).resize(180, 180).png().toBuffer();

  // Favicons (16, 32, 48)
  const fav16 = await sharp(faviconBuf).resize(16, 16).png().toBuffer();
  const fav32 = await sharp(faviconBuf).resize(32, 32).png().toBuffer();
  const fav48 = await sharp(faviconBuf).resize(48, 48).png().toBuffer();
  const icoBuffer = createIco(fav16, fav32);

  // og-image.png (1200x630) and og-image.jpg
  const ogImagePng = await sharp(ogCardBuf).png({ quality: 95 }).toBuffer();
  const ogImageJpg = await sharp(ogCardBuf).jpeg({ quality: 92 }).toBuffer();

  // Distribute all files to public/, public/assets/img/ and src/assets/img/
  const fileMappings = [
    { name: 'logo-1024.png', buf: png1024Solid },
    { name: 'logo.png', buf: png1024Trans },
    { name: 'logo-transparent.png', buf: png1024Trans },
    { name: 'icon-512.png', buf: icon512Solid },
    { name: 'icon-192.png', buf: icon192Solid },
    { name: 'icon-maskable-512.png', buf: iconMaskable512 },
    { name: 'logo-512.png', buf: logo512Trans },
    { name: 'logo-256.png', buf: logo256Trans },
    { name: 'logo-header-256.png', buf: logo256Trans },
    { name: 'apple-touch-icon.png', buf: appleTouchIcon180 },
    { name: 'favicon-16x16.png', buf: fav16 },
    { name: 'favicon-32x32.png', buf: fav32 },
    { name: 'favicon-48x48.png', buf: fav48 },
    { name: 'favicon.ico', buf: icoBuffer },
    { name: 'og-image.png', buf: ogImagePng },
    { name: 'og-image.jpg', buf: ogImageJpg }
  ];

  for (const { name, buf } of fileMappings) {
    fs.writeFileSync(path.join(publicAssetsDir, name), buf);
    fs.writeFileSync(path.join(srcAssetsDir, name), buf);
    fs.writeFileSync(path.join(publicDir, name), buf);
  }

  console.log(`✓ All ${fileMappings.length} image assets created and synchronized!`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
