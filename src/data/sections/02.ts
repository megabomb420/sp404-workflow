import { Section } from '../types'

export const section: Section = {
  id: 'sampling',
  pad: 2,
  title: 'SAMPLING',
  short: 'wejście → EXT SOURCE → REC → pad',
  body: [
    {
      kind: 'intro',
      text: 'Sampling w SP to 3 ruchy: wpuść źródło (EXT SOURCE), naciśnij REC, wskaż pad.',
    },
    {
      kind: 'diagram',
      steps: [
        { label: 'SOURCE', sub: 'LINE IN / INPUT / USB', tone: 'source' },
        { label: 'EXT SOURCE', sub: 'poziom wejścia', tone: 'bus' },
        { label: 'REC', sub: 'wybór pada', tone: 'bus' },
        { label: 'PAD', sub: 'start / stop' },
        { label: 'START/END', sub: 'przycinanie' },
        { label: 'TRUNCATE', sub: 'proces' },
      ],
    },
    { kind: 'h', title: 'SKĄD NAGRYWAĆ' },
    {
      kind: 'list',
      items: [
        'LINE IN (L/MONO, R) — linia z instrumentów, telefonu, innego samplera',
        'INPUT jack (front) — mikrofon / gitara; MIC/GUITAR switch + GAIN przy gnieździe',
        'USB-C — audio z komputera/telefonu (bez sterownika, USB Audio 2.0)',
      ],
    },
    {
      kind: 'sequence',
      buttons: ['SHIFT', 'EXT SOURCE'],
      note: 'Ustawienie wejścia: poziom CTRL 3, pan SHIFT+CTRL 3',
      source: { manual: 'RM5.50', page: 93 },
    },
    {
      kind: 'note',
      text: 'RECORD SETTING (przycisk po REC): REC BPM (CTRL 1), ROUTING (CTRL 2): Mix = playback + wejście, ExtIn = tylko wejście; PAN (SHIFT+CTRL 3); LEVEL (CTRL 3).',
      source: { manual: 'RM5.50', page: 33 },
    },
    {
      kind: 'steps',
      title: 'NAGRYWANIE',
      steps: [
        {
          id: 's1',
          title: 'ARMUJ',
          action: 'Wciśnij REC. Puste pady zaczną migać na czerwono.',
          buttons: ['REC'],
          expectedResult: 'Tryb oczekiwania — puste pady migają na czerwono, SP czeka na wybór celu.',
          commonMistake: 'Jeśli nic nie miga, wszystkie pady w banku są zajęte — przełącz bank (A–J).',
          source: { manual: 'RM5.50', page: 33 },
          kind: 'verified',
        },
        {
          id: 's2',
          title: 'WYBIERZ PAD',
          action: 'Wciśnij migający pad, na który chcesz nagrać.',
          expectedResult: 'Wybrany pad podświetla się — tu trafi nowy sample.',
          commonMistake: 'Przypadkowe wciśnięcie innego pada zmienia pad docelowy — miej pewność, który miga.',
          source: { manual: 'RM5.50', page: 33 },
          kind: 'verified',
        },
        {
          id: 's3',
          title: 'START',
          action: 'Wciśnij REC, by zacząć. EXIT anuluje.',
          buttons: ['REC'],
          expectedResult: 'Nagrywanie idzie — metronom (jeśli włączony) odlicza, EXIT w każdej chwili anuluje.',
          commonMistake: 'Poziomy za wysokie — przester. Ustaw poziom (CTRL 3) zanim wejdziesz w REC.',
          source: { manual: 'RM5.50', page: 33 },
          kind: 'verified',
        },
        {
          id: 's4',
          title: 'STOP I ZAPISZ',
          action: 'Wciśnij ten sam pad albo REC ponownie — sample ląduje na padzie.',
          buttons: ['REC'],
          expectedResult: 'Sample zapisany na padzie i gotowy do odtworzenia.',
          commonMistake: 'EXIT zamiast pada/REC porzuca nagranie — nic się nie zapisze.',
          source: { manual: 'RM5.50', page: 33 },
          kind: 'verified',
        },
      ],
    },
    {
      kind: 'note',
      text: 'END SNAP: w trybie oczekiwania wciśnij START/END — koniec sampla wskoczy na najbliższy beat ("END Snap ON"). Ustawiasz wcześniej BPM.',
      source: { manual: 'RM5.50', page: 35 },
    },
    {
      kind: 'note',
      text: 'Count-in: SHIFT+PAD 10 — 1MEAS / 2MEAS / WAIT (auto-start powyżej poziomu Auto Trig Level) / OFF.',
      source: { manual: 'RM5.50', page: 35 },
    },
    {
      kind: 'tip',
      text: 'Monitoruj w słuchawkach i kręć poziom aż EXT SOURCE przestanie świecić na czerwono. Nagrywasz to, co słyszysz.',
    },
    { kind: 'link', title: 'SZYBKI WORKFLOW: SAMPLE', route: '/workflow/sample-something' },
  ],
}
