/**
 * Caricamento dei contenuti iniziali da riga di comando.
 *
 *   npm run seed            → carica i contenuti solo se il database è vuoto
 *   npm run seed -- --force → SOSTITUISCE servizi, team, articoli e pagine con quelli iniziali
 *                             (utenti, immagini e richieste di appuntamento non vengono toccati)
 */
import config from '@payload-config'
import { getPayload } from 'payload'

import { seedDatabase } from './seed'

const force = process.argv.includes('--force') || process.env.SEED_FORCE === '1'
const payload = await getPayload({ config })
await seedDatabase(payload, { force })
process.exit(0)
