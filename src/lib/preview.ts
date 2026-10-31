import { getServerUrl } from './utils'

/** Collegamento "Anteprima" del pannello admin: mostra la pagina (anche in bozza) sul sito. */
export const previewUrl = (path: string) =>
  `${getServerUrl()}/next/preview?path=${encodeURIComponent(path)}`
