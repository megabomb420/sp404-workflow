# SP Workflow — handover 2026-09-14

## Zakres ukończonej wersji offline vNext

Repozytorium: `megabomb420/sp404-workflow`, aplikacja statyczna na GitHub Pages. React 18, React Router 7 w trybie deklaratywnym / HashRouter, Vite 7, TypeScript strict, PWA. Node 22.12+; instalacja przez `npm ci`. Nie dodano backendu, kont użytkowników, AI ani telemetrii.

Główna pętla produktu: **NOW → akcja workflow → obserwowany rezultat → kolejny krok lub Rescue → powrót → powtórka w trainerze**.

- 18 współdzielonych akcji w `src/data/actions.ts` zasila workflow, search, procedury trenera i instrukcje Loop Fit.
- Workflow zachowuje pozycję i potwierdzone kroki. Parametr `step` jest konsumowany przy wejściu. Pominięte kroki wracają przed zakończeniem. Wyjście z Rescue nie zalicza kroku. Workflow można zapisać do MY KIT.
- Rescue: cztery rodziny obserwacji (`src/data/rescue.ts`), wskazujące istniejące rekordy troubleshooting. Po każdym teście użytkownik ocenia rezultat. Stan gałęzi jest w URL i przeżywa odświeżenie. Koniec ścieżki bez rozwiązania nie staje się automatyczną diagnozą. Biblioteka pozostaje dostępna jako rozwijana sekcja.
- Trainer: procedury z akcji + istniejące fiszki skrótów; samoocena zamiast licznika odsłonięć. Niepowodzenie checkpointu kolejkuje akcję do treningu. Fiszki operacji destrukcyjnych nie są losowane. Nie ma automatycznej oceny rzeczywistego sprzętu.
- Search: wspólna normalizacja polskich znaków (łącznie z ł), zachowane oryginalne terminy przy rozszerzaniu aliasów, ranking dokładnych trafień, konkretne docelowe karty oraz query w URL.
- Loop Fit: ścisłe dodatnie liczby z kropką/przecinkiem, brak cichego zastępowania błędnego BPM wartością 90. Trwałe wejścia, powrót do sesji, jasne założenia 4/4 i dryfu bez synchronizacji/retriggera. Kolory są orientacyjne; nie stanowią analizy audio.
- Store: ten sam klucz `spw.state.v1`, ostrożna migracja pól; nowe `practice` i `loopFit`. Niepoprawne typy zastępowane domyślnymi. Błąd zapisu pokazuje ostrzeżenie. Nie przechowujemy zdjęć, nagrań ani kluczy.
- Słowniki danych mają bezpieczne lookupy bez odziedziczonych kluczy, by błędny URL `constructor` / `__proto__` nie był traktowany jak workflow.

## Weryfikacja

- Produkcyjny build: `npm run build`, domyślnie `/`; Pages używa `BASE_PATH=/sp404-workflow/`.
- `scripts/audit.mjs`: 22 kontrole funkcjonalne.
- `scripts/regression-test.mjs`: przypadki graniczne, trening, Rescue, search, walidacja/migracja, layout 320/390/430/768 px i zimne odświeżenia offline. Zapisuje screenshoty do ignorowanego `reference/shots`.
- Dodatkowe testy: `offline-test`, `explorer-test`, `recent-test`.
- Każdy skrypt testowy poza starszym generatorem screenshotów przyjmuje `TEST_BASE_URL`. Deploy uruchamia cały zestaw na swoim buildzie Pages, zanim udostępni artefakt do publikacji.
- Zaktualizowane Vite, plugin React, PWA, router i fast-uri; audyt npm po aktualizacji: 0 zgłoszonych podatności (2026-09-14).

## Wiedza sprzętowa i ograniczenia

Źródła: [HTML v5.50](https://static.roland.com/manuals/sp-404mk2_reference_v550/en-US/index.html), [PDF v5](https://static.roland.com/assets/media/pdf/SP-404MK2_v5_reference_eng03_W.pdf).

Poprawiono błędne stwierdzenie, że Mix usuwa efekty; doprecyzowano uruchamianie resamplingu patternu po wybraniu pustego pada. Zweryfikowano i zachowano UTILITY: SHIFT + PAD 13; SHIFT + PAD 16 otwiera bezpośrednio EFX SET, nie główne UTILITY. Ustawianie BPM porównano z oficjalnym rozdziałem HTML. Etykiety paginacji teraz mówią PDF v5, zamiast sugerować paginację HTML v5.50.

To nie był pełny ponowny audyt starszych sekcji, wszystkich fiszek i porad. Nie przeprowadzono testów na fizycznym SP-404MKII ani na Safari/iOS; automatyczny E2E korzysta z Chromium. Oryginalne dłuższe workflow nadal mogą używać lokalnych instrukcji zamiast ActionRecord. Składanie porad w Rescue pomaga w diagnozie, ale nie potwierdza jej przyczyny.

## Dalszy rozwój — poza tym wydaniem

1. Test trzech głównych ścieżek przy fizycznym SP z użytkownikiem; zgromadzenie konkretnych rozbieżności ekranów i kolejności.
2. Stopniowe przenoszenie starych instrukcji do wspólnych rekordów po kontroli merytorycznej, a nie automatyczne oznaczanie ich jako zweryfikowane.
3. Jeśli wróci temat DeepSeek, zacząć od eksperymentu interpretacji zapytania do lokalnych ID, z walidacją i działającym fallbackiem bez sieci. Obecne ID i rekordy są wystarczającą podstawą. Nie umieszczać klucza dostawcy w statycznym frontendzie. Vision, cloud i generowanie instrukcji nie są częścią ukończonego zakresu.
