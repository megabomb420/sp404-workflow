import type { Shortcut, Source, Workflow, WorkflowStep } from './types'

export const DOOM = {
  version: '0.6.2 alpha', build: '3824', firmware: '5.52',
  manualVersion: '0.6.1 alpha', reviewed: '2026-10-08',
  manualUrl: 'https://klangfeldlabs.com/doom-os/manual/',
  siteUrl: 'https://klangfeldlabs.com/doom-os/',
  patcherUrl: 'https://klangfeldlabs.com/doom-os/patcher',
  repoUrl: 'https://github.com/klangfeld-labs/doom-os',
  changelogUrl: 'https://github.com/klangfeld-labs/doom-os/blob/main/CHANGELOG.md',
} as const

export const doomSource: Source = { manual: 'DOOM0.6.1', section: 'Quickstart', url: DOOM.manualUrl, reviewedAt: DOOM.reviewed, firmwareVersion: 'DOOM OS 0.6.1 / 0.6.2 alpha · Roland 5.52' }

export const doomTopics = [
  { id: 'basics', label: 'START', description: 'Wejście, patterny, tempo, zapis i pomoc.' },
  { id: 'tracks', label: 'ŚCIEŻKI', description: 'Jedna ścieżka odpowiada jednemu padowi z samplem.' },
  { id: 'notes', label: 'NUTY', description: 'W siatce 16 padów odpowiada 16 krokom wybranej ścieżki.' },
  { id: 'views', label: 'TAKTY / WIDOKI', description: 'Nawigacja zależy od widoku: siatka, zoom lub piano roll.' },
  { id: 'piano', label: 'PIANO ROLL', description: 'PAD 5 to oryginalna wysokość; pady 1–4 obniżają, 6–16 podwyższają.' },
  { id: 'recording', label: 'NAGRYWANIE', description: 'Pierwsze REC uruchamia próbę, drugie zapisuje grane nuty.' },
  { id: 'tools', label: 'PATTERN TOOLS', description: 'VALUE wybiera narzędzie i jego wartość; naciśnięcie zatwierdza. EXIT anuluje.' },
  { id: 'mixer', label: 'MIKSER', description: 'Tutaj CTRL 1–3 sterują panoramą, busem i poziomem.' },
  { id: 'effects', label: 'FX', description: 'Na otwartej stronie efektu CTRL 1–3 zmieniają parametry FX.' },
  { id: 'automation', label: 'AUTOMATYKA', description: 'Ruchy parametrów efektów zapisane w patternie, edytowane krok po kroku.' },
  { id: 'settings', label: 'USTAWIENIA', description: 'Opcje DOOM OS i własne kombinacje przycisków w SYSTEM.' },
] as const
export type DoomTopic = typeof doomTopics[number]['id']
export interface DoomShortcut extends Shortcut { topic: DoomTopic }

function control(topic: DoomTopic, id: string, name: string, buttons: string[], description: string, path?: string[]): DoomShortcut {
  const source: Source = ['undo', 'delete', 'record-fx'].includes(id)
    ? { manual: 'DOOM0.6.2', section: 'Features / controls', url: id === 'undo' ? DOOM.repoUrl : DOOM.siteUrl, reviewedAt: DOOM.reviewed, firmwareVersion: 'DOOM OS 0.6.2 alpha · Roland 5.52' }
    : doomSource
  return { id: `doom-${id}`, name, category: 'DOOM OS', topic, buttons, description, path,
    kind: 'verified', source, tags: ['doom', 'doom os', 'doomos', topic, name, description] }
}

// Własne, polskie opracowanie czynności z Quickstart autora, bez kopiowania jego ilustracji.
// Skróty dotyczą DOOM OS i wskazanego ekranu; nie są skrótami stockowego TR-REC.
export const doomShortcuts: DoomShortcut[] = [
  control('basics', 'open', 'OTWÓRZ DOOM OS', ['REMAIN', 'SUB PAD'], 'Przytrzymaj REMAIN i naciśnij SUB PAD. Możesz wejść z dowolnego ekranu SP.'),
  control('basics', 'save', 'ZAMKNIJ I ZAPISZ', ['EXIT'], 'Na głównym ekranie DOOM OS EXIT zamyka edytor i zapisuje zmiany. Zapis następuje też przy przejściu do innego patternu. W panelach EXIT najpierw wraca do poprzedniego widoku.'),
  control('basics', 'help', 'POMOC NA SPRZĘCIE', ['SHIFT (3 s)'], 'Przytrzymaj SHIFT przez trzy sekundy, potem sprawdź przycisk, pad lub pokrętło. Pomoc opisze działanie w bieżącym kontekście; nic nie zagra i nic się nie zmieni. EXIT kończy pomoc.'),
  control('basics', 'play', 'PLAY / STOP', ['PATTERN SELECT'], 'Krótkie naciśnięcie uruchamia albo zatrzymuje pattern.'),
  control('basics', 'pattern', 'WYBIERZ LUB UTWÓRZ PATTERN', ['PATTERN SELECT', 'PAD 1–16'], 'Trzymaj PATTERN SELECT i wybierz pad patternu. Pusty pad tworzy nowy pattern; zajęty otwiera istniejący.'),
  control('basics', 'pattern-bank', 'PATTERN Z INNEGO BANKU', ['PATTERN SELECT', 'BANK'], 'Z przytrzymanym PATTERN SELECT wybierz bank, a następnie pad patternu.'),
  control('basics', 'tempo', 'TEMPO PATTERNU', ['SHIFT', 'PAD 11'], 'Po otwarciu ustawienia obróć VALUE, aby wybrać tempo, i naciśnij VALUE, aby zatwierdzić.'),
  control('basics', 'undo', 'UNDO', ['SHIFT', 'PATTERN SELECT'], 'Cofnij ostatnią edycję. Historia DOOM OS ma 12 poziomów.'),
  control('basics', 'redo', 'REDO', ['REMAIN', 'PATTERN SELECT'], 'Przywróć cofniętą edycję.'),
  control('tracks', 'track', 'WYBIERZ ŚCIEŻKĘ', ['obróć VALUE'], 'W siatce obrót VALUE wybiera ścieżkę, której kroki edytujesz padami.'),
  control('tracks', 'sound', 'DODAJ ŚCIEŻKĘ / WYBIERZ SAMPLE', ['SUB PAD', 'PAD 1–16'], 'Trzymaj SUB PAD, odsłuchuj sample padami i zwolnij SUB PAD po wybraniu brzmienia. BANK zmienia bank sampli.'),
  control('tracks', 'track-knobs', 'PARAMETRY CAŁEJ ŚCIEŻKI', ['CTRL 1 / 2 / 3'], 'W siatce, bez trzymania pada: CTRL 1 ustawia velocity, CTRL 2 długość, CTRL 3 nudge. Wszystkie nuty ścieżki otrzymują tę samą wartość, więc tracą wcześniejsze różnice.'),
  control('tracks', 'mute', 'MUTE / UNMUTE', ['SHIFT', 'naciśnij VALUE'], 'Wycisz lub przywróć wybraną ścieżkę. Ta sama kombinacja działa w mikserze.'),
  control('tracks', 'solo', 'SOLO / SOLO OFF', ['SHIFT', 'ROLL'], 'Zostaw samą wybraną ścieżkę lub wyłącz solo. Migający ROLL sygnalizuje aktywne solo.'),
  control('tracks', 'panel', 'PANEL ŚCIEŻKI', ['RECORD SETTING'], 'Pierwsze naciśnięcie otwiera ścieżkę, drugie pattern, trzecie zamyka panel. VALUE wybiera pozycję; naciśnięcie VALUE pozwala ją zmienić.'),
  control('tracks', 'volume', 'GŁOŚNOŚĆ ŚCIEŻKI', ['RECORD SETTING'], 'W panelu ścieżki wybierz VOLUME pokrętłem VALUE.', ['VOLUME']),
  control('tracks', 'copy', 'KOPIUJ ŚCIEŻKĘ', ['COPY'], 'Skopiuj wybraną ścieżkę; na ścieżce docelowej użyj ACTIONS → PASTE.'),
  control('tracks', 'paste', 'WKLEJ ŚCIEŻKĘ', ['RECORD SETTING'], 'W panelu docelowej ścieżki wybierz PASTE.', ['ACTIONS', 'PASTE']),
  control('tracks', 'swap', 'ZMIEŃ SAMPLE, ZACHOWAJ NUTY', ['RECORD SETTING'], 'SWAP PAD zmienia pad przypisany do ścieżki, zachowując jej nuty. Sprawdź wybór przed potwierdzeniem.', ['ACTIONS', 'SWAP PAD']),
  control('tracks', 'clear', 'WYCZYŚĆ NUTY ŚCIEŻKI', ['RECORD SETTING'], 'CLEAR usuwa nuty wybranej ścieżki. Sprawdź ścieżkę przed zatwierdzeniem.', ['ACTIONS', 'CLEAR...']),
  control('tracks', 'delete', 'USUŃ ŚCIEŻKĘ', ['DEL'], 'Usuwa wybraną ścieżkę po potwierdzeniu. Upewnij się, że wybrałeś właściwy wiersz.'),
  control('notes', 'step', 'WŁĄCZ / WYŁĄCZ KROK', ['PAD 1–16'], 'W siatce stuknięcie pada przełącza odpowiadający mu krok wybranej ścieżki.'),
  control('notes', 'select-note', 'WYBIERZ NUTĘ', ['przytrzymaj PAD kroku'], 'Trzymaj pad nuty podczas edycji. Na ekranie VEL oznacza velocity, LEN długość, MIC nudge.'),
  control('notes', 'lock-note', 'ZATRZYMAJ ZAZNACZENIE NUTY', ['PAD kroku', 'REMAIN'], 'Trzymaj pad i naciśnij REMAIN; nuta pozostanie zaznaczona po puszczeniu pada. Ponowne REMAIN zwalnia zaznaczenie.'),
  control('notes', 'velocity', 'VELOCITY JEDNEJ NUTY', ['PAD kroku', 'CTRL 1'], 'Trzymaj pad kroku i obróć CTRL 1, aby zmienić tylko jego velocity.'),
  control('notes', 'length', 'DŁUGOŚĆ JEDNEJ NUTY', ['PAD kroku', 'CTRL 2'], 'Trzymaj pad kroku i obróć CTRL 2. Zakres długości: od 1/8 kroku do całego taktu.'),
  control('notes', 'nudge', 'NUDGE / MICROTIMING', ['PAD kroku', 'CTRL 3'], 'Przesuń nutę przed lub za siatkę. Środkowa pozycja daje trafienie dokładnie na kroku.'),
  control('notes', 'pitch', 'PITCH JEDNEJ NUTY', ['PAD kroku', 'SHIFT', 'CTRL 1'], 'Zmień wysokość wybranej nuty w zakresie ±12 półtonów.'),
  control('notes', 'semitone', 'PITCH CO PÓŁTON', ['PAD kroku', 'obróć VALUE'], 'W siatce trzymaj pad nuty i obracaj VALUE, aby zmieniać wysokość po jednym półtonie.'),
  control('views', 'bar', 'POPRZEDNI / NASTĘPNY TAKT', ['SHIFT', 'obróć VALUE'], 'W siatce przejdź między taktami. W widoku ZOOM ta kombinacja przechodzi między beatami.'),
  control('views', 'pattern-length', 'DŁUGOŚĆ PATTERNU', ['RECORD SETTING ×2'], 'W panelu patternu wybierz LENGTH. Skrócenie z nutami poza nowym końcem wyświetla pytanie CROP: YES usuwa końcówkę, NO zachowuje pattern.', ['LENGTH']),
  control('views', 'signature', 'METRUM / VIEW ONLY', ['SHIFT', 'CTRL 2'], 'Metrum nowego patternu ustaw na stockowym ekranie RECORD SETTING przed nagrywaniem. DOOM OS wyświetla je obok LENGTH. Patterny 5/4, 6/4 i 7/4 pokazują pierwsze 16 kroków taktu i są tylko do podglądu.', ['TIME SIGN']),
  control('views', 'follow', 'FOLLOW / ZATRZYMAJ WIDOK', ['SHIFT', 'HOLD'], 'Przełącz śledzenie odtwarzanej pozycji. Wyłączenie follow zostawia wybrany takt na ekranie.'),
  control('views', 'view', 'ZMIEŃ WIDOK SIATKI', ['SHIFT', 'RECORD SETTING'], 'Przełączaj GRID, LABELS, BEATS, BOTH i ZOOM. W mikserze ta kombinacja zmienia sposób wyświetlania poziomów.'),
  control('views', 'zoom', 'SKALA W WIDOKU ZOOM', ['REMAIN', 'obróć VALUE'], 'W ZOOM zmień skalę podglądu. Ten sam obrót w ekranie automatyki zmienia takt.'),
  control('piano', 'piano', 'OTWÓRZ / ZAMKNIJ PIANO ROLL', ['naciśnij VALUE'], 'Z siatki otwórz piano roll wybranej ścieżki. Ponowne naciśnięcie VALUE wraca do siatki.'),
  control('piano', 'piano-scroll', 'PRZEWIŃ PIANO ROLL', ['obróć VALUE'], 'W piano roll obróć VALUE, aby przesunąć widok w górę lub w dół.'),
  control('piano', 'piano-pitch', 'NADAJ NUCIE WYSOKOŚĆ', ['PAD kroku', 'PAD jako klawisz'], 'W piano roll trzymaj pad kroku i wybierz wysokość innym padem. PAD 5 daje oryginalny pitch sampla.'),
  control('piano', 'piano-track', 'INNA ŚCIEŻKA W PIANO ROLL', ['SHIFT', 'obróć VALUE'], 'W piano roll zmień ścieżkę. W siatce ta kombinacja służy do zmiany taktu.'),
  control('recording', 'rehearse', 'PRÓBA → NAGRYWANIE', ['REC'], 'Pierwsze REC włącza REHEARSAL: pady grają bez zapisu. Drugie REC nagrywa; EXIT kończy nagrywanie.'),
  control('recording', 'rec-mode', 'SINGLE / MULTI / CHROMATIC', ['SHIFT', 'REC'], 'Podczas próby lub nagrywania przełącz tryb. Alternatywnie użyj panelu patternu: RECORD SETTING dwa razy → REC.'),
  control('recording', 'new-notes', 'USTAWIENIA NOWYCH NUT', ['SHIFT', 'PATTERN EDIT'], 'Ustaw quantise, swing, velocity i długość dla nowych nut. PATTERN EDIT bez SHIFT służy do obróbki już istniejących nut.'),
  control('recording', 'hold', 'GRAJ SAMPLE ZAMIAST KROKÓW', ['HOLD'], 'Przełącz pady z edycji kroków na granie sampli. Drugie HOLD przywraca kroki.'),
  control('recording', 'fixed', 'FIXED VELOCITY', ['SHIFT', 'PAD 1'], 'Włącz albo wyłącz stałe velocity podczas grania.'),
  control('recording', 'metronome', 'METRONOM', ['SHIFT', 'PAD 9'], 'Przełącz tryb metronomu. Quickstart opisuje ON (próba i nagrywanie), RECPLAY (odtwarzanie patternu) oraz OFF. Sprawdź bieżący tryb na ekranie; changelog 0.6.1 inaczej opisuje kolejność przełączania.'),
  control('recording', 'input', 'EXT SOURCE', ['EXT SOURCE'], 'Przełącz wejścia zewnętrzne, aby słyszeć line in, mikrofon lub USB audio.'),
  ...(['QUANT', 'SWING', 'SHIFT', 'DOUBLE', 'HALVE', 'REVERSE', 'HUMAN', 'TRANSP'] as const).map((tool, index) => control('tools', `tool-${tool.toLowerCase()}`, tool, ['PATTERN EDIT'], [
    'Wyrównaj istniejące nuty do wybranej siatki.', 'Nadaj istniejącym nutom swing. W SWING trzymaj SHIFT i obróć VALUE, aby przełączyć podstawę na ósemki.',
    'Przesuń wszystkie nuty o całe kroki.', 'Podwój pattern.', 'Skróć pattern o połowę.', 'Odwróć kolejność patternu.',
    'Dodaj humanizację.', 'Transponuj nuty.',
  ][index] + ' Wybierz narzędzie i ustawienie przez VALUE; naciśnij, aby zastosować. EXIT anuluje.', [tool])),
  control('tools', 'tool-track', 'NARZĘDZIE TYLKO DLA ŚCIEŻKI', ['PATTERN EDIT', 'PAD ścieżki'], 'W menu narzędzi wybierz pad ścieżki, aby ograniczyć obróbkę do niej.'),
  control('mixer', 'mixer', 'OTWÓRZ MIKSER', ['RECORD SETTING'], 'W panelu ścieżki obróć VALUE do MIXER i naciśnij. W mikserze VALUE wybiera ścieżkę, EXIT wraca do siatki.', ['MIXER']),
  control('mixer', 'mix-knobs', 'PAN / BUS / LEVEL', ['CTRL 1 / 2 / 3'], 'W mikserze: CTRL 1 = panorama, CTRL 2 = B1 / B2 / DRY, CTRL 3 = poziom. SHIFT + naciśnięcie VALUE wycisza; SHIFT + ROLL włącza solo.'),
  control('mixer', 'mix-value', 'DOKŁADNA EDYCJA MIKSERA', ['VALUE'], 'Naciśnięcia VALUE wybierają pan, bus lub level; następnie obrót zmienia wybraną wartość małymi krokami.'),
  control('mixer', 'mix-view', 'WIDOK POZIOMÓW', ['SHIFT', 'RECORD SETTING'], 'W mikserze przełącz poziomy wyświetlane jako strzałki lub dither.'),
  control('effects', 'fx', 'WŁĄCZ / WYŁĄCZ EFEKT', ['przycisk FX'], 'Naciśnij przycisk wybranego efektu, np. FILTER+DRIVE lub MFX.'),
  control('effects', 'fx-parameters', 'PARAMETRY EFEKTU', ['CTRL 1 / 2 / 3'], 'Na otwartej stronie FX pokrętła zmieniają parametry efektu. Przytrzymaj VALUE dla drugiej strony parametrów; EXIT zamyka stronę FX.'),
  control('effects', 'mfx-1', 'MFX 1–16', ['MFX', 'PAD 1–16'], 'Przytrzymaj MFX i wybierz efekt padem.'),
  control('effects', 'mfx-2', 'MFX 17–32', ['MFX', 'DJFX LOOPER', 'PAD 1–16'], 'Przytrzymaj MFX i DJFX LOOPER, potem wybierz efekt padem.'),
  control('effects', 'mfx-3', 'MFX 33–48', ['MFX', 'ISOLATOR', 'PAD 1–16'], 'Przytrzymaj MFX i ISOLATOR, potem wybierz efekt padem.'),
  control('effects', 'bus', 'WYBIERZ BUS FX', ['BUS FX'], 'Przełącz bus, którego efekty edytujesz.'),
  control('automation', 'record-fx', 'NAGRAJ RUCHY FX', ['REC ×2'], 'Otwórz stronę efektu, naciśnij REC raz dla próby i ponownie dla zapisu. Obracaj CTRL 1–3. EXIT kończy nagrywanie. W ustawieniach DOOM OS sposób zapisu może zastępować lub łączyć wcześniejsze ruchy.'),
  control('automation', 'automation', 'EKRAN AUTOMATYKI', ['SHIFT', 'MARK'], 'Otwórz lub zamknij ekran automatyki efektów patternu.'),
  control('automation', 'parameter', 'WYBIERZ PARAMETR / EFEKT', ['obróć VALUE'], 'W ekranie automatyki VALUE wybiera parametr. SHIFT + obrót VALUE przechodzi do kolejnego efektu; naciśnięcie VALUE otwiera edycję kroków parametru.'),
  control('automation', 'auto-step', 'WARTOŚĆ PARAMETRU NA KROKU', ['PAD kroku', 'obróć VALUE'], 'W edycji parametru trzymaj pad kroku i obróć VALUE, aby zmienić wartość automatyki.'),
  control('automation', 'auto-delete', 'USUŃ RUCH NA KROKU', ['DEL', 'PAD kroku'], 'Usuń automatykę z wybranego kroku parametru.'),
  control('automation', 'auto-clear', 'WYCZYŚĆ AUTOMATYKĘ PARAMETRU', ['DEL', 'naciśnij VALUE'], 'Usuń wszystkie zapisane ruchy wybranego parametru.'),
  control('automation', 'auto-copy', 'KOPIUJ / WKLEJ PARAMETR', ['COPY', 'naciśnij VALUE'], 'Skopiuj lub wklej automatykę wybranego parametru.'),
  control('automation', 'auto-play', 'ODTWARZANIE AUTOMATYKI ON / OFF', ['START/END'], 'W ekranie automatyki przełącz odtwarzanie zapisanych ruchów.'),
  control('automation', 'auto-bar', 'TAKT AUTOMATYKI', ['REMAIN', 'obróć VALUE'], 'W ekranie automatyki przejdź do poprzedniego lub następnego taktu.'),
  control('settings', 'settings', 'USTAWIENIA DOOM OS', ['SHIFT', 'PAD 13'], 'Otwórz SYSTEM i zakładkę DOOM OS.', ['SYSTEM', 'DOOM OS']),
  control('settings', 'custom', 'WŁASNE SKRÓTY', ['SHIFT', 'PAD 13'], 'W zakładce SHORTCUT skonfiguruj własne kombinacje otwierające ekrany SP lub DOOM OS.', ['SYSTEM', 'SHORTCUT']),
  control('settings', 'utility', 'UTILITY', ['REMAIN', 'PATTERN EDIT'], 'Otwórz menu UTILITY.'),
  control('settings', 'stock', 'STOCKOWY EKRAN PATTERNU', ['REMAIN', 'RECORD SETTING'], 'Przejdź z DOOM OS do oryginalnego ekranu patternu SP.'),
]

const step = (id: string, title: string, action: string, expectedResult: string, buttons: string[], commonMistake?: string): WorkflowStep =>
  ({ id, title, action, expectedResult, buttons, commonMistake, source: doomSource, kind: 'verified' })

export const doomWorkflows: Workflow[] = [
  {
    id: 'doom-first-pattern', environment: 'doom', title: 'DOOM OS · PIERWSZY PATTERN', category: 'DOOM OS', difficulty: 'easy', minutes: 5,
    blurb: 'Od pustego patternu do grającej siatki kroków.',
    startingState: 'DOOM OS jest zainstalowany. Przygotuj pusty pad patternu i bank z samplami. Te przyciski dotyczą edytora DOOM OS.',
    outcome: 'Pattern gra i zachowuje kroki po ponownym otwarciu.',
    ending: {
      check: 'Otwórz ponownie pattern i sprawdź, czy słychać zapisane kroki.',
      tryIt: 'Zmień velocity jednej nuty i zapisz, jeśli chcesz zachować nowy akcent.',
      hintStepIds: ['note', 'save'],
      next: {
        kind: 'workflow',
        id: 'doom-live-record',
        label: 'DOGRAJ PARTIĘ',
        preparation: 'Otwórz zapisany pattern w DOOM OS.',
      },
    },
    steps: [
      step('open', 'WEJDŹ DO EDYTORA', 'Trzymaj REMAIN i naciśnij SUB PAD.', 'Widzisz graficzny edytor DOOM OS.', ['REMAIN', 'SUB PAD']),
      step('new', 'WYBIERZ PUSTY PATTERN', 'Trzymaj PATTERN SELECT i naciśnij pusty pad patternu.', 'Widzisz nowy pattern.', ['PATTERN SELECT', 'PAD 1–16']),
      step('sound', 'WYBIERZ PIERWSZY SAMPLE', 'Trzymaj SUB PAD, odsłuchaj pady i zwolnij SUB PAD po wybraniu dźwięku.', 'W siatce pojawia się ścieżka wybranego sampla.', ['SUB PAD', 'PAD 1–16']),
      step('steps', 'WSTAW KROKI', 'Stuknij pady odpowiadające miejscom, w których ma zagrać sample.', 'Wybrane kroki są zaznaczone w wierszu ścieżki.', ['PAD 1–16']),
      step('play', 'URUCHOM PATTERN', 'Naciśnij PATTERN SELECT i posłuchaj frazy.', 'Pozycja odtwarzania przesuwa się, a sample gra na wybranych krokach.', ['PATTERN SELECT']),
      step('note', 'ZMIEŃ JEDNĄ NUTĘ', 'Trzymaj pad jednego kroku i obróć CTRL 1, aby zmienić velocity.', 'Zmienia się velocity wybranej nuty.', ['PAD kroku', 'CTRL 1'], 'Bez trzymania pada CTRL 1 ustawia tę samą wartość wszystkim nutom ścieżki.'),
      step('save', 'ZAPISZ I WYJDŹ', 'Naciśnij PATTERN SELECT, aby zatrzymać. Na głównej siatce naciśnij EXIT, aby zamknąć edytor i zapisać.', 'DOOM OS zamyka się. Po ponownym wejściu pattern zachowuje Twoje kroki.', ['EXIT']),
    ],
  },
  {
    id: 'doom-live-record', environment: 'doom', title: 'DOOM OS · PRÓBA → NAGRANIE', category: 'DOOM OS', difficulty: 'easy', minutes: 4,
    blurb: 'Przećwicz partię, potem nagraj ją do patternu.',
    startingState: 'Otwarty pattern w DOOM OS i wybrane sample. Możesz użyć patternu z poprzedniej ścieżki.',
    outcome: 'Zagrana partia znajduje się w patternie.',
    ending: {
      check: 'Odsłuchaj pattern bez dogrywania: czy Twoja partia jest na swoim miejscu?',
      tryIt: 'W trybie próby zagraj tę samą partię z innym akcentem.',
      hintStepIds: ['rehearse', 'stop'],
      next: {
        kind: 'kit',
        tab: 'song',
        label: 'ZAPLANUJ DALSZĄ FORMĘ',
      },
    },
    steps: [
      step('pads', 'PRZEŁĄCZ PADY NA GRANIE', 'Naciśnij HOLD, jeśli pady nadal edytują kroki.', 'Pady odtwarzają sample.', ['HOLD']),
      step('rehearse', 'PRZEĆWICZ PARTIĘ', 'Naciśnij REC raz i zagraj frazę.', 'Ekran pokazuje REHEARSAL; partia jeszcze się nie zapisuje.', ['REC']),
      step('mode', 'WYBIERZ TRYB', 'Podczas próby użyj SHIFT + REC, aby wybrać SINGLE, MULTI lub CHROMATIC odpowiednio do partii.', 'Ekran pokazuje wybrany tryb nagrywania.', ['SHIFT', 'REC']),
      step('record', 'NAGRAJ PARTIĘ', 'Naciśnij REC ponownie i zagraj przygotowaną frazę.', 'Nagrywanie zapisuje grane nuty do patternu.', ['REC']),
      step('stop', 'ZAKOŃCZ I ODSŁUCHAJ', 'Naciśnij EXIT, aby zakończyć nagrywanie. Sprawdź kroki w siatce i odsłuchaj pattern przez PATTERN SELECT.', 'Nagrywanie jest zakończone, a pattern zawiera zagrane nuty.', ['EXIT']),
    ],
  },
  {
    id: 'doom-fx-automation', environment: 'doom', title: 'DOOM OS · NAGRAJ RUCHY FX', category: 'DOOM OS', difficulty: 'medium', minutes: 5,
    blurb: 'Zapisz ruch pokrętła i popraw go na wybranym kroku.',
    startingState: 'Otwarty pattern w DOOM OS, słyszalny sample skierowany na bus z efektem. Ustawienia zapisu automatyki mogą zastąpić wcześniejsze ruchy.',
    outcome: 'Pattern odtwarza nagrane ruchy efektu.',
    ending: {
      check: 'Posłuchaj dwóch obiegów: czy ruch efektu wraca w tym samym miejscu?',
      tryIt: 'Porównaj frazę z automatyką i bez niej; wybierz wersję do dalszej pracy.',
      hintStepIds: ['edit'],
      next: {
        kind: 'kit',
        tab: 'ab',
        label: 'ZANOTUJ PORÓWNANIE A/B',
      },
    },
    steps: [
      step('fx', 'OTWÓRZ STRONĘ EFEKTU', 'Wybierz bus przez BUS FX i otwórz stronę wybranego efektu jego przyciskiem.', 'Widzisz parametry efektu i słyszysz jego działanie.', ['BUS FX']),
      step('arm', 'PRZEJDŹ Z PRÓBY DO ZAPISU', 'Na stronie efektu naciśnij REC raz dla próby, a drugi raz dla nagrywania.', 'Nagrywanie jest aktywne na stronie efektu.', ['REC ×2']),
      step('move', 'NAGRAJ RUCH', 'Podczas grania patternu obróć CTRL 1, 2 lub 3, zmieniając parametr efektu.', 'Słyszysz zmianę efektu w trakcie nagrywania.', ['CTRL 1 / 2 / 3']),
      step('stop', 'ZAKOŃCZ NAGRYWANIE', 'Naciśnij EXIT, aby zakończyć zapis. Zamknij stronę efektu, jeśli nadal jest otwarta.', 'Nagrywanie już nie jest aktywne.', ['EXIT']),
      step('matrix', 'SPRAWDŹ AUTOMATYKĘ', 'Naciśnij SHIFT + MARK, wybierz parametr obrotem VALUE i naciśnij VALUE.', 'Widzisz zapisane ruchy wybranego parametru w krokach.', ['SHIFT', 'MARK']),
      step('edit', 'POPRAW WYBRANY KROK', 'Trzymaj pad kroku i obróć VALUE. START/END w ekranie automatyki włącza lub wyłącza odtwarzanie ruchów; pozostaw je włączone i odsłuchaj pattern.', 'Wartość kroku zmienia się, a podczas odsłuchu słychać zapisaną automatykę.', ['PAD kroku', 'obróć VALUE']),
    ],
  },
]
