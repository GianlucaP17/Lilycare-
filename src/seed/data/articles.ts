/**
 * Articoli iniziali della sezione Notizie.
 * IMPORTANTE: sono bozze divulgative da far rileggere ai professionisti prima della messa online.
 * Autore e "revisione medica" vanno assegnati nel pannello admin da chi ha effettivamente
 * scritto/verificato il testo.
 */
export const articleCategories = [
  {
    title: 'Diagnostica per immagini',
    slug: 'diagnostica',
    description:
      'Radiografie, ecografie ed ecodoppler spiegati in modo semplice: a cosa servono e come prepararsi.',
  },
  {
    title: 'Terapia del dolore',
    slug: 'terapia-del-dolore',
    description:
      'Mal di schiena, artrosi, tendiniti: approfondimenti sui trattamenti per il dolore muscolo-scheletrico.',
  },
  {
    title: 'Benessere e agopuntura',
    slug: 'benessere',
    description: 'Agopuntura, agopuntura estetica e consigli per il benessere quotidiano.',
  },
  {
    title: 'Dal centro',
    slug: 'dal-centro',
    description: 'Novità, servizi e informazioni pratiche da LilyCare.',
  },
]

export type SeedArticle = {
  title: string
  slug: string
  category: string
  daysAgo: number
  relatedServices: string[]
  excerpt: string
  /** Titolo per Google (max ~60 caratteri) */
  metaTitle: string
  /** Descrizione per Google, se diversa dal sommario (max ~155 caratteri) */
  metaDescription?: string
  content: string
  faqs?: Array<{ question: string; answer: string }>
}

export const articles: SeedArticle[] = [
  {
    title: 'Ossigeno-ozonoterapia per l’ernia del disco: come funziona e cosa aspettarsi',
    slug: 'ozonoterapia-ernia-del-disco',
    metaTitle: 'Ozonoterapia per l’ernia del disco | LilyCare',
    metaDescription:
      'Ernia o protrusione discale: come funziona l’ossigeno-ozonoterapia, come si svolge un ciclo di sedute e quali sono le controindicazioni.',
    category: 'terapia-del-dolore',
    daysAgo: 1,
    relatedServices: ['ozonoterapia', 'radiografia'],
    excerpt:
      'Mal di schiena e sciatica da ernia o protrusione discale: che cos’è l’ossigeno-ozonoterapia, come si svolge un ciclo di trattamento e quali sono le controindicazioni.',
    content: `Il mal di schiena è uno dei disturbi più frequenti in assoluto e, quando il dolore scende lungo la gamba, spesso la causa è un’**ernia o una protrusione del disco intervertebrale** che irrita una radice nervosa. Tra le opzioni di trattamento conservativo, cioè non chirurgico, c’è anche l’ossigeno-ozonoterapia.

## Che cos’è l’ozono medicale

L’ozono (O₃) è una molecola formata da tre atomi di ossigeno. In medicina si utilizza una **miscela di ossigeno e ozono** prodotta al momento da apparecchiature specifiche, con concentrazioni precise e controllate. Somministrata in piccole quantità nella zona interessata, la miscela può contribuire a ridurre l’infiammazione e il dolore.

## Come si svolge il trattamento

Per l’ernia lombare il trattamento più diffuso prevede **piccole iniezioni intramuscolari ai lati della colonna** (infiltrazioni paravertebrali), con aghi sottili:

1. **Visita**: il medico valuta i sintomi e gli esami – in particolare la risonanza magnetica o la TAC – e verifica che non ci siano controindicazioni.
2. **Sedute**: ogni seduta dura pochi minuti; dopo l’iniezione si può avvertire un senso di peso che passa rapidamente.
3. **Ciclo**: in genere si prevedono più sedute, a cadenza settimanale o bisettimanale, con una rivalutazione durante il percorso.

## Cosa aspettarsi

La risposta all’ozonoterapia è **individuale**: c’è chi nota un beneficio già dopo alcune sedute e chi ha bisogno di più tempo. Il trattamento si inserisce spesso in un percorso più ampio, che può includere fisioterapia, esercizio e corrette abitudini posturali.

## Quando non è indicata

L’ozonoterapia non è adatta a tutti. Tra le controindicazioni più note ci sono il **deficit di G6PD (favismo)**, la gravidanza e l’ipertiroidismo non controllato. Inoltre, alcuni sintomi richiedono una valutazione urgente e non vanno trattati in ambulatorio: perdita di forza importante a una gamba, alterazioni della sensibilità nella zona genitale o disturbi nel controllo di vescica e intestino.

## Perché è importante la diagnosi

Non tutti i mal di schiena sono uguali. Disporre di immagini aggiornate e di una valutazione medica accurata permette di capire se l’ozonoterapia è una scelta sensata o se è preferibile un altro approccio. A LilyCare il trattamento è eseguito da un medico specialista in radiologia, che può valutare le immagini e seguire nel tempo l’andamento del percorso.`,
    faqs: [
      {
        question: 'Quante sedute di ozonoterapia servono per l’ernia del disco?',
        answer:
          'Non esiste un numero valido per tutti: in genere si prevede un ciclo di più sedute, che il medico definisce in base al quadro clinico e rivaluta durante il trattamento.',
      },
      {
        question: 'Dopo la seduta posso guidare e lavorare?',
        answer:
          'Nella maggior parte dei casi sì: dopo pochi minuti di osservazione si possono riprendere le normali attività, evitando sforzi intensi nella giornata.',
      },
    ],
  },
  {
    title: 'Radiografia o ecografia? Le differenze e quando serve l’una o l’altra',
    slug: 'radiografia-o-ecografia-differenze',
    metaTitle: 'Radiografia o ecografia? Le differenze | LilyCare',
    category: 'diagnostica',
    daysAgo: 4,
    relatedServices: ['radiografia', 'ecografia'],
    excerpt:
      'Due esami diversi, spesso complementari: la radiografia vede bene le ossa, l’ecografia muscoli, tendini e tessuti molli. Ecco come orientarsi.',
    content: `Hai un dolore al ginocchio o alla spalla e ti è stato consigliato un esame: radiografia o ecografia? La risposta dipende da **che cosa bisogna osservare**. I due esami utilizzano tecnologie diverse e, spesso, si completano a vicenda.

## La radiografia: il riferimento per le ossa

La radiografia utilizza una piccola dose di **raggi X**. Le strutture dense, come le ossa, bloccano i raggi e appaiono chiare nell’immagine. Per questo la radiografia è l’esame di primo livello per:

- sospette **fratture** dopo un trauma;
- **artrosi**, per valutare lo spazio articolare e le alterazioni ossee;
- deformità e problemi della **colonna vertebrale**;
- alcune calcificazioni.

## L’ecografia: tendini, muscoli e tessuti molli

L’ecografia usa **ultrasuoni**, senza radiazioni. Mostra molto bene i tessuti molli e permette di studiarli **in movimento**. È particolarmente utile per:

- **tendini** (ad esempio della spalla o il tendine d’Achille);
- **lesioni muscolari** e versamenti;
- **borsiti** e cisti;
- noduli e tumefazioni sotto la pelle;
- organi come tiroide e addome, su indicazione medica.

## Perché spesso servono entrambe

Prendiamo l’esempio della spalla dolorosa: la radiografia può mostrare una calcificazione o un’artrosi, mentre l’ecografia valuta lo stato dei tendini della cuffia dei rotatori e delle borse. Insieme danno un quadro completo, che orienta la scelta del trattamento più adatto.

## Il vantaggio di un unico centro

A LilyCare entrambi gli esami sono seguiti dal medico specialista in radiologia, che può confrontare le immagini e, se emerge un problema doloroso trattabile, proporre nello stesso centro terapie mirate come le infiltrazioni ecoguidate.

## In sintesi

- **Radiografia**: raggi X a basso dosaggio; ideale per ossa, articolazioni e colonna; immagini statiche.
- **Ecografia**: ultrasuoni, senza radiazioni; ideale per tendini, muscoli e tessuti molli; permette lo studio in movimento.

Il medico ti consiglierà l’esame più indicato per il tuo caso.`,
  },
  {
    title: 'Ecodoppler delle gambe: quando farlo e come prepararsi',
    slug: 'ecodoppler-gambe-quando-farlo',
    metaTitle: 'Ecodoppler delle gambe: quando farlo | LilyCare',
    category: 'diagnostica',
    daysAgo: 8,
    relatedServices: ['ecodoppler'],
    excerpt:
      'Gambe pesanti, gonfie, varici: l’ecocolordoppler è l’esame che permette di vedere come scorre il sangue nelle vene e nelle arterie. Ecco quando è utile.',
    content: `Gambe pesanti a fine giornata, caviglie gonfie, comparsa di vene varicose: sono disturbi molto comuni, soprattutto con il caldo o dopo molte ore in piedi. Per capirne l’origine, l’esame di riferimento è l’**ecocolordoppler**.

## Che cosa mostra l’esame

L’ecocolordoppler è un’ecografia che, grazie all’effetto Doppler, permette di osservare **il flusso del sangue** all’interno dei vasi. Il medico valuta:

- se le **valvole delle vene** funzionano correttamente o se il sangue “torna indietro” (reflusso), come accade nell’insufficienza venosa;
- la presenza di **varici** e la loro origine;
- lo stato delle **arterie**, con eventuali placche o restringimenti.

## Quando è consigliato

- sensazione di **pesantezza** o gonfiore alle gambe;
- **varici** visibili o capillari in aumento;
- crampi notturni o dolore alle gambe camminando;
- presenza di **fattori di rischio cardiovascolare** (fumo, diabete, ipertensione, colesterolo alto), su indicazione del medico;
- controlli dopo trattamenti delle vene.

> **Attenzione:** un gonfiore improvviso e doloroso di una sola gamba, soprattutto se accompagnato da difficoltà a respirare, è un’urgenza. Non prenotare online: contatta subito il medico o chiama il 144.

## Come si svolge

L’esame è **indolore** e non utilizza radiazioni. Il medico applica un gel sulla pelle e fa scorrere la sonda lungo il decorso dei vasi. Per le vene delle gambe l’esame può essere eseguito anche in piedi, perché in questa posizione il reflusso è più evidente. Durante l’esame si possono sentire i suoni del flusso sanguigno: è normale.

## Come prepararsi

Per l’ecodoppler degli arti e del collo **non serve alcuna preparazione**. Ti consigliamo di:

- indossare abiti comodi, facili da togliere;
- evitare creme sulle gambe il giorno dell’esame;
- portare eventuali esami precedenti e l’elenco dei farmaci che assumi.

## Dopo l’esame

Al termine il medico ti spiega quanto osservato e redige il referto, utile al tuo medico curante per decidere gli eventuali passi successivi.`,
  },
  {
    title: 'Tendinite calcifica della spalla: il ruolo delle onde d’urto',
    slug: 'tendinite-calcifica-spalla-onde-d-urto',
    metaTitle: 'Tendinite calcifica della spalla e onde d’urto | LilyCare',
    category: 'terapia-del-dolore',
    daysAgo: 13,
    relatedServices: ['onde-d-urto', 'ecografia', 'infiltrazioni'],
    excerpt:
      'Dolore alla spalla che non passa e un deposito di calcio nel tendine: come si arriva alla diagnosi e quando le onde d’urto possono essere un’opzione.',
    content: `La **tendinopatia calcifica della spalla** è una condizione in cui si formano depositi di calcio all’interno dei tendini della cuffia dei rotatori, più spesso nel tendine sovraspinato. Può restare silenziosa per anni oppure causare un dolore intenso, che peggiora sollevando il braccio o di notte.

## Come si fa la diagnosi

Per riconoscere la calcificazione e valutarne dimensioni e caratteristiche si utilizzano due esami complementari:

- la **radiografia**, che mostra bene il deposito di calcio;
- l’**ecografia**, che valuta il tendine, la borsa vicina e lo stato infiammatorio, e permette di osservare la spalla in movimento.

## Le onde d’urto: come agiscono

La terapia con onde d’urto (ESWT) trasmette impulsi acustici ad alta energia attraverso la pelle, concentrandoli sulla zona da trattare. Nelle tendinopatie calcifiche è uno dei trattamenti conservativi più studiati: può contribuire a **ridurre il dolore** e a favorire il riassorbimento della calcificazione.

## Come si svolge un ciclo

- ogni seduta dura **pochi minuti**;
- non servono aghi, farmaci né anestesia;
- in genere si eseguono **alcune sedute** a distanza di circa una settimana;
- durante il trattamento si può avvertire un fastidio, regolabile modificando l’intensità.

## Altre opzioni

Le onde d’urto non sono l’unica strada. A seconda della situazione, il medico può proporre anche **infiltrazioni ecoguidate** (ad esempio nella borsa infiammata), esercizi specifici con il fisioterapista o, in casi selezionati, altri trattamenti.

## Quando non sono indicate

Le onde d’urto sono sconsigliate, tra l’altro, in gravidanza, in caso di disturbi della coagulazione o terapia anticoagulante e in presenza di infezioni nella zona da trattare. Per questo il trattamento è sempre preceduto da una valutazione medica.`,
  },
  {
    title: 'Infiltrazioni ecoguidate: perché la precisione fa la differenza',
    slug: 'infiltrazioni-ecoguidate-precisione',
    metaTitle: 'Infiltrazioni ecoguidate: perché sono precise | LilyCare',
    metaDescription:
      'Cortisone, acido ialuronico, anestetici: con la guida ecografica il medico vede l’ago in tempo reale e porta il farmaco dove serve.',
    category: 'terapia-del-dolore',
    daysAgo: 18,
    relatedServices: ['infiltrazioni', 'ecografia'],
    excerpt:
      'Cortisone, acido ialuronico, anestetici: le infiltrazioni portano il farmaco direttamente dove serve. Con la guida ecografica il medico vede l’ago in tempo reale.',
    content: `Le infiltrazioni sono una delle terapie più utilizzate per il dolore articolare e tendineo. Il principio è semplice: **portare il farmaco esattamente nel punto in cui serve**, così da ottenere un effetto locale con dosi contenute.

## Che cosa si infiltra

La scelta del farmaco dipende dal disturbo:

- **cortisonici**, con un’azione antinfiammatoria, ad esempio in borsiti, tendinopatie o fasi di riacutizzazione dell’artrosi;
- **acido ialuronico**, una sostanza naturalmente presente nelle articolazioni, utilizzato nell’artrosi per migliorare la lubrificazione;
- **anestetici locali**, spesso associati agli altri farmaci.

## Il vantaggio della guida ecografica

Molte infiltrazioni possono essere eseguite “a mano libera”, basandosi sui punti di repere anatomici. La **guida ecografica** aggiunge un elemento importante: il medico **vede in tempo reale l’ago e la struttura da raggiungere**.

Questo significa:

- maggiore **precisione**, soprattutto nelle articolazioni piccole o profonde (come l’anca);
- possibilità di **evitare** vasi, nervi e altre strutture delicate;
- verifica immediata che il farmaco si distribuisca nel punto giusto.

## Come si svolge

Dopo la visita, la pelle viene disinfettata e il medico individua la zona con l’ecografo. L’iniezione con ago sottile dura pochi istanti. Dopo un breve periodo di osservazione si può tornare a casa, con l’indicazione di evitare sforzi intensi per 24–48 ore.

## Quante infiltrazioni si possono fare?

Non c’è una regola unica: dipende dal farmaco e dalla situazione. Il medico stabilisce numero e intervalli, evitando ripetizioni non necessarie, e valuta eventuali alternative come l’ossigeno-ozonoterapia.

## Cosa segnalare prima del trattamento

Allergie ai farmaci, terapie anticoagulanti o antiaggreganti, diabete (i cortisonici possono alzare temporaneamente la glicemia) e infezioni in corso.`,
  },
  {
    title: 'Agopuntura estetica e cellulite: cosa aspettarsi davvero',
    slug: 'agopuntura-estetica-cellulite',
    metaTitle: 'Agopuntura estetica e cellulite | LilyCare',
    metaDescription:
      'Agopuntura estetica per cellulite e luminosità del viso: come funziona, quante sedute servono e quali risultati aspettarsi davvero.',
    category: 'benessere',
    daysAgo: 22,
    relatedServices: ['agopuntura-estetica', 'agopuntura'],
    excerpt:
      'Un approccio naturale e complementare per la cellulite e la luminosità del viso: come funziona l’agopuntura estetica, quante sedute servono e quali risultati aspettarsi.',
    content: `La cellulite è un inestetismo molto diffuso, che riguarda la grande maggioranza delle donne, indipendentemente dal peso. Tra i trattamenti che si possono affiancare a uno stile di vita sano c’è l’**agopuntura estetica**.

## Come funziona

L’agopuntura estetica utilizza **aghi sottilissimi, sterili e monouso**, inseriti in punti specifici delle zone da trattare e, secondo la medicina tradizionale cinese, in punti che favoriscono l’equilibrio generale dell’organismo. L’obiettivo è stimolare la **microcircolazione** e i tessuti.

## Cellulite: risultati graduali

È importante essere chiari: l’agopuntura estetica **non è una bacchetta magica**. Può contribuire a migliorare l’aspetto della pelle e la sensazione di gonfiore, ma i risultati:

- sono **graduali**, e si apprezzano nel corso del ciclo di sedute;
- **variano da persona a persona**;
- si mantengono meglio con una buona idratazione, un’alimentazione equilibrata e attività fisica regolare.

## Il viso

Sul viso l’agopuntura estetica è proposta come trattamento delicato e non chirurgico per favorire **tono e luminosità** della pelle.

## Come si svolge un percorso

1. **Colloquio iniziale**: valutiamo insieme le zone da trattare, lo stato di salute e le aspettative.
2. **Sedute**: gli aghi restano in sede per circa 20–30 minuti, in un ambiente tranquillo.
3. **Ciclo**: in genere si prevedono 8–10 sedute, con controlli periodici dei risultati.

## Effetti collaterali

L’agopuntura è generalmente ben tollerata. Possono comparire **piccoli lividi** nei punti di inserimento, che scompaiono in pochi giorni. È importante segnalare l’uso di anticoagulanti o una gravidanza.

A LilyCare l’agopuntura estetica è eseguita in un contesto sanitario, da un’infermiera che lavora in collaborazione con il medico.`,
  },
  {
    title: 'LilyCare: diagnosi e cura in un unico centro a Coldrerio',
    slug: 'lilycare-centro-medico-coldrerio',
    metaTitle: 'Diagnosi e cura in un unico centro | LilyCare',
    category: 'dal-centro',
    daysAgo: 28,
    relatedServices: ['radiografia', 'ozonoterapia', 'agopuntura'],
    excerpt:
      'Radiografie, ecografie, terapia del dolore, cure infermieristiche e agopuntura: ecco come funziona LilyCare e come prenotare una visita.',
    content: `**LilyCare** è un centro medico a **Coldrerio**, nel Mendrisiotto, nato con un’idea semplice: permettere ai pazienti di trovare **nello stesso luogo** la diagnosi e la cura, con professionisti che si conoscono e lavorano insieme.

## Che cosa trovi a LilyCare

**Diagnostica per immagini**

- radiografie
- ecografie
- ecodoppler (ecocolordoppler)

**Terapia del dolore**

- ossigeno-ozonoterapia
- infiltrazioni antidolorifiche, anche ecoguidate
- onde d’urto

**Cure infermieristiche, agopuntura e benessere**

- prestazioni infermieristiche ambulatoriali
- agopuntura
- agopuntura estetica, ad esempio per la cellulite

## Perché un unico centro fa la differenza

Pensiamo a un dolore alla spalla: spesso servono una radiografia e un’ecografia, poi una terapia mirata come un’infiltrazione ecoguidata o le onde d’urto. Quando tutto avviene nello stesso centro, **le informazioni non si perdono**, i tempi si accorciano e il paziente ha un punto di riferimento chiaro.

## Come prenotare

- **Online**: compila il modulo nella pagina *Prenota una visita*. La richiesta ci arriva subito e ti ricontattiamo per fissare data e ora.
- **Per telefono**: chiamaci negli orari di apertura.

## Dove siamo

Ci trovi in **Via Monte Generoso 2, 6877 Coldrerio**, a pochi minuti da Mendrisio, Balerna e Chiasso. Nella pagina *Contatti* trovi la mappa e le indicazioni per raggiungerci.`,
  },
]
