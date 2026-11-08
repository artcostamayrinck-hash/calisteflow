const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const srcLogo = path.resolve(__dirname, '../public/assets/img/logo.png');
const publicDir = path.resolve(__dirname, '../public');
const assetsDir = path.resolve(__dirname, '../public/assets/img');

async function createOgImage() {
  const canvasWidth = 1200;
  const canvasHeight = 630;
  const logoSize = 480; // nicely proportioned within 630 height

  // Resize logo
  const resizedLogo = await sharp(srcLogo)
    .resize(logoSize, logoSize, { fit: 'contain' })
    .toBuffer();

  const ogPng = await sharp({
    create: {
      width: canvasWidth,
      height: canvasHeight,
      channels: 4,
      background: { r: 2, g: 4, b: 18, alpha: 1 } // #020412
    }
  })
  .composite([
    {
      input: resizedLogo,
      gravity: 'center'
    }
  ])
  .png({ quality: 95, compressionLevel: 9 })
  .toBuffer();

  fs.writeFileSync(path.join(publicDir, 'og-image.png'), ogPng);
  fs.writeFileSync(path.join(assetsDir, 'og-image.png'), ogPng);
  
  // Also create a high quality jpg version
  const ogJpg = await sharp(ogPng).jpeg({ quality: 92 }).toBuffer();
  fs.writeFileSync(path.join(publicDir, 'og-image.jpg'), ogJpg);
  fs.writeFileSync(path.join(assetsDir, 'og-image.jpg'), ogJpg);

  console.log('✓ Successfully generated 1200x630 og-image.png and og-image.jpg with CF logo centered on #020412');
}

createOgImage().catch(err => {
  console.error(err);
  process.exit(1);
});
