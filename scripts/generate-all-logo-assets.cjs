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

async function renderOnDark(logoBuffer, canvasW, canvasH, logoTargetW, logoTargetH) {
  const resized = await sharp(logoBuffer)
    .resize(logoTargetW, logoTargetH, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  return await sharp({
    create: {
      width: canvasW,
      height: canvasH,
      channels: 4,
      background: { r: 2, g: 4, b: 18, alpha: 1 } // #020412
    }
  })
  .composite([{ input: resized, gravity: 'center' }])
  .png({ quality: 95 })
  .toBuffer();
}

async function main() {
  console.log('Generating new CalisteFlow logo assets from:', srcPath);
  const srcBuf = fs.readFileSync(srcPath);

  // 1. logo-original.png & logo-transparente.png
  const transparentPng = await sharp(srcBuf).png({ quality: 100, compressionLevel: 9 }).toBuffer();
  fs.writeFileSync(path.join(publicAssetsDir, 'logo-original.png'), transparentPng);
  fs.writeFileSync(path.join(publicAssetsDir, 'logo-transparente.png'), transparentPng);
  fs.writeFileSync(path.join(srcAssetsDir, 'logo-original.png'), transparentPng);
  fs.writeFileSync(path.join(srcAssetsDir, 'logo-transparente.png'), transparentPng);
  fs.writeFileSync(path.join(publicDir, 'logo-transparente.png'), transparentPng);
  console.log('✓ logo-original.png & logo-transparente.png');

  // 2. logo.webp
  const logoWebp = await sharp(srcBuf).webp({ quality: 95, effort: 6 }).toBuffer();
  fs.writeFileSync(path.join(publicAssetsDir, 'logo.webp'), logoWebp);
  fs.writeFileSync(path.join(srcAssetsDir, 'logo.webp'), logoWebp);
  fs.writeFileSync(path.join(publicDir, 'logo.webp'), logoWebp);
  console.log('✓ logo.webp');

  // 3. logo-512.png (512x512 on #020412)
  const logo512 = await renderOnDark(srcBuf, 512, 512, 430, 310);
  fs.writeFileSync(path.join(publicAssetsDir, 'logo-512.png'), logo512);
  fs.writeFileSync(path.join(srcAssetsDir, 'logo-512.png'), logo512);
  fs.writeFileSync(path.join(publicDir, 'logo-512.png'), logo512);
  console.log('✓ logo-512.png');

  // 4. logo-header-256.png (256x256 on #020412)
  const logoHeader256 = await renderOnDark(srcBuf, 256, 256, 220, 160);
  fs.writeFileSync(path.join(publicAssetsDir, 'logo-header-256.png'), logoHeader256);
  fs.writeFileSync(path.join(srcAssetsDir, 'logo-header-256.png'), logoHeader256);
  fs.writeFileSync(path.join(publicDir, 'logo-header-256.png'), logoHeader256);
  console.log('✓ logo-header-256.png');

  // 5. icon-192.png (192x192 on #020412, safe for maskable)
  const icon192 = await renderOnDark(srcBuf, 192, 192, 150, 110);
  fs.writeFileSync(path.join(publicAssetsDir, 'icon-192.png'), icon192);
  fs.writeFileSync(path.join(publicDir, 'icon-192.png'), icon192);
  console.log('✓ icon-192.png');

  // 6. icon-512.png (512x512 on #020412, safe for maskable)
  const icon512 = await renderOnDark(srcBuf, 512, 512, 400, 290);
  fs.writeFileSync(path.join(publicAssetsDir, 'icon-512.png'), icon512);
  fs.writeFileSync(path.join(publicDir, 'icon-512.png'), icon512);
  console.log('✓ icon-512.png');

  // 7. apple-touch-icon.png (180x180 on #020412)
  const appleTouch = await renderOnDark(srcBuf, 180, 180, 144, 105);
  fs.writeFileSync(path.join(publicAssetsDir, 'apple-touch-icon.png'), appleTouch);
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleTouch);
  console.log('✓ apple-touch-icon.png');

  // 8. favicon-16x16.png & favicon-32x32.png
  const fav16 = await renderOnDark(srcBuf, 16, 16, 14, 11);
  const fav32 = await renderOnDark(srcBuf, 32, 32, 28, 21);
  fs.writeFileSync(path.join(publicAssetsDir, 'favicon-16x16.png'), fav16);
  fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), fav16);
  fs.writeFileSync(path.join(publicAssetsDir, 'favicon-32x32.png'), fav32);
  fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), fav32);
  console.log('✓ favicon-16x16.png & favicon-32x32.png');

  // 9. favicon.ico
  const ico = createIco(fav16, fav32);
  fs.writeFileSync(path.join(publicAssetsDir, 'favicon.ico'), ico);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), ico);
  console.log('✓ favicon.ico');

  // 10. og-image.png (1200x630 on #020412)
  const ogPng = await renderOnDark(srcBuf, 1200, 630, 640, 451);
  fs.writeFileSync(path.join(publicAssetsDir, 'og-image.png'), ogPng);
  fs.writeFileSync(path.join(publicDir, 'og-image.png'), ogPng);
  const ogJpg = await sharp(ogPng).jpeg({ quality: 92 }).toBuffer();
  fs.writeFileSync(path.join(publicAssetsDir, 'og-image.jpg'), ogJpg);
  fs.writeFileSync(path.join(publicDir, 'og-image.jpg'), ogJpg);
  console.log('✓ og-image.png (1200x630) & og-image.jpg');

  console.log('\nAll new logo assets generated successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
