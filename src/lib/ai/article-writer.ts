import Anthropic from '@anthropic-ai/sdk'
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod'
import * as z from 'zod/v4'

/**
 * Generazione delle bozze degli articoli con Claude (Anthropic).
 *
 * - Modello: Claude Opus 5.5 (modificabile con la variabile ANTHROPIC_MODEL).
 * - Output strutturato (JSON validato con Zod): titolo, sommario, testo, FAQ, note per il revisore.
 * - Fallback lato server ("fallbacks: default"): se il modello rifiuta una richiesta per motivi
 *   di sicurezza, l'API riprova automaticamente su un modello alternativo consigliato.
 * - Costo indicativo: circa 0,10–0,20 USD per bozza.
 */

export const AI_MODEL = process.env.ANTHROPIC_MODEL || 'claude-opus-5-5'

export const isAiConfigured = () => Boolean(process.env.ANTHROPIC_API_KEY)

export const ArticleDraftSchema = z.object({
  title: z.string().describe('Titolo dell’articolo, chiaro e specifico (max 90 caratteri)'),
  excerpt: z.string().describe('Sommario di 1–2 frasi (max 300 caratteri)'),
  metaTitle: z.string().describe('Titolo per Google, max 60 caratteri, termina con " | LilyCare"'),
  metaDescription: z.string().describe('Descrizione per Google, 120–155 caratteri'),
  categorySlug: z.string().describe('Slug di una delle categorie disponibili'),
  relatedServiceSlugs: z.array(z.string()).describe('Slug dei servizi del centro collegati (0–3)'),
  contentMarkdown: z
    .string()
    .describe(
      'Testo in Markdown: paragrafi, titoli ## e ###, elenchi. Nessun titolo # di primo livello.',
    ),
  faqs: z
    .array(z.object({ question: z.string(), answer: z.string() }))
    .describe('2–4 domande frequenti con risposte brevi'),
  reviewNotes: z
    .array(z.string())
    .describe(
      'Affermazioni mediche o fattuali che il revisore deve verificare prima di pubblicare',
    ),
  imagePrompt: z
    .string()
    .describe(
      'Descrizione IN INGLESE dell’illustrazione di copertina, secondo le regole sull’immagine',
    ),
  imageAlt: z
    .string()
    .describe('Testo alternativo in italiano dell’illustrazione (max 120 caratteri)'),
})

export type ArticleDraft = z.infer<typeof ArticleDraftSchema>

export type WriterContext = {
  clinic: {
    name: string
    address: string
    phone?: string | null
    area?: string | null
  }
  services: Array<{ slug: string; title: string; summary: string; performedBy: string[] }>
  team: Array<{ name: string; role: string }>
  categories: Array<{ slug: string; title: string }>
  recentTitles: string[]
  styleGuide?: string | null
}

export type WriterRequest = {
  topic?: string | null
  categorySlug?: string | null
  serviceSlugs?: string[]
  notes?: string | null
  length: 'breve' | 'media' | 'lunga'
}

const WORDS: Record<WriterRequest['length'], string> = {
  breve: 'circa 600 parole',
  media: 'circa 900 parole',
  lunga: 'circa 1200 parole',
}

/** Errore comprensibile da mostrare allo staff nel pannello. */
export class AiWriterError extends Error {}

function systemPrompt(ctx: WriterContext): string {
  const services = ctx.services
    .map(
      (s) =>
        `- ${s.title} (slug: ${s.slug})${s.performedBy.length ? ` – eseguito da: ${s.performedBy.join(', ')}` : ''}: ${s.summary}`,
    )
    .join('\n')
  const team = ctx.team.map((t) => `- ${t.name}: ${t.role}`).join('\n')
  const categories = ctx.categories.map((c) => `- ${c.title} (slug: ${c.slug})`).join('\n')

  return `Sei il redattore scientifico del sito di ${ctx.clinic.name}, centro medico in ${ctx.clinic.address}${
    ctx.clinic.area ? `, ${ctx.clinic.area}` : ''
  } (Svizzera). Prepari BOZZE di articoli divulgativi in italiano per i pazienti. Ogni bozza viene riletta e approvata dallo staff sanitario prima della pubblicazione: il tuo compito è rendere quella revisione facile e sicura.

## Il centro
Servizi offerti:
${services}

Team:
${team}

Categorie della sezione Notizie:
${categories}

## Regole sui contenuti medici (obbligatorie)
- Scrivi solo informazioni generali, prudenti e coerenti con le conoscenze mediche consolidate. Se un tema è controverso o le evidenze sono limitate, dillo con onestà.
- Non promettere guarigioni o risultati, non usare superlativi pubblicitari ("il migliore", "rivoluzionario"), non usare testimonianze di pazienti: in Svizzera la comunicazione delle professioni mediche deve essere oggettiva.
- Non inventare dati: niente percentuali, statistiche, studi, citazioni, nomi di ricercatori, prezzi, rimborsi specifici o titoli dei professionisti che non ti sono stati forniti.
- Non attribuire al centro servizi, apparecchiature, orari o caratteristiche che non compaiono nell’elenco sopra. Non fare diagnosi e non dare indicazioni terapeutiche personali: invita a una valutazione medica.
- Quando è pertinente indica i segnali che richiedono un medico rapidamente e ricorda che in caso di emergenza in Svizzera si chiama il 144.
- Usa il contesto svizzero (cassa malati, LAMal, assicurazioni complementari) solo in termini generali.
- In "reviewNotes" elenca, una per voce, ogni affermazione medica o fattuale che un professionista deve verificare prima di pubblicare (indicazioni, controindicazioni, durate, numeri di sedute, rimborsi…), più eventuali dubbi.

## Regole sull’immagine di copertina (obbligatorie)
In "imagePrompt" descrivi, **in inglese**, un’illustrazione editoriale astratta che accompagni l’articolo. Serve a evocare il tema, non a documentarlo.
- VIETATO: persone, volti, mani, corpi, parti anatomiche, organi, sangue, ferite, aghi, siringhe, apparecchiature mediche riconoscibili, camici, loghi, marchi, testo, lettere o numeri di qualsiasi tipo.
- Un’immagine medica realistica sarebbe inventata e quindi ingannevole: resta sull’astratto e sul simbolico (forme morbide, onde, gradienti, linee sottili, elementi naturali stilizzati come petali, foglie, acqua, luce).
- Colori: blu notte profondo (#2F55B4), rosa orchidea (#CF7EB4), crema chiarissimo (#FBF9F6), bianco. Luce naturale, atmosfera calma e pulita.
- Composizione orizzontale, molto spazio vuoto, soggetto spostato verso destra: la parte in basso a sinistra deve restare libera.
- Scrivi 2–4 frasi descrittive, senza elenchi.
In "imageAlt" scrivi in italiano, per chi non vede l’immagine, che cosa rappresenta l’illustrazione.

## Stile
- Italiano corretto, registro chiaro e professionale, adatto a un pubblico non specialista. Dai del "tu" al lettore.
- Struttura: un’introduzione che risponde subito alla domanda principale, poi sezioni con titoli ## (eventualmente ###), elenchi puntati dove aiutano, una breve conclusione che invita, senza insistere, a chiedere una valutazione al centro.
- Quando citi un servizio del centro puoi inserire un link Markdown alla sua pagina: /servizi/SLUG (solo con gli slug elencati sopra).
- Evita argomenti e titoli già trattati negli articoli recenti.${ctx.styleGuide ? `\n\nLinee guida dello staff:\n${ctx.styleGuide}` : ''}`
}

function userPrompt(ctx: WriterContext, req: WriterRequest): string {
  const lines: string[] = []
  lines.push(
    req.topic?.trim()
      ? `Argomento richiesto: ${req.topic.trim()}`
      : 'Argomento: scegli tu un tema utile per i pazienti del centro, legato ai servizi offerti e diverso dagli articoli recenti.',
  )
  if (req.categorySlug) lines.push(`Categoria: ${req.categorySlug}`)
  if (req.serviceSlugs?.length) lines.push(`Servizi da collegare: ${req.serviceSlugs.join(', ')}`)
  lines.push(`Lunghezza del testo: ${WORDS[req.length]}.`)
  if (req.notes?.trim()) lines.push(`Indicazioni dello staff: ${req.notes.trim()}`)
  if (ctx.recentTitles.length) {
    lines.push(
      `Articoli recenti (non ripeterli):\n${ctx.recentTitles.map((t) => `- ${t}`).join('\n')}`,
    )
  }
  return lines.join('\n\n')
}

/** Chiede a Claude una bozza di articolo e la restituisce già validata. */
export async function writeArticleDraft(
  ctx: WriterContext,
  req: WriterRequest,
): Promise<ArticleDraft> {
  if (!isAiConfigured()) {
    throw new AiWriterError(
      'Assistente non configurato: manca la variabile ANTHROPIC_API_KEY sul server.',
    )
  }

  const client = new Anthropic()

  try {
    const response = await client.beta.messages.parse({
      model: AI_MODEL,
      max_tokens: 16000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: {
        effort: 'high',
        format: betaZodOutputFormat(ArticleDraftSchema),
      },
      system: systemPrompt(ctx),
      messages: [{ role: 'user', content: userPrompt(ctx, req) }],
    })

    if (response.stop_reason === 'refusal') {
      throw new AiWriterError(
        'L’assistente ha rifiutato questo argomento. Prova a riformularlo in modo più generale.',
      )
    }
    if (response.stop_reason === 'max_tokens') {
      throw new AiWriterError(
        'La bozza è risultata troppo lunga ed è stata interrotta. Riprova con una lunghezza minore.',
      )
    }
    if (!response.parsed_output) {
      throw new AiWriterError('La risposta dell’assistente non era nel formato previsto. Riprova.')
    }
    return response.parsed_output
  } catch (error) {
    if (error instanceof AiWriterError) throw error
    if (error instanceof Anthropic.AuthenticationError) {
      throw new AiWriterError('Chiave API di Anthropic non valida: controlla ANTHROPIC_API_KEY.')
    }
    if (error instanceof Anthropic.PermissionDeniedError) {
      throw new AiWriterError('La chiave API non ha accesso al modello richiesto.')
    }
    if (error instanceof Anthropic.RateLimitError) {
      throw new AiWriterError(
        'Troppe richieste all’assistente in poco tempo: riprova tra qualche minuto.',
      )
    }
    if (error instanceof Anthropic.BadRequestError) {
      throw new AiWriterError(`Richiesta non valida: ${error.message}`)
    }
    if (error instanceof Anthropic.APIConnectionError) {
      throw new AiWriterError(
        'Impossibile contattare il servizio AI: verifica la connessione del server.',
      )
    }
    if (error instanceof Anthropic.APIError) {
      throw new AiWriterError(
        `Il servizio AI non è disponibile al momento (errore ${error.status}). Riprova più tardi.`,
      )
    }
    throw error
  }
}
