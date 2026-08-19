import { Section } from '../types'

export const section: Section = {
  id: 'edit',
  pad: 3,
  title: 'SAMPLE EDIT',
  short: 'start/end · chop · pitch',
  body: [
    {
      kind: 'intro',
      text: 'Edytujesz sample na dwóch ekranach: START/END (granice i pętla) oraz PITCH/SPEED (wysokość i tempo). Chop działa z markerów.',
    },
    {
      kind: 'steps',
      title: 'USTAW GRANICE (START/END)',
      steps: [
        {
          id: 'se1',
          title: 'OTWÓRZ',
          action: 'Wciśnij START/END i wybierz pad.',
          buttons: ['START/END'],
          expectedResult: 'Na ekranie przebieg sampla z punktami START/END — gotowy do edycji.',
          commonMistake: 'Edycja dotyczy aktywnego pada — zmieniłeś pad, edytujesz inny sample.',
          source: { manual: 'RM5.50', page: 43 },
          kind: 'verified',
        },
        {
          id: 'se2',
          title: 'USTAW',
          action: 'CTRL 1 = start, CTRL 3 = koniec, CTRL 2 (przy LOOP) = punkt pętli. Zoom: VALUE.',
          expectedResult: 'Słyszysz na żywo, gdzie zaczyna się i kończy sample; punkt pętli trzyma zapętlony fragment.',
          commonMistake: 'CTRL 2 (punkt pętli) działa tylko przy włączonym LOOP — bez LOOP nie ma czego ustawiać.',
          source: { manual: 'RM5.50', page: 43 },
          kind: 'verified',
        },
        {
          id: 'se3',
          title: 'ZERO-CROSS',
          action: 'Wciśnij RESAMPLE, by przyciągnąć punkty do przejścia przez zero — koniec klików w pętli.',
          buttons: ['RESAMPLE'],
          expectedResult: 'Start/end/loop wskakują do najbliższego przejścia przez zero — pętla bez „klików”.',
          commonMistake: 'SNAP działa, gdy świeci RESAMPLE — jeśli przycisk nie świeci, punkty nie będą przyciągane.',
          source: { manual: 'RM5.50', page: 44 },
          kind: 'verified',
        },
      ],
    },
    { kind: 'h', title: 'PROCESY' },
    {
      kind: 'note',
      text: 'Menu procesów (VALUE po ustawieniu granic): TRUNCATE (tnij przed start / po end), NORMALIZE (podgłośnij), EMPHASIS (wzmacnia wysokie), CANCEL. Operacje niszczące — nieodwracalne.',
      source: { manual: 'RM5.50', page: 45 },
    },
    {
      kind: 'sequence',
      buttons: ['SHIFT', 'START/END'],
      note: 'Chop: markery → menu VALUE → ASSIGN TO PAD → wybierz pady → VALUE',
      source: { manual: 'RM5.50', page: 48 },
    },
    { kind: 'h', title: 'MARK / CHOP' },
    {
      kind: 'note',
      text: 'AUTO MARK: markery automatycznie — TIME DIVISION 2–16 (równy podział), LEVEL 1–10 (próg), TRANSIENT HARD/MID/SOFT (wykrywanie ataków).',
      source: { manual: 'RM5.50', page: 46 },
    },
    { kind: 'h', title: 'ENVELOPE' },
    {
      kind: 'note',
      text: 'SHIFT+PITCH/SPEED → ENVELOPE: ATTACK 0–127 (fade-in, 127 = 3 s), HOLD 1–100 % (zakres odtwarzania), RELEASE 0–127 (fade-out). Przy GATE puszczenie pada kończy fade.',
      source: { manual: 'RM5.50', page: 49 },
    },
    { kind: 'h', title: 'PITCH / SPEED' },
    {
      kind: 'list',
      items: [
        'SPEED 50–150 % (CTRL 1)',
        'PITCH -12.00..+12.00 (CTRL 2; -12..+7 przy VINYL MODE)',
        'FINE (SHIFT+CTRL 2) — centy',
        'VOLUME 0–127 (CTRL 3)',
        'BPM SET AUTO / MANU / MANU-F (VALUE)',
        'VINYL MODE — No (pitch i speed niezależnie) / Yes (jak winyl — razem)',
        'VARI MODE — Off / Backing / Ensemble: jakość zmiany pitcha',
      ],
    },
    {
      kind: 'note',
      text: 'BPM SYNC: przycisk na panelu — sample gra z tempem banku/projektu. Wymaga ustawionego tempa sample (AUTO wykrywa).',
      source: { manual: 'RM5.50', page: 18 },
    },
    { kind: 'h', title: 'INNE TRYBY' },
    {
      kind: 'list',
      items: [
        'CHROMATIC — SHIFT+PAD 4; skala na padach, LEGATO/MONO/POLY przez REMAIN',
        "SAMPLE MERGE — SHIFT+RESAMPLE: połącz do 4 sample'ów (SUM/MUL)",
        'INIT PARAM — SHIFT+PAD 6: reset parametrów sampla',
        'FIXED VELOCITY — SHIFT+PAD 1; 16 VELOCITY — SHIFT+PAD 2',
        'GATE / One-shot / LOOP / REVERSE / ROLL — przyciski trybów odtwarzania',
      ],
    },
    {
      kind: 'compare',
      title: 'WHEN SHOULD I CHOP IT?',
      a: {
        heading: 'LOOP',
        points: [
          'Jedno powtórzenie = cały utwór (drums break, chór)',
          'Szybkie: ustaw START/END i gotowe',
          'Bez żonglowania padami — play jeden pad',
        ],
      },
      b: {
        heading: 'CHOP',
        points: [
          'Dajesz każdemu fragmentowi własny pad',
          'Pitch każdy kawałek osobno',
          "Przestawiasz kolejność na żywo — idealne do remake'ów",
        ],
      },
    },
    { kind: 'link', title: 'WORKFLOW: CHOP A LOOP', route: '/workflow/chop-a-loop' },
  ],
}
