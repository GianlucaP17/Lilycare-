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
cron di cPanel descritto più sotto. Lo stesso riquadro contiene le _linee guida di stile_ e, sotto
_«Controllo della bozza automatica»_, **quando il cron ha chiamato l’ultima volta e com’è andata**:
se non arrivano bozze si parte da lì (vedi “Se la bozza automatica non arriva”).

Le regole seguite dall’assistente: italiano chiaro, nessuna promessa di risultato né testimonianze
(come richiesto in Svizzera per la comunicazione delle professioni mediche), nessun dato inventato
(statistiche, studi, prezzi), nessun servizio non offerto dal centro, rimando al 144 per le urgenze.

**Immagine di copertina**: se sul server è impostata la variabile `OPENAI_API_KEY`, l'assistente
descrive anche l'immagine mentre scrive l'articolo e un servizio esterno la disegna. Sono
**fotografie realistiche**: l'apparecchio di cui si parla, l'ambiente (sala, lettino, postazione)
oppure **la parte del corpo interessata** dall'esame o dal trattamento — mano, piede, ginocchio,
spalla, schiena, addome. Regole fisse: **nessun volto** (una persona inventata verrebbe scambiata
per il personale dello studio), **nessuna nudità** (mai seno, glutei, inguine: si vede solo la zona
di cui parla l'articolo, il resto è vestito o coperto), niente sangue, ferite o aghi nella pelle,
nessuna immagine medica sugli schermi. **Va sempre guardata ingrandita prima di pubblicare**: i
generatori sbagliano spesso mani e arti (dita in più, pose impossibili) e su un sito medico si nota
subito; fra i punti da verificare compare un promemoria. Va comunque guardata prima di pubblicare: fra i
punti da verificare compare un promemoria. Si disattiva dal riquadro _Notizie → Assistente AI_. Se
la generazione non riesce (per esempio perché il modello indicato è stato dismesso), la bozza viene
creata lo stesso e il motivo compare fra i punti da verificare.

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

### Le email arrivano davvero?

Ogni richiesta e ogni candidatura fa partire **due email**: l'avviso allo studio (con il curriculum
in allegato, per le candidature) e la conferma a chi ha scritto. Se la posta non funziona, il
contenuto **resta comunque salvato nel pannello**: non si perde niente, ma nessuno viene avvisato.

Perché non passi inosservato, l'esito dell'avviso allo studio viene scritto sulla richiesta stessa,
nella colonna **Avviso allo studio** dell'elenco e nella barra laterale della scheda:

- `Inviata il 10.11.2026, 11:12 a info@lilycare.ch` → tutto a posto;
- `NON inviata: la casella ha rifiutato nome utente o password` → controlla `SMTP_USER` e
  `SMTP_PASS` in _Setup Node.js App_;
- `NON inviata: il server di posta non è raggiungibile` → controlla `SMTP_HOST` e `SMTP_PORT`;
- `NON inviata: sul server manca la configurazione della posta` → manca `SMTP_HOST`;
- `NON inviata: manca l'indirizzo dello studio` → compila _Impostazioni studio → Contatti e sede_.

Per provarlo **senza aspettare** una richiesta vera: _Impostazioni studio → Contatti e sede_,
pulsante **«Invia un'email di prova»**. Parte solo verso gli indirizzi configurati lì.

### Candidature (Lavora con noi)

**Prenotazioni → Candidature**: chi si candida dalla pagina _Lavora con noi_ compila il modulo e
allega il curriculum. Lo stesso curriculum arriva **in allegato all'email** di avviso, e nella scheda
della candidatura si legge con il pulsante **«Apri il curriculum»**.

Il curriculum non è pubblico: l'indirizzo non si può indovinare né aprire senza essere collegati al
pannello. Candidatura e file vengono cancellati insieme dopo 30 giorni.

> Il pulsante passa da `/next/candidature/<id>/cv` e non dal collegamento sul nome del file generato
> da Payload. Quel collegamento porta a `/api/application-files/file/...`, che accetta il cookie
> dell'accesso solo se la richiesta contiene l'intestazione `Origin` oppure `Sec-Fetch-Site`: il clic
> su un collegamento non manda la prima e alcuni browser non mandano la seconda, e la risposta era
> «Non sei autorizzato» anche a chi era regolarmente collegato.

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

Ad ogni modifica GitHub compila il sito da solo (workflow _Build e pubblicazione (Namecheap)_).
Apri **GitHub → Actions → ultima esecuzione → Artifacts → `lilycare-namecheap`** e scarica lo zip.
In alternativa, sul tuo computer: `npm ci && npm run build && npm run package:namecheap`
(crea `dist-namecheap/lilycare-namecheap.zip`).

> Su GitHub, in _Settings → Secrets and variables → Actions → Variables_, imposta
> `NEXT_PUBLIC_SERVER_URL` = `https://lilycare.ch` (è il valore predefinito).

### 2. Crea le cartelle sul server

Con il **File Manager** di cPanel, nella tua cartella home (`/home/UTENTE`):

- `lilycare-app` → qui va il sito; carica lo zip e usa **Extract**.

La cartella dei dati (`lilycare-data`, con **database e immagini**) viene creata da sola al primo
avvio, nel percorso indicato dalle variabili `DATABASE_URL` e `MEDIA_DIR` del punto 3. Resta fuori
dal sito, così gli aggiornamenti non la toccano mai.

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

Servono **due cose**, e se ne manca una non arriva nessuna bozza:

1. **cPanel → Cron Jobs → Add New Cron Job**, una volta al giorno (es. alle 6:00), comando:

   ```bash
   curl -fsS -X POST -H "Authorization: Bearer IL_TUO_CRON_SECRET" https://lilycare.ch/next/ai/daily > /dev/null
   ```

   Il token va fra **apici doppi** come sopra: se `CRON_SECRET` contiene caratteri come `&`, `!`
   o `$`, un comando senza apici viene spezzato dalla shell e la chiamata parte sbagliata.

2. Nel pannello, **Notizie → Assistente AI**: spunta _«Prepara automaticamente una bozza ogni
   giorno»_ e salva. L’opzione è **disattivata** di serie, quindi dopo una nuova installazione va
   rimessa.

#### Se la bozza automatica non arriva

Le bozze dell’assistente **non compaiono mai sul sito**: restano in _Notizie → Articoli_ come
bozze da rileggere, e arriva un’email. Guarda prima lì.

Poi apri **Notizie → Assistente AI**: il riquadro _«Controllo della bozza automatica»_ mostra
quando il cron ha chiamato il sito l’ultima volta e com’è andata. La stessa riga compare in cima a
_Notizie → Articoli_.

| Cosa c’è scritto                                | Cosa fare                                                                                                                                                 |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| la data è **vuota**                             | il cron non ha mai raggiunto il sito: controlla che il Cron Job esista e che l’indirizzo sia `https://lilycare.ch/next/ai/daily` (non `demo.lilycare.ch`) |
| «il token del cron non corrisponde»             | il `Bearer` nel comando è diverso da `CRON_SECRET` in _Setup Node.js App_ (tipico dopo aver cambiato la chiave)                                           |
| «manca l’intestazione Authorization»            | nel comando manca la parte `-H "Authorization: Bearer …"`                                                                                                 |
| «manca la variabile CRON_SECRET»                | aggiungi `CRON_SECRET` alle variabili in _Setup Node.js App_ e riavvia l’applicazione                                                                     |
| «la variabile CRON_SECRET è troppo corta»       | scegline una di almeno 16 caratteri (in _Setup Node.js App_), aggiornala anche nel comando del cron e riavvia                                             |
| «manca ANTHROPIC_API_KEY»                       | aggiungi la chiave di Anthropic alle variabili e riavvia                                                                                                  |
| «la bozza automatica giornaliera è disattivata» | spunta l’opzione qui sopra e salva                                                                                                                        |
| «una bozza era già stata creata»                | tutto bene: si fa una sola bozza automatica ogni 20 ore                                                                                                   |
| «Bozza pronta da rileggere: …»                  | tutto bene: la trovi in _Notizie → Articoli_                                                                                                              |

**Per provare subito senza aspettare domani**: in cPanel metti il cron su `* * * * *` (ogni
minuto), aspetta due minuti, ricarica _Notizie → Assistente AI_ e leggi la riga; poi rimetti
l’orario giornaliero.

### Demo su un sottodominio (prima della messa online)

Per vedere e provare il nuovo sito **senza toccare il sito attuale né le email**, installalo su un
sottodominio, ad esempio `demo.lilycare.ch`. Si prepara una volta sola (circa 20 minuti); da lì in
poi **ogni aggiornamento arriva da solo**.

1. **cPanel → Domains** (o _Subdomains_): crea `demo.lilycare.ch`.

2. **cPanel → Setup Node.js App → Create Application**:

   | Campo                    | Valore                       |
   | ------------------------ | ---------------------------- |
   | Node.js version          | **22.23.4** (oppure 24.22.2) |
   | Application mode         | Production                   |
   | Application root         | `lilycare-demo`              |
   | Application URL          | `demo.lilycare.ch`           |
   | Application startup file | `app.js`                     |

   e le **Environment variables** (`UTENTE` = il tuo nome utente cPanel):

   | Nome             | Valore                                             |
   | ---------------- | -------------------------------------------------- |
   | `SERVER_URL`     | `https://demo.lilycare.ch`                         |
   | `NOINDEX`        | `true` (così Google non indicizza la demo)         |
   | `PAYLOAD_SECRET` | stringa lunga e casuale                            |
   | `DATABASE_URL`   | `file:/home/UTENTE/lilycare-demo-data/lilycare.db` |
   | `MEDIA_DIR`      | `/home/UTENTE/lilycare-demo-data/media`            |

   Facoltative: `SMTP_*` (per ricevere davvero le email delle richieste di prova) e
   `ANTHROPIC_API_KEY` (per provare l’assistente AI). Le cartelle dei dati non vanno create a mano:
   le prepara il sito al primo avvio. Premi **Create**.

3. **cPanel → FTP Accounts → Create an FTP Account**: utente `deploy-demo`, _Directory_
   `lilycare-demo`. Annota il **nome utente completo** (es. `deploy-demo@lilycare.ch`) e la password.

4. **GitHub → Settings → Secrets and variables → Actions → New repository secret**, tre segreti:

   | Nome                | Valore                                                                                                     |
   | ------------------- | ---------------------------------------------------------------------------------------------------------- |
   | `FTP_DEMO_SERVER`   | il nome del server Namecheap (in cPanel, colonna a destra: _Server Name_, es. `serverXXX.web-hosting.com`) |
   | `FTP_DEMO_USERNAME` | il nome utente FTP completo del punto 3                                                                    |
   | `FTP_DEMO_PASSWORD` | la password del punto 3                                                                                    |

5. **GitHub → Actions → Build e pubblicazione (Namecheap) → Run workflow** (scegli il ramo di
   sviluppo): GitHub compila il sito e lo carica sul server. La prima volta servono circa 15 minuti
   (sono 2600 file); gli aggiornamenti successivi richiedono pochi minuti, perché le librerie del
   sito — i due terzi dei file — non vengono ricaricate se non sono cambiate.

6. Apri `https://demo.lilycare.ch` (al primo avvio carica foto e contenuti in qualche secondo) e
   **subito dopo** `https://demo.lilycare.ch/admin` per creare il tuo utente: il primo che apre
   quella pagina diventa amministratore.

Da qui in poi non serve più fare nulla: **ogni modifica al sito aggiorna la demo da sola**, con il
riavvio dell’applicazione incluso.

**Se qualcosa non va**

- Il browser segnala il certificato → **cPanel → SSL/TLS Status → Run AutoSSL**.
- Il sottodominio non si apre dopo 30 minuti → in Namecheap, _Domain List → Advanced DNS_, aggiungi
  un record **A** con host `demo` verso l’indirizzo IP del server (in cPanel: _Shared IP Address_).
- La pubblicazione si ferma su un errore di certificato → controlla che `FTP_DEMO_SERVER` sia il
  **nome del server** (non `ftp.lilycare.ch`) e che l’account FTP del punto 3 sia attivo.
- La pubblicazione si interrompe a metà (il server chiude il collegamento) → rilancia il workflow:
  i file già caricati non vengono ritrasmessi. Se succede spesso, si può abbassare il numero di
  trasferimenti in parallelo (`--parallel=5` in `.github/workflows/namecheap.yml`).
- Il sito resta alla versione precedente → **Setup Node.js App → Restart**.
- La demo risponde **503** → quasi sempre è la versione di Node: cPanel propone 14.21.3 come
  "recommended", ma il sito richiede **22.23.4 o superiore**. Cambiala in _Setup Node.js App_,
  premi SAVE, attendi qualche minuto e poi RESTART. L'errore esatto si legge nel file
  `startup-error.log` dentro la cartella dell'applicazione.
- Se la pubblicazione via FTP non va a buon fine, puoi sempre installare la demo a mano: scarica lo
  zip (_Actions → ultima esecuzione → Artifacts_), caricalo in `lilycare-demo` con il File Manager
  e usa **Extract**. I punti 1, 2 e 6 restano identici.

> I segreti inseriti su GitHub sono cifrati: non compaiono nel codice né nei registri delle
> pubblicazioni, e nessuno può rileggerli (si possono solo sostituire).

I contenuti modificati nella demo restano nella cartella `lilycare-demo-data`: al momento della
messa online si possono riutilizzare.

### Aggiornamenti

- **Automatici** (consigliato): impostati i segreti FTP su GitHub, ogni modifica viene compilata,
  caricata sul server e l’applicazione si riavvia da sola. Le due destinazioni sono separate, così
  si può provare tutto sulla demo prima di toccare il sito vero:

  | Ramo su GitHub   | Destinazione    | Segreti da impostare                                        |
  | ---------------- | --------------- | ----------------------------------------------------------- |
  | ramo di sviluppo | demo            | `FTP_DEMO_SERVER`, `FTP_DEMO_USERNAME`, `FTP_DEMO_PASSWORD` |
  | `main`           | sito definitivo | `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`                |

  Ogni account FTP va limitato alla cartella della sua applicazione (`lilycare-demo`,
  `lilycare-app`). Se invece l’account vede tutta la home, indica la cartella nelle _Variables_
  `FTP_DEMO_SERVER_DIR` / `FTP_SERVER_DIR` (es. `lilycare-app/`).

- **Manuale**: scarica il nuovo zip da GitHub Actions, estrailo sopra `lilycare-app` (sovrascrivendo)
  e premi **Restart** in Setup Node.js App. La struttura del database si aggiorna da sola all’avvio.

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

**Un solo indirizzo**: `src/proxy.ts` manda chi arriva su `www.lilycare.ch` sull'indirizzo indicato
da `SERVER_URL` (`https://lilycare.ch`), conservando percorso e parametri. Serve per il
posizionamento su Google, ma soprattutto perché il pannello costruisce i collegamenti ai file
usando `SERVER_URL`: da un indirizzo diverso il cookie dell'accesso non viene inviato.

**Veste grafica del pannello admin**: il pannello usa gli stessi colori, caratteri e forme del
sito. Tutto sta in `src/app/(payload)/custom.scss`: in cima ci sono le variabili del marchio e la
rimappatura di quelle di Payload (fondo panna, superfici bianche con angoli morbidi, pulsanti a
pillola, titoli in Fraunces, testi in Inter), con una versione per il tema scuro. I due caratteri
arrivano da `src/components/admin/AdminFonts.tsx`, serviti dal nostro server come sul sito.
**Non viene cambiato nulla nel funzionamento**: è solo aspetto, quindi gli aggiornamenti di Payload
non si rompono. Per ritoccare un colore basta modificare le variabili `--lily-*` in cima al file.

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
