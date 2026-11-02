/**
 * Prepara il pacchetto da caricare su Namecheap (cPanel → Setup Node.js App).
 * Da eseguire DOPO `npm run build`.
 *
 * Risultato: cartella dist-namecheap/lilycare-app/ (e lo zip lilycare-namecheap.zip, se `zip` è disponibile)
 *
 *   lilycare-app/            ← "Application root" in cPanel
 *   ├── app.js               ← "Application startup file" in cPanel
 *   ├── package.json         ← indica a Node che app.js è CommonJS
 *   ├── standalone/          ← il sito compilato (server Next.js + dipendenze)
 *   └── tmp/restart.txt      ← modificandolo, Passenger riavvia l'app
 */
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const standalone = path.join(root, '.next', 'standalone')
const outRoot = path.join(root, 'dist-namecheap')
const out = path.join(outRoot, 'lilycare-app')

if (!fs.existsSync(path.join(standalone, 'server.js'))) {
  console.error('✗ Build non trovata: esegui prima "npm run build".')
  process.exit(1)
}

fs.rmSync(outRoot, { recursive: true, force: true })
fs.mkdirSync(out, { recursive: true })

// 1. Server compilato. I file .env NON vanno mai nel pacchetto (contengono segreti locali):
//    sul server le variabili si impostano in cPanel.
fs.cpSync(standalone, path.join(out, 'standalone'), {
  recursive: true,
  // I collegamenti simbolici diventano copie reali: FTP e File Manager di cPanel non li gestiscono
  dereference: true,
  filter: (src) => !/[\\/]\.env(\..*)?$/.test(src),
})

// 2. File statici (CSS, JS, font) e cartella public
fs.cpSync(path.join(root, '.next', 'static'), path.join(out, 'standalone', '.next', 'static'), {
  recursive: true,
})
fs.cpSync(path.join(root, 'public'), path.join(out, 'standalone', 'public'), { recursive: true })

// 3. File di avvio per Phusion Passenger (cPanel)
fs.writeFileSync(
  path.join(out, 'app.js'),
  `/**
 * LilyCare – file di avvio per cPanel "Setup Node.js App".
 * Avvia il server del sito contenuto nella cartella "standalone".
 *
 * Se l'avvio non riesce, l'errore viene scritto anche nel file "startup-error.log"
 * di questa cartella: utile quando il server mostra solo "503 Service Unavailable".
 */
const fs = require('fs')
const path = require('path')
const { pathToFileURL } = require('url')

process.env.NODE_ENV = 'production'

function segnalaErrore(errore) {
  const testo =
    '[' +
    new Date().toISOString() +
    '] Avvio non riuscito\\n' +
    (errore && errore.stack ? errore.stack : String(errore)) +
    '\\n\\nNode ' +
    process.version +
    ' – cartella ' +
    __dirname +
    '\\n'
  console.error('[LilyCare] ' + testo)
  try {
    fs.writeFileSync(path.join(__dirname, 'startup-error.log'), testo)
  } catch {
    // se la cartella non è scrivibile resta il messaggio nel log del server
  }
}

process.on('uncaughtException', (errore) => {
  segnalaErrore(errore)
  process.exit(1)
})
process.on('unhandledRejection', (errore) => {
  segnalaErrore(errore)
  process.exit(1)
})

import(pathToFileURL(path.join(__dirname, 'standalone', 'server.js')).href).catch((errore) => {
  segnalaErrore(errore)
  process.exit(1)
})
`,
)
fs.writeFileSync(
  path.join(out, 'package.json'),
  JSON.stringify(
    { name: 'lilycare-app', private: true, type: 'commonjs', main: 'app.js' },
    null,
    2,
  ) + '\n',
)

// 4. Riavvio automatico di Passenger: quando cambia tmp/restart.txt l'applicazione si ricarica.
//    Lo stesso file viene messo anche in dist-namecheap/restart/, che la pubblicazione via FTP
//    carica per ultimo: così il riavvio avviene solo a caricamento completato.
const restartStamp = new Date().toISOString() + '\n'
for (const dir of [path.join(out, 'tmp'), path.join(outRoot, 'restart', 'tmp')]) {
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'restart.txt'), restartStamp)
}

// 5. Controlli: nessun file .env e nessun collegamento simbolico nel pacchetto
const leaked = fs.readdirSync(path.join(out, 'standalone')).filter((f) => f.startsWith('.env'))
if (leaked.length) {
  console.error('✗ Trovati file .env nel pacchetto:', leaked)
  process.exit(1)
}
const links = execSync('find . -type l', { cwd: out }).toString().trim()
if (links) {
  console.error('✗ Il pacchetto contiene collegamenti simbolici:\n' + links)
  process.exit(1)
}

// 6. Zip (facoltativo) da caricare con il File Manager di cPanel
try {
  execSync('zip -qr ../lilycare-namecheap.zip .', { cwd: out, stdio: 'inherit' })
  console.log('✓ Creato dist-namecheap/lilycare-namecheap.zip')
} catch {
  console.log(
    'ℹ "zip" non disponibile: carica direttamente la cartella dist-namecheap/lilycare-app/',
  )
}
console.log('✓ Pacchetto pronto in dist-namecheap/lilycare-app/')
