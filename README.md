# LilyCare – sito web e pannello di amministrazione

Sito del centro medico **LilyCare** (Corso San Gottardo 89, 6830 Chiasso – Ticino), con pannello di
amministrazione integrato per gestire servizi, team, notizie, pagine e richieste di appuntamento.

- **Sito pubblico**: homepage, servizi (una pagina per ogni prestazione), team (un curriculum per
  ogni persona), notizie, prenotazione online, contatti con mappa, chi siamo, privacy e note legali.
- **Pannello admin** (`/admin`), in italiano: tutto si modifica senza toccare il codice.
- **Prenotazioni**: il modulo invia un’email allo studio (con risposta diretta al paziente) e
  un’email di conferma al paziente; ogni richiesta resta salvata nel pannello con il suo stato.
- **Assistente AI**: prepara bozze di articoli da rileggere, su richiesta o una al giorno.
- **SEO e ricerca AI**: dati strutturati schema.org, sitemap, `llms.txt`, immagini di
  condivisione automatiche.
- **Hosting**: Namecheap (cPanel → Setup Node.js App), database SQLite in un unico file.

## Tecnologie

| Parte          | Tecnologia                                                                       |
| -------------- | -------------------------------------------------------------------------------- |
| Sito           | [Next.js 16](https://nextjs.org) (React 19), Tailwind CSS 4                      |
| Pannello admin | [Payload CMS 3](https://payloadcms.com) (React, integrato nello stesso progetto) |
| Database       | SQLite (un file sul server)                                                      |
| Email          | SMTP – Namecheap Private Email                                                   |
| Assistente AI  | Claude (Anthropic API), modello Claude Opus 5.5                                  |

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
appuntamento, le **bozze AI da rivedere** e le scorciatoie principali.

### Dati dello studio

**Impostazioni → Impostazioni studio**: nome, telefono, email, indirizzo, orari (anche con pausa
pranzo: una riga per la mattina e una per il pomeriggio), zona, logo, social, avvisi in cima al sito
(es. chiusure per ferie), email che ricevono le richieste. Si modificano una volta sola e vengono
aggiornati ovunque (intestazione, piè di pagina, contatti, dati per Google e per gli assistenti AI).

> **Logo ufficiale**: è già integrato nel sito, in versione vettoriale nitida a ogni dimensione
> (intestazione, piè di pagina, pannello admin, email, icone e immagini di condivisione). Solo se in
> futuro cambiasse, carica il nuovo file in _Impostazioni studio → Studio → Logo_ (SVG o PNG
> trasparente) e _Logo (su sfondo scuro)_ per il piè di pagina.

### Foto

Le **9 foto dello studio** sono già caricate (in **Sistema → Immagini e file**) e usate nella
testata della homepage, nelle gallerie della homepage e di _Chi siamo_ e nelle pagine dei servizi.
Sono state ridimensionate, ottimizzate e ripulite dai dati nascosti (posizione GPS, modello del
telefono). Ogni immagine si cambia direttamente dal campo dove serve:

- **Homepage** → _Pagine → Homepage → Testata (hero) → Immagine_ e blocco _Galleria fotografica_.
- **Servizi** → _Immagine_ · **Articoli** → _Immagine di copertina_.
- **Team** → apri la persona → _Foto_ (ritratto verticale, sfondo neutro): **ancora da caricare**;
  finché manca viene mostrato un riquadro elegante con le iniziali.

Compila sempre il **testo alternativo** (descrizione della foto): serve ad accessibilità e Google.
Nel caricamento puoi indicare il **punto focale** (il soggetto da non tagliare): il sito ritaglia
la foto attorno a quel punto nei vari formati. Puoi caricare le foto direttamente dallo smartphone:
vengono ridotte in automatico (max 2400 px) e ripulite dai dati nascosti, come la posizione GPS.

### Servizi e team

- **Servizi e team → Servizi → Crea nuovo**: nome, “In breve” (2–3 frasi che rispondono a “che
  cos’è?”), descrizione, quando è indicato, come si svolge, come prepararsi, informazioni utili,
  domande frequenti, categoria, icona e professionisti che lo eseguono. La pagina viene creata
  automaticamente in `/servizi/nome-servizio`, con il pulsante “Prenota questa prestazione”.
- **Servizi e team → Team**: presentazione, ambiti di competenza, lingue, formazione, esperienza,
  società scientifiche e link ai profili esterni (OneDoc, LinkedIn…). Il campo _Ordine_ decide la
  posizione. I servizi di ciascuno compaiono da soli nel suo profilo.

### Notizie (articoli)

**Notizie → Articoli → Crea nuovo**. Il testo si salva automaticamente in **bozza**; con
**Anteprima** lo vedi sul sito prima di pubblicarlo. Per **programmare** un articolo imposta una
_Data di pubblicazione_ futura e premi _Pubblica_: comparirà sul sito da quel momento. Se lasci la
data vuota, viene usato il momento della pubblicazione. Indica sempre _Autore_ e, per i temi medici,
_Revisione medica_: aumentano l’affidabilità agli occhi di Google.

### Assistente AI (bozze degli articoli)

In **Notizie → Articoli**, sopra l’elenco, c’è il riquadro **✨ Assistente AI**:

1. scrivi l’argomento (o lascialo vuoto: sceglie l’assistente), la categoria, la lunghezza, i servizi
   da collegare ed eventuali indicazioni;
2. premi **Prepara la bozza**: dopo circa un minuto la bozza compare nell’elenco e arriva un’email;
3. aprila, **rileggi e correggi** il testo, controlla i **punti da verificare** indicati
   dall’assistente nella colonna di destra, assegna _Autore_ e _Revisione medica_;
4. spunta **“Ho riletto e verificato il testo”** e pubblica. Senza la spunta il pannello non permette
   di pubblicare: nessun testo dell’AI va online senza una revisione umana.

**Bozza automatica ogni giorno**: in **Notizie → Assistente AI** attiva l’opzione e compila il
**piano editoriale** (elenco di argomenti). Ogni mattina l’assistente prepara una bozza con il primo
argomento “da fare” (o, se il piano è vuoto, con un tema scelto da lui) e avvisa via email. Serve il
cron di cPanel descritto più sotto. Lo stesso riquadro contiene le _linee guida di stile_.

Le regole seguite dall’assistente: italiano chiaro, nessuna promessa di risultato né testimonianze
(come richiesto in Svizzera per la comunicazione delle professioni mediche), nessun dato inventato
(statistiche, studi, prezzi), nessun servizio non offerto dal centro, rimando al 144 per le urgenze.

**Costi**: modello Claude Opus 5.5 (4 USD per milione di token in ingresso, 20 USD in uscita):
circa **0,10–0,20 USD per bozza**, quindi pochi franchi al mese con una bozza al giorno. Per
sicurezza sono possibili al massimo 10 bozze manuali ogni 24 ore.

**Dati**: all’assistente vengono inviati solo i dati pubblici del centro (servizi, team, titoli
degli articoli) e le indicazioni scritte dallo staff; **mai dati dei pazienti**.

### Homepage e pagine (struttura modulare)

Ogni pagina è composta da **blocchi** (testata, elenco servizi, team, punti di forza, passaggi,
mappa, ultime notizie, domande frequenti, invito all’azione, testo, immagine+testo, numeri,
galleria fotografica).
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

## Messa online su Namecheap (cPanel)

Il sito è un’applicazione Node.js. Su Namecheap si pubblica con **cPanel → Setup Node.js App**
(disponibile sui piani di hosting condiviso Stellar). Il sito viene **compilato su GitHub** (il server
condiviso non ha memoria sufficiente per farlo) e sul server si carica solo il pacchetto pronto.

> Prima di tutto fai un **backup del sito attuale** (cPanel → Backup), perché il dominio verrà
> collegato alla nuova applicazione.

### 1. Ottieni il pacchetto

Ad ogni modifica del ramo `main` GitHub compila il sito (workflow _Build e pubblicazione (Namecheap)_).
Apri **GitHub → Actions → ultima esecuzione → Artifacts → `lilycare-namecheap`** e scarica lo zip.
In alternativa, sul tuo computer: `npm ci && npm run build && npm run package:namecheap`
(crea `dist-namecheap/lilycare-namecheap.zip`).

> Su GitHub, in _Settings → Secrets and variables → Actions → Variables_, imposta
> `NEXT_PUBLIC_SERVER_URL` = `https://lilycare.ch` (è il valore predefinito).

### 2. Crea le cartelle sul server

Con il **File Manager** di cPanel, nella tua cartella home (`/home/UTENTE`):

- `lilycare-app` → qui va il sito; carica lo zip e usa **Extract**;
- `lilycare-data` e, al suo interno, `media` → qui vivono **database e immagini**. Restano separati
  dal sito, così gli aggiornamenti non li toccano mai.

### 3. Crea l’applicazione Node.js

**cPanel → Setup Node.js App → Create Application**:

| Campo                    | Valore                                                                 |
| ------------------------ | ---------------------------------------------------------------------- |
| Node.js version          | la più recente tra 24.x e 22.x                                         |
| Application mode         | Production                                                             |
| Application root         | `lilycare-app`                                                         |
| Application URL          | `lilycare.ch`                                                          |
| Application startup file | `app.js`                                                               |
| Passenger log file       | `/home/UTENTE/lilycare-data/passenger.log` (utile in caso di problemi) |

Poi aggiungi le **Environment variables** (vedi anche `.env.example`):

| Nome                | Valore                                                                                 |
| ------------------- | -------------------------------------------------------------------------------------- |
| `PAYLOAD_SECRET`    | stringa lunga e casuale (non cambiarla più)                                            |
| `DATABASE_URL`      | `file:/home/UTENTE/lilycare-data/lilycare.db`                                          |
| `MEDIA_DIR`         | `/home/UTENTE/lilycare-data/media`                                                     |
| `SMTP_HOST`         | `mail.privateemail.com`                                                                |
| `SMTP_PORT`         | `465`                                                                                  |
| `SMTP_USER`         | `info@lilycare.ch`                                                                     |
| `SMTP_PASS`         | password della casella                                                                 |
| `SMTP_FROM_ADDRESS` | `info@lilycare.ch`                                                                     |
| `SMTP_FROM_NAME`    | `LilyCare`                                                                             |
| `ANTHROPIC_API_KEY` | chiave da [console.anthropic.com](https://console.anthropic.com) (per l’assistente AI) |
| `CRON_SECRET`       | stringa lunga e casuale (per la bozza giornaliera)                                     |

Premi **Create** e poi **Start/Restart**. **Non** serve “Run NPM Install”: tutte le dipendenze sono
già nel pacchetto.

### 4. Primo avvio

Apri `https://lilycare.ch`: alla prima visita il sito crea il database e carica i contenuti iniziali
(qualche secondo). Poi vai su `https://lilycare.ch/admin` e crea il **primo utente amministratore**.
Controlla in cPanel → _SSL/TLS Status_ che il certificato HTTPS sia attivo.

### 5. Bozza AI giornaliera (cron)

**cPanel → Cron Jobs → Add New Cron Job**, una volta al giorno (es. alle 6:00), comando:

```bash
curl -fsS -X POST -H "Authorization: Bearer IL_TUO_CRON_SECRET" https://lilycare.ch/next/ai/daily > /dev/null
```

e attiva l’opzione in _Notizie → Assistente AI_ nel pannello.

### Demo su un sottodominio (prima della messa online)

Per vedere e provare il nuovo sito **senza toccare il sito attuale né le email**, installalo su un
sottodominio, ad esempio `demo.lilycare.ch`. Servono circa 15 minuti:

1. **cPanel → Domains** (o _Subdomains_) → crea `demo.lilycare.ch`.
2. **File Manager**, nella cartella home: crea `lilycare-demo` e `lilycare-demo-data` (con dentro la
   cartella `media`). Carica `lilycare-namecheap.zip` in `lilycare-demo` e usa **Extract**.
3. **Setup Node.js App → Create Application**: _Application root_ `lilycare-demo`, _Application
   URL_ `demo.lilycare.ch`, _Application startup file_ `app.js`, _Application mode_ Production,
   Node.js 24.x o 22.x (la più recente).
4. **Environment variables**:

   | Nome             | Valore                                             |
   | ---------------- | -------------------------------------------------- |
   | `SERVER_URL`     | `https://demo.lilycare.ch`                         |
   | `NOINDEX`        | `true` (Google non indicizza la demo)              |
   | `PAYLOAD_SECRET` | stringa lunga e casuale                            |
   | `DATABASE_URL`   | `file:/home/UTENTE/lilycare-demo-data/lilycare.db` |
   | `MEDIA_DIR`      | `/home/UTENTE/lilycare-demo-data/media`            |

   Facoltative: le variabili `SMTP_*` (per ricevere davvero le email delle richieste di prova) e
   `ANTHROPIC_API_KEY` (per provare l’assistente AI).

5. **Create** → **Start**. Apri `https://demo.lilycare.ch` (al primo avvio carica foto e contenuti
   in qualche secondo) e **subito dopo** `https://demo.lilycare.ch/admin` per creare il tuo utente
   amministratore: il primo che lo apre diventa amministratore.
6. Se il browser segnala il certificato: **cPanel → SSL/TLS Status → Run AutoSSL**. Se dopo 30 minuti
   il sottodominio non si apre, in Namecheap → _Domain List → Advanced DNS_ aggiungi un record **A**
   con host `demo` verso l’IP del server (in cPanel, colonna a destra: _Shared IP Address_).

I contenuti modificati nella demo restano nella cartella `lilycare-demo-data`: al momento della
messa online si possono riutilizzare.

### Aggiornamenti

- **Manuale**: scarica il nuovo zip da GitHub Actions, estrailo sopra `lilycare-app` (sovrascrivendo)
  e premi **Restart** in Setup Node.js App. La struttura del database si aggiorna da sola all’avvio.
- **Automatico**: crea in cPanel un _FTP Account_ con cartella `lilycare-app`, poi su GitHub aggiungi i
  segreti `FTP_SERVER` (es. `ftp.lilycare.ch` o il nome del server Namecheap), `FTP_USERNAME`,
  `FTP_PASSWORD` e la variabile `FTP_SERVER_DIR` = `./`. Da quel momento ogni modifica a `main` viene
  pubblicata da sola e l’app si riavvia automaticamente.

### Backup

Database e immagini sono tutti nella cartella **`lilycare-data`**: includila nei backup di cPanel e
scaricane una copia periodicamente.

### Se qualcosa non va

- Leggi il _Passenger log file_ indicato sopra.
- Le immagini caricate non si vedono → sul server il modulo immagini `sharp` non è supportato: su
  GitHub imposta la variabile `IMAGES_UNOPTIMIZED` = `true` e ripubblica.
- Le email non partono → verifica `SMTP_*`; le richieste restano comunque salvate nel pannello.

> Nota tecnica: il sito è stato provato con Node.js 22.23. Payload (il CMS) indica come minimo
> Node 22.23 / 24.22: se in cPanel la versione disponibile fosse leggermente più vecchia, scegli la più
> recente e verifica il funzionamento dopo il primo avvio.

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
- Pagine veloci (cache dei dati, immagini AVIF/WebP), anche su smartphone.

Da fare dopo la pubblicazione:

1. **Google Search Console**: verifica il dominio (codice in _Impostazioni studio → Social, Google e
   avvisi_) e invia `https://lilycare.ch/sitemap.xml`. Stessa cosa su **Bing Webmaster Tools**
   (Bing alimenta anche ChatGPT e Copilot).
2. **Profilo dell’attività su Google** (Google Maps): aggiorna indirizzo (Chiasso) e telefono in modo
   **identico** al sito, categoria “Centro medico”, orari con pausa pranzo, foto, link al sito e a
   `/prenota`. Se esistono ancora schede con il vecchio indirizzo di Coldrerio, chiudile o aggiornale.
   Poi incolla il link della scheda in _Impostazioni studio → Link alla scheda Google Maps_.
3. Chiedi ai pazienti soddisfatti una **recensione su Google**.
4. Aggiorna i profili esterni (OneDoc, local.ch, search.ch) con lo stesso indirizzo e il link al sito.
5. Pubblica **articoli con regolarità** (anche con l’assistente AI), sempre riletti, con autore e
   revisione medica.
6. Inserisci le **coordinate esatte** dello studio in _Impostazioni studio → Coordinate_.

### Dal vecchio sito

Gli indirizzi più comuni del vecchio template (es. `/about-us`, `/contact`, `/blog`) reindirizzano
automaticamente alle nuove pagine (vedi `next.config.ts`), così non si perdono visite né posizionamento.

---

## Struttura del codice

```
src/
├── app/(frontend)/        pagine del sito (home, servizi, team, notizie, prenota, contatti…)
│   └── next/ai/           assistente AI: bozza su richiesta, bozza giornaliera (cron), stato
├── app/(payload)/         pannello admin e API (generati da Payload)
├── app/sitemap.ts, robots.ts, llms.txt/, og/   SEO, AI e immagini di condivisione
├── collections/           tipi di contenuto: Servizi, Team, Articoli, Pagine, Richieste, Immagini…
├── globals/               Impostazioni studio, Menu, Assistente AI
├── blocks/                blocchi modulari: configs.ts (campi) + components/ (grafica)
├── components/            interfaccia (header, footer, schede, modulo di prenotazione, pannello AI…)
├── emails/                email di prenotazione e notifiche
├── lib/                   dati e cache, SEO, schema.org, percorsi, utilità
├── lib/ai/                assistente AI (Claude): istruzioni, formato della risposta, bozze
├── seed/                  contenuti iniziali (caricati da soli al primo avvio)
└── migrations/            migrazioni del database (applicate da sole all’avvio)
public/brand/              logo ufficiale in SVG (orizzontale, verticale, fiore, versioni chiare)
public/images/studio/      foto dello studio usate dai contenuti iniziali
assets/brand/              file originale del logo
scripts/build-brand-assets.mjs  rigenera logo SVG, icone e favicon dal file originale
scripts/package-namecheap.mjs   crea il pacchetto per cPanel
.github/workflows/namecheap.yml compila e (se configurato) pubblica su Namecheap
```

**Aggiungere un nuovo tipo di blocco**: aggiungi la configurazione in `src/blocks/configs.ts`
(e nell’array `pageBlocks`), crea il componente in `src/blocks/components/`, registralo in
`src/blocks/RenderBlocks.tsx`, poi esegui `npm run generate:types` e `npm run migrate:create`.

**Colori e caratteri**: sono definiti in un unico punto, `src/app/(frontend)/globals.css`
(blocco `@theme`). Il blu (`navy`) e il rosa orchidea (`orchid`) sono ricavati dal logo ufficiale.

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
| `npm run build`                      | compila il sito (non serve il database)                              |
| `npm run package:namecheap`          | crea il pacchetto per cPanel (dopo la build)                         |
| `npm run start:standalone`           | avvia in locale il sito compilato                                    |
| `npm run seed`                       | contenuti iniziali (solo se il database è vuoto)                     |
| `npm run seed -- --force`            | **sostituisce** servizi, team, articoli e pagine con quelli iniziali |
| `npm run migrate:create`             | crea una migrazione dopo aver modificato i tipi di contenuto         |
| `npm run generate:types`             | rigenera i tipi TypeScript dal CMS                                   |
| `npm run lint` / `npm run typecheck` | controlli di qualità del codice                                      |
| `npm run brand`                      | rigenera logo SVG, icone e favicon da `assets/brand/`                |

---

## Contenuti da verificare prima della pubblicazione

I testi iniziali sono stati scritti con un tono prudente (nessuna promessa di risultato, come
richiesto per la pubblicità delle professioni mediche). **Vanno riletti e approvati dai
professionisti** di LilyCare, in particolare:

- [ ] Curriculum del **Dr. med. Mauro Binda** (fonti: OneDoc, ozonoterapiaticino.ch, SIOOT) e lingue
      parlate. Il link a OneDoc è stato tolto perché la scheda riporta ancora l’indirizzo di Coldrerio:
      aggiornala e poi aggiungila di nuovo nel profilo.
- [ ] Curriculum di **Monica Gaiga** (formazione, diplomi, formazione in agopuntura e GAET).
- [ ] Testo della pagina **GAET**: indicazioni, controindicazioni, durata e modalità del vostro
      protocollo.
- [ ] Elenco delle prestazioni infermieristiche e dei distretti ecografici effettivamente offerti.
- [ ] Testi dei servizi e degli articoli; poi assegna _Autore_ e _Revisione medica_ agli articoli.
- [ ] Privacy e note legali (ragione sociale, eventuale numero IDI): da far verificare.
- [ ] Foto del team (ritratti di Mauro Binda e Monica Gaiga). Foto dello studio e logo ufficiale:
      ✓ già integrati.
