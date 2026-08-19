import { Section } from '../types'

export const section: Section = {
  id: 'start',
  pad: 1,
  title: 'START HERE',
  short: 'Project → Bank → Pad → Sample → Pattern',
  body: [
    {
      kind: 'intro',
      text: 'Wszystko, co trzymasz w SP, siedzi w prostej hierarchii: projekt → bank → pad → sample (albo pattern). Zrozum ją, a reszta stanie się logiczna.',
    },
    {
      kind: 'diagram',
      steps: [
        'PROJECT',
        { label: 'BANK', sub: '10 banków A–J' },
        { label: 'PAD', sub: '1–16' },
        { label: 'SAMPLE', sub: 'albo PATTERN' },
        { label: 'OUTPUT' },
      ],
    },
    { kind: 'h', title: 'HIERARCHIA' },
    {
      kind: 'list',
      title: 'Pojęcia',
      items: [
        'PROJECT — plik z całością ustawień, bankami i patternami (16 projektów)',
        'BANK — 10 banków (A–J) × 16 padów',
        'PAD — 1 z 16; trzyma sample lub pattern',
        'SAMPLE — nagrany dźwięk na padzie',
        'PATTERN — sekwencja padów w czasie',
      ],
    },
    {
      kind: 'note',
      text: 'Sample to pojedyncze nagranie przypisane do pada. Pattern łączy pady w sekwencję.',
      source: { manual: 'RM5.50', page: 10 },
    },
    { kind: 'h', title: '5 rzeczy przed pierwszym bitem' },
    {
      kind: 'pros',
      items: [
        'USTAW TEMPO — SHIFT+PAD 11 (TEMPO SEL / tap tempo na SUB PAD)',
        'POZIOM WEJŚCIA — SHIFT+EXT SOURCE, poziom CTRL 3; EXT SOURCE świeci czerwono przy clippingu',
        'COUNT-IN — SHIFT+PAD 10: 1MEAS / 2MEAS / WAIT / OFF',
        'MARK FUNCTION — SYSTEM → MARK Function: SBS Def (skip back 25 s) / SBS Long (40 s) / Looper',
        'WYBIERZ BANK — bank A–J, w którym będziesz pracować',
      ],
    },
    {
      kind: 'tip',
      text: 'Zacznij od jednego banku i jednego projektu. Zero organizacji na starcie = bałagan po godzinie.',
    },
    {
      kind: 'link',
      title: 'NAUCZ SIĘ NAGRYWAĆ',
      route: '/workflow/sample-something',
      note: 'pierwszy sample w 60 sekund',
    },
  ],
}
