# LilyCare – sito web e pannello di amministrazione

Sito del centro medico **LilyCare** (Via Monte Generoso 2, 6877 Coldrerio – Ticino), con pannello di
amministrazione integrato per gestire servizi, team, notizie, pagine e richieste di appuntamento.

- **Sito pubblico**: homepage, servizi (una pagina per ogni prestazione), team (un curriculum per
  ogni persona), notizie, prenotazione online, contatti con mappa, chi siamo, privacy e note legali.
- **Pannello admin** (`/admin`), in italiano: tutto si modifica senza toccare il codice.
- **Prenotazioni**: il modulo invia un’email allo studio (con risposta diretta al paziente) e
  un’email di conferma al paziente; ogni richiesta resta salvata nel pannello con il suo stato.
- **SEO e ricerca AI**: dati strutturati schema.org, sitemap, `llms.txt`, immagini di
  condivisione automatiche, pagine veloci pre-generate.

## Tecnologie

| Parte          | Tecnologia                                                                       |
| -------------- | -------------------------------------------------------------------------------- |
| Sito           | [Next.js 16](https://nextjs.org) (React 19), Tailwind CSS 4                      |
| Pannello admin | [Payload CMS 3](https://payloadcms.com) (React, integrato nello stesso progetto) |
| Database       | SQLite (file locale) oppure libSQL/Turso in cloud                                |
| Email          | SMTP (qualsiasi provider: Infomaniak, Microsoft 365, Gmail…)                     |

Tutto è scritto in **React/TypeScript**: lo stesso pannello espone un’API REST e GraphQL pronta per
una futura app (vedi [App futura](#app-futura)).

---

## Avvio in locale (per sviluppatori)

Requisiti: **Node.js 22** o superiore.

```bash
cp .env.example .env          # poi imposta PAYLOAD_SECRET (es. openssl rand -hex 32)
npm install
npm run seed                  # carica i contenuti iniziali (servizi, team, articoli, pagine)
npm run dev                   # http://localhost:3000  –  admin: http://localhost:3000/admin
```

Al primo accesso a `/admin` viene chiesto di creare il **primo utente**, che diventa amministratore.
In sviluppo, senza SMTP configurato, le email vengono stampate nel terminale.

---

## Guida rapida al pannello admin

Apri `https://lilycare.ch/admin` e accedi. La dashboard mostra subito le **nuove richieste** di
appuntamento e le scorciatoie principali.

### Dati dello studio

**Impostazioni → Impostazioni studio**: nome, telefono, email, indirizzo, orari, logo, social,
avvisi in cima al sito (es. chiusure per ferie), email che ricevono le richieste. Si modificano una
volta sola e vengono aggiornati ovunque (intestazione, piè di pagina, contatti, dati per Google).

> **Logo ufficiale**: carica il file in _Impostazioni studio → Studio → Logo_ (PNG trasparente o SVG).
> Finché non lo carichi viene mostrato il marchio grafico provvisorio a forma di giglio.

### Foto

Ogni immagine si carica direttamente dal campo dove serve (o da **Sistema → Immagini e file**):

- **Team** → apri la persona → _Foto_ (ritratto verticale, sfondo neutro).
- **Homepage** → _Pagine → Homepage → Testata (hero) → Immagine_ (foto dello studio).
- **Servizi** → _Immagine_ (facoltativa) · **Articoli** → _Immagine di copertina_.

Compila sempre il **testo alternativo** (descrizione della foto): serve ad accessibilità e Google.
Se una foto manca, il sito mostra un’illustrazione elegante al suo posto.

### Servizi e team

- **Servizi e team → Servizi → Crea nuovo**: nome, “In breve” (2–3 frasi che rispondono a “che
  cos’è?”), descrizione, quando è indicato, come si svolge, come prepararsi, informazioni utili,
  domande frequenti, categoria, icona e professionisti che lo eseguono. La pagina viene creata
  automaticamente in `/servizi/nome-servizio`, con il pulsante “Prenota questa prestazione”.
- **Servizi e team → Team**: presentazione, ambiti di competenza, lingue, formazione, esperienza,
  società scientifiche e link ai profili esterni (OneDoc, LinkedIn…). Il campo _Ordine_ decide la
  posizione.

### Notizie (articoli)

**Notizie → Articoli → Crea nuovo**. Il testo si salva automaticamente in **bozza**; con
**Anteprima** lo vedi sul sito prima di pubblicarlo. Per **programmare** un articolo imposta una
_Data di pubblicazione_ futura e premi _Pubblica_: comparirà sul sito da quel momento (utile per
preparare in anticipo gli articoli della settimana). Indica sempre _Autore_ e, per i temi medici,
_Revisione medica_: aumentano l’affidabilità agli occhi di Google.

### Homepage e pagine (struttura modulare)

Ogni pagina è composta da **blocchi** (testata, elenco servizi, team, punti di forza, passaggi,
mappa, ultime notizie, domande frequenti, invito all’azione, testo, immagine+testo, numeri).
Da **Pagine → Homepage** puoi aggiungere, togliere e trascinare i blocchi per riordinarli. Con
**Pagine → Crea nuovo** crei nuove pagine (es. `/convenzioni`) con la stessa struttura.
Nei titoli puoi evidenziare parole scrivendole tra asterischi: `Diagnosi e cura, *in un unico centro*`.

### Richieste di appuntamento

**Prenotazioni → Richieste di appuntamento**: elenco delle richieste con nome, telefono, prestazione
e stato (Nuova → In lavorazione → Appuntamento fissato → Archiviata). Puoi aggiungere note interne.

### Utenti

**Sistema → Utenti**: un _Amministratore_ gestisce tutto (anche gli utenti); un _Redattore_ gestisce
contenuti e richieste.

---

## Email (SMTP)

Imposta nel file `.env` (o nelle variabili d’ambiente dell’hosting):

```bash
SMTP_HOST=mail.infomaniak.com     # esempio; usa i dati del tuo provider email
SMTP_PORT=587                     # 465 = SSL, 587 = STARTTLS
SMTP_USER=info@lilycare.ch
SMTP_PASS=********
SMTP_FROM_ADDRESS=info@lilycare.ch
SMTP_FROM_NAME=LilyCare
```

Gli indirizzi che ricevono le richieste si cambiano dal pannello (_Impostazioni studio →
Contatti e sede → Email che ricevono le richieste_). Anche se l’email non partisse, ogni richiesta
resta salvata nel pannello.

---

## Messa online

> **Importante**: imposta sempre `NEXT_PUBLIC_SERVER_URL=https://lilycare.ch` **prima della build**:
> è usato per i link canonici, la sitemap e i dati per Google.

### Opzione A – Server con Docker (consigliata: dati anche in Svizzera)

Su un VPS (es. Infomaniak, Hostpoint, Exoscale) con Docker:

```bash
cp .env.example .env     # compila PAYLOAD_SECRET, NEXT_PUBLIC_SERVER_URL e SMTP_*
docker compose up -d --build
```

All’avvio il container aggiorna il database, carica i contenuti iniziali (solo la prima volta),
genera il sito e lo avvia sulla porta 3000. Database e immagini sono in volumi persistenti
(`lilycare-data`, `lilycare-media`): includili nei backup. Metti davanti un reverse proxy con HTTPS
(es. Caddy o Nginx + Let’s Encrypt).

### Opzione B – Vercel + Turso

1. Crea un database su [Turso](https://turso.tech) (regione europea) e imposta `DATABASE_URL`
   (`libsql://…`) e `DATABASE_AUTH_TOKEN`.
2. Su Vercel collega il repository, aggiungi le variabili d’ambiente, crea uno store **Vercel Blob**
   (imposta `BLOB_READ_WRITE_TOKEN`, per le immagini) e usa come comando di build `npm run deploy`
   (migrazioni + build).
3. Una sola volta, dal tuo computer: `DATABASE_URL=… DATABASE_AUTH_TOKEN=… npm run seed`.

### Dal vecchio sito

Gli indirizzi più comuni del vecchio template (es. `/about-us`, `/contact`, `/blog`) reindirizzano
automaticamente alle nuove pagine (vedi `next.config.ts`), così non si perdono visite né posizionamento.

---

## SEO e ricerca con l’intelligenza artificiale

Già incluso:

- **Dati strutturati schema.org** su ogni pagina: `MedicalClinic` (indirizzo, orari, telefono, zona
  servita, servizi, prenotazione), `Person` con formazione e affiliazioni per ogni professionista,
  `ImagingTest`/`TherapeuticProcedure` + `MedicalWebPage` per ogni servizio, `FAQPage`,
  `BlogPosting`, `BreadcrumbList`.
- **Titoli e descrizioni** personalizzabili (scheda _SEO_ di ogni contenuto, con anteprima Google),
  URL canonici, Open Graph e **immagini di condivisione generate automaticamente**.
- **`/sitemap.xml`** e **`/robots.txt`** automatici; i crawler dei motori AI (ChatGPT, Claude,
  Perplexity, Gemini, Apple) sono esplicitamente ammessi.
- **`/llms.txt`** e **`/llms-full.txt`**: sintesi chiara e completa del centro per gli assistenti AI.
- Blocchi “In breve” e domande frequenti scritti per rispondere direttamente alle domande dei pazienti.
- Pagine pre-generate e immagini ottimizzate (AVIF/WebP): sito veloce anche su smartphone.

Da fare dopo la pubblicazione:

1. **Google Search Console**: verifica il dominio (codice in _Impostazioni studio → Social, Google e
   avvisi_) e invia `https://lilycare.ch/sitemap.xml`. Stessa cosa su **Bing Webmaster Tools**
   (Bing alimenta anche ChatGPT e Copilot).
2. **Profilo dell’attività su Google** (Google Maps): nome, indirizzo e telefono **identici** a quelli
   del sito, categoria “Centro medico”, orari, foto, link al sito e a `/prenota`. Poi incolla il link
   della scheda in _Impostazioni studio → Link alla scheda Google Maps_ e aggiungilo ai _Profili social_.
3. Chiedi ai pazienti soddisfatti una **recensione su Google**.
4. Aggiorna i profili esterni (OneDoc, local.ch, search.ch) con lo stesso indirizzo e il link al sito.
5. Pubblica **articoli con regolarità** (meglio 1–3 a settimana ben fatti, 600–1200 parole, che uno
   al giorno frettoloso), sempre con autore e revisione medica.
6. Inserisci le **coordinate esatte** dello studio in _Impostazioni studio → Coordinate_.

---

## Struttura del codice

```
src/
├── app/(frontend)/        pagine del sito (home, servizi, team, notizie, prenota, contatti…)
├── app/(payload)/         pannello admin e API (generati da Payload)
├── app/sitemap.ts, robots.ts, llms.txt/, og/   SEO, AI e immagini di condivisione
├── collections/           tipi di contenuto: Servizi, Team, Articoli, Pagine, Richieste, Immagini…
├── globals/               Impostazioni studio, Menu
├── blocks/                blocchi modulari: configs.ts (campi) + components/ (grafica)
├── components/            interfaccia (header, footer, schede, modulo di prenotazione…)
├── emails/                email di prenotazione
├── lib/                   dati, SEO, schema.org, percorsi, utilità
├── seed/                  contenuti iniziali (npm run seed)
└── migrations/            migrazioni del database
```

**Aggiungere un nuovo tipo di blocco**: aggiungi la configurazione in `src/blocks/configs.ts`
(e nell’array `pageBlocks`), crea il componente in `src/blocks/components/`, registralo in
`src/blocks/RenderBlocks.tsx`, poi esegui `npm run generate:types` e `npm run migrate:create`.

**Colori e caratteri**: sono definiti in un unico punto, `src/app/(frontend)/globals.css`
(blocco `@theme`): per adattarli al logo ufficiale basta cambiare quei valori.

## App futura

Il pannello espone già un’**API REST** e **GraphQL** che una app (es. React Native) può usare:

```
GET  /api/services?where[_status][equals]=published&sort=order
GET  /api/team?where[_status][equals]=published
GET  /api/articles?where[_status][equals]=published&sort=-publishedAt&limit=10
GET  /api/globals/settings
POST /api/graphql
```

## Comandi utili

| Comando                              | A cosa serve                                                         |
| ------------------------------------ | -------------------------------------------------------------------- |
| `npm run dev`                        | sviluppo locale                                                      |
| `npm run build` / `npm start`        | build e avvio in produzione                                          |
| `npm run seed`                       | contenuti iniziali (solo se il database è vuoto)                     |
| `npm run seed -- --force`            | **sostituisce** servizi, team, articoli e pagine con quelli iniziali |
| `npm run migrate`                    | aggiorna la struttura del database                                   |
| `npm run migrate:create`             | crea una migrazione dopo aver modificato i tipi di contenuto         |
| `npm run generate:types`             | rigenera i tipi TypeScript dal CMS                                   |
| `npm run lint` / `npm run typecheck` | controlli di qualità del codice                                      |

---

## Contenuti da verificare prima della pubblicazione

I testi iniziali sono stati scritti a partire dal vecchio sito e da fonti pubbliche, con un tono
prudente (nessuna promessa di risultato, come richiesto per la pubblicità delle professioni
mediche). **Vanno riletti e approvati dai professionisti** di LilyCare, in particolare:

- [ ] Telefono, email, orari e indirizzo (sul vecchio sito comparivano anche un indirizzo a Chiasso e
      un secondo numero).
- [ ] Curriculum del **Dr. med. Mauro Binda** (fonti: OneDoc, ozonoterapiaticino.ch, SIOOT) e lingue parlate.
- [ ] Curriculum di **Monica Gaiga** (formazione, diplomi di agopuntura, esperienze): da completare.
- [ ] Elenco delle prestazioni infermieristiche e dei distretti ecografici effettivamente offerti.
- [ ] Testi dei servizi e degli articoli; poi assegna _Autore_ e _Revisione medica_ agli articoli.
- [ ] Privacy e note legali (ragione sociale, eventuale numero IDI): da far verificare.
- [ ] Foto del team, dello studio e logo ufficiale.
