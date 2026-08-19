import { Section } from '../types'

export const section: Section = {
  id: 'beat',
  pad: 11,
  title: 'BUILD A BEAT',
  short: 'pełny bit od zera',
  body: [
    {
      kind: 'intro',
      text: 'Cały bit w 11 ruchach: sample z USB, chop, drums, bas, pattern, FX, sidechain, resample, wariant, arrangement, bounce. To jest twój roadmap.',
    },
    {
      kind: 'diagram',
      title: 'FLOW',
      steps: [
        { label: 'USB-C SAMPLE', tone: 'source' },
        { label: 'CHOP' },
        { label: 'DRUMS', tone: 'bus' },
        { label: 'BASS', tone: 'bus' },
        { label: 'PATTERN', tone: 'bus' },
        { label: 'EFFECTS', tone: 'bus' },
        { label: 'SIDECHAIN', tone: 'target' },
        { label: 'RESAMPLE', tone: 'target' },
        { label: 'VARIATION' },
        { label: 'ARRANGEMENT', tone: 'master' },
        { label: 'FINAL BOUNCE', tone: 'master' },
      ],
    },
    {
      kind: 'p',
      text: 'Każdy krok w wersji interaktywnej — z dokładnymi przyciskami, oczekiwanym rezultatem i typowymi błędami.',
    },
    {
      kind: 'link',
      title: 'ODTWÓRZ KROK PO KROKU',
      route: '/workflow/build-a-beat',
      note: '11 kroków · ~20 min',
    },
    {
      kind: 'tip',
      text: 'Nie kombinuj przy pierwszym razie. Trzymaj się kolejności: materiał → porządek → ruch → zamrożenie. Warianty później.',
    },
  ],
}
