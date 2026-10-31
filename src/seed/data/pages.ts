/**
 * Pagine iniziali composte da blocchi. I campi "richText" sono scritti in Markdown
 * e convertiti automaticamente dallo script di caricamento.
 */
type Block = Record<string, unknown> & { blockType: string }
export type SeedPage = {
  title: string
  slug: string
  metaTitle?: string
  metaDescription?: string
  layout: Block[]
}

export const pages: SeedPage[] = [
  {
    title: 'Homepage',
    slug: 'home',
    metaTitle: 'LilyCare Chiasso | Radiologia e terapia del dolore',
    metaDescription:
      'Radiografie, ecografie, ecodoppler, ozonoterapia e GAET, infiltrazioni, onde d’urto, infermieristica e agopuntura a Chiasso (Ticino). Prenota online.',
    layout: [
      {
        blockType: 'hero',
        variant: 'home',
        eyebrow: 'Centro medico · Chiasso, Ticino',
        heading: 'Diagnosi e terapia del dolore, *in un unico centro*',
        text: 'Radiografie, ecografie ed ecodoppler, ozonoterapia e GAET, infiltrazioni e onde d’urto, cure infermieristiche e agopuntura: a LilyCare, a Chiasso, ti seguiamo dalla diagnosi al trattamento.',
        image: '@photo:reception',
        primaryCta: { label: 'Prenota una visita', url: '/prenota' },
        showPhoneButton: true,
        highlights: [
          { text: 'Esami eseguiti dal medico specialista' },
          { text: 'Diagnosi e cura nello stesso luogo' },
          { text: 'Richiesta online in un minuto' },
        ],
      },
      {
        blockType: 'servicesGrid',
        eyebrow: 'Servizi',
        heading: 'Cosa puoi trovare a LilyCare',
        intro:
          'Esami di diagnostica per immagini, terapie per il dolore e cure per il benessere, con professionisti che collaborano sul tuo percorso.',
        source: 'featured',
        groupByCategory: false,
      },
      {
        blockType: 'features',
        eyebrow: 'Perché LilyCare',
        heading: 'Un percorso chiaro, dalla prima visita al trattamento',
        intro:
          'Ci prendiamo il tempo per ascoltarti, spiegarti ogni passaggio e scegliere insieme la strada più adatta.',
        items: [
          {
            icon: 'route',
            title: 'Dalla diagnosi alla cura',
            text: 'Esami e terapie nello stesso centro: meno spostamenti, informazioni che non si perdono, tempi più brevi.',
          },
          {
            icon: 'stethoscope',
            title: 'Esperienza specialistica',
            text: 'Un medico specialista in radiologia con oltre 40 anni di esperienza segue esami e trattamenti del dolore.',
          },
          {
            icon: 'ultrasound',
            title: 'Trattamenti mirati',
            text: 'Quando indicato, infiltrazioni e ozonoterapia sono guidate dall’ecografia, per la massima precisione.',
          },
          {
            icon: 'heart',
            title: 'Ascolto e attenzione',
            text: 'Spiegazioni chiare, tempi dedicati e un percorso costruito sulla persona, non solo sul sintomo.',
          },
        ],
      },
      {
        blockType: 'gallery',
        eyebrow: 'Il centro',
        heading: 'Spazi luminosi, pensati per accoglierti',
        intro: 'Reception, sala d’attesa e ambulatori in Corso San Gottardo 89, a Chiasso.',
        images: [
          { image: '@photo:reception' },
          { image: '@photo:attesa' },
          { image: '@photo:radiologia' },
          { image: '@photo:ecografia' },
          { image: '@photo:trattamenti' },
        ],
      },
      {
        blockType: 'teamGrid',
        eyebrow: 'Il team',
        heading: 'Le persone che si prendono cura di te',
        intro: 'Scopri il percorso professionale, le competenze e le prestazioni di ciascuno.',
      },
      {
        blockType: 'steps',
        eyebrow: 'Prenotazioni',
        heading: 'Prenotare è semplice',
        items: [
          {
            title: 'Invia la richiesta',
            text: 'Compila il modulo online in un minuto oppure chiamaci.',
          },
          {
            title: 'Ti ricontattiamo',
            text: 'Concordiamo insieme giorno e ora e ti diamo le indicazioni per prepararti.',
          },
          { title: 'La tua visita', text: 'Ti accogliamo nel nostro centro a Chiasso.' },
        ],
        cta: { label: 'Prenota una visita', url: '/prenota' },
      },
      {
        blockType: 'location',
        eyebrow: 'Dove siamo',
        heading: 'Ci trovi a Chiasso, in Corso San Gottardo',
        intro: 'Nel Mendrisiotto, al confine con Como.',
        showMap: true,
        showDirections: false,
      },
      {
        blockType: 'latestNews',
        eyebrow: 'Notizie',
        heading: 'Approfondimenti e consigli',
        intro: 'Esami e terapie spiegati in modo semplice dai nostri professionisti.',
        limit: 3,
      },
      {
        blockType: 'faq',
        eyebrow: 'Domande frequenti',
        heading: 'Prima della visita',
        intro: 'Le risposte alle domande che ci fate più spesso.',
        items: [
          {
            question: 'Serve la prescrizione del medico?',
            answer:
              'Per molti esami radiologici e per alcune prestazioni infermieristiche sì. Per altre prestazioni puoi rivolgerti direttamente a noi: contattaci e ti diremo come procedere.',
          },
          {
            question: 'Come posso prenotare?',
            answer:
              'Puoi inviare una richiesta online dalla pagina “Prenota una visita” oppure chiamarci. Ti ricontatteremo per fissare data e ora.',
          },
          {
            question: 'Le prestazioni sono rimborsate dalla cassa malati?',
            answer:
              'Molte prestazioni mediche sono coperte dall’assicurazione di base (LAMal) alle condizioni previste; alcuni trattamenti, come l’agopuntura, possono essere rimborsati dalle assicurazioni complementari. Ti consigliamo di verificare con la tua cassa malati.',
          },
          {
            question: 'Cosa devo portare alla visita?',
            answer:
              'Un documento d’identità, la tessera della cassa malati, l’eventuale prescrizione, gli esami precedenti (immagini e referti) e l’elenco dei farmaci che assumi.',
          },
          {
            question: 'In caso di urgenza?',
            answer:
              'Il modulo online non è adatto alle urgenze. In caso di emergenza medica chiama subito il 144.',
          },
        ],
      },
      {
        blockType: 'cta',
        heading: 'Hai bisogno di un consulto?',
        text: 'Chiamaci o invia una richiesta online: ti ricontattiamo per fissare l’appuntamento.',
        primary: { label: 'Prenota una visita', url: '/prenota' },
        showPhone: true,
        style: 'dark',
      },
    ],
  },
  {
    title: 'Chi siamo',
    slug: 'chi-siamo',
    metaTitle: 'Chi siamo – Centro medico LilyCare a Chiasso',
    metaDescription:
      'LilyCare è un centro medico a Chiasso (Ticino) che riunisce diagnostica per immagini, terapia del dolore, ozonoterapia, cure infermieristiche e agopuntura.',
    layout: [
      {
        blockType: 'hero',
        variant: 'page',
        eyebrow: 'Chi siamo',
        heading: 'Un centro medico *a misura di persona*',
        text: 'LilyCare nasce a Chiasso con un’idea semplice: offrire in un unico luogo diagnosi e cura, con professionisti che si conoscono, si confrontano e seguono il paziente in tutto il percorso.',
        showPhoneButton: false,
      },
      {
        blockType: 'content',
        width: 'narrow',
        content: `## La nostra idea di cura

Quando si ha un dolore o un problema di salute, spesso si è costretti a spostarsi tra strutture diverse: un esame in un posto, il referto in un altro, la terapia in un altro ancora. A LilyCare abbiamo voluto fare il contrario.

Nel nostro centro trovi **diagnostica per immagini** – radiografie, ecografie ed ecodoppler – e **terapie per il dolore** come l’ossigeno-ozonoterapia, le infiltrazioni ecoguidate e le onde d’urto. Accanto a queste, le **cure infermieristiche** e l’**agopuntura**, anche in ambito estetico.

## Come lavoriamo

- **Ascolto**: ogni percorso inizia da un colloquio, per capire davvero il problema.
- **Chiarezza**: spieghiamo esami e trattamenti con parole semplici, compresi benefici, limiti e alternative.
- **Collaborazione**: medico e infermiera lavorano fianco a fianco e, quando serve, ci confrontiamo con il tuo medico curante.
- **Prudenza**: proponiamo solo ciò che è indicato per il tuo caso.

## Dove siamo

Il centro si trova in Corso San Gottardo 89 a Chiasso, nel Mendrisiotto, al confine con Como.`,
      },
      {
        blockType: 'stats',
        items: [
          { value: '40+', label: 'anni di esperienza in radiologia' },
          { value: '10', label: 'prestazioni specialistiche' },
          { value: '1', label: 'centro per diagnosi e terapia' },
          { value: 'Lun–Ven', label: 'su appuntamento, mattina e pomeriggio' },
        ],
      },
      {
        blockType: 'gallery',
        eyebrow: 'Il centro',
        heading: 'I nostri spazi',
        intro:
          'Ambienti luminosi e curati, con la diagnostica per immagini e gli spazi per i trattamenti nello stesso centro.',
        images: [
          { image: '@photo:reception' },
          { image: '@photo:attesa' },
          { image: '@photo:corridoio' },
          { image: '@photo:radiologia' },
          { image: '@photo:ecografia' },
          { image: '@photo:trattamenti' },
          { image: '@photo:ambulatorio' },
          { image: '@photo:luminoso' },
          { image: '@photo:consulenza' },
        ],
      },
      {
        blockType: 'teamGrid',
        eyebrow: 'Il team',
        heading: 'Le persone di LilyCare',
      },
      {
        blockType: 'cta',
        heading: 'Vieni a conoscerci',
        text: 'Prenota una visita o chiamaci per qualsiasi informazione.',
        primary: { label: 'Prenota una visita', url: '/prenota' },
        showPhone: true,
        style: 'blush',
      },
    ],
  },
  {
    title: 'Privacy',
    slug: 'privacy',
    metaTitle: 'Informativa sulla privacy | LilyCare',
    metaDescription:
      'Come LilyCare tratta i dati personali raccolti tramite il sito web, ai sensi della Legge federale sulla protezione dei dati (LPD).',
    layout: [
      {
        blockType: 'hero',
        variant: 'page',
        eyebrow: 'Informazioni legali',
        heading: 'Informativa sulla privacy',
        text: 'Come trattiamo i dati personali raccolti tramite questo sito, nel rispetto della Legge federale sulla protezione dei dati (LPD).',
        showPhoneButton: false,
      },
      {
        blockType: 'content',
        width: 'narrow',
        content: `## Titolare del trattamento

LilyCare, Corso San Gottardo 89, 6830 Chiasso (Svizzera) – info@lilycare.ch – +41 21 988 70 95.

## Quali dati raccogliamo

- **Modulo di prenotazione**: nome e cognome, telefono, email, prestazione e preferenze di orario, eventuale messaggio e consenso.
- **Dati tecnici**: come ogni sito web, il server registra dati tecnici (ad esempio indirizzo IP, data e ora, pagina richiesta) necessari al funzionamento e alla sicurezza.

Il sito **non utilizza cookie di profilazione né strumenti di tracciamento pubblicitario**. La mappa di Google Maps viene caricata **solo se scegli di visualizzarla**: in quel caso Google può trattare dati secondo la propria informativa.

## Dati relativi alla salute

Il messaggio del modulo potrebbe contenere informazioni sulla tua salute, che la legge considera dati degni di particolare protezione. Ti invitiamo a indicare solo le informazioni necessarie per organizzare l’appuntamento. Tutti i dati sono trattati con riservatezza, nel rispetto del segreto professionale.

## Perché trattiamo i dati

Utilizziamo i dati esclusivamente per rispondere alla tua richiesta, organizzare l’appuntamento e comunicare con te. Non vendiamo né cediamo i dati a terzi per finalità di marketing.

## Destinatari

I dati possono essere trattati da fornitori che ci supportano nel funzionamento del sito e della posta elettronica (ad esempio hosting ed email), vincolati per contratto alla riservatezza. Un eventuale trasferimento all’estero avviene solo verso Paesi con un livello di protezione adeguato o con garanzie appropriate.

## Per quanto tempo

Conserviamo i dati per il tempo necessario a gestire la richiesta e per gli obblighi di legge; le richieste che non hanno dato seguito a un appuntamento vengono cancellate periodicamente.

## I tuoi diritti

Puoi chiedere in ogni momento informazioni sui dati che ti riguardano, la loro rettifica o cancellazione, scrivendo a info@lilycare.ch. Hai inoltre il diritto di rivolgerti all’Incaricato federale della protezione dei dati e della trasparenza (IFPDT).

## Modifiche

Questa informativa può essere aggiornata. La versione pubblicata su questa pagina è quella in vigore.`,
      },
    ],
  },
  {
    title: 'Note legali',
    slug: 'note-legali',
    metaTitle: 'Note legali | LilyCare',
    metaDescription: 'Note legali del sito web di LilyCare, centro medico a Chiasso.',
    layout: [
      {
        blockType: 'hero',
        variant: 'page',
        eyebrow: 'Informazioni legali',
        heading: 'Note legali',
        showPhoneButton: false,
      },
      {
        blockType: 'content',
        width: 'narrow',
        content: `## Responsabile del sito

LilyCare
Corso San Gottardo 89
6830 Chiasso, Svizzera
Telefono: +41 21 988 70 95
Email: info@lilycare.ch

## Contenuti a scopo informativo

Le informazioni pubblicate su questo sito hanno carattere generale e divulgativo e **non sostituiscono in alcun modo la visita e il parere del medico**. L’indicazione a esami e trattamenti viene sempre stabilita individualmente. In caso di emergenza chiama il 144.

## Responsabilità

Pur curando con attenzione i contenuti, non possiamo garantire che siano sempre completi e aggiornati. Decliniamo ogni responsabilità per danni derivanti dall’uso delle informazioni del sito, nei limiti consentiti dalla legge.

## Link esterni

Il sito può contenere collegamenti a siti di terzi, sui cui contenuti non abbiamo alcun controllo e per i quali non ci assumiamo responsabilità.

## Diritti d’autore

Testi, immagini e grafica di questo sito sono protetti dal diritto d’autore. Ogni riproduzione richiede il consenso scritto di LilyCare. I caratteri tipografici Fraunces e Inter sono distribuiti con licenza SIL Open Font License.`,
      },
    ],
  },
]
