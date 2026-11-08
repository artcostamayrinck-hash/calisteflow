const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const transparentSrcPath = 'C:/Users/mayri/.gemini/antigravity/brain/3d202cc5-97e4-40ef-8556-2faa2c1173f0/.user_uploaded/media_1794104656116_52adaee9.png';
const darkSrcPath = 'C:/Users/mayri/.gemini/antigravity/brain/3d202cc5-97e4-40ef-8556-2faa2c1173f0/.user_uploaded/media_1794101811613_98fb42d6.jpg';

const publicAssetsDir = path.resolve(__dirname, '../public/assets/img');
const srcAssetsDir = path.resolve(__dirname, '../src/assets/img');
const publicDir = path.resolve(__dirname, '../public');

fs.mkdirSync(publicAssetsDir, { recursive: true });
fs.mkdirSync(srcAssetsDir, { recursive: true });

function writeToAllDestinations(filename, buffer) {
  fs.writeFileSync(path.join(publicAssetsDir, filename), buffer);
  fs.writeFileSync(path.join(srcAssetsDir, filename), buffer);
  fs.writeFileSync(path.join(publicDir, filename), buffer);
}

function createIco(png16Buffer, png32Buffer, png48Buffer) {
  const images = [
    { size: 16, buf: png16Buffer },
    { size: 32, buf: png32Buffer },
    { size: 48, buf: png48Buffer }
  ];

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 (ICO)
  header.writeUInt16LE(images.length, 4); // count

  const entries = [];
  let currentOffset = 6 + 16 * images.length;

  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.size, 0); // Width
    entry.writeUInt8(img.size, 1); // Height
    entry.writeUInt8(0, 2);  // Palette 0
    entry.writeUInt8(0, 3);  // Reserved
    entry.writeUInt16LE(1, 4); // Color planes 1
    entry.writeUInt16LE(32, 6); // Bits per pixel 32
    entry.writeUInt32LE(img.buf.length, 8); // Size of image
    entry.writeUInt32LE(currentOffset, 12); // Offset
    entries.push(entry);
    currentOffset += img.buf.length;
  }

  return Buffer.concat([header, ...entries, ...images.map(img => img.buf)]);
}

async function renderTransparentSquare(srcBuffer, size, paddingPercent = 0.08) {
  const padding = Math.round(size * paddingPercent);
  const targetSize = size - padding * 2;
  const resized = await sharp(srcBuffer)
    .resize(targetSize, targetSize, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .toBuffer();

  return await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
  .composite([{ input: resized, gravity: 'center' }])
  .png({ quality: 100, compressionLevel: 9 })
  .toBuffer();
}

async function main() {
  console.log('Generating complete brand assets from authentic user files:');
  console.log('1. Transparent:', transparentSrcPath);
  console.log('2. Dark original:', darkSrcPath);

  const rawTrans = fs.readFileSync(transparentSrcPath);
  const rawDark = fs.existsSync(darkSrcPath) ? fs.readFileSync(darkSrcPath) : null;

  // 1. logo.png & logo-transparente.png
  const logoPng = await sharp(rawTrans).png({ quality: 100, compressionLevel: 9 }).toBuffer();
  writeToAllDestinations('logo.png', logoPng);
  writeToAllDestinations('logo-transparente.png', logoPng);
  console.log('✓ logo.png & logo-transparente.png');

  // 2. logo-original.png (from dark original if available, else generated on #020617)
  if (rawDark) {
    const origPng = await sharp(rawDark).png({ quality: 100 }).toBuffer();
    writeToAllDestinations('logo-original.png', origPng);
    console.log('✓ logo-original.png (original dark)');
  }

  // 3. logo.webp (optimized WebP)
  const logoWebp = await sharp(rawTrans).webp({ quality: 95, effort: 6 }).toBuffer();
  writeToAllDestinations('logo.webp', logoWebp);
  console.log('✓ logo.webp');

  // 4. logo-1024.png, logo-512.png, logo-256.png (square transparent)
  const logo1024 = await renderTransparentSquare(rawTrans, 1024);
  writeToAllDestinations('logo-1024.png', logo1024);
  writeToAllDestinations('logo-transparent.png', logo1024);
  console.log('✓ logo-1024.png & logo-transparent.png');

  const logo512 = await renderTransparentSquare(rawTrans, 512);
  writeToAllDestinations('logo-512.png', logo512);
  console.log('✓ logo-512.png');

  const logo256 = await renderTransparentSquare(rawTrans, 256);
  writeToAllDestinations('logo-256.png', logo256);
  console.log('✓ logo-256.png');

  // 5. logo-header-256.png (horizontal transparent, height = 256)
  const logoHeader256 = await sharp(rawTrans)
    .resize({ height: 256, fit: 'inside' })
    .png({ quality: 100 })
    .toBuffer();
  writeToAllDestinations('logo-header-256.png', logoHeader256);
  console.log('✓ logo-header-256.png');

  // 6. icon-192.png & icon-512.png (PWA icons - transparent)
  const icon192 = await renderTransparentSquare(rawTrans, 192);
  writeToAllDestinations('icon-192.png', icon192);
  writeToAllDestinations('icon-512.png', logo512);
  console.log('✓ icon-192.png & icon-512.png');

  // 7. icon-maskable-512.png (Android adaptive maskable icon - safe area 60% on #020617)
  const maskableTarget = Math.round(512 * 0.60); // 60% safe area
  const resizedMaskable = await sharp(rawTrans)
    .resize(maskableTarget, maskableTarget, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .toBuffer();

  const iconMaskable = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 2, g: 6, b: 23, alpha: 1 } // #020617
    }
  })
  .composite([{ input: resizedMaskable, gravity: 'center' }])
  .png({ quality: 95 })
  .toBuffer();
  writeToAllDestinations('icon-maskable-512.png', iconMaskable);
  console.log('✓ icon-maskable-512.png (maskable safe area)');

  // 8. Favicons: 16x16, 32x32, 48x48
  const fav16 = await sharp(rawTrans)
    .resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const fav32 = await sharp(rawTrans)
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const fav48 = await sharp(rawTrans)
    .resize(48, 48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  writeToAllDestinations('favicon-16x16.png', fav16);
  writeToAllDestinations('favicon-32x32.png', fav32);
  writeToAllDestinations('favicon-48x48.png', fav48);
  console.log('✓ favicons: 16x16, 32x32, 48x48');

  // 9. favicon.ico
  const ico = createIco(fav16, fav32, fav48);
  writeToAllDestinations('favicon.ico', ico);
  console.log('✓ favicon.ico');

  // 10. apple-touch-icon.png (180x180 on site dark #020617)
  const appleTouchTarget = Math.round(180 * 0.75); // 135px
  const resizedApple = await sharp(rawTrans)
    .resize(appleTouchTarget, appleTouchTarget, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .toBuffer();

  const appleTouch = await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: { r: 2, g: 6, b: 23, alpha: 1 } // #020617
    }
  })
  .composite([{ input: resizedApple, gravity: 'center' }])
  .png({ quality: 95 })
  .toBuffer();
  writeToAllDestinations('apple-touch-icon.png', appleTouch);
  console.log('✓ apple-touch-icon.png');

  // 11. og-image.png & og-image.jpg (1200x630 on #020617)
  const ogLogoResized = await sharp(rawTrans)
    .resize(600, 420, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const ogPng = await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: { r: 2, g: 6, b: 23, alpha: 1 } // #020617
    }
  })
  .composite([{ input: ogLogoResized, gravity: 'center' }])
  .png({ quality: 95 })
  .toBuffer();
  writeToAllDestinations('og-image.png', ogPng);

  const ogJpg = await sharp(ogPng).jpeg({ quality: 92 }).toBuffer();
  writeToAllDestinations('og-image.jpg', ogJpg);
  console.log('✓ og-image.png & og-image.jpg');

  console.log('\nAll brand assets successfully synchronized across public/, public/assets/img/ and src/assets/img/!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
