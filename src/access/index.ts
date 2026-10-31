import type { Access, FieldAccess } from 'payload'

/** Chiunque (anche i visitatori non autenticati). */
export const anyone: Access = () => true

/** Solo utenti autenticati nel pannello admin. */
export const authenticated: Access = ({ req }) => Boolean(req.user)

/** Solo amministratori. */
export const isAdmin: Access = ({ req }) => req.user?.role === 'admin'

export const isAdminField: FieldAccess = ({ req }) => req.user?.role === 'admin'

/** Amministratori, oppure l'utente stesso (per modificare il proprio profilo). */
export const isAdminOrSelf: Access = ({ req }) => {
  if (!req.user) return false
  if (req.user.role === 'admin') return true
  return { id: { equals: req.user.id } }
}

/** I visitatori vedono solo i contenuti pubblicati; lo staff vede anche le bozze. */
export const publishedOrAuthenticated: Access = ({ req }) => {
  if (req.user) return true
  return { _status: { equals: 'published' } }
}
