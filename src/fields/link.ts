import type { GroupField } from 'payload'

/** Pulsante/collegamento semplice: testo + indirizzo. */
export const linkGroup = (name: string, label: string, required = false): GroupField => ({
  name,
  label,
  type: 'group',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'label', label: 'Testo del pulsante', type: 'text', required },
        {
          name: 'url',
          label: 'Collegamento',
          type: 'text',
          required,
          admin: {
            description: 'Es. /prenota, /servizi/ozonoterapia, https://… oppure tel:+41…',
          },
        },
      ],
    },
  ],
})
