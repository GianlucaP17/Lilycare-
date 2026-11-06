/**
 * Inaugurazione del centro: avviso a tempo sulla homepage.
 *
 * L'avviso compare da subito e **sparisce da solo** quando l'evento finisce: le pagine sono
 * generate a ogni richiesta, quindi dopo l'orario di chiusura nessuno deve togliere niente.
 * Quando l'evento sarà passato si può cancellare questo file, il componente
 * src/components/home/InaugurazioneBanner.tsx e la riga che lo richiama in
 * src/app/(frontend)/page.tsx.
 */

export const inaugurazione = {
  /** Inizio, con il fuso orario svizzero scritto per esteso. */
  inizio: '2026-11-11T17:30:00+01:00',
  /** Fine: da questo momento l'avviso non compare più. */
  fine: '2026-11-11T21:00:00+01:00',
  giorno: 'Mercoledì 11 novembre 2026',
  ora: '17:30',
  titolo: 'Inaugurazione del centro',
  invito: 'Siamo lieti di invitarvi',
} as const

/** L'avviso si mostra finché l'inaugurazione non è finita. */
export function inaugurazioneInCorso(adesso: number = Date.now()): boolean {
  return adesso < Date.parse(inaugurazione.fine)
}
