#!/bin/sh
# Avvio del container: aggiorna il database, carica i contenuti iniziali (solo la prima volta),
# genera il sito con i dati reali e lo avvia.
set -e
mkdir -p /app/data "${MEDIA_DIR:-/app/media}"
echo "→ Migrazioni del database"
npm run migrate
echo "→ Contenuti iniziali (ignorato se già presenti)"
npm run seed
echo "→ Build del sito"
npm run build
echo "→ Avvio"
exec npm start
