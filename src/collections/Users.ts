import type { CollectionConfig } from 'payload'

import { authenticated, isAdmin, isAdminField, isAdminOrSelf } from '@/access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Utente', plural: 'Utenti' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Sistema',
    description: 'Persone che possono accedere al pannello di amministrazione.',
  },
  auth: {
    tokenExpiration: 60 * 60 * 8, // 8 ore
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000, // 15 minuti
  },
  access: {
    admin: ({ req }) => Boolean(req.user),
    read: authenticated,
    create: isAdmin,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', label: 'Nome e cognome', type: 'text', required: true },
    {
      name: 'role',
      label: 'Ruolo',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Amministratore (accesso completo)', value: 'admin' },
        { label: 'Redattore (contenuti e richieste)', value: 'editor' },
      ],
      access: { update: isAdminField },
      admin: {
        position: 'sidebar',
        description:
          'Il primo utente creato diventa sempre Amministratore. Solo gli amministratori possono gestire gli utenti e cancellare le richieste di appuntamento.',
      },
    },
  ],
  hooks: {
    beforeChange: [
      // Il primo utente creato diventa automaticamente amministratore.
      async ({ data, operation, req }) => {
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users', req })
          if (totalDocs === 0) data.role = 'admin'
        }
        return data
      },
    ],
  },
  timestamps: true,
}
