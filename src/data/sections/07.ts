import { Section } from '../types'

export const section: Section = {
  id: 'pattern',
  pad: 7,
  title: 'PATTERN',
  short: 'TR-REC · quantize · motion',
  body: [
    {
      kind: 'intro',
      text: 'Pattern łączy pady w czasie: nagrywasz real-time albo TR-REC (krok po kroku), domykasz quantize, dodajesz ruch efektów. Do 64 taktów.',
    },
    {
      kind: 'diagram',
      steps: [
        { label: 'PATTERN SELECT', tone: 'source' },
        { label: 'REC', sub: 'wybór pada', tone: 'bus' },
        { label: 'REAL-TIME / TR-REC', sub: 'metoda nagrania', tone: 'bus' },
        { label: 'PADY', sub: 'kroki / granie', tone: 'target' },
        { label: 'QUANTIZE', sub: 'domknij timing', tone: 'master' },
      ],
    },
    {
      kind: 'steps',
      title: 'NAGRYWANIE REAL-TIME',
      steps: [
        {
          id: 'rt-open',
          title: 'OTWÓRZ',
          action: 'PATTERN SELECT → REC → wybierz migający pusty pad.',
          buttons: ['PATTERN SELECT', 'REC'],
        },
        {
          id: 'rt-method',
          title: 'METODA',
          action: 'REMAIN — przełącz na "Real-Time".',
          buttons: ['REMAIN'],
        },
        {
          id: 'rt-play',
          title: 'GRAJ',
          action: 'REC i graj pady; overdubuj kolejne warstwy.',
          buttons: ['REC'],
        },
        {
          id: 'rt-end',
          title: 'KONIEC',
          action: 'EXIT zapisuje; EXIT 2× zatrzymuje pattern.',
          buttons: ['EXIT'],
        },
      ],
    },
    {
      kind: 'steps',
      title: 'TR-REC KROK PO KROKU',
      steps: [
        {
          id: 'trr-open',
          title: 'OTWÓRZ',
          action: 'PATTERN SELECT → REC → pad → REMAIN "TR-REC".',
        },
        {
          id: 'trr-sample',
          title: 'SAMPLE',
          action: 'SUB PAD + pad — wybierz sample.',
          buttons: ['SUB PAD'],
        },
        {
          id: 'trr-steps',
          title: 'KROKI',
          action: 'Pady 1–16 włączają/wyłączają kroki; VALUE zmienia takt.',
        },
        {
          id: 'trr-delete',
          title: 'USUŃ',
          action: 'DEL+A/F — noty pada; DEL+B/G — wszystkie pady (1 takt).',
          buttons: ['DEL'],
        },
      ],
    },
    {
      kind: 'note',
      text: 'Parametry TR-REC: SUBSTEP, HOLD STEP, PITCH, PITCH MODE (CHROMATIC/PAD), VELOCITY 0–127, BPM, SHUFFLE -50..+50, START, MODE (TRIG / HOLD STEP).',
      source: { manual: 'RM5.50', page: 61 },
    },
    { kind: 'h', title: 'DOMKNIJ TIMING' },
    {
      kind: 'note',
      text: 'Quantize: RECORD SETTING na ekranie patternu → QTZ: GRID 32 / 16.3 / 16 / 8.3 / 8 / 4.3 / 4 / SHUFFLE 16 / SHUFFLE 8, STR 0–100 %. Nieodwracalne po OK.',
      source: { manual: 'RM5.50', page: 75 },
    },
    {
      kind: 'note',
      text: 'Shuffle (-50..+50) ustawiasz przy nagraniu (SHFL RATE / SHUFFLE) — przesuwa offbeaty.',
      source: { manual: 'RM5.50', page: 59 },
    },
    { kind: 'h', title: 'MIKROEDYCJA' },
    {
      kind: 'note',
      text: 'Microscope: PATTERN EDIT + pad z notą — zmiana PITCH, VELOCITY, timingu (VALUE), DEL noty.',
      source: { manual: 'RM5.50', page: 64 },
    },
    { kind: 'h', title: 'EDIT I ORGANIZACJA' },
    {
      kind: 'list',
      items: [
        'PATTERN EDIT: BPM (CTRL 1), LOOP START (CTRL 2), LENGTH (CTRL 3: 1/2/4/8/16/32/64)',
        'DUPLICATE — podwaja pattern (8 taktów z 4)',
        'CROP — zostaw tylko zakres LOOP START–LENGTH',
        'PATTERN CHAIN — HOLD + pad: do 16 patternów w kolejności',
        'EXCHANGE — SHIFT+PAD 5 zamiana patternów',
        'COPY — COPY + pady; kopiuj bank COPY+EXIT',
      ],
    },
    { kind: 'h', title: 'RUCH W PATTERNIE' },
    {
      kind: 'note',
      text: 'EFX MOTION REC: REC → MARK ("MOTION REC START") → kręcisz CTRL i włączasz efekty. START/END włącza/wyłącza odtwarzanie motion.',
      source: { manual: 'RM5.50', page: 70 },
    },
    {
      kind: 'note',
      text: 'PAD MUTE MOTION REC: REC → SHIFT+REVERSE+REMAIN → wyciszasz pady w rytmie.',
      source: { manual: 'RM5.50', page: 71 },
    },
    { kind: 'sequencer', label: 'TR-REC — wyklikaj wzór' },
    { kind: 'link', title: 'WORKFLOW: 8-BAR PATTERN', route: '/workflow/8-bar-pattern' },
  ],
}
