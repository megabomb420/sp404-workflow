import type { Firmware, KitItem } from '../state/model'

export type BeatCopy = readonly [string, string]
export const beatReasons = [
  { id: 'start', label: ['Nie wiem, od czego zacząć', 'I don’t know where to start'] },
  { id: 'loop', label: ['Mam loop, ale co dalej?', 'I have a loop. What next?'] },
  { id: 'flat', label: ['Beat jest nudny', 'My beat feels flat'] },
  { id: 'details', label: ['Ciągle poprawiam detale', 'I keep tweaking details'] },
] as const
export type BeatReason = typeof beatReasons[number]['id']
export interface BeatStep { copy: BeatCopy; doomCopy?: BeatCopy; help: Record<Firmware, string> }
export interface BeatChallenge {
  id: string; reason: BeatReason; title: BeatCopy; goal: BeatCopy; constraint: BeatCopy; minutes: number
  steps: BeatStep[]; kitItem: Record<Firmware, KitItem>
}
const step = (pl: string, en: string, roland: string, doom: string, doomCopy?: BeatCopy): BeatStep => ({ copy: [pl, en], help: { roland, doom }, doomCopy })
const pattern = ['/section/pattern', '/workflow/doom-first-pattern'] as const
const live = ['/section/pattern', '/workflow/doom-live-record'] as const
const edit = ['/section/edit', '/doom-os?view=controls&topic=notes'] as const
const mix = ['/section/effects', '/screen?id=mixer'] as const
const fx = ['/section/effects', '/screen?id=doom-fx'] as const
const basicKit: Record<Firmware, KitItem> = { roland: { kind: 'workflows', id: 'make-drums' }, doom: { kind: 'workflows', id: 'doom-first-pattern' } }
const liveKit: Record<Firmware, KitItem> = { roland: { kind: 'workflows', id: 'loop-to-pattern' }, doom: { kind: 'workflows', id: 'doom-live-record' } }
const fxKit: Record<Firmware, KitItem> = { roland: { kind: 'workflows', id: 'resample-with-fx' }, doom: { kind: 'workflows', id: 'doom-fx-automation' } }

// Creative prompts, with links to the documented procedures already in the app.
// These are listening decisions for the player, not automatic changes to their SP.
export const beatChallenges: BeatChallenge[] = [
  { id: 'three-sounds', reason: 'start', title: ['Tylko trzy dźwięki', 'Only three sounds'], minutes: 8,
    goal: ['Krótka fraza ze stopy, werbla i jednego fragmentu sampla.', 'A short phrase using a kick, a snare and one sample fragment.'],
    constraint: ['Trzy brzmienia. Jeden pattern. Bez szukania kolejnych sampli.', 'Three sounds. One pattern. No hunting for more samples.'], kitItem: basicKit,
    steps: [
      step('Wybierz stopę, werbel i jeden fragment z obecnego banku.', 'Choose a kick, a snare and one fragment from your current bank.', ...pattern, ['Wybierz trzy sample jako ścieżki w DOOM OS.', 'Choose three samples as tracks in DOOM OS.']),
      step('Ułóż prosty rytm i dodaj fragment w jednym lub dwóch miejscach.', 'Build a simple rhythm and place the fragment once or twice.', ...pattern),
      step('Odsłuchaj całą frazę i wybierz moment, który chcesz rozwinąć.', 'Listen to the whole phrase and choose a moment to develop.', ...live),
    ] },
  { id: 'one-sample', reason: 'start', title: ['Jeden sample, dwie role', 'One sample, two roles'], minutes: 7,
    goal: ['Dwa kontrastujące dźwięki z jednego sampla tworzą prostą frazę.', 'Two contrasting sounds from one sample make a simple phrase.'],
    constraint: ['Jedno źródło. Zachowaj oryginał i pracuj na kopii.', 'One source. Keep the original and work on a copy.'], kitItem: liveKit,
    steps: [
      step('Wybierz krótki sample i przygotuj kopię do edycji.', 'Choose a short sample and prepare a copy to edit.', '/section/edit', '/section/edit', ['Po wyjściu z edytora DOOM przygotuj oryginał i kopię na padach SP.', 'After leaving the DOOM editor, prepare the original and a copy on the SP pads.']),
      step('Nadaj kopii wyraźnie inną wysokość lub długość; porównaj oba brzmienia.', 'Give the copy a clearly different pitch or length; compare both sounds.', '/section/edit', '/section/edit'),
      step('Nagraj krótką odpowiedź jednego brzmienia na drugie.', 'Record a short call and response between the sounds.', ...live),
    ] },
  { id: 'play-first', reason: 'start', title: ['Najpierw zagraj', 'Play first'], minutes: 5,
    goal: ['Jedno spontaniczne nagranie padów, które zachowasz jako szkic.', 'One spontaneous pad performance to keep as a sketch.'],
    constraint: ['Jedno podejście. Zostaw drobne niedoskonałości.', 'One take. Keep the small imperfections.'], kitItem: liveKit,
    steps: [
      step('Wybierz dwa lub trzy pady i przećwicz krótką partię.', 'Choose two or three pads and rehearse a short passage.', ...live, ['W DOOM OS wybierz sample i przejdź do próby grania.', 'In DOOM OS, choose samples and enter playing rehearsal.']),
      step('Nagraj jedno podejście do pustego patternu.', 'Record one take into an empty pattern.', ...live),
      step('Odsłuchaj nagranie bez poprawiania nut. Wskaż jego najmocniejszy moment.', 'Listen without editing the notes. Pick its strongest moment.', ...pattern),
    ] },
  { id: 'change-pulse', reason: 'loop', title: ['Zmień puls', 'Change the pulse'], minutes: 8,
    goal: ['Znany loop z nowym rytmem wejść.', 'A familiar loop with a new rhythm of entries.'],
    constraint: ['Te same dźwięki. Zmieniasz tylko miejsca ich wejścia.', 'The same sounds. Change only where they enter.'], kitItem: liveKit,
    steps: [
      step('Wybierz dwa lub trzy fragmenty loopa; zachowaj pełny oryginał.', 'Choose two or three loop fragments; keep the full original.', '/workflow/chop-a-loop', '/workflow/chop-a-loop', ['Po wyjściu z DOOM przygotuj fragmenty na padach SP, potem wróć do edytora.', 'After leaving DOOM, prepare the fragments on SP pads, then return to the editor.']),
      step('Ułóż inną kolejność lub pozostaw przerwę w miejscu oczywistego wejścia.', 'Reorder the fragments or leave a gap where an entry feels obvious.', ...pattern),
      step('Odsłuchaj nową frazę obok oryginału i wybierz ciekawsze wejście.', 'Listen beside the original and choose the more interesting entry.', ...live),
    ] },
  { id: 'call-response', reason: 'loop', title: ['Pytanie i odpowiedź', 'Call and response'], minutes: 7,
    goal: ['Dwie krótkie frazy, które odpowiadają sobie nawzajem.', 'Two short phrases that answer each other.'],
    constraint: ['Jeden motyw i jedna odpowiedź. Resztę miejsca zostaw pustą.', 'One motif and one answer. Leave the remaining space empty.'], kitItem: liveKit,
    steps: [
      step('Wybierz krótki motyw z loopa i zostaw po nim przerwę.', 'Choose a short loop motif and leave a gap after it.', ...pattern),
      step('W przerwie dodaj inną kolejność fragmentów albo zmianę wysokości.', 'In the gap, add reordered fragments or a pitch change.', ...edit),
      step('Odsłuchaj całość. Skróć odpowiedź, jeśli zasłania pierwszy motyw.', 'Listen to the whole phrase. Shorten the answer if it obscures the first motif.', ...live),
    ] },
  { id: 'print-texture', reason: 'loop', title: ['Zamroź teksturę', 'Print a texture'], minutes: 10,
    goal: ['Nowy sample z jednego krótkiego przejścia z efektem.', 'A new sample made from one short effect transition.'],
    constraint: ['Jeden efekt i jeden ruch. Zachowaj źródło; nagraj na pusty pad.', 'One effect and one movement. Keep the source; record to an empty pad.'], kitItem: fxKit,
    steps: [
      step('Wybierz efekt na loopie i przećwicz jeden krótki ruch parametru.', 'Choose an effect on the loop and rehearse one short parameter movement.', ...fx),
      step('Nagraj przejście przez resampling na pusty pad.', 'Resample the transition to an empty pad.', '/workflow/resample-with-fx', '/workflow/resample-with-fx', ['Zakończ edycję w DOOM, zapisz pattern i przejdź do resamplingu na padach SP.', 'Finish editing in DOOM, save the pattern and move to resampling on the SP pads.']),
      step('Porównaj nowy sample ze źródłem. Zaznacz fragment do kolejnego szkicu.', 'Compare the new sample with the source. Pick a fragment for your next sketch.', '/section/edit', '/section/edit'),
    ] },
  { id: 'make-space', reason: 'flat', title: ['Zrób miejsce', 'Make space'], minutes: 5,
    goal: ['Rytm z wyraźniejszym głównym motywem.', 'A rhythm with a clearer main motif.'],
    constraint: ['Wycisz jedną warstwę. Przez całą próbę nie dodawaj nowej.', 'Mute one layer. Add no new layers during this attempt.'], kitItem: basicKit,
    steps: [
      step('Posłuchaj wszystkich warstw i wybierz jedną, która zasłania motyw.', 'Listen to all layers and choose one that obscures the motif.', ...mix),
      step('Wycisz tę warstwę i odtwórz frazę kilka razy.', 'Mute that layer and play the phrase a few times.', '/shortcuts?id=pad-mute', '/doom-os?id=doom-mute'),
      step('Porównaj oba warianty. Zapisz, co stało się wyraźniejsze.', 'Compare both versions. Note what became clearer.', ...mix),
    ] },
  { id: 'one-note', reason: 'flat', title: ['Jedna nuta robi różnicę', 'One note makes a difference'], minutes: 6,
    goal: ['Fraza z jednym świadomie zmienionym akcentem.', 'A phrase with one deliberately changed accent.'],
    constraint: ['Wybierz jedną nutę. Zmień tylko velocity, długość albo timing.', 'Choose one note. Change only velocity, length or timing.'], kitItem: basicKit,
    steps: [
      step('Wybierz uderzenie, które mogłoby lepiej prowadzić rytm.', 'Choose a hit that could guide the rhythm better.', ...pattern),
      step('W TR-REC wyłącz wybrany krok, ustaw jeden parametr i wstaw tę nutę ponownie. Odsłuchaj zmianę.', 'In TR-REC, turn off the selected step, set one parameter and reinsert that note. Listen to the change.', '/screen?id=tr-steps', '/doom-os?id=doom-select-note', ['Trzymaj pad wybranego kroku podczas zmiany parametru jednej nuty.', 'Hold the selected step pad while changing a single note’s parameter.']),
      step('Porównaj z pierwotnym akcentem. Zostaw wersję, którą wolisz.', 'Compare with the original accent. Keep the version you prefer.', ...edit),
    ] },
  { id: 'two-states', reason: 'flat', title: ['Dwa stany beatu', 'Two states of the beat'], minutes: 8,
    goal: ['Pełna fraza i jej oszczędna odpowiedź.', 'A full phrase and a sparse response.'],
    constraint: ['Dwa warianty. Różnią się tylko obecnością jednej warstwy.', 'Two versions. Differ only by the presence of one layer.'], kitItem: basicKit,
    steps: [
      step('Odtwórz pełny pattern i wskaż warstwę, która może zniknąć.', 'Play the full pattern and identify one layer you could leave out.', ...pattern),
      step('Przećwicz przejście między pełną wersją i wersją z wyciszeniem.', 'Rehearse switching between the full version and the muted version.', '/shortcuts?id=pad-mute', '/doom-os?id=doom-mute'),
      step('Wybierz miejsce przejścia i zapisz je jako plan aranżacji.', 'Choose where to switch and note it as an arrangement idea.', ...mix),
    ] },
  { id: 'commit-take', reason: 'details', title: ['Zachowaj to podejście', 'Keep this take'], minutes: 5,
    goal: ['Jedna zapisana wersja frazy i konkretny następny krok.', 'One saved version of the phrase and a concrete next step.'],
    constraint: ['Odsłuch bez edycji. Wybierz jedną rzecz do rozwinięcia później.', 'Listen without editing. Choose one thing to develop later.'], kitItem: basicKit,
    steps: [
      step('Odtwórz obecną frazę od początku do końca.', 'Play your current phrase from beginning to end.', ...pattern),
      step('Zakończ zapis i zachowaj tę wersję na SP.', 'Finish recording and keep this version on the SP.', '/section/pattern', '/doom-os?id=doom-save'),
      step('Zapisz bank/pad oraz jedną rzecz, od której zaczniesz następnym razem.', 'Note the bank/pad and one thing to start with next time.', ...live),
    ] },
  { id: 'one-move', reason: 'details', title: ['Jeden ruch wystarczy', 'One movement is enough'], minutes: 7,
    goal: ['Jeden prosty ruch efektu pasujący do frazy.', 'One simple effect movement that fits the phrase.'],
    constraint: ['Jeden efekt, jeden parametr. Pozostałych ustawień nie zmieniaj.', 'One effect, one parameter. Leave other settings alone.'], kitItem: fxKit,
    steps: [
      step('Wybierz jeden słyszalny efekt i parametr, który zmienia charakter frazy.', 'Choose one audible effect and a parameter that changes the phrase’s character.', ...fx),
      step('Przećwicz jeden ruch, potem zapisz go w patternie.', 'Rehearse one movement, then record it in the pattern.', '/compare?goal=fx', '/workflow/doom-fx-automation'),
      step('Odsłuchaj bez dalszych poprawek. Wskaż miejsce, w którym ruch działa najlepiej.', 'Listen without more edits. Pick where the movement works best.', ...fx),
    ] },
  { id: 'finish-phrase', reason: 'details', title: ['Domknij frazę', 'Finish the phrase'], minutes: 10,
    goal: ['Krótka fraza z początkiem, środkiem i zakończeniem.', 'A short phrase with a beginning, middle and ending.'],
    constraint: ['Użyj gotowych brzmień. Zmieniaj tylko wejścia i przerwy.', 'Use your existing sounds. Change only entries and gaps.'], kitItem: basicKit,
    steps: [
      step('Zacznij od prostszego wejścia, potem wprowadź pełny motyw.', 'Begin with a simpler entry, then introduce the full motif.', ...pattern),
      step('Przećwicz krótkie zakończenie przez odjęcie jednej warstwy.', 'Rehearse a short ending by leaving out one layer.', '/shortcuts?id=pad-mute', '/doom-os?id=doom-mute'),
      step('Odsłuchaj całość i zapisz kolejność wejść w notatce do szkicu.', 'Listen to the whole phrase and note the order of entries for your sketch.', ...live),
    ] },
]

export function pickBeatChallenge(reason: BeatReason, recent: string[], current?: string | null, random = Math.random): BeatChallenge {
  const pool = beatChallenges.filter(item => item.reason === reason && item.id !== current)
  const fresh = pool.filter(item => !recent.includes(item.id))
  // If this group is exhausted, offer its least recently seen prompt.
  const choices = fresh.length ? fresh : pool.filter(item => recent.indexOf(item.id) === Math.max(...pool.map(entry => recent.indexOf(entry.id))))
  return choices[Math.min(choices.length - 1, Math.max(0, Math.floor(random() * choices.length)))]
}
