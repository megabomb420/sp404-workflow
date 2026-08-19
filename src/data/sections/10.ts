import { Section } from '../types'

export const section: Section = {
  id: 'sidechain',
  pad: 10,
  title: 'SIDECHAIN',
  short: 'ducking — dodane w firmware 5.50',
  body: [
    {
      kind: 'intro',
      text: 'Side chain (dodany w 5.50, 404 Day 2026) ścisza bus TARGET, gdy bus SOURCE przekroczy próg. Klasyczne ducking kick→bas. Krótka ścieżka, 6 parametrów.',
    },
    {
      kind: 'sequence',
      buttons: ['SHIFT', 'PAD 16'],
      path: ['EFX SET', 'SIDE CHAIN'],
      note: 'Bezpośrednio z ekranu głównego',
    },
    {
      kind: 'table',
      headers: ['PARAMETR', 'ZAKRES', 'ZNACZENIE'],
      rows: [
        ['SOURCE', 'DRY, BUS 1–4', 'bus wyzwalający kompresję'],
        ['TARGET', 'OFF, DRY, BUS 1–4', 'bus ściskany (OFF = wyłączone)'],
        ['THRESHOLD', '0–255', 'próg; wyższa wartość = niższy próg'],
        ['RATIO', '0–255', 'stopień ściszenia; ekstremalne = do zera'],
        ['RELEASE', '0–255', 'czas powrotu głośności'],
        ['GAIN', '0.0–6.0 dB', 'makeup gain po ściszeniu'],
      ],
    },
    {
      kind: 'note',
      text: 'TARGET inny niż OFF = side chain aktywny. SOURCE = TARGET daje zwykły kompresor. DRY nie może być źródłem/targetem, gdy DRY Routing = BUS 3.',
      source: { manual: 'RM5.50', section: 'EFX SET > SIDE CHAIN' },
    },
    {
      kind: 'steps',
      title: 'USTAW DUCKING',
      steps: [
        {
          id: 'sc-buses',
          title: 'PRZYPISZ BUSY',
          action: 'Ustaw kicka na bus SOURCE (np. BUS 2), a bas/sample na TARGET (np. BUS 1) przez REMAIN + pady.',
        },
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
          action: 'Ustaw TARGET ≠ OFF.',
        },
        {
          id: 'sc-probe',
          title: 'PROG',
          action: 'Graj pattern; z RATIO max i RELEASE min znajdź THRESHOLD, od którego bas ucieka.',
        },
        {
          id: 'sc-tune',
          title: 'DOBRZE',
          action: 'Ustaw RATIO ~100, dopasuj RELEASE (dłuższy dla krótkiego, perkusyjnego kicka).',
        },
      ],
    },
    {
      kind: 'tip',
      text: 'RELEASE naturalnie maleje z tempem: szybszy pattern = krótszy release. Ekstremalne ustawienia dają efekt „pompki" — świadomie.',
    },
    { kind: 'h', title: 'PRESETY START' },
    {
      kind: 'preset',
      title: 'KICK → BASS',
      config: [
        { label: 'SOURCE', value: 'BUS 2' },
        { label: 'TARGET', value: 'BUS 1' },
        { label: 'THRESHOLD', value: '~120' },
        { label: 'RATIO', value: '~100' },
        { label: 'RELEASE', value: '~80' },
        { label: 'GAIN', value: '~3.0 dB' },
      ],
      whatYouHear: 'Bas chowa się przy każdym uderzeniu kicka i wraca między uderzeniami — rytm oddycha.',
      source: { manual: 'RM5.50', section: 'EFX SET > SIDE CHAIN' },
    },
    {
      kind: 'preset',
      title: 'KICK → SAMPLE',
      config: [
        { label: 'SOURCE', value: 'BUS 2' },
        { label: 'TARGET', value: 'DRY' },
        { label: 'THRESHOLD', value: '~110' },
        { label: 'RATIO', value: '~90' },
        { label: 'RELEASE', value: '~100' },
        { label: 'GAIN', value: '~3.0 dB' },
      ],
      whatYouHear: 'Sample w DRY są ściskane pod kick — muzyka rozstępuje się dla stopy.',
      source: { manual: 'RM5.50', section: 'EFX SET > SIDE CHAIN' },
    },
    {
      kind: 'preset',
      title: 'WHOLE BEAT PUMP',
      config: [
        { label: 'SOURCE', value: 'BUS 1' },
        { label: 'TARGET', value: 'BUS 3' },
        { label: 'THRESHOLD', value: '~130' },
        { label: 'RATIO', value: '~150' },
        { label: 'RELEASE', value: '~120' },
        { label: 'GAIN', value: '~2.0 dB' },
      ],
      whatYouHear: 'Cały miks „pompuje" w rytm bębnów z BUS 1 — ruch, nie tylko ducking.',
      source: { manual: 'RM5.50', section: 'EFX SET > SIDE CHAIN' },
    },
    {
      kind: 'task',
      title: 'SPRĘDŹ SIĘ',
      task: 'Otwórz ustawienia sidechain',
      answer: ['SHIFT', 'PAD 16'],
      path: ['EFX SET', 'SIDE CHAIN'],
    },
    { kind: 'explorer' },
    { kind: 'link', title: 'WORKFLOW: ADD SIDECHAIN', route: '/workflow/add-sidechain' },
  ],
}
