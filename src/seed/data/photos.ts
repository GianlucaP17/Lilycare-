/**
 * Foto dello studio (public/images/studio): già ritagliate dei dettagli sensibili e senza metadati.
 * Vengono caricate nella libreria immagini del pannello al primo avvio.
 * focalX/focalY (in %) indicano il punto da tenere al centro nei ritagli.
 */
export type SeedPhoto = {
  key: string
  file: string
  /** Sottocartella di public/images (predefinita: "studio"). */
  dir?: string
  alt: string
  caption: string
  focalX: number
  focalY: number
}

export const photos: SeedPhoto[] = [
  {
    key: 'reception',
    file: 'reception.jpg',
    alt: 'Reception di LilyCare Medical Center a Chiasso, con il logo sul bancone e la sala d’attesa',
    caption: 'Reception',
    focalX: 42,
    focalY: 74,
  },
  {
    key: 'attesa',
    file: 'sala-attesa.jpg',
    alt: 'Sala d’attesa luminosa con sedute in legno e piante',
    caption: 'Sala d’attesa',
    focalX: 50,
    focalY: 62,
  },
  {
    key: 'radiologia',
    file: 'radiologia.jpg',
    alt: 'Sala di radiologia con apparecchio per radiografie e lettino',
    caption: 'Radiologia',
    focalX: 58,
    focalY: 58,
  },
  {
    key: 'ecografia',
    file: 'ecografia.jpg',
    alt: 'Ambulatorio con ecografo e lettino per gli esami',
    caption: 'Ecografia',
    focalX: 55,
    focalY: 62,
  },
  {
    key: 'trattamenti',
    file: 'sala-trattamenti.jpg',
    alt: 'Sala trattamenti con lettino regolabile e scrivania',
    caption: 'Sala trattamenti',
    focalX: 58,
    focalY: 66,
  },
  {
    key: 'ambulatorio',
    file: 'ambulatorio.jpg',
    alt: 'Ambulatorio con lettino, mobile e scrivania',
    caption: 'Ambulatorio',
    focalX: 52,
    focalY: 66,
  },
  {
    key: 'luminoso',
    file: 'ambulatorio-luminoso.jpg',
    alt: 'Ambulatorio luminoso con lettino e carrello',
    caption: 'Ambulatorio',
    focalX: 52,
    focalY: 62,
  },
  {
    key: 'consulenza',
    file: 'studio-consulenza.jpg',
    alt: 'Studio di consulenza con scrivania, lettino e luce calda',
    caption: 'Studio di consulenza',
    focalX: 45,
    focalY: 58,
  },
  {
    key: 'corridoio',
    file: 'corridoio.jpg',
    alt: 'Corridoio del centro con vetrata satinata e piante',
    caption: 'Il centro',
    focalX: 50,
    focalY: 60,
  },
  {
    key: 'ritratto-mauro-binda',
    file: 'mauro-binda.jpg',
    dir: 'team',
    alt: 'Ritratto del Dr. med. Mauro Binda, medico specialista in radiologia di LilyCare',
    caption: 'Dr. med. Mauro Binda',
    focalX: 50,
    focalY: 25,
  },
  {
    key: 'ritratto-monica-gaiga',
    file: 'monica-gaiga.jpg',
    dir: 'team',
    alt: 'Ritratto di Monica Gaiga, infermiera di LilyCare',
    caption: 'Monica Gaiga',
    focalX: 50,
    focalY: 25,
  },
]
