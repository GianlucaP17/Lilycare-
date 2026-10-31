import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

/**
 * Dopo ogni modifica dal pannello admin, svuota la cache dei contenuti:
 * la visita successiva mostra subito i dati aggiornati (es. un nuovo numero di telefono).
 */
const revalidateAll = async (context?: Record<string, unknown>) => {
  if (context?.disableRevalidate) return
  try {
    const { revalidatePath, revalidateTag } = await import('next/cache')
    revalidateTag('cms', { expire: 0 })
    revalidatePath('/', 'layout')
  } catch {
    // Fuori da Next.js (es. script di caricamento contenuti) non c'è nulla da invalidare.
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = async ({ doc, req }) => {
  await revalidateAll(req.context)
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  await revalidateAll(req.context)
  return doc
}

export const revalidateGlobal: GlobalAfterChangeHook = async ({ doc, req }) => {
  await revalidateAll(req.context)
  return doc
}
