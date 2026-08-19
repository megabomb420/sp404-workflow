import { Section } from '../types'

export const section: Section = {
  id: 'inputs',
  pad: 4,
  title: 'INPUTS & ROUTING',
  short: 'skąd wchodzi dźwięk i gdzie płynie',
  body: [
    {
      kind: 'intro',
      text: 'Wiesz, skąd idzie sygnał? Źródło → wejście → EXT SOURCE → bus/sample → wyjście. Złe rozumienie tego to połowa „bugów".',
    },
    {
      kind: 'list',
      title: 'WEJŚCIA',
      items: [
        'LINE IN (L/MONO, R) — z tyłu, poziom liniowy',
        'INPUT jack (front) — MIC/GUITAR: przestaw MIC/GUITAR na GUITAR dla gitary, GAIN przy gnieździe',
        'USB-C — komputer/telefon; klasa 2.0, bez sterownika',
        'MIDI IN/OUT — TRS/MIDI (BMIDI-5-35)',
      ],
    },
    {
      kind: 'diagram',
      steps: [
        { label: 'SOURCE', sub: 'LINE IN · INPUT · USB', tone: 'source' },
        { label: 'INPUT FX', sub: 'tylko dla gniazd wejściowych', tone: 'bus' },
        { label: 'EXT SOURCE', sub: 'słyszysz wejście', tone: 'bus' },
        { label: 'BUS / SAMPLE', sub: 'Mix lub ExtIn', tone: 'target' },
        { label: 'OUTPUT', sub: 'LINE OUT · PHONES', tone: 'master' },
      ],
    },
    {
      kind: 'sequence',
      buttons: ['SHIFT', 'EXT SOURCE'],
      note: 'Ekran ustawień wejścia — poziom audio CTRL 3',
      source: { manual: 'RM5.50', page: 93 },
    },
    {
      kind: 'note',
      text: 'EXT SOURCE świeci CZERWONO, gdy poziom wejścia jest za wysoki — sygnał może być przesterowany. Kręć poziom w dół.',
      source: { manual: 'RM5.50', page: 93 },
    },
    { kind: 'h', title: 'USB AUDIO (z telefonu/komputera)' },
    {
      kind: 'steps',
      title: 'PODEPNIJ USB',
      steps: [
        {
          id: 'u1',
          title: 'POŁĄCZ',
          action: 'Podłącz USB-C do SP i urządzenia (bez USB-huba).',
          expectedResult: 'SP podłączony do komputera/telefonu kablem USB-C.',
          commonMistake: 'Przez USB-hub audio nie przejdzie — podłącz bezpośrednio.',
          source: { manual: 'RM5.50', page: 94 },
          kind: 'verified',
        },
        {
          id: 'u2',
          title: 'UJAWNIJ SP',
          action: 'W systemie ustaw SP-404MKII jako domyślne wyjście (Windows: "SP-404MKII-G", macOS: "SP-404MKII-OUT").',
          expectedResult: 'Urządzenie SP-404MKII jest domyślnym wyjściem audio w systemie.',
          commonMistake: 'Wybranie innego wyjścia = z USB nic nie leci.',
          source: { manual: 'RM5.50', page: 94 },
          kind: 'verified',
        },
        {
          id: 'u3',
          title: 'EXT SOURCE',
          action: 'Wciśnij EXT SOURCE — audio z USB wchodzi do samplera.',
          buttons: ['EXT SOURCE'],
          expectedResult: 'Audio z USB wchodzi do samplera — słychać je i można nagrać na pad.',
          commonMistake: 'EXT SOURCE wyłączony = USB milczy. Nie zapomnij go włączyć.',
          source: { manual: 'RM5.50', page: 94 },
          kind: 'verified',
        },
      ],
    },
    {
      kind: 'note',
      text: 'SYSTEM → USB IN: LINE IN (miksuje z analogowym LINE IN) lub MIX OUT (miksuje na wyjściu, omija INPUT FX i BUS FX).',
      source: { manual: 'RM5.50', page: 122 },
    },
    {
      kind: 'tip',
      text: 'Do nagrania z telefonu: wpuść w EXT SOURCE, ustaw ROUTING na ExtIn w RECORD SETTING, nagraj jak każde wejście.',
    },
  ],
}
