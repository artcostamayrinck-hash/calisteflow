const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const srcPath = 'C:/Users/mayri/.gemini/antigravity/brain/3d202cc5-97e4-40ef-8556-2faa2c1173f0/.user_uploaded/media_1794104656116_52adaee9.png';

const publicAssetsDir = path.resolve(__dirname, '../public/assets/img');
const srcAssetsDir = path.resolve(__dirname, '../src/assets/img');
const publicDir = path.resolve(__dirname, '../public');

fs.mkdirSync(publicAssetsDir, { recursive: true });
fs.mkdirSync(srcAssetsDir, { recursive: true });

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

async function renderTransparentSquare(srcBuffer, size) {
  // Resize logo proportionally to fit within square canvas with 10% padding
  const padding = Math.round(size * 0.08);
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
  .png({ quality: 100 })
  .toBuffer();
}

async function main() {
  console.log('Generating transparent PNG assets from:', srcPath);
  const rawSrc = fs.readFileSync(srcPath);

  // 1. logo.png - pure transparent original PNG
  const logoPng = await sharp(rawSrc).png({ quality: 100, compressionLevel: 9 }).toBuffer();
  fs.writeFileSync(path.join(publicAssetsDir, 'logo.png'), logoPng);
  fs.writeFileSync(path.join(srcAssetsDir, 'logo.png'), logoPng);
  fs.writeFileSync(path.join(publicDir, 'logo.png'), logoPng);
  console.log('✓ logo.png');

  // 2. logo-512.png - 512x512 transparent
  const logo512 = await renderTransparentSquare(rawSrc, 512);
  fs.writeFileSync(path.join(publicAssetsDir, 'logo-512.png'), logo512);
  fs.writeFileSync(path.join(srcAssetsDir, 'logo-512.png'), logo512);
  fs.writeFileSync(path.join(publicDir, 'logo-512.png'), logo512);
  console.log('✓ logo-512.png');

  // 3. logo-256.png - 256x256 transparent
  const logo256 = await renderTransparentSquare(rawSrc, 256);
  fs.writeFileSync(path.join(publicAssetsDir, 'logo-256.png'), logo256);
  fs.writeFileSync(path.join(srcAssetsDir, 'logo-256.png'), logo256);
  fs.writeFileSync(path.join(publicDir, 'logo-256.png'), logo256);
  console.log('✓ logo-256.png');

  // 4. icon-192.png - 192x192 transparent
  const icon192 = await renderTransparentSquare(rawSrc, 192);
  fs.writeFileSync(path.join(publicAssetsDir, 'icon-192.png'), icon192);
  fs.writeFileSync(path.join(publicDir, 'icon-192.png'), icon192);
  console.log('✓ icon-192.png');

  // 5. favicon-16x16.png & favicon-32x32.png - transparent
  const fav16 = await sharp(rawSrc)
    .resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const fav32 = await sharp(rawSrc)
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(publicAssetsDir, 'favicon-16x16.png'), fav16);
  fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), fav16);
  fs.writeFileSync(path.join(publicAssetsDir, 'favicon-32x32.png'), fav32);
  fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), fav32);
  console.log('✓ favicon-16x16.png & favicon-32x32.png');

  // 6. favicon.ico (multi-size 16 & 32 transparent ICO)
  const ico = createIco(fav16, fav32);
  fs.writeFileSync(path.join(publicAssetsDir, 'favicon.ico'), ico);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), ico);
  console.log('✓ favicon.ico');

  // 7. apple-touch-icon.png - 180x180 on site background #020617 (to prevent iOS turning transparent into black/white)
  const appleTouch = await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: { r: 2, g: 6, b: 23, alpha: 1 } // #020617 exact site color
    }
  })
  .composite([{
    input: await sharp(rawSrc).resize(144, 105, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer(),
    gravity: 'center'
  }])
  .png({ quality: 95 })
  .toBuffer();
  fs.writeFileSync(path.join(publicAssetsDir, 'apple-touch-icon.png'), appleTouch);
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleTouch);
  console.log('✓ apple-touch-icon.png');

  // 8. og-image.png - 1200x630 on site background #020617
  const ogPng = await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: { r: 2, g: 6, b: 23, alpha: 1 } // #020617 exact site color
    }
  })
  .composite([{
    input: await sharp(rawSrc).resize(620, 437, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer(),
    gravity: 'center'
  }])
  .png({ quality: 95 })
  .toBuffer();
  fs.writeFileSync(path.join(publicAssetsDir, 'og-image.png'), ogPng);
  fs.writeFileSync(path.join(publicDir, 'og-image.png'), ogPng);

  const ogJpg = await sharp(ogPng).jpeg({ quality: 92 }).toBuffer();
  fs.writeFileSync(path.join(publicAssetsDir, 'og-image.jpg'), ogJpg);
  fs.writeFileSync(path.join(publicDir, 'og-image.jpg'), ogJpg);
  console.log('✓ og-image.png & og-image.jpg (on #020617)');

  console.log('\nAll transparent assets successfully generated!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

