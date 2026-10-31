/**
 * Genera i file del marchio LilyCare a partire dal logo ufficiale (assets/brand/lilycare-logo-originale.jpg):
 * vettorializza (potrace) le quattro parti del logo nei colori ufficiali e produce
 *  - public/brand/*.svg   (logo completo, orizzontale, chiaro per sfondi scuri, solo fiore)
 *  - public/brand/lilycare-logo-email.png (per le email, che non supportano SVG)
 *  - icone del sito (favicon, apple-icon, icone PWA)
 *  - src/components/icons/brand-paths.ts (tracciato del fiore per i componenti React)
 *
 *   node scripts/build-brand-assets.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import potrace from 'potrace'
import sharp from 'sharp'

const root = process.cwd()
const SRC = path.join(root, 'assets/brand/lilycare-logo-originale.jpg')
export const BLUE = '#2F55B4'
export const PINK = '#CF7EB4'
const SCALE = 3 // si ingrandisce prima di vettorializzare per bordi più precisi

const { data, info } = await sharp(SRC)
  .resize({ width: 1320 * SCALE, kernel: 'lanczos3' })
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })
const W = info.width
const H = info.height

const isInk = (r, g, b) => Math.min(r, g, b) < 215
const isBlue = (r, g, b) => isInk(r, g, b) && b > r + 25
const isPink = (r, g, b) => isInk(r, g, b) && r > g + 30 && !isBlue(r, g, b)

/** Maschera bianco/nero di una parte del logo (in coordinate del file originale × SCALE). */
async function mask(test, y0, y1) {
  const out = Buffer.alloc(W * H, 255)
  for (let y = y0 * SCALE; y < y1 * SCALE; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 3
      if (test(data[i], data[i + 1], data[i + 2])) out[y * W + x] = 0
    }
  }
  // leggera sfocatura + soglia: elimina il rumore della compressione JPEG (curve più pulite, file più leggeri)
  return sharp(out, { raw: { width: W, height: H, channels: 1 } })
    .blur(SCALE * 0.7)
    .threshold(128)
    .png()
    .toBuffer()
}

const trace = (buffer) =>
  new Promise((resolve, reject) =>
    potrace.trace(
      buffer,
      { threshold: 128, turdSize: 20, optTolerance: 1.2, alphaMax: 1.1 },
      (err, svg) => {
        if (err) return reject(err)
        const d = /d="([^"]+)"/.exec(svg)?.[1]
        if (!d) return reject(new Error('Nessun tracciato trovato'))
        resolve(d)
      },
    ),
  )

/** Riporta le coordinate alla scala originale (1 unità = 1 pixel del logo originale). */
const rescale = (d) =>
  d
    .replace(/-?\d+(\.\d+)?/g, (n) => String(Math.round((Number(n) / SCALE) * 10) / 10))
    .replace(/,\s*/g, ',')
    .replace(/\s+/g, ' ')

const parts = {
  lotus: rescale(await trace(await mask(isPink, 0, 350))),
  care: rescale(await trace(await mask(isPink, 350, 600))),
  lily: rescale(await trace(await mask(isBlue, 350, 600))),
  tagline: rescale(await trace(await mask(isBlue, 600, 700))),
}

// Riquadri (dal logo originale): fiore 497–823 × 79–334, scritta 240–1116 × 364–587, sottotitolo 341–986 × 612–649
const svg = (viewBox, body, extra = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-label="LilyCare Medical Center"${extra}>${body}</svg>\n`

const colors = (light) => ({
  lotus: light ? '#F1CDE5' : PINK,
  care: light ? '#F1CDE5' : PINK,
  lily: light ? '#FFFFFF' : BLUE,
  tagline: light ? '#DCE5F8' : BLUE,
})

const allPaths = (light) => {
  const c = colors(light)
  return Object.entries(parts)
    .map(([k, d]) => `<path fill="${c[k]}" fill-rule="evenodd" d="${d}"/>`)
    .join('')
}

// 1. Logo completo (come l'originale)
const full = svg('228 67 900 594', allPaths(false))
const fullLight = svg('228 67 900 594', allPaths(true))

// 2. Logo orizzontale: fiore a sinistra, scritta a destra (per l'intestazione del sito)
const horizontal = (light) => {
  const c = colors(light)
  // il fiore (326×255) viene scalato all'altezza del blocco scritta+sottotitolo (364–649 = 285) e affiancato
  const s = 285 / 255
  const lotus = `<g transform="translate(${-497 * s} ${-79 * s + 364}) scale(${s})"><path fill="${c.lotus}" fill-rule="evenodd" d="${parts.lotus}"/></g>`
  const text = ['care', 'lily', 'tagline']
    .map((k) => `<path fill="${c[k]}" fill-rule="evenodd" d="${parts[k]}"/>`)
    .join('')
  const textBlock = `<g transform="translate(${326 * s + 40 - 240} 0)">${text}</g>`
  const width = Math.round(326 * s + 40 + (1116 - 240) + 8)
  return svg(`-4 356 ${width} 302`, lotus + textBlock)
}

// 3. Solo il fiore
const mark = svg('489 71 342 271', `<path fill="${PINK}" fill-rule="evenodd" d="${parts.lotus}"/>`)

fs.mkdirSync(path.join(root, 'public/brand'), { recursive: true })
const write = (file, content) => {
  fs.writeFileSync(path.join(root, file), content)
  console.log(`✓ ${file} (${Math.round(Buffer.byteLength(content) / 1024)} KB)`)
}
write('public/brand/lilycare-logo.svg', full)
write('public/brand/lilycare-logo-chiaro.svg', fullLight)
write('public/brand/lilycare-logo-orizzontale.svg', horizontal(false))
write('public/brand/lilycare-logo-orizzontale-chiaro.svg', horizontal(true))
write('public/brand/lilycare-fiore.svg', mark)
// copia per l'immagine di condivisione generata (src/app/og)
write('src/app/og/logo-orizzontale.svg', horizontal(false))

// 4. PNG per le email (sfondo trasparente)
await sharp(Buffer.from(full), { density: 144 })
  .resize({ width: 480 })
  .png()
  .toFile(path.join(root, 'public/brand/lilycare-logo-email.png'))
console.log('✓ public/brand/lilycare-logo-email.png')

// 5. Icone: fiore rosa su fondo bianco, con margine
const iconSvg = (size, radius) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 400 400">` +
      `<rect width="400" height="400" rx="${radius}" fill="#FFFFFF"/>` +
      `<g transform="translate(200 206) scale(0.92) translate(-660 -206.5)"><path fill="${PINK}" fill-rule="evenodd" d="${parts.lotus}"/></g></svg>`,
  )
write('src/app/(frontend)/icon.svg', iconSvg(48, 80).toString())
await sharp(iconSvg(180, 0)).png().toFile(path.join(root, 'src/app/(frontend)/apple-icon.png'))
await sharp(iconSvg(192, 0)).png().toFile(path.join(root, 'public/icons/icon-192.png'))
await sharp(iconSvg(512, 0)).png().toFile(path.join(root, 'public/icons/icon-512.png'))
console.log('✓ icone (apple-icon, icon-192, icon-512)')

// 6. Tracciato del fiore per i componenti React
write(
  'src/components/icons/brand-paths.ts',
  `/* File generato da scripts/build-brand-assets.mjs a partire dal logo ufficiale: non modificare a mano. */\n\n` +
    `export const BRAND_BLUE = '${BLUE}'\nexport const BRAND_PINK = '${PINK}'\n\n` +
    `/** Fiore di loto del logo LilyCare (viewBox "489 71 342 271"). */\n` +
    `export const LOTUS_VIEWBOX = '489 71 342 271'\nexport const LOTUS_PATH =\n  '${parts.lotus}'\n`,
)
