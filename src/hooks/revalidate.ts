import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

/**
 * Dopo ogni modifica dal pannello admin, invalida la cache delle pagine pubbliche
 * così le modifiche sono visibili subito sul sito.
 */
const revalidateAll = async (context?: Record<string, unknown>) => {
  if (context?.disableRevalidate) return
  try {
    const { revalidatePath } = await import('next/cache')
    revalidatePath('/', 'layout')
  } catch {
    // Fuori da Next.js (es. script di seed) non c'è nulla da invalidare.
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
