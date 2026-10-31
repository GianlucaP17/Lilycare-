# LilyCare – immagine Docker (sito + pannello admin)
# Uso consigliato: docker compose up -d   (vedi docker-compose.yml e README)
FROM node:22-bookworm-slim

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json .npmrc ./
RUN npm ci

COPY . .

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    DATABASE_URL=file:/app/data/lilycare.db \
    MEDIA_DIR=/app/media

EXPOSE 3000

# La build avviene all'avvio perché le pagine vengono generate a partire dal database reale.
CMD ["sh", "./scripts/docker-start.sh"]
