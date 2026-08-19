import { Section } from '../types'

export const section: Section = {
  id: 'quick',
  pad: 12,
  title: 'QUICK WORKFLOWS',
  short: 'ekran do grania, nie do czytania',
  body: [
    {
      kind: 'intro',
      text: 'Krótkie procedury w maksymalnie kilku krokach. Ekran do używania obok samplera — nie na kanapie.',
    },
    {
      kind: 'steps',
      title: 'SAMPLE SOMETHING',
      steps: [
        {
          id: 'sample-arm',
          title: 'ARMUJ',
          action: 'REC → wybierz migający pad.',
          buttons: ['REC'],
        },
        {
          id: 'sample-startstop',
          title: 'START/STOP',
          action: 'REC, by zacząć; REC lub pad, by zapisać.',
          buttons: ['REC'],
        },
      ],
    },
    {
      kind: 'steps',
      title: 'CHOP A LOOP',
      steps: [
        {
          id: 'chop-marker',
          title: 'MARKER',
          action: 'SHIFT+START/END → AUTO MARK albo markery ręcznie (MARK).',
          buttons: ['SHIFT', 'START/END'],
        },
        {
          id: 'chop-assign',
          title: 'CHOP',
          action: 'VALUE → ASSIGN TO PAD → wybierz pady → VALUE.',
        },
      ],
    },
    {
      kind: 'steps',
      title: 'MAKE DRUMS',
      steps: [
        {
          id: 'drums-kit',
          title: 'KIT',
          action: 'Rozłóż sample perkusji na pady.',
        },
        {
          id: 'drums-mutegroup',
          title: 'MUTE GROUP',
          action: 'SHIFT+PAD 8 — grupa, by nie grały na raz.',
          buttons: ['SHIFT', 'PAD 8'],
        },
      ],
    },
    {
      kind: 'steps',
      title: 'RESAMPLE WITH FX',
      steps: [
        {
          id: 'rwf-fx',
          title: 'FX',
          action: 'Włącz efekty na BUS 1/2.',
          buttons: ['BUS FX'],
        },
        {
          id: 'rwf-freeze',
          title: 'FREEZE',
          action: 'RESAMPLE → ROUTING Mix → pusty pad → REC.',
          buttons: ['RESAMPLE'],
        },
      ],
    },
    {
      kind: 'steps',
      title: 'ADD SIDECHAIN',
      steps: [
        {
          id: 'sc-open',
          title: 'OTWÓRZ',
          action: 'SHIFT+PAD 16 → EFX SET → SIDE CHAIN.',
          buttons: ['SHIFT', 'PAD 16'],
          path: ['EFX SET', 'SIDE CHAIN'],
        },
        {
          id: 'sc-target',
          title: 'TARGET',
          action: 'Ustaw SOURCE (kick) i TARGET (bas), TARGET ≠ OFF.',
        },
      ],
    },
    {
      kind: 'steps',
      title: 'CAPTURE SKIP BACK',
      steps: [
        {
          id: 'skip-play',
          title: 'GRAJ',
          action: 'Graj bez REC.',
        },
        {
          id: 'skip-catch',
          title: 'ZŁAP',
          action: 'MARK → REC → wybierz pad.',
          buttons: ['MARK'],
        },
      ],
    },
    {
      kind: 'steps',
      title: 'BUILD VARIATION',
      steps: [
        {
          id: 'var-dup',
          title: 'DUPLICATE',
          action: 'PATTERN EDIT → DUPLICATE — podwaja pattern.',
          buttons: ['PATTERN EDIT'],
          path: ['DUPLICATE'],
        },
        {
          id: 'var-change',
          title: 'ZMIEŃ',
          action: 'Wymień część padów — masz wariant.',
        },
      ],
    },
    {
      kind: 'steps',
      title: 'FINAL BOUNCE',
      steps: [
        {
          id: 'bounce-go',
          title: 'BOUNCE',
          action: 'PATTERN SELECT → wybierz pattern → BOUNCE na pad.',
          buttons: ['PATTERN SELECT'],
        },
        {
          id: 'bounce-done',
          title: 'GOTOWE',
          action: 'Jeden sample = cały utwór.',
        },
      ],
    },
    { kind: 'link', title: 'WSZYSTKIE WORKFLOW', route: '/workflows' },
  ],
}
