/**
 * Uniforma la luminosità delle foto dello studio (public/images/studio).
 *
 * Le foto scattate al chiuso risultano scure e di luminosità diversa fra loro: la galleria
 * ne esce disomogenea. Questo script porta ogni foto alla stessa luminosità media, così gli
 * ambienti appaiono chiari e coerenti, senza bruciare le finestre.
 *
 * È IDEMPOTENTE: si basa su un valore di luminosità assoluto, quindi eseguirlo più volte
 * non schiarisce ulteriormente le foto già a posto.
 *
 *   node scripts/photo-brightness.mjs            applica le modifiche
 *   node scripts/photo-brightness.mjs --dry      mostra soltanto cosa farebbe
 */
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const DIR = path.join(process.cwd(), 'public/images/studio')
/** Luminosità media desiderata (0–255). Le foto già più chiare restano intatte. */
const TARGET = 148
/** Schiarimento massimo, in unità di luminosità percettiva (L*). */
const MAX_LIFT = 18
const DRY = process.argv.includes('--dry')

/** Luminosità media percepita di un'immagine (0–255). */
async function luma(input) {
  const { channels } = await sharp(input).stats()
  const [r, g, b] = channels
  return 0.2126 * r.mean + 0.7152 * g.mean + 0.0722 * b.mean
}

/** Quota di pixel quasi bianchi: serve a non bruciare finestre e pareti chiare. */
async function clipped(input) {
  const { data, info } = await sharp(input).greyscale().raw().toBuffer({ resolveWithObject: true })
  let n = 0
  for (const v of data) if (v >= 252) n++
  return n / (info.width * info.height)
}

/** Cerca lo schiarimento che porta la foto alla luminosità desiderata. */
async function findLift(small, target) {
  let low = 0
  let high = MAX_LIFT
  for (let i = 0; i < 8; i++) {
    const mid = (low + high) / 2
    const value = await luma(await sharp(small).modulate({ lightness: mid }).toBuffer())
    if (value < target) low = mid
    else high = mid
  }
  return (low + high) / 2
}

const files = fs.readdirSync(DIR).filter((f) => /\.jpe?g$/i.test(f))
if (!files.length) {
  console.error('✗ Nessuna foto trovata in', DIR)
  process.exit(1)
}

for (const file of files.sort()) {
  const full = path.join(DIR, file)
  const before = await luma(full)
  if (before >= TARGET - 1) {
    console.log(`· ${file.padEnd(26)} ${before.toFixed(0)} → già abbastanza chiara`)
    continue
  }

  // La ricerca si fa su una copia ridotta: stesso risultato, molto più veloce
  const small = await sharp(full).resize({ width: 400 }).toBuffer()
  const lift = await findLift(small, TARGET)

  const out = await sharp(full)
    .modulate({ lightness: lift })
    .jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toBuffer()

  const after = await luma(out)
  const burn = (await clipped(out)) - (await clipped(full))
  console.log(
    `${DRY ? '·' : '✓'} ${file.padEnd(26)} ${before.toFixed(0)} → ${after.toFixed(0)}` +
      `  (schiarimento ${lift.toFixed(1)}, pixel bruciati +${(burn * 100).toFixed(2)}%)`,
  )
  if (!DRY) fs.writeFileSync(full, out)
}

console.log(DRY ? '\nNessun file modificato (--dry).' : '\n✓ Foto aggiornate.')
