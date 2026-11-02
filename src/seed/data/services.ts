/**
 * Contenuti iniziali dei servizi.
 * Testi divulgativi, prudenti e verificabili: NON promettono risultati (regole sulla pubblicità
 * delle professioni mediche in Svizzera). Vanno riletti e approvati dai professionisti di LilyCare.
 */

export type SeedCategory = {
  key: string
  title: string
  slug: string
  description: string
  order: number
}

export const categories: SeedCategory[] = [
  {
    key: 'diagnostica',
    title: 'Diagnostica per immagini',
    slug: 'diagnostica-per-immagini',
    description:
      'Esami radiologici ed ecografici eseguiti e refertati da un medico specialista, per una diagnosi precisa e tempestiva.',
    order: 1,
  },
  {
    key: 'dolore',
    title: 'Terapia del dolore e ozonoterapia',
    slug: 'terapia-del-dolore',
    description:
      'Trattamenti mirati per il dolore della colonna, delle articolazioni e dei tendini, e ossigeno-ozonoterapia, sempre dopo una valutazione.',
    order: 2,
  },
  {
    key: 'infermieristica',
    title: 'Cure infermieristiche',
    slug: 'cure-infermieristiche',
    description: 'Prestazioni infermieristiche ambulatoriali, in collaborazione con il medico.',
    order: 3,
  },
  {
    key: 'agopuntura',
    title: 'Agopuntura e benessere',
    slug: 'agopuntura-e-benessere',
    description: 'Agopuntura come trattamento complementare, anche in ambito estetico.',
    order: 4,
  },
]

export type SeedService = {
  title: string
  slug: string
  category: string
  icon: string
  schemaType: 'ImagingTest' | 'MedicalTest' | 'TherapeuticProcedure' | 'MedicalProcedure'
  professionals: string[]
  order: number
  featured: boolean
  summary: string
  content: string
  indications: string[]
  procedure: Array<{ title: string; text: string }>
  preparation?: string
  facts: Array<{ label: string; value: string }>
  faqs: Array<{ question: string; answer: string }>
  metaTitle: string
  metaDescription: string
  /** chiave di una foto in data/photos.ts */
  photo?: string
}

export const services: SeedService[] = [
  {
    title: 'Radiografia',
    slug: 'radiografia',
    photo: 'radiologia',
    category: 'diagnostica',
    icon: 'xray',
    schemaType: 'ImagingTest',
    professionals: ['mauro-binda'],
    order: 1,
    featured: true,
    summary:
      'La radiografia (RX) è un esame di diagnostica per immagini che utilizza una piccola dose di raggi X per visualizzare ossa, articolazioni, colonna vertebrale e torace. È rapida, indolore e a LilyCare viene valutata da un medico specialista in radiologia.',
    content: `## Che cos’è la radiografia

La radiografia è uno degli esami più utilizzati in medicina: un fascio di raggi X attraversa la parte del corpo da studiare e produce un’immagine in cui le strutture dense, come le ossa, risultano ben visibili. È l’esame di riferimento per molte patologie dell’apparato muscolo-scheletrico.

## Perché farla a LilyCare

A LilyCare la radiografia fa parte di un percorso completo: il medico specialista in radiologia valuta le immagini e, se necessario, può integrarle con un’**ecografia** nello stesso centro. Quando l’esame mostra un problema doloroso di colonna o articolazioni, possiamo discutere con te le possibili **terapie del dolore**, senza dover cambiare struttura.

## Sicurezza e radioprotezione

La dose di radiazioni di una radiografia è bassa. Ogni esame viene eseguito solo quando è giustificato dal punto di vista clinico e con i parametri più adatti a ottenere un’immagine diagnostica con la minima esposizione, secondo i principi della radioprotezione.`,
    indications: [
      'Traumi, cadute e sospette fratture',
      'Dolori articolari e artrosi (ginocchio, anca, spalla, mani)',
      'Mal di schiena e disturbi della colonna vertebrale',
      'Controlli dopo fratture o interventi ortopedici',
      'Valutazione della postura e delle deformità scheletriche',
      'Esami del torace su indicazione del medico curante',
    ],
    procedure: [
      {
        title: 'Accoglienza',
        text: 'Verifichiamo la richiesta d’esame e raccogliamo le informazioni utili, inclusa un’eventuale gravidanza.',
      },
      {
        title: 'Posizionamento',
        text: 'Il personale ti aiuta a posizionarti correttamente; potrebbe esserti chiesto di togliere oggetti metallici.',
      },
      {
        title: 'Acquisizione',
        text: 'L’esposizione dura una frazione di secondo: ti chiederemo di restare fermo/a per qualche istante.',
      },
      {
        title: 'Valutazione',
        text: 'Le immagini vengono esaminate dal medico specialista in radiologia, che redige il referto.',
      },
    ],
    preparation:
      'Di norma non serve alcuna preparazione. Porta con te la prescrizione del medico (se ne hai una), eventuali esami precedenti della stessa zona e indossa abiti comodi. Informa sempre il personale in caso di gravidanza, anche solo sospetta.',
    facts: [
      { label: 'Durata', value: '10–15 minuti' },
      { label: 'Preparazione', value: 'Nessuna' },
      { label: 'Dolore', value: 'Nessuno' },
      { label: 'Da portare', value: 'Prescrizione ed esami precedenti' },
    ],
    faqs: [
      {
        question: 'La radiografia è pericolosa?',
        answer:
          'La dose di raggi X di una radiografia è bassa e l’esame viene eseguito solo quando è utile per la diagnosi. Il beneficio di una diagnosi corretta supera di gran lunga il rischio legato all’esposizione.',
      },
      {
        question: 'Serve una prescrizione medica?',
        answer:
          'Dipende dal modello della tua assicurazione di base. Con il modello “Medico di famiglia” (come con HMO e Telmed) devi prima passare dal tuo medico curante, che rilascia la prescrizione. Con il modello standard, a libera scelta del medico, puoi rivolgerti direttamente a noi.',
      },
      {
        question: 'Posso fare una radiografia in gravidanza?',
        answer:
          'In gravidanza la radiografia si esegue solo se strettamente necessaria e con particolari precauzioni. Informa sempre il personale prima dell’esame, anche in caso di dubbio.',
      },
    ],
    metaTitle: 'Radiografia a Chiasso (Ticino) | LilyCare',
    metaDescription:
      'Radiografie di ossa, articolazioni, colonna e torace a Chiasso, valutate da un medico specialista in radiologia. Prenota online o chiama.',
  },
  {
    title: 'Ecografia',
    slug: 'ecografia',
    photo: 'ecografia',
    category: 'diagnostica',
    icon: 'ultrasound',
    schemaType: 'ImagingTest',
    professionals: ['mauro-binda'],
    order: 2,
    featured: true,
    summary:
      'L’ecografia è un esame che utilizza gli ultrasuoni, senza radiazioni, per studiare in tempo reale muscoli, tendini, articolazioni, organi e tessuti molli. È indolore, non invasiva e ripetibile tutte le volte che serve.',
    content: `## Che cos’è l’ecografia

L’ecografia sfrutta onde sonore ad alta frequenza (ultrasuoni) emesse da una sonda appoggiata sulla pelle. Gli echi riflessi dai tessuti vengono trasformati in immagini in movimento, che il medico osserva in tempo reale durante l’esame.

## Un esame “dinamico”

A differenza di altre metodiche, l’ecografia permette di valutare le strutture anche **durante il movimento**: è particolarmente utile per tendini e articolazioni, perché il medico può chiederti di muovere la parte da esaminare e osservare subito cosa accade.

## Ecografia muscolo-scheletrica e non solo

A LilyCare l’ecografia è eseguita direttamente dal medico specialista in radiologia, che può confrontarla con eventuali radiografie ed esami precedenti. Se emerge un problema doloroso trattabile, l’ecografo può anche guidare con precisione le **infiltrazioni** e i trattamenti di **ossigeno-ozonoterapia**.

## Quali ecografie eseguiamo

A LilyCare si eseguono ecografie di **tutti i principali distretti**:

- **Addome**: completo o superiore (fegato, colecisti e vie biliari, pancreas, milza, reni)
- **Apparato urinario**: reni, vescica, prostata
- **Muscolo-scheletrico**: spalla, gomito, polso e mano, anca, ginocchio, caviglia e piede, muscoli e tendini
- **Collo**: tiroide, paratiroidi, ghiandole salivari, linfonodi
- **Tessuti molli**: noduli, cisti, tumefazioni e raccolte superficiali
- **Mammella** e **testicoli**
- **Vasi sanguigni**: con l’ecodoppler

Se cerchi un esame che non trovi in elenco, chiamaci: ti diremo subito se possiamo eseguirlo.`,
    indications: [
      'Dolore a spalla, gomito, polso, anca, ginocchio o caviglia',
      'Tendiniti, lesioni muscolari e borsiti',
      'Gonfiori, noduli e tumefazioni dei tessuti molli',
      'Valutazione di tiroide, collo e linfonodi',
      'Studio degli organi addominali e dell’apparato urinario',
      'Guida per infiltrazioni e trattamenti mirati',
    ],
    procedure: [
      {
        title: 'Colloquio',
        text: 'Il medico raccoglie le informazioni sui tuoi disturbi e guarda gli esami precedenti.',
      },
      {
        title: 'Esame',
        text: 'Sulla pelle si applica un gel e la sonda viene fatta scorrere sulla zona da studiare.',
      },
      {
        title: 'Valutazione in tempo reale',
        text: 'Il medico osserva le immagini sul monitor e, se utile, ti chiede di eseguire alcuni movimenti.',
      },
      {
        title: 'Referto',
        text: 'Al termine il medico ti spiega quanto osservato e redige il referto.',
      },
    ],
    preparation:
      'Per le ecografie muscolo-scheletriche, del collo e dei tessuti molli non serve preparazione. Per l’ecografia dell’addome è in genere richiesto il digiuno da alcune ore: al momento della prenotazione ti daremo le indicazioni precise per il tuo esame.',
    facts: [
      { label: 'Durata', value: '15–30 minuti' },
      { label: 'Radiazioni', value: 'Nessuna' },
      { label: 'Dolore', value: 'Nessuno' },
      { label: 'Preparazione', value: 'Dipende dal distretto' },
    ],
    faqs: [
      {
        question: 'L’ecografia fa male?',
        answer:
          'No. Si avverte solo il contatto della sonda e del gel sulla pelle. In caso di zone molto dolenti il medico procede con delicatezza.',
      },
      {
        question: 'L’ecografia usa radiazioni?',
        answer:
          'No, l’ecografia utilizza ultrasuoni e non espone a radiazioni ionizzanti: per questo può essere ripetuta senza problemi.',
      },
      {
        question: 'Meglio un’ecografia o una radiografia?',
        answer:
          'Dipende da cosa si deve studiare: la radiografia è ideale per le ossa, l’ecografia per tendini, muscoli e tessuti molli. Spesso i due esami si completano. Il medico ti consiglierà quello più indicato.',
      },
    ],
    metaTitle: 'Ecografia a Chiasso, Ticino | LilyCare',
    metaDescription:
      'Ecografie muscolo-scheletriche, del collo, dei tessuti molli e dell’addome a Chiasso, eseguite dal medico specialista. Senza radiazioni. Prenota online.',
  },
  {
    title: 'Ecodoppler',
    slug: 'ecodoppler',
    photo: 'ecografia',
    category: 'diagnostica',
    icon: 'doppler',
    schemaType: 'ImagingTest',
    professionals: ['mauro-binda'],
    order: 3,
    featured: true,
    summary:
      'L’ecodoppler (o ecocolordoppler) è un’ecografia che permette di vedere il flusso del sangue nelle arterie e nelle vene. È un esame non invasivo e indolore, utile per valutare varici, insufficienza venosa e lo stato delle arterie.',
    content: `## Che cos’è l’ecodoppler

L’ecodoppler unisce l’immagine ecografica allo studio del flusso sanguigno basato sull’effetto Doppler. Il medico può così osservare la struttura dei vasi e, allo stesso tempo, la direzione e la velocità del sangue che vi scorre, rappresentate anche con i colori (ecocolordoppler).

## A cosa serve

L’esame consente di individuare restringimenti, placche, dilatazioni o ostacoli al flusso nelle arterie e di valutare il corretto funzionamento delle valvole delle vene. È un esame di primo livello prezioso nella prevenzione e nel follow-up delle malattie vascolari.

## Il valore del medico che esegue l’esame

Come per ogni ecografia, la qualità dell’ecodoppler dipende molto dall’esperienza di chi lo esegue: a LilyCare l’esame è effettuato dal medico specialista, che ti spiega subito quanto osservato.`,
    indications: [
      'Gambe pesanti, gonfie o doloranti',
      'Varici e capillari: valutazione dell’insufficienza venosa',
      'Controllo delle arterie del collo (tronchi sovra-aortici)',
      'Valutazione delle arterie delle gambe',
      'Controlli periodici in caso di fattori di rischio cardiovascolare',
      'Follow-up dopo trattamenti vascolari',
    ],
    procedure: [
      {
        title: 'Colloquio',
        text: 'Il medico raccoglie i sintomi, i fattori di rischio e gli esami precedenti.',
      },
      {
        title: 'Esame',
        text: 'Con il gel e la sonda vengono studiati i vasi; per le gambe l’esame può svolgersi anche in piedi.',
      },
      {
        title: 'Studio del flusso',
        text: 'Si possono sentire i suoni del flusso sanguigno: è del tutto normale.',
      },
      { title: 'Referto', text: 'Il medico ti illustra il risultato e redige il referto.' },
    ],
    preparation:
      'Per l’ecodoppler di collo e gambe non è richiesta alcuna preparazione. Indossa abiti comodi e facili da togliere. Per lo studio dei vasi addominali potrebbe essere richiesto il digiuno: te lo indicheremo al momento della prenotazione.',
    facts: [
      { label: 'Durata', value: '20–40 minuti' },
      { label: 'Radiazioni', value: 'Nessuna' },
      { label: 'Dolore', value: 'Nessuno' },
      { label: 'Preparazione', value: 'Di norma nessuna' },
    ],
    faqs: [
      {
        question: 'Che differenza c’è tra ecodoppler ed ecocolordoppler?',
        answer:
          'Sono termini usati spesso come sinonimi. L’ecocolordoppler rappresenta il flusso del sangue anche con i colori, rendendo più immediata la valutazione dei vasi.',
      },
      {
        question: 'Quando è utile un ecodoppler delle gambe?',
        answer:
          'Ad esempio in presenza di varici, gonfiore, pesantezza o dolore alle gambe, oppure su indicazione del medico per valutare la circolazione arteriosa o venosa.',
      },
      {
        question: 'In caso di sospetta trombosi posso prenotare online?',
        answer:
          'No: se hai un improvviso gonfiore doloroso a una gamba o difficoltà a respirare, contatta subito il tuo medico o chiama il 144. Il modulo online non è adatto alle urgenze.',
      },
    ],
    metaTitle: 'Ecodoppler ed ecocolordoppler a Chiasso | LilyCare',
    metaDescription:
      'Ecocolordoppler di arterie e vene (collo e gambe) a Chiasso, eseguito dal medico specialista. Esame indolore e senza radiazioni. Prenota online.',
  },
  {
    title: 'Ossigeno-ozonoterapia',
    slug: 'ozonoterapia',
    photo: 'trattamenti',
    category: 'dolore',
    icon: 'ozone',
    schemaType: 'TherapeuticProcedure',
    professionals: ['mauro-binda'],
    order: 4,
    featured: true,
    summary:
      'L’ossigeno-ozonoterapia utilizza una miscela di ossigeno e ozono medicale, a concentrazioni controllate, per contribuire a ridurre il dolore e l’infiammazione, in particolare nelle patologie della colonna vertebrale come ernie e protrusioni discali. A LilyCare è eseguita da un medico.',
    content: `## Che cos’è l’ossigeno-ozonoterapia

L’ozono medicale è una forma di ossigeno (O₃) che viene prodotta al momento, con apparecchiature dedicate, e miscelata con ossigeno puro in concentrazioni precise. La miscela viene somministrata in piccole quantità, con aghi sottili, nella zona da trattare.

L’impiego più consolidato riguarda il **mal di schiena da ernia o protrusione discale**, ma il trattamento può essere proposto anche per alcune forme di dolore articolare e muscolo-tendineo, sempre dopo un’attenta valutazione medica.

## Modalità di trattamento

- **Infiltrazioni paravertebrali**: piccole iniezioni intramuscolari ai lati della colonna, nella zona del dolore.
- **Infiltrazioni intra- e periarticolari**: per alcune patologie di ginocchio, spalla, anca e altre articolazioni, quando possibile sotto guida ecografica.
- **Grande autoemoterapia (GAET)**: è la forma “sistemica” dell’ossigeno-ozonoterapia, in cui una piccola quantità del proprio sangue viene miscelata con ossigeno-ozono e reinfusa. A LilyCare ha una [pagina dedicata](/servizi/gaet).

## Un approccio medico

A LilyCare l’ossigeno-ozonoterapia è eseguita da un **medico specialista in radiologia, membro della Società Scientifica Internazionale di Ossigeno-Ozono Terapia (SIOOT)**. La possibilità di eseguire nello stesso centro radiografie ed ecografie consente di valutare con precisione la situazione e di seguire nel tempo l’andamento del trattamento.

La risposta alla terapia varia da persona a persona: durante la visita il medico ti spiega benefici attesi, limiti e alternative.`,
    indications: [
      'Lombalgia e lombosciatalgia da ernia o protrusione discale',
      'Cervicalgia e dolore cervico-brachiale',
      'Dolore articolare da artrosi (ad es. ginocchio, anca, spalla)',
      'Tendinopatie e dolori muscolo-scheletrici',
      'Dolore cronico che non ha risposto ad altri trattamenti conservativi',
    ],
    procedure: [
      {
        title: 'Visita e valutazione degli esami',
        text: 'Il medico valuta i sintomi e le immagini (radiografie, risonanza o TAC) e verifica l’assenza di controindicazioni.',
      },
      {
        title: 'Piano di trattamento',
        text: 'Vengono definiti modalità, numero e frequenza delle sedute.',
      },
      {
        title: 'Seduta',
        text: 'Dopo la disinfezione della cute, la miscela viene iniettata con aghi sottili; quando utile si usa la guida ecografica.',
      },
      {
        title: 'Controllo',
        text: 'Dopo alcuni minuti di osservazione puoi tornare alle tue attività. L’andamento viene rivalutato durante il ciclo.',
      },
    ],
    preparation:
      'Porta con te gli esami più recenti della zona da trattare (in particolare risonanza magnetica o TAC per la colonna) e l’elenco dei farmaci che assumi. Segnala al medico eventuali allergie, terapie anticoagulanti, gravidanza o un deficit di G6PD (favismo).',
    facts: [
      { label: 'Durata della seduta', value: '15–30 minuti' },
      { label: 'Numero di sedute', value: 'Ciclo definito dal medico' },
      { label: 'Anestesia', value: 'Non necessaria' },
      { label: 'Eseguita da', value: 'Medico' },
    ],
    faqs: [
      {
        question: 'L’ozonoterapia è dolorosa?',
        answer:
          'Gli aghi utilizzati sono sottili. Durante e subito dopo l’iniezione si può avvertire un senso di peso o di tensione nella zona trattata, che in genere scompare in pochi minuti.',
      },
      {
        question: 'Quante sedute servono?',
        answer:
          'Dipende dal disturbo e dalla risposta individuale. In genere si prevede un ciclo di più sedute, a cadenza settimanale o bisettimanale, che il medico definisce e rivaluta durante il percorso.',
      },
      {
        question: 'Ci sono controindicazioni?',
        answer:
          'Sì: ad esempio il deficit di G6PD (favismo), la gravidanza, l’ipertiroidismo non controllato e alcune condizioni cardiovascolari gravi. Per questo il trattamento viene sempre preceduto da una visita medica.',
      },
      {
        question: 'Serve una risonanza magnetica?',
        answer:
          'Per il trattamento di ernie e protrusioni discali è importante disporre di esami recenti (risonanza magnetica o TAC). Se non li hai, il medico ti indicherà come procedere.',
      },
      {
        question: 'Che cos’è la GAET?',
        answer:
          'La grande autoemoterapia (GAET) consiste nel prelievo di una piccola quantità di sangue, nella sua miscelazione con ossigeno-ozono e nella reinfusione. A LilyCare è eseguita dall’infermiera, su indicazione medica: trovi tutti i dettagli nella pagina dedicata alla GAET.',
      },
    ],
    metaTitle: 'Ossigeno-ozonoterapia a Chiasso, Ticino | LilyCare',
    metaDescription:
      'Ossigeno-ozonoterapia per ernia del disco, lombosciatalgia, cervicalgia e dolori articolari, eseguita da un medico a Chiasso (Ticino). Prenota online.',
  },
  {
    title: 'GAET – Grande autoemoterapia',
    slug: 'gaet',
    photo: 'luminoso',
    category: 'dolore',
    icon: 'ozone',
    schemaType: 'TherapeuticProcedure',
    professionals: ['monica-gaiga'],
    order: 5,
    featured: true,
    summary:
      'La GAET (grande autoemoterapia con ossigeno-ozono) è una forma di ossigeno-ozonoterapia in cui una piccola quantità del proprio sangue viene prelevata, miscelata con ossigeno e ozono medicale in concentrazione controllata e reinfusa. A LilyCare è eseguita dall’infermiera, su indicazione medica.',
    content: `## Che cos’è la GAET

La sigla GAET indica la **grande autoemoterapia** con ossigeno-ozono. A differenza delle infiltrazioni locali di ossigeno-ozono, che agiscono sulla zona dolorante, la GAET è una modalità **sistemica**: la miscela di ossigeno e ozono medicale viene messa a contatto con il sangue della persona, che viene poi reinfuso.

## Come funziona

Il trattamento si svolge in ambulatorio. Si preleva una quantità limitata di sangue da una vena del braccio, raccolta in una sacca sterile e monouso contenente un anticoagulante; il sangue viene miscelato con ossigeno-ozono prodotto al momento, in concentrazione controllata, e reinfuso lentamente attraverso lo stesso accesso venoso.

## Sicurezza e indicazione

La GAET viene eseguita **dall’infermiera, su indicazione medica**, dopo aver raccolto le informazioni sulla tua salute e sulle terapie in corso e aver escluso le controindicazioni. Si utilizza esclusivamente materiale sterile e monouso.

La GAET è proposta come trattamento complementare e le evidenze scientifiche disponibili variano molto a seconda dell’indicazione: per questo, prima di iniziare, valutiamo insieme a te benefici attesi, limiti e alternative.`,
    indications: [],
    procedure: [
      {
        title: 'Colloquio e valutazione',
        text: 'Raccolta delle informazioni sulla salute, sui farmaci assunti e sulle possibili controindicazioni.',
      },
      {
        title: 'Prelievo',
        text: 'Si preleva una quantità limitata di sangue da una vena del braccio, in una sacca sterile monouso.',
      },
      {
        title: 'Miscelazione',
        text: 'Il sangue viene miscelato con ossigeno-ozono medicale prodotto al momento, in concentrazione controllata.',
      },
      {
        title: 'Reinfusione e osservazione',
        text: 'Il sangue viene reinfuso lentamente; segue un breve periodo di osservazione prima di tornare alle tue attività.',
      },
    ],
    preparation:
      'Fai una colazione leggera e bevi acqua prima della seduta. Porta l’elenco dei farmaci che assumi e gli esami del sangue recenti, se li hai. Prima del ciclo può essere richiesto un esame per escludere il deficit di G6PD (favismo). Segnala sempre gravidanza, terapie anticoagulanti o disturbi della coagulazione.',
    facts: [
      { label: 'Durata della seduta', value: '30–45 minuti' },
      { label: 'Numero di sedute', value: 'Ciclo su indicazione medica' },
      { label: 'Materiale', value: 'Sterile e monouso' },
      { label: 'Eseguita da', value: 'Infermiera, su indicazione medica' },
    ],
    faqs: [
      {
        question: 'La GAET è dolorosa?',
        answer:
          'Si avverte solo la puntura dell’ago nel braccio, come per un normale prelievo di sangue. Durante la reinfusione si resta seduti o sdraiati comodamente.',
      },
      {
        question: 'Che differenza c’è con l’ozonoterapia “classica”?',
        answer:
          'Le infiltrazioni di ossigeno-ozono agiscono localmente, ad esempio sulla colonna o su un’articolazione. La GAET è invece una modalità sistemica, perché la miscela viene messa a contatto con il sangue che poi viene reinfuso.',
      },
      {
        question: 'Chi non può fare la GAET?',
        answer:
          'Tra le controindicazioni principali ci sono il deficit di G6PD (favismo), la gravidanza, l’ipertiroidismo non controllato e alcuni disturbi della coagulazione. Per questo la GAET è sempre preceduta da una valutazione.',
      },
      {
        question: 'Quante sedute servono?',
        answer:
          'Il numero e la frequenza delle sedute vengono definiti su indicazione medica, in base alla situazione di ogni persona.',
      },
    ],
    metaTitle: 'GAET – autoemoterapia con ozono a Chiasso | LilyCare',
    metaDescription:
      'GAET, grande autoemoterapia con ossigeno-ozono a Chiasso (Ticino): come funziona, come prepararsi e controindicazioni. Eseguita su indicazione medica.',
  },
  {
    title: 'Infiltrazioni antidolorifiche',
    slug: 'infiltrazioni',
    photo: 'ambulatorio',
    category: 'dolore',
    icon: 'syringe',
    schemaType: 'TherapeuticProcedure',
    professionals: ['mauro-binda'],
    order: 6,
    featured: true,
    summary:
      'Le infiltrazioni consistono nell’iniezione mirata di un farmaco – ad esempio un antinfiammatorio cortisonico, acido ialuronico o un anestetico locale – in un’articolazione, vicino a un tendine o in una borsa, per ridurre dolore e infiammazione. Quando indicato, sono eseguite sotto guida ecografica.',
    content: `## Che cosa sono le infiltrazioni

L’infiltrazione permette di portare il farmaco **esattamente dove serve**, ottenendo un effetto locale con dosi contenute. È una procedura ambulatoriale, rapida, che non richiede ricovero.

## Perché sotto guida ecografica

Con l’ecografo il medico vede in tempo reale l’ago e le strutture da raggiungere (articolazione, tendine, borsa). La guida ecografica aumenta la precisione della procedura, soprattutto nelle articolazioni piccole o profonde, e permette di evitare le strutture delicate vicine.

## Quali farmaci

La scelta del farmaco dipende dal disturbo e dalla tua situazione clinica:

- **Cortisonici**, con azione antinfiammatoria, ad esempio in borsiti, tendinopatie e fasi infiammatorie dell’artrosi.
- **Acido ialuronico**, utilizzato nell’artrosi per migliorare la lubrificazione articolare.
- **Anestetici locali**, spesso associati ad altri farmaci.

In alternativa o in associazione, in alcuni casi il medico può proporre l’**ossigeno-ozonoterapia**.`,
    indications: [
      'Artrosi di ginocchio, anca, spalla e piccole articolazioni',
      'Borsiti (spalla, anca, gomito, ginocchio)',
      'Tendinopatie e tendiniti, ad esempio della spalla',
      'Epicondilite (“gomito del tennista”)',
      'Dito a scatto e tenosinoviti',
      'Sindrome del tunnel carpale, su indicazione medica',
    ],
    procedure: [
      {
        title: 'Valutazione',
        text: 'Il medico conferma l’indicazione, verifica allergie e terapie in corso e ti spiega la procedura.',
      },
      {
        title: 'Preparazione',
        text: 'La pelle viene accuratamente disinfettata; la zona viene individuata con l’ecografo.',
      },
      {
        title: 'Iniezione',
        text: 'Con un ago sottile il farmaco viene iniettato nel punto preciso, seguendo l’ago sullo schermo.',
      },
      {
        title: 'Dopo il trattamento',
        text: 'Breve osservazione, poi puoi tornare a casa. Ti daremo indicazioni su riposo e attività.',
      },
    ],
    preparation:
      'Segnala al medico allergie a farmaci, terapie anticoagulanti o antiaggreganti, diabete e infezioni in corso. Porta gli esami relativi alla zona da trattare. Di norma non è necessario il digiuno.',
    facts: [
      { label: 'Durata', value: '15–20 minuti' },
      { label: 'Guida', value: 'Ecografica, quando indicato' },
      { label: 'Ricovero', value: 'Non necessario' },
      { label: 'Eseguite da', value: 'Medico' },
    ],
    faqs: [
      {
        question: 'Le infiltrazioni sono dolorose?',
        answer:
          'Si usano aghi sottili e la procedura è rapida. Si può avvertire un fastidio momentaneo; nelle ore successive la zona può essere un po’ dolente.',
      },
      {
        question: 'Quante infiltrazioni si possono fare?',
        answer:
          'Il numero e l’intervallo tra le infiltrazioni dipendono dal farmaco utilizzato e dalla situazione clinica: li stabilisce il medico, evitando ripetizioni non necessarie.',
      },
      {
        question: 'Cosa devo fare dopo l’infiltrazione?',
        answer:
          'In genere si consiglia di evitare sforzi intensi con la parte trattata per 24–48 ore. Riceverai indicazioni specifiche al termine della seduta.',
      },
    ],
    metaTitle: 'Infiltrazioni ecoguidate a Chiasso, Ticino | LilyCare',
    metaDescription:
      'Infiltrazioni antidolorifiche ecoguidate (cortisone, acido ialuronico) per artrosi, borsiti e tendiniti a Chiasso, eseguite dal medico. Prenota online.',
  },
  {
    title: 'Onde d’urto',
    slug: 'onde-d-urto',
    photo: 'ecografia',
    category: 'dolore',
    icon: 'shockwave',
    schemaType: 'TherapeuticProcedure',
    professionals: ['mauro-binda'],
    order: 7,
    featured: true,
    summary:
      'La terapia con onde d’urto (ESWT) utilizza impulsi acustici ad alta energia, trasmessi attraverso la pelle, per stimolare i processi di riparazione dei tessuti e ridurre il dolore in diverse patologie dei tendini. È un trattamento non invasivo, senza aghi né farmaci.',
    content: `## Che cosa sono le onde d’urto

Le onde d’urto sono onde acustiche che vengono generate da un apparecchio e concentrate sulla zona da trattare tramite un manipolo appoggiato sulla pelle. Agiscono sui tessuti stimolando la circolazione locale e i processi biologici di riparazione, con un effetto antalgico.

## Un trattamento non invasivo

La terapia con onde d’urto non richiede aghi, farmaci né anestesia e permette nella maggior parte dei casi di proseguire le normali attività quotidiane. È spesso proposta nelle **tendinopatie croniche**, quando il dolore persiste nonostante riposo e altre terapie conservative.

## Valutazione prima del trattamento

Prima di iniziare, il medico conferma la diagnosi – se necessario con un’ecografia o una radiografia eseguite nello stesso centro – e verifica che non vi siano controindicazioni.`,
    indications: [
      'Tendinopatia calcifica della spalla',
      'Epicondilite (“gomito del tennista”)',
      'Fascite plantare e spina calcaneare',
      'Tendinopatia achillea e rotulea',
      'Dolore laterale dell’anca (trocanterite)',
    ],
    procedure: [
      {
        title: 'Valutazione medica',
        text: 'Il medico conferma la diagnosi, eventualmente con un’ecografia, ed esclude controindicazioni.',
      },
      {
        title: 'Applicazione',
        text: 'Sulla zona dolente si applica un gel; il manipolo trasmette le onde d’urto per alcuni minuti.',
      },
      {
        title: 'Intensità graduale',
        text: 'L’intensità viene regolata in base alla tua sensibilità.',
      },
      {
        title: 'Ciclo di sedute',
        text: 'Generalmente sono previste alcune sedute a distanza di circa una settimana.',
      },
    ],
    preparation:
      'Non serve una preparazione particolare. Informa il medico in caso di gravidanza, terapie anticoagulanti, disturbi della coagulazione, pacemaker o infezioni nella zona da trattare.',
    facts: [
      { label: 'Durata della seduta', value: '10–20 minuti' },
      { label: 'Ciclo indicativo', value: '3–5 sedute' },
      { label: 'Aghi e farmaci', value: 'No' },
      { label: 'Anestesia', value: 'Non necessaria' },
    ],
    faqs: [
      {
        question: 'Le onde d’urto fanno male?',
        answer:
          'Durante la seduta si può avvertire un fastidio, a volte intenso ma sopportabile, nella zona trattata. L’intensità viene adattata alla tua sensibilità.',
      },
      {
        question: 'Dopo quanto tempo si vedono i risultati?',
        answer:
          'L’effetto delle onde d’urto è progressivo e la risposta varia da persona a persona: il medico ti spiegherà cosa aspettarti e quando rivalutare il trattamento.',
      },
      {
        question: 'Chi non può fare le onde d’urto?',
        answer:
          'Il trattamento è sconsigliato ad esempio in gravidanza, in presenza di disturbi della coagulazione o terapie anticoagulanti, infezioni o tumori nella zona da trattare. Il medico valuta ogni situazione.',
      },
    ],
    metaTitle: 'Terapia con onde d’urto a Chiasso | LilyCare',
    metaDescription:
      'Onde d’urto (ESWT) per tendinite calcifica della spalla, epicondilite, fascite plantare e tendinopatie a Chiasso (Ticino). Trattamento non invasivo.',
  },
  {
    title: 'Cure infermieristiche',
    slug: 'cure-infermieristiche',
    photo: 'luminoso',
    category: 'infermieristica',
    icon: 'nursing',
    schemaType: 'MedicalProcedure',
    professionals: ['monica-gaiga'],
    order: 8,
    featured: true,
    summary:
      'Prestazioni infermieristiche ambulatoriali eseguite da un’infermiera qualificata, in collaborazione con il medico: medicazioni, iniezioni, controllo dei parametri e supporto nei percorsi di cura.',
    content: `## Un punto di riferimento per le cure

Le cure infermieristiche accompagnano molte fasi del percorso di salute: dopo un intervento, durante una terapia o semplicemente quando serve un aiuto competente per una medicazione o un’iniezione.

A LilyCare l’infermiera lavora **a stretto contatto con il medico** del centro: questo permette di seguire i pazienti con continuità e di intervenire rapidamente se qualcosa non va come previsto.

## Ascolto ed educazione sanitaria

Oltre alle prestazioni tecniche, l’infermiera dedica tempo a spiegare con chiarezza come gestire la terapia a casa, come prendersi cura di una ferita o come riconoscere i segnali a cui prestare attenzione.

Le prestazioni disponibili e le modalità vanno concordate al momento della prenotazione: per alcune è necessaria la prescrizione del medico.`,
    indications: [
      'Medicazioni di ferite e cicatrici chirurgiche',
      'Iniezioni intramuscolari e sottocutanee',
      'Rimozione di punti di sutura',
      'Controllo della pressione arteriosa e di altri parametri',
      'Assistenza durante le procedure mediche del centro',
      'Consigli ed educazione sanitaria per la gestione delle terapie',
    ],
    procedure: [
      {
        title: 'Richiesta',
        text: 'Prenota indicando la prestazione e, se disponibile, la prescrizione del medico.',
      },
      { title: 'Accoglienza', text: 'L’infermiera verifica le indicazioni e la tua situazione.' },
      {
        title: 'Prestazione',
        text: 'La prestazione viene eseguita con materiali sterili e monouso, secondo i protocolli.',
      },
      {
        title: 'Indicazioni',
        text: 'Ricevi consigli pratici e, se necessario, l’appuntamento successivo.',
      },
    ],
    preparation:
      'Porta con te la prescrizione medica (se prevista), i farmaci da somministrare quando richiesto e l’elenco delle terapie che assumi.',
    facts: [
      { label: 'Durata', value: '15–30 minuti' },
      { label: 'Prescrizione', value: 'Necessaria per alcune prestazioni' },
      { label: 'Eseguite da', value: 'Infermiera' },
    ],
    faqs: [
      {
        question: 'Serve una prescrizione medica?',
        answer:
          'Per diverse prestazioni infermieristiche, come la somministrazione di farmaci, sì. Contattaci per sapere cosa serve nel tuo caso.',
      },
      {
        question: 'Posso portare un farmaco prescritto dal mio medico per l’iniezione?',
        answer:
          'Sì, insieme alla prescrizione. L’infermiera verificherà le indicazioni prima della somministrazione.',
      },
    ],
    metaTitle: 'Cure infermieristiche a Chiasso | LilyCare',
    metaDescription:
      'Medicazioni, iniezioni, rimozione punti e controllo dei parametri a Chiasso, eseguiti da un’infermiera in collaborazione con il medico. Prenota.',
  },
  {
    title: 'Agopuntura',
    slug: 'agopuntura',
    photo: 'consulenza',
    category: 'agopuntura',
    icon: 'acupuncture',
    schemaType: 'TherapeuticProcedure',
    professionals: ['monica-gaiga'],
    order: 9,
    featured: true,
    summary:
      'L’agopuntura è una tecnica della medicina tradizionale cinese che prevede l’inserimento di aghi sottilissimi, sterili e monouso, in punti specifici del corpo. Può essere utilizzata come trattamento complementare per il dolore e per favorire il benessere generale.',
    content: `## Che cos’è l’agopuntura

Secondo la medicina tradizionale cinese, la stimolazione di punti precisi del corpo aiuta a ristabilire l’equilibrio dell’organismo. Oggi l’agopuntura è utilizzata in molti Paesi anche come **trattamento complementare**, cioè affiancato – e non in sostituzione – alle cure convenzionali.

## Per chi è indicata

È spesso richiesta da chi soffre di dolori muscolo-scheletrici ricorrenti, cefalea o tensione, e da chi cerca un percorso di benessere personalizzato. La risposta al trattamento è individuale: durante il primo incontro valutiamo insieme obiettivi e aspettative.

## Sicurezza

Gli aghi sono **sterili e monouso** e vengono eliminati dopo ogni utilizzo. Se assumi anticoagulanti, sei in gravidanza o porti un pacemaker, segnalalo prima del trattamento.

Lavorando in un centro medico, l’agopuntura a LilyCare si inserisce in un contesto in cui è sempre possibile confrontarsi con il medico.`,
    indications: [
      'Dolore cervicale e lombare ricorrente',
      'Dolori muscolari e articolari',
      'Cefalea ed emicrania',
      'Tensione e stress',
      'Supporto al benessere generale',
    ],
    procedure: [
      {
        title: 'Primo colloquio',
        text: 'Raccolta delle informazioni sulla tua salute, sui disturbi e sugli obiettivi del trattamento.',
      },
      {
        title: 'Inserimento degli aghi',
        text: 'Aghi sottilissimi vengono inseriti in punti specifici; la sensazione è in genere lieve.',
      },
      {
        title: 'Riposo',
        text: 'Gli aghi restano in sede per circa 20–30 minuti mentre ti rilassi.',
      },
      { title: 'Percorso', text: 'Si concorda un ciclo di sedute e se ne valuta l’andamento.' },
    ],
    preparation:
      'Evita di presentarti a digiuno o subito dopo un pasto abbondante. Indossa abiti comodi. Segnala farmaci anticoagulanti, gravidanza, pacemaker o paura degli aghi.',
    facts: [
      { label: 'Durata della seduta', value: '45–60 minuti' },
      { label: 'Aghi', value: 'Sterili e monouso' },
      { label: 'Ciclo indicativo', value: '6–10 sedute' },
    ],
    faqs: [
      {
        question: 'L’agopuntura fa male?',
        answer:
          'Gli aghi sono molto più sottili di quelli usati per le iniezioni. All’inserimento si può avvertire una lieve puntura o una sensazione di formicolio o pesantezza, generalmente ben tollerata.',
      },
      {
        question: 'L’agopuntura è rimborsata dalla cassa malati?',
        answer:
          'Alcune assicurazioni complementari possono rimborsare l’agopuntura, a determinate condizioni. Ti consigliamo di verificare con la tua cassa malati prima di iniziare.',
      },
      {
        question: 'Quante sedute servono?',
        answer:
          'Dipende dall’obiettivo e dalla risposta individuale. In genere si prevede un ciclo iniziale di alcune sedute, poi si valuta insieme come proseguire.',
      },
    ],
    metaTitle: 'Agopuntura a Chiasso (Ticino) | LilyCare',
    metaDescription:
      'Agopuntura per dolore cervicale e lombare, cefalea, tensione e benessere a Chiasso, in un centro medico. Aghi sterili monouso. Prenota online.',
  },
  {
    title: 'Agopuntura estetica',
    slug: 'agopuntura-estetica',
    photo: 'consulenza',
    category: 'agopuntura',
    icon: 'aesthetic',
    schemaType: 'TherapeuticProcedure',
    professionals: ['monica-gaiga'],
    order: 10,
    featured: true,
    summary:
      'L’agopuntura estetica applica i principi dell’agopuntura alla cura della pelle e della silhouette. È un trattamento complementare e naturale che può contribuire a migliorare l’aspetto della cellulite, la tonicità dei tessuti e la luminosità del viso.',
    content: `## Bellezza e benessere, con un approccio naturale

L’agopuntura estetica utilizza aghi sottilissimi, sterili e monouso, inseriti in punti specifici del corpo e del viso. L’obiettivo è stimolare la microcircolazione e i tessuti, nell’ambito di un percorso che considera la persona nel suo insieme.

## Corpo: cellulite e ritenzione

Sul corpo il trattamento è proposto in particolare per la **cellulite** e la sensazione di gonfiore e ritenzione. Può contribuire a migliorare l’aspetto della pelle, soprattutto se associato a uno stile di vita sano, a un’adeguata idratazione e all’attività fisica.

## Viso: tono e luminosità

Sul viso l’agopuntura estetica è utilizzata per favorire tono e luminosità della pelle, come alternativa delicata e non chirurgica.

## Aspettative realistiche

I risultati sono **graduali e variabili da persona a persona**: per questo il percorso inizia sempre con un colloquio in cui definiamo insieme obiettivi realistici e il numero di sedute indicativo.`,
    indications: [
      'Cellulite',
      'Ritenzione idrica e sensazione di gambe gonfie',
      'Tono e luminosità della pelle del viso',
      'Benessere generale e rilassamento',
    ],
    procedure: [
      {
        title: 'Colloquio',
        text: 'Valutiamo insieme la zona da trattare, le tue aspettative e lo stato di salute generale.',
      },
      {
        title: 'Trattamento',
        text: 'Aghi sottilissimi vengono applicati sulle zone del corpo o del viso concordate.',
      },
      { title: 'Rilassamento', text: 'Gli aghi restano in sede per circa 20–30 minuti.' },
      {
        title: 'Percorso',
        text: 'Si prosegue con un ciclo di sedute e controlli periodici dei risultati.',
      },
    ],
    preparation:
      'Presentati senza trucco per i trattamenti del viso e con abiti comodi per quelli del corpo. Segnala anticoagulanti, gravidanza o tendenza a formare lividi.',
    facts: [
      { label: 'Durata della seduta', value: '45–60 minuti' },
      { label: 'Ciclo indicativo', value: '8–10 sedute' },
      { label: 'Risultati', value: 'Graduali e individuali' },
    ],
    faqs: [
      {
        question: 'L’agopuntura elimina la cellulite?',
        answer:
          'L’agopuntura estetica può contribuire a migliorare l’aspetto della cellulite, ma i risultati sono graduali e variano da persona a persona. Funziona meglio all’interno di uno stile di vita sano.',
      },
      {
        question: 'Possono comparire lividi?',
        answer:
          'Occasionalmente possono formarsi piccoli lividi nei punti di inserimento, che scompaiono in pochi giorni.',
      },
      {
        question: 'Posso abbinarla ad altri trattamenti?',
        answer:
          'In molti casi sì. Ne parleremo durante il colloquio iniziale per costruire il percorso più adatto a te.',
      },
    ],
    metaTitle: 'Agopuntura estetica e cellulite a Chiasso | LilyCare',
    metaDescription:
      'Agopuntura estetica per cellulite, ritenzione e luminosità del viso a Chiasso (Ticino). Trattamento naturale e complementare. Prenota online.',
  },
]
