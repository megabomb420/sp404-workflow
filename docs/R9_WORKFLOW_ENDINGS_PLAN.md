# R9 — płynne zakończenia instrukcji

Status: **specyfikacja zrealizowana w R9, 10.10.2026**. Przeszło 92 testy jednostkowe i pełne sprawdzenia aplikacji, w tym wszystkie zakończenia PL/EN, widoki mobilne i offline. Przegląd źródeł zapisano w `docs/R9_SOURCE_REVIEW.md`.

Data planu: 10.10.2026. Projekt: SP Workflow.
Baza sprawdzona lokalnie: R8, commit `ceeb6fe8d39dac065e9058a50b8deb2212bfa56a`, gałąź `codex/doom-workflow-upgrades`.

## 1. Zadanie i decyzja produktowa

Użytkownik dobrze pracuje z aplikacją przy SP, ale odczuwa nagłe zakończenie tutorialu i nie jest pewien, czy prowadzenie kończy się w odpowiednim momencie. Chce zaplanować poprawkę i pozostawić wdrożenie innemu modelowi.

R9 dopracowuje przejście od instrukcji do samodzielnego grania. Po zakończeniu użytkownik ma wiedzieć:

1. Co właśnie uzyskał na SP i czego posłuchać.
2. Jak wypróbować tę umiejętność samodzielnie.
3. Jaki jeden dalszy ruch pasuje do obecnego rezultatu albo jak zakończyć sesję.

Zakres obejmuje wszystkie **16 istniejących workflow: 13 Roland i 3 DOOM**. Użytkownik nie wskazał konkretnej ścieżki, więc wspólny ekran zakończenia dostaje treść dopasowaną do każdej z nich. Krótkie wprowadzenie `/onboarding` i rozdziały `/section/*` pozostają poza przebudową.

Zmiany mają pozostać małe: obecny ekran końcowy, istniejące instrukcje i narzędzia, obecne MY KIT. Zachować układ NOW z R8, stale rozwinięte 16 padów, stylistykę samplera, PL/EN oraz działanie offline. W R9 nie powstają nowe tryby, rozbudowana ścieżka kursowa, poziomy, odznaki, obowiązkowe oceny ani automatyczne odtwarzanie mediów.

## 2. Co potwierdzono w kodzie

- `src/components/content/WorkflowPlayer.tsx`: po zakończeniu wyświetla `workflow.outcome` albo ogólny tekst, informację o lokalnym postępie i przyciski „OD NOWA” / „NOW”. Nie proponuje działania wynikającego z rezultatu.
- Zakończenie obecnie wymaga `workflowStep >= steps.length` i potwierdzenia wszystkich kroków. `COMPLETE_WORKFLOW` zapisuje ukończenie i zwalnia wskaźnik aktywnej instrukcji.
- `src/data/workflows.ts`: w `8-bar-pattern` ostatni krok `bounce-optional` ma tytuł „BOUNCE (OPCJA)”, ale model danych i odtwarzacz nie obsługują opcjonalności. Bez potwierdzenia aplikacja cofa do tego kroku.
- Nowe odsłuchy i samodzielne próby nie powinny zwiększać licznika kroków ani opóźniać zapisu ukończenia.
- `src/pages/KitPage.tsx`: wybór istniejącego zestawu zachowuje `tab`, lecz utworzenie nowego wykonuje `setParams({ set: id })` i gubi ten parametr.
- `src/components/content/KitStudio.tsx`: obsługuje `tab=next`, `tab=song`, `tab=ab`; notatka następnego kroku zapisuje się lokalnie na bieżąco. „POKAŻ NA NOW” przypina szkic, a „OZNACZ GOTOWY” kończy szkic — to osobne działania.
- Roland korzysta z `src/i18n/en/workflows.ts` i `localizeWorkflow`; DOOM korzysta z rekurencyjnego `localizeCompanion` i słownika w `src/i18n/companion.ts`. Trzeba uwzględnić obie ścieżki tłumaczenia.
- Zapis `spw.state.v1`, kopie zapasowe i obecna struktura MY KIT wystarczają do tej zmiany. Nie planować migracji danych ani nowego trwałego stanu ćwiczeń.

## 3. Ekran zakończenia

Na istniejącym adresie `/workflow/:id`, po potwierdzeniu wymaganych kroków, wyświetlić jedną kartę w tej kolejności:

1. **CEL OSIĄGNIĘTY / GOAL REACHED** i jednozdaniowy, konkretny rezultat.
2. **SPRAWDŹ / CHECK** — jedno krótkie polecenie odsłuchowe.
3. **SPRÓBUJ SAM · OPCJONALNIE / TRY IT YOURSELF · OPTIONAL** — jedna niewielka próba związana z tą instrukcją. Jest widoczna od razu; nie wymaga zatwierdzania.
4. Zwijana **PODPOWIEDŹ / HINT**, domyślnie zamknięta. Pokazuje odpowiednie istniejące kroki z przyciskami i źródłem, bez cofania ukończenia lub zmiany kursora instrukcji.
5. Jeden bursztynowy przycisk proponowanego dalszego działania. Jeśli potrzebne jest przygotowanie na sprzęcie, nad nim jedno krótkie zdanie z warunkiem wejścia.
6. Neutralne działania **ZANOTUJ NASTĘPNY KROK / NOTE YOUR NEXT STEP** oraz **NA DZIŚ KONIEC / DONE FOR TODAY**.
7. Dyskretne **POWTÓRZ INSTRUKCJĘ / REPEAT THE GUIDE** i obecna informacja o zapisie postępu.

Jeśli główny przycisk już prowadzi do `MY KIT → next`, pominąć powtarzający się link „Zanotuj następny krok”.

### Zachowanie

- „Na dziś koniec” wraca do NOW. Nie oznacza szkicu jako gotowego, nie resetuje BEAT BLOCK, nie tworzy notatki i nie uruchamia kolejnej instrukcji.
- „Zanotuj następny krok” otwiera obecne MY KIT przy `tab=next`, zgodnie z regułami w części 7. Użytkownik wpisuje własny tekst; aplikacja nie zastępuje jego wcześniejszej notatki propozycją.
- „Powtórz instrukcję” świadomie uruchamia istniejący `RESET_WORKFLOW` tylko dla bieżącej instrukcji. Nie resetuje sprzętu ani innych danych.
- Otwarcie podpowiedzi, zmiana języka, odświeżenie i użycie wstecz nie cofają ukończenia.
- Ćwiczenie jest propozycją twórczą. Nie dopisywać go do treningu MUSCLE MEMORY ani do `doneSteps`. Nie mierzyć jego zaliczenia i nie udawać odsłuchu SP przez aplikację.
- LCD pozostaje `DONE` na zakończeniu. NOW korzysta z istniejących reguł `READY` / `RESUME`.
- Jeśli w przyszłości workflow nie będzie miał opisu końcowego, zachować bezpieczne podsumowanie z obecnym `outcome` / fallback, link do notatki i powrót do NOW. Nie losować dalszej instrukcji.

### Wygląd

- Użyć obecnych powierzchni, kolorów i przycisków; bursztyn tylko na głównym dalszym działaniu.
- Teksty wyrównać do lewej. Ograniczyć dekoracyjny LED i pionowe odstępy obecnej `.wf-done`.
- Rezultat, odsłuch i próba: po jednym krótkim zdaniu. Dłuższe objaśnienia pozostają w podpowiedzi. Nie ucinać treści instrukcji CSS-em.
- Przy 390 × 844, zwykłym trybie i zgodnym firmware, główne działanie oraz „Na dziś koniec” mają być widoczne bez przewijania, przy zamkniętej podpowiedzi. Sprawdzić PL i EN dla wszystkich 16 zakończeń; skracać tekst zamiast zmniejszać czytelność.
- Przy 320 px oraz w trybie większych elementów dopuszczalne pionowe przewijanie; brak poziomego przewijania i zasłaniania elementów przez dolny dock.
- Interaktywne cele minimum 44 × 44 px, widoczny fokus, logiczna kolejność klawiatury, semantyczne nagłówki i natywne `details/summary`. Po zakończeniu przewinąć kontener główny na początek i przenieść fokus na nagłówek wyniku; nie powtarzać tego przy każdej aktualizacji stanu.

## 4. Treści dla wszystkich instrukcji

Poniższe teksty są copy do wdrożenia. Można je skrócić dla czytelności, zachowując sens i zgodność obu języków. Mechanika przycisków pochodzi z istniejących kroków i podlega sprawdzeniu źródeł z części 10. Nowe próby oznaczać jako wskazówki, nie jako testy wykonane na fizycznym SP.

### 4.1 Rezultat — `outcome`

Uzupełnić `outcome` w istniejących danych workflow; przechowywać rezultat w jednym miejscu. Dla już opisanych ścieżek można zachować obecne równoważne zdanie, jeśli mieści się w układzie.

| Workflow ID | Polski | English |
| --- | --- | --- |
| `source-to-pad` | Masz przycięty sample gotowy do grania na padzie. | Your trimmed sample is ready to play on a pad. |
| `pattern-to-print` | Masz nowy sample z patternu i wybranych efektów. | Your pattern and chosen effects are printed to a new sample. |
| `loop-to-pattern` | Masz nową frazę z chopów zapisaną w patternie. | Your new phrase made from chops is recorded in a pattern. |
| `build-a-beat` | Masz szkic beatu gotowy do odsłuchu i dalszych decyzji. | You have a beat sketch ready to listen to and develop. |
| `8-bar-pattern` | Masz grający pattern i przygotowaną drugą połowę. | Your pattern plays, with a second half prepared. |
| `sample-something` | Twoje nagranie jest na wybranym padzie. | Your recording is on the pad you selected. |
| `chop-a-loop` | Fragmenty loopa są rozłożone na pady. | Your loop slices are assigned to pads. |
| `make-drums` | Pattern odtwarza Twój zestaw perkusyjny. | The pattern plays your drum kit. |
| `resample-with-fx` | Masz nowy sample z nagranym przetwarzaniem. | You have a new sample with the processing recorded into it. |
| `add-sidechain` | Sidechain reaguje na wybrane źródło. | The sidechain responds to your chosen source. |
| `capture-skip-back` | Wybrany moment ze Skip Back jest na padzie. | The moment you chose from Skip Back is on a pad. |
| `build-variation` | Masz zmienioną drugą część patternu. | You have a variation in the second part of the pattern. |
| `final-bounce` | Wybrany pattern jest zapisany jako sample. | The selected pattern is saved as a sample. |
| `doom-first-pattern` | Pattern gra i zachowuje kroki po ponownym otwarciu. | The pattern plays and keeps its steps when reopened. |
| `doom-live-record` | Zagrana partia znajduje się w patternie. | The part you played is recorded in the pattern. |
| `doom-fx-automation` | Pattern odtwarza nagrane ruchy efektu. | The pattern plays back your recorded effect movements. |

### 4.2 Odsłuch i samodzielna próba

| Workflow ID | Sprawdź — PL / EN | Spróbuj sam — PL / EN |
| --- | --- | --- |
| `source-to-pad` | Zagraj pad kilka razy: czy początek i wybrzmienie są takie, jak chciałeś?<br>Play the pad a few times: do the start and tail sound as intended? | Zagraj z tego sampla krótką frazę z pauzami.<br>Play a short phrase with this sample, leaving gaps. |
| `pattern-to-print` | Odsłuchaj osobno pattern i nowy sample: sprawdź efekt, poziom i długość.<br>Listen to the pattern and new sample separately: check the effect, level and length. | Wybierz wersję, której chcesz użyć dalej, i nazwij jedną słyszalną różnicę.<br>Choose the version to use next and name one difference you hear. |
| `loop-to-pattern` | Posłuchaj dwóch obiegów patternu: czy chopy układają się w zamierzoną frazę?<br>Listen to two repeats: do the chops form the phrase you intended? | Zagraj trzy chopy w innej kolejności, bez nagrywania.<br>Play three chops in a different order without recording. |
| `build-a-beat` | Odsłuchaj przygotowany układ od początku do końca.<br>Listen through the arrangement you prepared. | Wybierz jedną rzecz do następnej sesji albo zdecyduj, że ta wersja już Ci odpowiada.<br>Choose one thing for the next session, or decide this version works for you. |
| `8-bar-pattern` | Posłuchaj przejścia między pierwszą a drugą połową patternu.<br>Listen to the transition between the two halves of the pattern. | Zagraj nad patternem inną końcówkę, bez zapisywania zmian.<br>Play a different ending over the pattern without recording changes. |
| `sample-something` | Zagraj pad: czy słychać cały fragment, który chciałeś nagrać?<br>Play the pad: can you hear the whole passage you wanted to capture? | Zagraj prostą frazę rytmiczną tym jednym samplem.<br>Play a simple rhythmic phrase with this one sample. |
| `chop-a-loop` | Odsłuchaj każdy chop: czy fragmenty zaczynają się w wybranych miejscach?<br>Audition each chop: does it start where you intended? | Zagraj nową frazę z trzech wybranych fragmentów.<br>Play a new phrase using three chosen slices. |
| `make-drums` | Posłuchaj patternu: czy słychać wszystkie uderzenia, które chciałeś zachować?<br>Listen to the pattern: can you hear every hit you intended to keep? | Zagraj ten rytm ręcznie, zostawiając jedną dodatkową pauzę.<br>Play the rhythm by hand, leaving one extra gap. |
| `resample-with-fx` | Odsłuchaj nowy pad osobno: czy efekt jest częścią nagrania?<br>Listen to the new pad on its own: is the effect part of the recording? | Zagraj nowym samplem krótką frazę.<br>Play a short phrase with the new sample. |
| `add-sidechain` | Posłuchaj stopy i basu razem: czy obniżenie głośności trafia w zamierzony moment?<br>Listen to the kick and bass together: does the volume dip at the intended moment? | Porównaj krótszy i dłuższy powrót basu; wybierz ten, który pasuje do rytmu.<br>Compare a shorter and longer bass recovery; choose the one that fits the rhythm. |
| `capture-skip-back` | Zagraj zapisany pad: czy zawiera moment, który chciałeś złapać?<br>Play the saved pad: does it contain the moment you wanted to catch? | Wybierz fragment tego nagrania do rozwinięcia w kolejnej frazie.<br>Choose a part of this recording to develop into another phrase. |
| `build-variation` | Odsłuchaj obie części: czy zmiana w drugiej jest słyszalna?<br>Listen to both parts: can you hear the change in the second? | Zdecyduj, czy wariant ma być przerwą, czy mocniejszym wejściem.<br>Decide whether the variation should be a break or a stronger entrance. |
| `final-bounce` | Odsłuchaj nowy sample od początku do końca: czy niczego nie brakuje?<br>Listen to the new sample from start to finish: is anything missing? | Wybierz jedną poprawkę na później albo zachowaj tę wersję.<br>Choose one improvement for later, or keep this version. |
| `doom-first-pattern` | Otwórz ponownie pattern i sprawdź, czy słychać zapisane kroki.<br>Reopen the pattern and check that the saved steps play. | Zmień velocity jednej nuty i zapisz, jeśli chcesz zachować nowy akcent.<br>Change one note’s velocity and save if you want to keep the new accent. |
| `doom-live-record` | Odsłuchaj pattern bez dogrywania: czy Twoja partia jest na swoim miejscu?<br>Listen without overdubbing: is your recorded part where you intended? | W trybie próby zagraj tę samą partię z innym akcentem.<br>In rehearsal mode, play the same part with a different accent. |
| `doom-fx-automation` | Posłuchaj dwóch obiegów: czy ruch efektu wraca w tym samym miejscu?<br>Listen to two repeats: does the effect movement return at the same point? | Porównaj frazę z automatyką i bez niej; wybierz wersję do dalszej pracy.<br>Compare the phrase with and without automation; choose a version to develop. |

### 4.3 Jedna propozycja dalszej pracy i podpowiedź

Podane adresy to trasy aplikacji, względne względem jej bazy. Dla GitHub Pages korzystać z routera, który uwzględnia `/sp404-workflow/`.

| Workflow ID | Cel głównego działania | Etykieta PL / EN | Istniejące kroki do podpowiedzi (`step.id`) |
| --- | --- | --- | --- |
| `source-to-pad` | sekcja `pattern` | NAGRAJ Z TEGO PATTERN / RECORD A PATTERN | `capture-trim`, `capture-playback` |
| `pattern-to-print` | MY KIT, `tab=ab` | ZANOTUJ PORÓWNANIE A/B / NOTE YOUR A/B COMPARISON | `print-routing`, `print-compare` |
| `loop-to-pattern` | workflow `build-variation` | ZRÓB WARIANT / MAKE A VARIATION | `loop-assign`, `loop-pattern` |
| `build-a-beat` | MY KIT, `tab=next` | ZAPISZ KOLEJNY RUCH / NOTE YOUR NEXT MOVE | `arrangement`, `final-bounce` |
| `8-bar-pattern` | MY KIT, `tab=song` | ZAPLANUJ FORMĘ / PLAN THE ARRANGEMENT | `tr-rec-drums`, `duplicate` |
| `sample-something` | sekcja `edit` | DOPRACUJ SAMPLE / REFINE THE SAMPLE | `record` |
| `chop-a-loop` | sekcja `pattern` | NAGRAJ FRAZĘ / RECORD YOUR PHRASE | `assign-to-pad` |
| `make-drums` | workflow `build-variation` | ZRÓB WARIANT RYTMU / VARY THE RHYTHM | `drum-pattern` |
| `resample-with-fx` | MY KIT, `tab=ab` | ZANOTUJ PORÓWNANIE A/B / NOTE YOUR A/B COMPARISON | `routing-mix`, `resample-record` |
| `add-sidechain` | MY KIT, `tab=ab` | ZANOTUJ WYBRANE BRZMIENIE / NOTE YOUR CHOSEN SOUND | `tune-threshold` |
| `capture-skip-back` | sekcja `edit` | DOPRACUJ ZŁAPANY FRAGMENT / REFINE THE CAPTURE | `save-skip-back` |
| `build-variation` | MY KIT, `tab=song` | UMIEŚĆ WARIANT W UTWORZE / PLACE THE VARIATION | `edit-variation` |
| `final-bounce` | MY KIT, `tab=next` | ZAPISZ WNIOSEK Z ODSŁUCHU / NOTE YOUR LISTENING TAKEAWAY | `bounce` |
| `doom-first-pattern` | workflow `doom-live-record` | DOGRAJ PARTIĘ / RECORD ANOTHER PART | `note`, `save` |
| `doom-live-record` | MY KIT, `tab=song` | ZAPLANUJ DALSZĄ FORMĘ / PLAN THE ARRANGEMENT | `rehearse`, `stop` |
| `doom-fx-automation` | MY KIT, `tab=ab` | ZANOTUJ PORÓWNANIE A/B / NOTE YOUR A/B COMPARISON | `edit` |

Warunki wejścia wyświetlane nad głównym przyciskiem:

- `source-to-pad`, `chop-a-loop`: „Przygotuj pusty pattern; użyjesz swoich sampli.” / “Have an empty pattern ready; you’ll use your samples.”
- `loop-to-pattern`, `make-drums`: „Kontynuuj na patternie, który właśnie przygotowałeś.” / “Continue with the pattern you just made.”
- `doom-first-pattern`: „Przed dogrywaniem otwórz ten zapisany pattern w DOOM OS.” / “Open this saved pattern in DOOM OS before recording another part.”
- Dla pozostałych nie dodawać ogólnego zdania wypełniającego miejsce. MY KIT ma własne objaśnienia planowania i notatek.

Sekcje są celowym wyborem dla pojedynczego sampla lub chopów: obecny `8-bar-pattern` zakłada również zestaw bębnów i bas. Nie kierować tam automatycznie osoby, która dopiero nagrała jeden dowolny dźwięk.

## 5. Reguły wyboru następnego kroku

1. Propozycja wynika ze stałej mapy powyżej, a nie z losowania, liczby zaliczonych lekcji lub globalnego filtra firmware.
2. Jeśli celem jest workflow bez zapisanego postępu, otworzyć go normalnie od początku.
3. Jeśli docelowy workflow trwa, zachować zapisany krok i zmienić etykietę na „WZNÓW: [tytuł]” / “RESUME: [title]”. Nie kasować jego potwierdzeń.
4. Jeśli docelowy workflow jest już ukończony, główną propozycją staje się MY KIT, `tab=next`: „ZAPLANUJ KOLEJNY RUCH” / “PLAN YOUR NEXT MOVE”. Nie otwierać w kółko zakończenia już ukończonej lekcji i nie resetować jej automatycznie. Można ją powtórzyć z istniejącej listy FLOW.
5. Docelowa instrukcja musi dotyczyć tego samego firmware co bieżąca. Wspólne narzędzia MY KIT są dostępne dla obu. Na ekranie Roland otwartym przy globalnym filtrze DOOM nadal stosować kontekst Roland i istniejący `FirmwareNotice`.
6. Nieprawidłowy lub usunięty cel w danych daje bezpieczny fallback do MY KIT `next`. Błędne referencje mają zostać wychwycone przed publikacją.
7. Brak pasującego szkicu nie blokuje zakończenia ani samodzielnej próby.

## 6. Prawdziwie opcjonalny ostatni krok

Wprowadzić `optional?: boolean` do `WorkflowStep` i `WorkflowActionRef`. Przenieść tę flagę w `resolveEntry`, gdy krok odwołuje się do `ActionRecord`. W R9 oznaczyć nią wyłącznie `8-bar-pattern` → `bounce-optional`.

- Ten krok ma widoczną etykietę „OPCJONALNIE / OPTIONAL” i przycisk „POMIŃ TEN KROK / SKIP THIS STEP”. Zachować możliwość wykonania i normalnego potwierdzenia.
- Pominięcie przesuwa kursor, lecz **nie dodaje** jego ID do `doneSteps`.
- Warunkiem ukończenia jest dotarcie do końca i potwierdzenie wszystkich wymaganych kroków. Przy końcu wracać do pierwszego niepotwierdzonego wymaganego kroku, także po pominięciu ostatniego opcjonalnego.
- Przesunięcie kropką bez potwierdzenia wymaganego kroku nie pozwala ukończyć instrukcji.
- Licznik potwierdzeń dla ścieżki zawierającej opcję opisuje wymagane kroki, np. „Potwierdzone wymagane kroki: 6/6”. Kropki i numer bieżącego kroku nadal obejmują wszystkie 7 pozycji; opcję oznaczyć również w etykiecie dostępności.
- Dla pozostałych workflow zachować obecne zasady i liczby kroków. Nie zmieniać kolejności ani ID istniejących kroków.
- Starszy ukończony `8-bar-pattern` pozostaje ukończony. Starsza sesja zatrzymana przed opcjonalnym bounce dostaje możliwość pominięcia. Import i odświeżenie stanu z ukończeniem bez `bounce-optional` nie cofają do tej opcji.
- Nie tworzyć `skippedSteps` ani nowej wersji backupu: wystarczą obecny kursor i lista faktycznie potwierdzonych kroków.
- Ujednolicić logikę sprawdzania końca dla renderowania, potwierdzenia i pominięcia; obliczać ją na zbiorze potwierdzeń po bieżącej akcji, unikając odczytu starego stanu React.

## 7. MY KIT i zakończenie sesji

Wykorzystać istniejące adresy z `tab=next|song|ab`. Dodać lekki kontekst nawigacji `fromWorkflow=<id>` tylko dla przejścia z ekranu zakończenia. Nie przekazywać w URL notatek ani całego stanu.

### Wybór zestawu

- Jeżeli istnieje `ui.activeKitId`, wskazany zestaw ma `studio`, jest niedokończony i ma ten sam firmware co kończony workflow, link zawiera jego `set=<id>`.
- Przy braku pasującego aktywnego szkicu otworzyć `/kit?tab=<cel>&fromWorkflow=<id>` bez `set`. Użytkownik wybiera istniejący zestaw albo tworzy nowy w obecnym interfejsie.
- Nie wybierać przypadkowego zestawu z listy, nie otwierać automatycznie ukończonego szkicu i nie domyślać się firmware starego zestawu bez `studio`.
- Użytkownik nadal może świadomie wybrać dowolny istniejący zestaw. Jego firmware, notatki, SONG MAP, warianty A/B i status ukończenia pozostają zgodne z zapisanymi danymi.

### Obsługa kontekstu

- Walidować `fromWorkflow` przez istniejący katalog workflow. Nieznane ID ignorować. `tab` dopuszcza tylko `next`, `song`, `ab`.
- Przy wyborze lub tworzeniu zestawu zachować rozpoznane `tab` i `fromWorkflow`. Obejmuje to naprawę obecnego gubienia `tab` w `CREATE_KIT`.
- Nowy zestaw utworzony z tego wejścia dostaje `studio: defaultStudio(firmwareBieżącegoWorkflow)`. Bez kontekstu zachowuje dotychczasowe zasady tworzenia.
- Nie wypełniać ani nie nadpisywać automatycznie `nextStep`, projektu, banku/pada, BPM, opisu A/B i SONG MAP. Nie dodawać workflow do ulubionych ani elementów zestawu bez działania użytkownika.
- „POKAŻ NA NOW” pozostaje świadomym wyborem w KitStudio. Po wpisaniu notatki użytkownik może przypiąć ten szkic i wrócić do NOW.
- Przy limicie 30 zestawów zachować możliwość wybrania istniejącego. Długi tekst następnego kroku nadal ma limit 1000 znaków i pełną widoczność w edytorze.
- Brak zapisu lokalnego nie blokuje pracy w bieżącej sesji; komunikaty muszą nadal odróżniać zapis od stanu tylko na tę sesję.

Scenariusz odbioru: koniec instrukcji → „Zanotuj następny krok” → właściwy zestaw lub utworzenie nowego → pole „Następny krok” → własna notatka → „Pokaż na NOW” → powrót i wznowienie po odświeżeniu. Całość działa offline po zapisaniu aplikacji w pamięci podręcznej.

## 8. Kształt implementacji

### Dane

Rozszerzyć `Workflow` o opcjonalne `ending`:

```ts
interface WorkflowEnding {
  check: string
  tryIt: string
  hintStepIds: string[]
  next: (
    | { kind: 'workflow'; id: string }
    | { kind: 'section'; id: string }
    | { kind: 'kit'; tab: 'next' | 'song' | 'ab' }
  ) & { label: string; preparation?: string }
}
```

`outcome` pozostaje na `Workflow`. Referencje podpowiedzi używają trwałych `step.id`, nie numerów indeksu. W widoku rozwiązać je przez tę samą funkcję co zwykłe kroki; brakujący krok nie wywołuje wyjątku na ekranie końca.

### Komponenty i funkcje

- Wydzielić prezentację zakończenia do `src/components/content/WorkflowEnding.tsx`, aby `WorkflowPlayer` pozostał czytelny. Używać istniejących `HardwareButton`, `ButtonSequence`, `SourceTag`, `Link` i lokalizacji.
- Dodać małe, czyste funkcje w `src/utils/workflowEnding.ts` do oceny wymaganych kroków, wybrania propozycji i zbudowania kontekstu MY KIT. Można rozdzielić helper ukończenia, jeśli uprości to zależności.
- Funkcje mają przyjmować potrzebne dane; nie wprowadzać kolejnego providera, biblioteki stanu ani usługi sieciowej.
- Przy zmianie `workflow.id` wyzerować lokalny stan rozwinięcia podpowiedzi i fokusowania; można użyć klucza komponentu. Nie przechowywać tego w backupie.
- W linkach używać adaptera `src/lib/rr.tsx`. Nie przebudowywać routera. W testach wartości query odczytywać tak jak aplikacja; TanStack może kodować stringi liczbowe z cudzysłowami.

### Lokalizacja

- Roland: dane PL w `src/data/workflows.ts`, pola tekstowe `ending` w `src/i18n/en/workflows.ts`, jawne scalanie w `localizeWorkflow`. Overlay tłumaczy teksty, nie ID, `kind`, `tab` i `hintStepIds`.
- DOOM: dane PL w `src/data/doom.ts`, wszystkie nowe zdania i etykiety w słowniku `src/i18n/companion.ts`. Rekurencyjny translator ma zachować identyfikatory.
- Wspólne nagłówki, opcjonalność, pominięcie, wznowienie, fallback i teksty przycisków w `src/i18n/messages.ts` dla obu języków.
- Nie tłumaczyć zapisanych przez użytkownika nazw ani notatek przy zmianie języka.

### Mapa plików

| Plik | Zakres |
| --- | --- |
| `src/data/types.ts` | `WorkflowEnding`, `Workflow.ending`, opcjonalność kroków |
| `src/data/workflows.ts` | 13 zakończeń Roland, brakujące `outcome`, flaga `bounce-optional` |
| `src/data/doom.ts` | 3 zakończenia DOOM |
| `src/i18n/en/workflows.ts` | typ overlay i angielskie treści Roland |
| `src/i18n/content.ts` | scalenie lokalizacji z zachowaniem referencji |
| `src/i18n/companion.ts` | angielskie treści DOOM |
| `src/i18n/messages.ts` | wspólne etykiety PL/EN |
| `src/components/content/WorkflowPlayer.tsx` | wywołanie zakończenia i poprawna obsługa opcji |
| `src/components/content/WorkflowEnding.tsx` | nowa prezentacja w obrębie istniejącej trasy |
| `src/utils/workflowEnding.ts` | niewielkie funkcje decyzyjne |
| `src/pages/KitPage.tsx` | zachowanie celu i walidacja kontekstu po wyborze/utworzeniu zestawu |
| `src/styles/components.css`, `src/styles/pages.css` | układ karty końcowej; ograniczyć selektory do tego ekranu |
| `src/utils/workflowEnding.test.ts` | testy logiki i zachowania danych |
| `scripts/workflow-endings-test.mjs` | scenariusze przeglądarkowe |
| `scripts/companion-test.mjs`, `package.json` | włączenie nowych testów do obecnych poleceń |
| `src/lib/appRev.ts`, `README.md` | R9 i opis ukończonej zmiany po testach |

Store i format kopii zapasowych zasadniczo nie wymagają rozszerzania. Jeżeli implementacja wymaga dodania trwałego stanu tylko dla wyświetlenia tego ekranu, najpierw uprościć rozwiązanie.

## 9. Testy i kryteria akceptacji

### Logika

1. Wszystkie wymagane kroki potwierdzone → można zakończyć po dotarciu do końca.
2. Jeden wymagany pominięty → powrót do niego, także gdy pominięto końcowy krok opcjonalny.
3. `8-bar-pattern`: ukończenie zarówno po wykonaniu, jak i po pominięciu bounce; pominięty nie trafia do `doneSteps`.
4. Odświeżenie i import ukończenia z R8 oraz nowego ukończenia z pominiętą opcją nie cofają postępu.
5. Następny workflow: nowy, rozpoczęty, ukończony, nieznany; właściwa etykieta i cel bez resetowania danych.
6. Dobór MY KIT: aktywny zgodny, brak aktywnego, inne firmware, szkic ukończony, zestaw bez `studio`, usunięty wskaźnik.
7. Normalizacja/backup zachowują kursor, potwierdzenia, notatki, SONG MAP, A/B, `activeKitId`, praktykę i BEAT BLOCK.
8. Kontekst URL: nieznany workflow i nieznana zakładka ignorowane; poprawny kontekst zachowany po utworzeniu i wyborze zestawu.

### Przeglądarka

- Pokryć wszystkie 16 zakończeń w PL i EN. Sprawdzić, że treść odpowiada workflow, podpowiedź ma istniejące kroki, a każdy rodzaj głównego linku prowadzi do działającego celu.
- Co najmniej jedną ścieżkę Roland i DOOM w każdym języku przejść rzeczywistymi przyciskami od początku. `8-bar-pattern` sprawdzić interakcjami dla potwierdzenia i pominięcia opcji oraz brakującego wymaganego kroku.
- Widoki 320, 390 i 768 px, standardowy i większy tryb przy SP; brak overflow i zakrytych przycisków. Przy 390 × 844 sprawdzić kryterium widoczności z części 3.
- Sprawdzić globalny filtr inny niż firmware otwartego workflow; propozycja i kontekst nowego MY KIT wynikają z otwartej instrukcji.
- „Na dziś koniec” nie zmienia szkicu, BEAT BLOCK ani innych workflow. „Powtórz” resetuje tylko aktualny workflow. Rozwijanie podpowiedzi nie zmienia zapisanego postępu.
- Przejście do już rozpoczętej następnej instrukcji wznawia dokładny zapisany krok. Przejście po ukończonej następnej instrukcji prowadzi do `MY KIT → next`.
- Wejście do MY KIT dla `next`, `song`, `ab`: istniejący zestaw, nowy, brak dopasowania, limit 30, pełna notatka. Po utworzeniu otwiera się zamierzony panel i ma właściwy firmware. Istniejące dane nie są zastępowane.
- Klawiatura: fokus na nagłówku wyniku tylko po wejściu, osiągalność działań, rozwijanie podpowiedzi, poprawna kolejność. Zmiana PL/EN nie gubi treści użytkownika.
- Offline: po przygotowaniu cache ukończyć instrukcję, otworzyć podpowiedź, przejść do następnego celu, zapisać własną notatkę, wrócić do NOW i odświeżyć. Brak zależności od filmów lub manuali online.
- Zachować istniejący pełny zestaw testów R8, zwłaszcza `testNow`, BEAT BLOCK i KitStudio; zero wyjątków przeglądarki.

Nowy moduł testów przeglądarkowych dołączyć do `scripts/companion-test.mjs`. Testy wykorzystywać do sprawdzania zachowania, a nie porównywania całych plików HTML lub każdej litery copy. Jeśli katalog danych jest niewygodny do importowania przez obecny test runner Node, jego referencje można sprawdzić przez rzeczywiste przejścia w przeglądarce; nie dodawać zależności wyłącznie dla tego problemu.

### Polecenia weryfikacji przy wdrożeniu

```text
npm run typecheck
npm test
npm run build
npm run build:pages:cf
npm run test:companion
```

Nowe testy jednostkowe muszą zostać dołączone do `npm test`, który obecnie jawnie wymienia pliki. Baza R8 miała 83 testy jednostkowe; to informacja o poprzedniej wersji, nie wynik weryfikacji R9.

Zachować zrzuty PL/EN i Roland/DOOM w ignorowanym `artifacts/companion/`, np. `ending-r9-pl-roland.png`, `ending-r9-en-doom.png`, a także wariant z rozwiniętą pomocą i MY KIT po utworzeniu zestawu.

## 10. Sprawdzenie treści sprzętowych przed implementacją copy

Ten plan wynika z przeglądu kodu i informacji użytkownika. Nie przeprowadzono w jego ramach testów na samplerze ani ponownego audytu manuali.

Przed publikacją potwierdzić z pierwotnymi źródłami te istniejące kroki, których znaczenie zostaje wyeksponowane na zakończeniu. Korzystać z odsyłaczy źródłowych w danych i z `docs/DOOM_OS.md`. Szczególnie rozstrzygnąć dwa konkretne rozjazdy w obecnym tekście:

- `build-a-beat`: krok końcowy mówi o bounce „finalnego układu”, a objaśnienie odnosi się do pojedynczego patternu. Nowe podsumowanie nie może obiecywać zapisu całego chainu bez potwierdzonej procedury. Jeśli korekta jest konieczna, objąć nią ten krok i jego EN, zachowując ID.
- `build-variation`: objaśnienia sugerują nienaruszony oryginał, a ostrzeżenie mówi o zmianie istniejącego patternu. Sprawdzić właściwy zakres DUPLICATE i opisać go spójnie; nie obiecywać automatycznego zachowania osobnej kopii. W tabeli celowo opisano drugą część patternu.

W `8-bar-pattern` tekst po DUPLICATE opisuje podwojoną długość, dlatego nowy rezultat nie obiecuje końcowych ośmiu taktów. Nowa obsługa opcjonalności nie wymaga zmiany kolejności kroków.

Jeżeli korekta procedury wymagałaby przebudowy wielu instrukcji, zachować w R9 prawdziwy, węższy rezultat i odnotować osobny problem. Nie rozszerzać przy okazji całego podręcznika. Daty przeglądu dokumentacji i rzeczywistego testu sprzętu muszą nadal pozostać rozróżnione.

## 11. Kolejność prac dla modelu wdrażającego

1. Przeczytać ten dokument, sprawdzić aktualny stan repozytorium i różnice względem podanego commitu. Zachować późniejsze zmiany użytkownika. Nie resetować checkoutu do R8.
2. Sprawdzić źródła dla wskazanych niejasności i ustalić uczciwe zakończenia, bez dodatkowego pytania o wybór instrukcji.
3. Dodać typy i małe funkcje ukończenia/propozycji; testy pominięcia, wznowienia i doboru zestawu.
4. Uzupełnić 16 zakończeń i ich tłumaczenia. Zweryfikować wszystkie `hintStepIds`, cele i zgodność firmware.
5. Zbudować wspólną kartę zakończenia, podpowiedź i obsługę opcjonalnego bounce.
6. Dopiąć kontekst MY KIT i zachowanie `tab` przy tworzeniu/wyborze zestawu.
7. Przeprowadzić pełne sprawdzenia z części 9, obejrzeć zrzuty na telefonie, usunąć regresje.
8. Dopiero po poprawnej weryfikacji ustawić `APP_REV = 'R9'`, datę rzeczywistego wydania, dopisać zwięzły opis EN w README i zbudować finalny artefakt. Jeśli wersja jest sprawdzana w testach, ustawić ją przed ostatnim przebiegiem tych testów.
9. Publikację prowadzić zgodnie z dotychczasowym procesem GitHub i Cloudflare opisanym niżej; podsumować wynik i znane ograniczenia bez deklarowania testu fizycznego SP.

## 12. Publikacja — dla etapu wdrożenia

Użytkownik wcześniej zlecił publikowanie aplikacji na GitHubie i Cloudflare. Bieżące zadanie kończy się zapisaniem planu; poniższe czynności należą do późniejszego wdrożenia przez wybrany model.

- Repozytorium: `https://github.com/megabomb420/sp404-workflow`, gałąź publikacyjna `main`.
- Cloudflare Pages: projekt `sp-workflow`, produkcja `https://sp-workflow.pages.dev/`.
- GitHub Pages: `https://megabomb420.github.io/sp404-workflow/`.
- Aktualny proces: finalny commit → push do `main` po sprawdzeniu stanu zdalnego → sprawdzenie CI i GitHub Pages → wdrożenie tego samego commitu do Cloudflare.
- Użyć skonfigurowanej autoryzacji i obecnego projektu; nie tworzyć nowych kont, projektów ani usług. Szczegóły procesu znajdują się w `package.json` i `.github/workflows/`.
- Deploy Cloudflare buduje `dist/client` przez `npm run build:pages:cf`. Przy publikacji czystego commitu użyć `wrangler pages deploy` dla `sp-workflow`, `branch=main`, z poprawną informacją o czystości commitu. Nie polegać na starym katalogu `dist`.
- Na Windows istniejący `npm run build:pages` używa składni POSIX; do lokalnego builda Cloudflare jest przenośny skrypt, a build GitHub Pages wykonuje workflow Linuksa. Odróżniać ograniczenie środowiska od błędu aplikacji.
- Po publikacji sprawdzić rzeczywiste R9 i kluczowe przejścia na obu domenach, w tym bazę ścieżek GitHub Pages i offline po aktualizacji service workera.
- Zakończenie prac wymaga działającej publikacji i przejścia CI, a nie samego wysłania zmian. Nie używać force push; w razie nowych commitów na zdalnej gałęzi włączyć je bez utraty pracy.

## 13. Ocena po wydaniu

Poprosić użytkownika o trzy zwykłe sesje przy SP, obejmujące krótką instrukcję, dłuższy workflow i powrót do szkicu. Wystarczą jego obserwacje, bez dodawania analityki do aplikacji:

- Czy po zakończeniu wiedział, co zrobić na sprzęcie?
- Czy samodzielna próba pomogła, czy wymagała zbyt dużo czytania?
- Czy skorzystał z dalszego kroku lub spokojnie zakończył sesję?

Kolejną poprawkę wybrać na podstawie powtarzającego się problemu. R9 nie stanowi zobowiązania do kolejnych trybów czy rozbudowy kursu.

## 14. Gotowe polecenie przekazania

> Wdróż R9 zgodnie z `docs/R9_WORKFLOW_ENDINGS_PLAN.md`. Zacznij od sprawdzenia aktualnego stanu repozytorium i źródeł wskazanych w planie. Zrealizuj zakończenia wszystkich 16 workflow w PL/EN, prawdziwą opcjonalność bounce w 8-BAR PATTERN oraz przejścia do istniejącego MY KIT. Zachowaj uproszczenie NOW z R8 i wszystkie 16 rozwiniętych padów. Wykonaj wskazane testy, sprawdź widoki mobilne i offline, a następnie opublikuj R9 na istniejącym GitHubie i Cloudflare. Użytkownik chce małej, spójnej poprawki wynikającej z pracy przy SP; unikaj dodawania innych funkcji. Raportuj po polsku i nie deklaruj testów na fizycznym samplerze, których nie wykonano.

### Stan przekazania

W sesji planowania sprawdzono źródła aplikacji i zapisano ten dokument. Nie zmieniono kodu, numeru wersji, danych użytkownika ani publikacji. Testy R9 zostają do wykonania po implementacji. Nie uruchomiono innego modelu ani osobnego zadania.
