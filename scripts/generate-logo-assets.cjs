const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const srcPath = 'C:/Users/mayri/.gemini/antigravity/brain/3d202cc5-97e4-40ef-8556-2faa2c1173f0/.user_uploaded/media_1794101811613_98fb42d6.jpg';

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

async function generate() {
  console.log('Generating logo assets from:', srcPath);

  // 1. Full-size 1024x1024 PNG
  const logo1024Png = await sharp(srcPath).png({ quality: 100, compressionLevel: 9 }).toBuffer();
  fs.writeFileSync(path.join(publicAssetsDir, 'logo.png'), logo1024Png);
  fs.writeFileSync(path.join(srcAssetsDir, 'logo.png'), logo1024Png);
  console.log('Generated logo.png (1024x1024)');

  // 2. Full-size 1024x1024 WebP
  const logo1024Webp = await sharp(srcPath).webp({ quality: 95, effort: 6 }).toBuffer();
  fs.writeFileSync(path.join(publicAssetsDir, 'logo.webp'), logo1024Webp);
  fs.writeFileSync(path.join(srcAssetsDir, 'logo.webp'), logo1024Webp);
  console.log('Generated logo.webp (1024x1024)');

  // 3. 512x512 PNG & WebP
  const logo512Png = await sharp(srcPath).resize(512, 512, { fit: 'contain' }).png({ quality: 95 }).toBuffer();
  fs.writeFileSync(path.join(publicAssetsDir, 'logo-512x512.png'), logo512Png);
  fs.writeFileSync(path.join(srcAssetsDir, 'logo-512x512.png'), logo512Png);
  fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), logo512Png);

  const logo512Webp = await sharp(srcPath).resize(512, 512, { fit: 'contain' }).webp({ quality: 90, effort: 6 }).toBuffer();
  fs.writeFileSync(path.join(publicAssetsDir, 'logo-512x512.webp'), logo512Webp);
  fs.writeFileSync(path.join(srcAssetsDir, 'logo-512x512.webp'), logo512Webp);
  console.log('Generated logo-512x512.png & logo-512x512.webp');

  // 4. Apple Touch Icon (180x180)
  const appleTouchIcon = await sharp(srcPath).resize(180, 180, { fit: 'contain' }).png({ quality: 95 }).toBuffer();
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleTouchIcon);
  fs.writeFileSync(path.join(publicAssetsDir, 'apple-touch-icon.png'), appleTouchIcon);
  console.log('Generated apple-touch-icon.png (180x180)');

  // 5. PWA 192x192
  const pwa192 = await sharp(srcPath).resize(192, 192, { fit: 'contain' }).png({ quality: 95 }).toBuffer();
  fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), pwa192);
  console.log('Generated pwa-192x192.png (192x192)');

  // 6. Maskable icon (512x512 with safe area margin: logo inside 80% circle, padded with background #020412)
  const innerLogo = await sharp(srcPath).resize(410, 410, { fit: 'contain' }).toBuffer();
  const maskable = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 2, g: 4, b: 18, alpha: 1 }
    }
  }).composite([{ input: innerLogo, gravity: 'center' }]).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'maskable-icon-512x512.png'), maskable);
  console.log('Generated maskable-icon-512x512.png');

  // 7. Favicon 16x16 & 32x32
  const fav16 = await sharp(srcPath).resize(16, 16, { fit: 'contain' }).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), fav16);
  fs.writeFileSync(path.join(publicAssetsDir, 'favicon-16x16.png'), fav16);

  const fav32 = await sharp(srcPath).resize(32, 32, { fit: 'contain' }).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), fav32);
  fs.writeFileSync(path.join(publicAssetsDir, 'favicon-32x32.png'), fav32);
  console.log('Generated favicon-16x16.png & favicon-32x32.png');

  // 8. Favicon ICO (multi-size 16 & 32)
  const icoBuffer = createIco(fav16, fav32);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(publicAssetsDir, 'favicon.ico'), icoBuffer);
  console.log('Generated favicon.ico (16x16 + 32x32)');

  // 9. Generate transparent logo version by keying out dark background
  // Background is close to [0..4, 2..6, 16..22]
  const { data, info } = await sharp(srcPath).raw().toBuffer({ resolveWithObject: true });
  const rgbaBuffer = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < info.width * info.height; i++) {
    const r = data[i * 3];
    const g = data[i * 3 + 1];
    const b = data[i * 3 + 2];
    
    // Check brightness / distance from dark navy (#020412)
    // Cyan elements have high G and B (e.g. g > 150, b > 180)
    // Background is very dark (r < 25, g < 30, b < 45)
    rgbaBuffer[i * 4] = r;
    rgbaBuffer[i * 4 + 1] = g;
    rgbaBuffer[i * 4 + 2] = b;
    
    const maxVal = Math.max(r, g, b);
    if (maxVal < 30) {
      // Background: fully transparent
      rgbaBuffer[i * 4 + 3] = 0;
    } else if (maxVal < 65) {
      // Feathered transition edge
      const alpha = Math.round(((maxVal - 30) / 35) * 255);
      rgbaBuffer[i * 4 + 3] = alpha;
    } else {
      rgbaBuffer[i * 4 + 3] = 255;
    }
  }

  const transparentLogo = await sharp(rgbaBuffer, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4
    }
  }).png().toBuffer();
  fs.writeFileSync(path.join(publicAssetsDir, 'logo-transparent.png'), transparentLogo);
  fs.writeFileSync(path.join(srcAssetsDir, 'logo-transparent.png'), transparentLogo);

  const transparent512 = await sharp(transparentLogo).resize(512, 512, { fit: 'contain' }).png().toBuffer();
  fs.writeFileSync(path.join(publicAssetsDir, 'logo-transparent-512x512.png'), transparent512);
  fs.writeFileSync(path.join(srcAssetsDir, 'logo-transparent-512x512.png'), transparent512);

  console.log('Generated logo-transparent.png & logo-transparent-512x512.png');
  console.log('All logo assets successfully generated!');
}

generate().catch(err => {
  console.error('Asset generation error:', err);
  process.exit(1);
});

