const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.resolve(__dirname, '../public');

// --- 1. SVG: Full Official Logo with Typography (1024x1024) ---
function getFullLogoSvg(isDark = false) {
  const navy = isDark ? '#ffffff' : '#0c1f38';
  const navySecondary = isDark ? '#cbd5e1' : '#1e293b';
  const red = '#e11d48';
  const bg = isDark ? '#0c0a09' : '#ffffff';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@500;700&amp;family=Plus+Jakarta+Sans:wght@700;800&amp;display=swap');
      .brand-title {
        font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
        font-weight: 800;
        font-size: 114px;
        fill: ${navy};
        letter-spacing: -1px;
      }
      .brand-sub {
        font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
        font-weight: 700;
        font-size: 44px;
        fill: ${navy};
        letter-spacing: 5px;
      }
      .brand-jp {
        font-family: 'Noto Sans JP', 'IPAGothic', sans-serif;
        font-weight: 500;
        font-size: 26px;
        fill: ${navySecondary};
        letter-spacing: 7px;
      }
    </style>
    <!-- Sakura flower definition -->
    <g id="sakura-flower">
      <!-- 5 petals -->
      <path d="M 0 0 C -8 -16 -16 -24 0 -36 C 16 -24 8 -16 0 0 Z" fill="${red}" />
      <path d="M 0 0 C -8 -16 -16 -24 0 -36 C 16 -24 8 -16 0 0 Z" fill="${red}" transform="rotate(72)" />
      <path d="M 0 0 C -8 -16 -16 -24 0 -36 C 16 -24 8 -16 0 0 Z" fill="${red}" transform="rotate(144)" />
      <path d="M 0 0 C -8 -16 -16 -24 0 -36 C 16 -24 8 -16 0 0 Z" fill="${red}" transform="rotate(216)" />
      <path d="M 0 0 C -8 -16 -16 -24 0 -36 C 16 -24 8 -16 0 0 Z" fill="${red}" transform="rotate(288)" />
      <!-- Center stamen dots -->
      <circle cx="0" cy="0" r="4.5" fill="#ffffff" />
      <circle cx="0" cy="-7" r="1.8" fill="#ffffff" opacity="0.9"/>
      <circle cx="6.5" cy="-2.5" r="1.8" fill="#ffffff" opacity="0.9"/>
      <circle cx="4" cy="5.5" r="1.8" fill="#ffffff" opacity="0.9"/>
      <circle cx="-4" cy="5.5" r="1.8" fill="#ffffff" opacity="0.9"/>
      <circle cx="-6.5" cy="-2.5" r="1.8" fill="#ffffff" opacity="0.9"/>
    </g>
    <!-- Single falling petal -->
    <path id="sakura-petal" d="M 0 0 C -6 -10 -12 -16 0 -24 C 12 -16 6 -10 0 0 Z" fill="${red}" />
  </defs>

  <!-- EMBLEM GROUP (Centered at X: 500, Y: 350) -->
  <g transform="translate(500, 350)">
    
    <!-- 1. Rising Sun (Red circle in upper center) -->
    <circle cx="0" cy="-40" r="145" fill="${red}" />

    <!-- 2. Mount Fuji Dark Body -->
    <path d="M -180 120 C -120 70 -70 -40 -35 -105 L 35 -105 C 70 -40 120 70 180 120 Z" fill="${navy}" />

    <!-- 3. Mount Fuji Snowcap (Crisp white ridges on top) -->
    <path d="M -35 -105 
             L -20 -70 
             L -10 -85 
             L 0 -60 
             L 10 -85 
             L 20 -70 
             L 35 -105 
             Z" fill="#ffffff" />
    
    <!-- Glacial ridges detail -->
    <path d="M -20 -70 L -12 -50 L -4 -68 L 0 -45 L 4 -68 L 12 -50 L 20 -70 L 35 -105 L -35 -105 Z" fill="#ffffff" opacity="0.95" />

    <!-- 4. Water Reflections (beneath Torii gate) -->
    <g fill="${navy}">
      <path d="M -60 142 Q 0 140 60 142 Q 0 145 -60 142 Z" opacity="0.85" />
      <path d="M -85 152 Q 0 150 85 152 Q 0 156 -85 152 Z" opacity="0.9" />
      <path d="M -115 163 Q 0 160 115 163 Q 0 168 -115 163 Z" />
      <path d="M -80 174 Q 0 172 80 174 Q 0 178 -80 174 Z" opacity="0.8" />
      <path d="M -45 184 Q 0 182 45 184 Q 0 187 -45 184 Z" opacity="0.7" />
    </g>

    <!-- 5. Torii Gate (White with dark inner accents) -->
    <g>
      <!-- Kasagi / Shimaki (Curved top beam) -->
      <path d="M -115 18 C -60 12 60 12 115 18 L 118 6 C 60 0 -60 0 -118 6 Z" fill="#ffffff" />
      <path d="M -112 16 C -60 11 60 11 112 16 L 114 9 C 60 4 -60 4 -114 9 Z" fill="${navy}" />
      <path d="M -105 28 L 105 28 L 100 21 L -100 21 Z" fill="#ffffff" />

      <!-- Nuki (Secondary tie-beam) -->
      <rect x="-96" y="44" width="192" height="12" rx="2" fill="#ffffff" />
      <rect x="-92" y="46" width="184" height="8" rx="1" fill="${navy}" />

      <!-- Gakuzuka (Center strut) -->
      <rect x="-7" y="27" width="14" height="18" fill="#ffffff" />
      <rect x="-4" y="29" width="8" height="14" fill="${navy}" />

      <!-- Hashira (Two main pillars) -->
      <!-- Left pillar -->
      <path d="M -66 28 L -52 28 L -48 135 L -70 135 Z" fill="#ffffff" />
      <path d="M -62 32 L -54 32 L -51 132 L -65 132 Z" fill="${navy}" />
      <rect x="-73" y="132" width="28" height="6" rx="2" fill="#ffffff" />

      <!-- Right pillar -->
      <path d="M 52 28 L 66 28 L 70 135 L 48 135 Z" fill="#ffffff" />
      <path d="M 54 32 L 62 32 L 65 132 L 51 132 Z" fill="${navy}" />
      <rect x="45" y="132" width="28" height="6" rx="2" fill="#ffffff" />
    </g>

    <!-- 6. Big Outer Dark Navy Crescent (The framing moon/circle arc) -->
    <!-- Starts at (110, -210), curves around left to bottom right (190, 85) -->
    <path d="M 130 -220 
             C 40 -255 -80 -235 -170 -160 
             C -265 -80 -300 65 -250 180 
             C -200 290 -70 330 65 315 
             C 140 305 210 260 250 195 
             C 170 240 70 248 -10 225 
             C -110 195 -185 110 -185 -5 
             C -185 -125 -100 -210 50 -225 
             Z" fill="${navy}" />

    <!-- 7. Sakura Branch on upper right -->
    <!-- Branch twig -->
    <path d="M 60 -210 Q 140 -230 190 -210 Q 230 -190 280 -140" fill="none" stroke="${navy}" stroke-width="9" stroke-linecap="round" />
    <path d="M 140 -222 Q 170 -260 215 -270" fill="none" stroke="${navy}" stroke-width="6" stroke-linecap="round" />
    <path d="M 190 -210 Q 220 -225 250 -215" fill="none" stroke="${navy}" stroke-width="5" stroke-linecap="round" />

    <!-- Sakura Flowers along the branch -->
    <use href="#sakura-flower" x="140" y="-235" transform="scale(0.85)" />
    <use href="#sakura-flower" x="215" y="-270" transform="scale(0.95)" />
    <use href="#sakura-flower" x="260" y="-210" transform="scale(0.8)" />
    <use href="#sakura-flower" x="285" y="-140" transform="scale(0.65)" />

    <!-- Small buds & leaves -->
    <circle cx="105" cy="-228" r="7" fill="${red}" />
    <circle cx="175" cy="-245" r="8" fill="${red}" />

    <!-- Drifting / Falling sakura petals down the right -->
    <use href="#sakura-petal" x="230" y="-160" transform="rotate(35) scale(0.8)" />
    <use href="#sakura-petal" x="275" y="-95" transform="rotate(75) scale(0.9)" />
    <use href="#sakura-petal" x="245" y="-30" transform="rotate(40) scale(0.75)" />
    <use href="#sakura-petal" x="220" y="35" transform="rotate(110) scale(0.8)" />
  </g>

  <!-- TYPOGRAPHY SECTION (Centered below emblem) -->
  <g id="logo-text">
    <!-- "Chandu" with red accent mark above 'u' -->
    <g transform="translate(500, 720)">
      <!-- Main text -->
      <text x="0" y="0" text-anchor="middle" class="brand-title">
        <tspan>Chand</tspan><tspan dx="-2">u</tspan>
      </text>
      <!-- Red artistic petal accent above the letter 'u' (approx offset: x ~ +175, y ~ -85) -->
      <path d="M 162 -92 C 160 -105 170 -120 188 -125 C 185 -110 178 -96 162 -92 Z" fill="${red}" />
    </g>

    <!-- "Japanese School" -->
    <text x="500" y="800" text-anchor="middle" class="brand-sub">
      Japanese School
    </text>

    <!-- "—— 日本語を、もっと身近に ——" -->
    <g transform="translate(500, 855)">
      <!-- Left Rule Line -->
      <line x1="-310" y1="-8" x2="-200" y2="-8" stroke="${navySecondary}" stroke-width="2.5" stroke-linecap="round" />
      <!-- Japanese Slogan -->
      <text x="0" y="0" text-anchor="middle" class="brand-jp">
        日本語を、もっと身近に
      </text>
      <!-- Right Rule Line -->
      <line x1="200" y1="-8" x2="310" y2="-8" stroke="${navySecondary}" stroke-width="2.5" stroke-linecap="round" />
    </g>
  </g>
</svg>`;
}

// --- 2. SVG: Emblem Only for App Icon & PWA (Square 512x512) ---
function getEmblemSvg(isDark = false) {
  const navy = isDark ? '#ffffff' : '#0c1f38';
  const red = '#e11d48';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Sakura flower definition -->
    <g id="icon-sakura">
      <path d="M 0 0 C -6 -12 -12 -18 0 -27 C 12 -18 6 -12 0 0 Z" fill="${red}" />
      <path d="M 0 0 C -6 -12 -12 -18 0 -27 C 12 -18 6 -12 0 0 Z" fill="${red}" transform="rotate(72)" />
      <path d="M 0 0 C -6 -12 -12 -18 0 -27 C 12 -18 6 -12 0 0 Z" fill="${red}" transform="rotate(144)" />
      <path d="M 0 0 C -6 -12 -12 -18 0 -27 C 12 -18 6 -12 0 0 Z" fill="${red}" transform="rotate(216)" />
      <path d="M 0 0 C -6 -12 -12 -18 0 -27 C 12 -18 6 -12 0 0 Z" fill="${red}" transform="rotate(288)" />
      <circle cx="0" cy="0" r="3.5" fill="#ffffff" />
    </g>
    <path id="icon-petal" d="M 0 0 C -4 -8 -8 -12 0 -18 C 8 -12 4 -8 0 0 Z" fill="${red}" />
  </defs>

  <!-- Centered Emblem (Scales neatly inside 512x512) -->
  <g transform="translate(256, 256) scale(0.78)">
    <!-- 1. Rising Sun (Red circle) -->
    <circle cx="0" cy="-40" r="145" fill="${red}" />

    <!-- 2. Mount Fuji Dark Body -->
    <path d="M -180 120 C -120 70 -70 -40 -35 -105 L 35 -105 C 70 -40 120 70 180 120 Z" fill="${navy}" />

    <!-- 3. Snowcap -->
    <path d="M -35 -105 L -20 -70 L -10 -85 L 0 -60 L 10 -85 L 20 -70 L 35 -105 Z" fill="#ffffff" />
    <path d="M -20 -70 L -12 -50 L -4 -68 L 0 -45 L 4 -68 L 12 -50 L 20 -70 L 35 -105 L -35 -105 Z" fill="#ffffff" opacity="0.95" />

    <!-- 4. Water Reflections -->
    <g fill="${navy}">
      <path d="M -60 142 Q 0 140 60 142 Q 0 145 -60 142 Z" opacity="0.85" />
      <path d="M -85 152 Q 0 150 85 152 Q 0 156 -85 152 Z" opacity="0.9" />
      <path d="M -115 163 Q 0 160 115 163 Q 0 168 -115 163 Z" />
      <path d="M -80 174 Q 0 172 80 174 Q 0 178 -80 174 Z" opacity="0.8" />
      <path d="M -45 184 Q 0 182 45 184 Q 0 187 -45 184 Z" opacity="0.7" />
    </g>

    <!-- 5. Torii Gate -->
    <g>
      <path d="M -115 18 C -60 12 60 12 115 18 L 118 6 C 60 0 -60 0 -118 6 Z" fill="#ffffff" />
      <path d="M -112 16 C -60 11 60 11 112 16 L 114 9 C 60 4 -60 4 -114 9 Z" fill="${navy}" />
      <path d="M -105 28 L 105 28 L 100 21 L -100 21 Z" fill="#ffffff" />

      <rect x="-96" y="44" width="192" height="12" rx="2" fill="#ffffff" />
      <rect x="-92" y="46" width="184" height="8" rx="1" fill="${navy}" />

      <rect x="-7" y="27" width="14" height="18" fill="#ffffff" />
      <rect x="-4" y="29" width="8" height="14" fill="${navy}" />

      <path d="M -66 28 L -52 28 L -48 135 L -70 135 Z" fill="#ffffff" />
      <path d="M -62 32 L -54 32 L -51 132 L -65 132 Z" fill="${navy}" />
      <rect x="-73" y="132" width="28" height="6" rx="2" fill="#ffffff" />

      <path d="M 52 28 L 66 28 L 70 135 L 48 135 Z" fill="#ffffff" />
      <path d="M 54 32 L 62 32 L 65 132 L 51 132 Z" fill="${navy}" />
      <rect x="45" y="132" width="28" height="6" rx="2" fill="#ffffff" />
    </g>

    <!-- 6. Outer Dark Navy Crescent -->
    <path d="M 130 -220 
             C 40 -255 -80 -235 -170 -160 
             C -265 -80 -300 65 -250 180 
             C -200 290 -70 330 65 315 
             C 140 305 210 260 250 195 
             C 170 240 70 248 -10 225 
             C -110 195 -185 110 -185 -5 
             C -185 -125 -100 -210 50 -225 
             Z" fill="${navy}" />

    <!-- 7. Sakura Branch -->
    <path d="M 60 -210 Q 140 -230 190 -210 Q 230 -190 280 -140" fill="none" stroke="${navy}" stroke-width="9" stroke-linecap="round" />
    <path d="M 140 -222 Q 170 -260 215 -270" fill="none" stroke="${navy}" stroke-width="6" stroke-linecap="round" />
    <path d="M 190 -210 Q 220 -225 250 -215" fill="none" stroke="${navy}" stroke-width="5" stroke-linecap="round" />

    <use href="#icon-sakura" x="140" y="-235" transform="scale(0.85)" />
    <use href="#icon-sakura" x="215" y="-270" transform="scale(0.95)" />
    <use href="#icon-sakura" x="260" y="-210" transform="scale(0.8)" />
    <use href="#icon-sakura" x="285" y="-140" transform="scale(0.65)" />

    <circle cx="105" cy="-228" r="7" fill="${red}" />
    <circle cx="175" cy="-245" r="8" fill="${red}" />

    <use href="#icon-petal" x="230" y="-160" transform="rotate(35) scale(0.8)" />
    <use href="#icon-petal" x="275" y="-95" transform="rotate(75) scale(0.9)" />
    <use href="#icon-petal" x="245" y="-30" transform="rotate(40) scale(0.75)" />
    <use href="#icon-petal" x="220" y="35" transform="rotate(110) scale(0.8)" />
  </g>
</svg>`;
}

// --- 3. Maskable / Apple Touch Solid Background Icon (White or Soft-Slate Card) ---
function getCardIconSvg(bgFill = '#ffffff') {
  const emblem = getEmblemSvg(false);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" fill="${bgFill}"/>
  <g transform="translate(0, 0)">
    ${emblem.substring(emblem.indexOf('<defs>'), emblem.lastIndexOf('</svg>'))}
  </g>
</svg>`;
}

async function run() {
  console.log('Generating official Chandu Japanese School logo assets...');

  // 1. Save SVGs in public directory
  const fullLogoSvg = getFullLogoSvg(false);
  const fullLogoDarkSvg = getFullLogoSvg(true);
  const emblemSvg = getEmblemSvg(false);
  const cardIconSvg = getCardIconSvg('#ffffff');

  fs.writeFileSync(path.join(publicDir, 'logo.svg'), fullLogoSvg, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'logo-dark.svg'), fullLogoDarkSvg, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), emblemSvg, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'logo-emblem.svg'), emblemSvg, 'utf8');

  // 2. Render crisp PNG raster assets with Sharp
  await Promise.all([
    // Full Logo PNG (1024x1024 transparent)
    sharp(Buffer.from(fullLogoSvg))
      .resize(1024, 1024)
      .png({ quality: 100 })
      .toFile(path.join(publicDir, 'logo.png')),

    // Full Logo Dark PNG
    sharp(Buffer.from(fullLogoDarkSvg))
      .resize(1024, 1024)
      .png({ quality: 100 })
      .toFile(path.join(publicDir, 'logo-dark.png')),

    // PWA App Icon (512x512)
    sharp(Buffer.from(cardIconSvg))
      .resize(512, 512)
      .png({ quality: 100 })
      .toFile(path.join(publicDir, 'pwa-512x512.png')),

    // PWA App Icon (192x192)
    sharp(Buffer.from(cardIconSvg))
      .resize(192, 192)
      .png({ quality: 100 })
      .toFile(path.join(publicDir, 'pwa-192x192.png')),

    // Maskable Icon (safe zone padded)
    sharp(Buffer.from(cardIconSvg))
      .resize(512, 512)
      .png({ quality: 100 })
      .toFile(path.join(publicDir, 'pwa-maskable-512x512.png')),

    // Apple Touch Icon (180x180)
    sharp(Buffer.from(cardIconSvg))
      .resize(180, 180)
      .png({ quality: 100 })
      .toFile(path.join(publicDir, 'apple-touch-icon.png')),

    // Favicon (48x48)
    sharp(Buffer.from(cardIconSvg))
      .resize(48, 48)
      .png({ quality: 100 })
      .toFile(path.join(publicDir, 'favicon.png')),
  ]);

  console.log('Successfully generated all official logo files (SVG & PNG)!');
}

run().catch(err => {
  console.error('Failed to generate logo assets:', err);
  process.exit(1);
});
