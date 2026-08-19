import { Section } from '../types'

export const section: Section = {
  id: 'pattern-vs-resample',
  pad: 8,
  title: 'PATTERN VS RESAMPLE',
  short: 'dwie drogi do skończonego bita',
  body: [
    {
      kind: 'intro',
      text: 'To dwie filozofie: pattern to edytowalny układ w czasie, resample to zamrożona warstwa. Znajomość obu to połowa mocy SP.',
    },
    {
      kind: 'compare',
      title: 'WYBIERZ DROGĘ',
      a: {
        heading: 'PATTERN',
        points: [
          'Edytujesz każdy krok, pitch, velocity',
          'Timing + quantize + shuffle + motion automation (EFX MOTION REC)',
          'Layering bez zjadania polyphony do 32 głosów',
          'Arrangement przez PATTERN CHAIN',
          'Niszczy tylko przy bounce — edycja zostaje',
        ],
      },
      b: {
        heading: 'RESAMPLE',
        points: [
          'Konsolidujesz brzmienie z efektami na stałe',
          'Dowolna liczba warstw — bounce na bounce',
          'Uwalniasz głosy i miejsce w patternie',
          'Warianty = osobne sample',
          'Destrukcyjny: po zapisie nie cofniesz',
        ],
      },
    },
    { kind: 'h', title: 'HYBRYDOWY WORKFLOW' },
    {
      kind: 'diagram',
      steps: [
        { label: 'PATTERN', sub: 'baza' },
        { label: 'FX', sub: 'EFX MOTION REC', tone: 'bus' },
        { label: 'RESAMPLE', sub: 'freeze z efektami', tone: 'target' },
        { label: 'PATTERN', sub: 'nowy materiał', tone: 'bus' },
        { label: 'FINAL BOUNCE', sub: 'master sample', tone: 'master' },
      ],
    },
    {
      kind: 'tip',
      text: 'Najszybszy flow: zbuduj pattern → podkręć efekty i motion → zresampleuj na nowy pad → zbuduj następny pattern z tego sampla. Kończysz bounce całego układu.',
    },
    {
      kind: 'note',
      text: 'Resample patternu: PATTERN SELECT → RESAMPLE → ROUTING Mix → pusty pad → pattern gra i nagrywa się. BOUNCE przetwarza offline i wyłącza BUS 1–4.',
      source: { manual: 'RM5.50', page: 65 },
    },
  ],
}
