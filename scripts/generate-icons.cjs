const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.resolve(__dirname, '../public');

// 1. Standard SVG (any)
const svgAny = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="roseBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f43f5e"/>
      <stop offset="60%" stop-color="#e11d48"/>
      <stop offset="100%" stop-color="#be123c"/>
    </linearGradient>
  </defs>
  
  <rect width="512" height="512" rx="112" fill="url(#roseBg)"/>
  <circle cx="256" cy="256" r="156" fill="#ffffff"/>
  
  <g fill="#e11d48">
    <rect x="184" y="156" width="24" height="200" rx="6"/>
    <rect x="184" y="156" width="144" height="24" rx="6"/>
    <rect x="304" y="156" width="24" height="200" rx="6"/>
    <rect x="184" y="244" width="144" height="22" rx="5"/>
    <rect x="184" y="332" width="144" height="24" rx="6"/>
  </g>
  
  <text x="256" y="334" font-family="IPAGothic, Noto Sans JP, Hiragino Kaku Gothic ProN, sans-serif" font-size="210" font-weight="900" fill="#e11d48" text-anchor="middle">日</text>
</svg>`;

// 2. Full-bleed Maskable SVG (for Android adaptive rounded/circle masks)
const svgMaskable = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="roseBgMask" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f43f5e"/>
      <stop offset="60%" stop-color="#e11d48"/>
      <stop offset="100%" stop-color="#be123c"/>
    </linearGradient>
  </defs>
  
  <rect width="512" height="512" fill="url(#roseBgMask)"/>
  <circle cx="256" cy="256" r="148" fill="#ffffff"/>
  
  <g fill="#e11d48">
    <rect x="188" y="162" width="22" height="188" rx="5"/>
    <rect x="188" y="162" width="136" height="22" rx="5"/>
    <rect x="302" y="162" width="22" height="188" rx="5"/>
    <rect x="188" y="245" width="136" height="20" rx="4"/>
    <rect x="188" y="328" width="136" height="22" rx="5"/>
  </g>
  
  <text x="256" y="330" font-family="IPAGothic, Noto Sans JP, Hiragino Kaku Gothic ProN, sans-serif" font-size="195" font-weight="900" fill="#e11d48" text-anchor="middle">日</text>
</svg>`;

// 3. Apple Touch Icon (180x180 solid)
const svgApple = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="180" height="180">
  <defs>
    <linearGradient id="roseBgApple" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f43f5e"/>
      <stop offset="60%" stop-color="#e11d48"/>
      <stop offset="100%" stop-color="#be123c"/>
    </linearGradient>
  </defs>
  <rect width="180" height="180" fill="url(#roseBgApple)"/>
  <circle cx="90" cy="90" r="54" fill="#ffffff"/>
  <g fill="#e11d48">
    <rect x="66" y="56" width="8" height="68" rx="2"/>
    <rect x="66" y="56" width="48" height="8" rx="2"/>
    <rect x="106" y="56" width="8" height="68" rx="2"/>
    <rect x="66" y="86" width="48" height="7" rx="1.5"/>
    <rect x="66" y="116" width="48" height="8" rx="2"/>
  </g>
  <text x="90" y="118" font-family="IPAGothic, Noto Sans JP, sans-serif" font-size="70" font-weight="900" fill="#e11d48" text-anchor="middle">日</text>
</svg>`;

async function generate() {
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgAny);

  await Promise.all([
    sharp(Buffer.from(svgAny)).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-512x512.png')),
    sharp(Buffer.from(svgAny)).resize(192, 192).png().toFile(path.join(publicDir, 'pwa-192x192.png')),
    sharp(Buffer.from(svgMaskable)).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-maskable-512x512.png')),
    sharp(Buffer.from(svgApple)).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png')),
    sharp(Buffer.from(svgAny)).resize(48, 48).png().toFile(path.join(publicDir, 'favicon.png')),
  ]);

  console.log('Successfully generated all PWA icons with correct Japanese Kanji emblem!');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
