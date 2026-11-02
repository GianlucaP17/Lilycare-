/** Opzioni condivise fra pagina "Lavora con noi", pannello admin ed email. */

/** Profili cercati dal centro. Si possono aggiungere qui e compaiono ovunque. */
export const roleOptions = [
  { label: 'Assistente di studio medico (MPA)', value: 'mpa' },
  { label: 'Tecnico di radiologia medica (TRM)', value: 'trm' },
  { label: 'Infermiere / infermiera', value: 'infermiere' },
  { label: 'Medico specialista', value: 'medico-specialista' },
  { label: 'Medico di famiglia', value: 'medico-famiglia' },
  { label: 'Accoglienza e segretariato', value: 'segretariato' },
  { label: 'Altro profilo sanitario', value: 'altro' },
] as const

/** Forme di collaborazione proposte dal centro. */
export const collaborationOptions = [
  { label: 'Assunzione come dipendente', value: 'dipendente' },
  { label: 'Collaborazione indipendente', value: 'indipendente' },
  { label: 'Da valutare insieme', value: 'da-valutare' },
] as const

export const availabilityOptions = [
  { label: 'Tempo pieno', value: 'pieno' },
  { label: 'Tempo parziale', value: 'parziale' },
  { label: 'Alcuni giorni alla settimana', value: 'giorni' },
  { label: 'Da concordare', value: 'da-concordare' },
] as const

export const applicationStatusOptions = [
  { label: '🟢 Nuova', value: 'nuova' },
  { label: '🟡 In valutazione', value: 'in-valutazione' },
  { label: '📅 Colloquio fissato', value: 'colloquio' },
  { label: '⚪ Archiviata', value: 'archiviata' },
] as const

export const labelFor = (
  options: ReadonlyArray<{ label: string; value: string }>,
  value?: string | null,
) => options.find((o) => o.value === value)?.label ?? value ?? ''
