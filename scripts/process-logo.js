const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function processLogo() {
  const imgDir = path.join('apps', 'frontend', 'public', 'images');
  const iconDir = path.join('apps', 'frontend', 'public', 'icons');
  const src = 'Typhoon-Solar-logo-315x146.webp';

  // 1. Create a pristine high-res white version for dark headers
  // Negate RGB while preserving alpha channel
  const whiteLogo = await sharp(src)
    .negate({ alpha: false })
    .toBuffer();

  fs.writeFileSync(path.join(imgDir, 'typhoon-logo-white.png'), whiteLogo);

  // 2. Also ensure 512x512 and 192x192 PWA icons are perfectly framed
  const pwa512 = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 11, g: 25, b: 44, alpha: 1 } // #0B192C
    }
  })
  .composite([{
    input: await sharp(src).resize(380, null, { fit: 'inside' }).toBuffer(),
    gravity: 'center'
  }])
  .png()
  .toFile(path.join(iconDir, 'icon-512x512.png'));

  const pwa192 = await sharp({
    create: {
      width: 192,
      height: 192,
      channels: 4,
      background: { r: 11, g: 25, b: 44, alpha: 1 }
    }
  })
  .composite([{
    input: await sharp(src).resize(140, null, { fit: 'inside' }).toBuffer(),
    gravity: 'center'
  }])
  .png()
  .toFile(path.join(iconDir, 'icon-192x192.png'));

  fs.copyFileSync(path.join(iconDir, 'icon-192x192.png'), path.join(iconDir, 'apple-touch-icon.png'));
  console.log('Processed logo variants and icons successfully');
}

processLogo().catch(console.error);
