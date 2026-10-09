import { useCallback } from 'react'
import { useLocale, type Locale } from './locale'

// Shared copy for companion tools. Content IDs, URLs and hardware labels remain stable.
export const companionEnglish: Record<string, string> = Object.fromEntries(String.raw`
Utknąłeś? Krótkie wyzwanie, szkic i pomysł do rozwinięcia.|Stuck? A short prompt, a sketch and an idea to develop.
Plik nie jest poprawną kopią JSON.|The file is not a valid JSON backup.
To nie jest obsługiwana kopia SP Workflow.|This is not a supported SP Workflow backup.
Kopia jest niekompletna. Obecne dane pozostają bez zmian.|The backup is incomplete. Current data is unchanged.
ODSŁUCH SP|LISTEN ON SP
Publiczne demonstracje FX, resamplingu i sidechainu Rolanda.|Public Roland demonstrations of FX, resampling and sidechain.
wybierz krok|select step
, nuta włączona|, note enabled
, pusty|, empty
ŚCIEŻKI|TRACKS
NUTY|NOTES
TAKTY / WIDOKI|BARS / VIEWS
NAGRYWANIE|RECORDING
MIKSER|MIXER
AUTOMATYKA|AUTOMATION
USTAWIENIA|SETTINGS
SIATKA|GRID
SIATKA KROKÓW|STEP GRID
STRONA FX|FX PAGE
STRONA FX / BUS|FX PAGE / BUS
STRONA EFEKTU|EFFECT PAGE
Wejście, patterny, tempo, zapis i pomoc.|Enter, select patterns, set tempo, save and get help.
Jedna ścieżka odpowiada jednemu padowi z samplem.|One track corresponds to one sample pad.
W siatce 16 padów odpowiada 16 krokom wybranej ścieżki.|In the grid, 16 pads correspond to 16 steps on the selected track.
Nawigacja zależy od widoku: siatka, zoom lub piano roll.|Navigation depends on the view: grid, zoom or piano roll.
PAD 5 to oryginalna wysokość; pady 1–4 obniżają, 6–16 podwyższają.|PAD 5 is the original pitch; pads 1–4 lower it, 6–16 raise it.
Pierwsze REC uruchamia próbę, drugie zapisuje grane nuty.|The first REC starts rehearsal; the second records played notes.
VALUE wybiera narzędzie i jego wartość; naciśnięcie zatwierdza. EXIT anuluje.|VALUE selects a tool and its value; press to apply. EXIT cancels.
Tutaj CTRL 1–3 sterują panoramą, busem i poziomem.|Here CTRL 1–3 control pan, bus and level.
Na otwartej stronie efektu CTRL 1–3 zmieniają parametry FX.|On an open effect page, CTRL 1–3 adjust FX parameters.
Ruchy parametrów efektów zapisane w patternie, edytowane krok po kroku.|Effect parameter movements recorded in the pattern, editable step by step.
Opcje DOOM OS i własne kombinacje przycisków w SYSTEM.|DOOM OS options and custom button combinations in SYSTEM.
DOOM OS · PIERWSZY PATTERN|DOOM OS · FIRST PATTERN
Od pustego patternu do grającej siatki kroków.|From an empty pattern to a playing step grid.
DOOM OS jest zainstalowany. Przygotuj pusty pad patternu i bank z samplami. Te przyciski dotyczą edytora DOOM OS.|DOOM OS is installed. Prepare an empty pattern pad and a sample bank. These controls apply to the DOOM OS editor.
Pattern gra, a zmiany zostały zapisane po wyjściu z edytora.|The pattern plays and changes are saved when you leave the editor.
WEJDŹ DO EDYTORA|ENTER THE EDITOR
Trzymaj REMAIN i naciśnij SUB PAD.|Hold REMAIN and press SUB PAD.
Widzisz graficzny edytor DOOM OS.|The DOOM OS graphical editor is visible.
WYBIERZ PUSTY PATTERN|SELECT AN EMPTY PATTERN
Trzymaj PATTERN SELECT i naciśnij pusty pad patternu.|Hold PATTERN SELECT and press an empty pattern pad.
Widzisz nowy pattern.|A new pattern is visible.
WYBIERZ PIERWSZY SAMPLE|SELECT THE FIRST SAMPLE
Trzymaj SUB PAD, odsłuchaj pady i zwolnij SUB PAD po wybraniu dźwięku.|Hold SUB PAD, audition the pads, then release SUB PAD on the chosen sound.
W siatce pojawia się ścieżka wybranego sampla.|The chosen sample’s track appears in the grid.
WSTAW KROKI|INSERT STEPS
Stuknij pady odpowiadające miejscom, w których ma zagrać sample.|Tap the pads corresponding to the steps where the sample should play.
Wybrane kroki są zaznaczone w wierszu ścieżki.|The selected steps are marked in the track row.
URUCHOM PATTERN|START THE PATTERN
Naciśnij PATTERN SELECT i posłuchaj frazy.|Press PATTERN SELECT and listen to the phrase.
Pozycja odtwarzania przesuwa się, a sample gra na wybranych krokach.|The playback position moves and the sample plays at the selected steps.
ZMIEŃ JEDNĄ NUTĘ|EDIT ONE NOTE
Trzymaj pad jednego kroku i obróć CTRL 1, aby zmienić velocity.|Hold one step pad and turn CTRL 1 to change its velocity.
Zmienia się velocity wybranej nuty.|The selected note’s velocity changes.
Bez trzymania pada CTRL 1 ustawia tę samą wartość wszystkim nutom ścieżki.|Without holding a pad, CTRL 1 sets every note on the track to the same value.
ZAPISZ I WYJDŹ|SAVE AND EXIT
Naciśnij PATTERN SELECT, aby zatrzymać. Na głównej siatce naciśnij EXIT, aby zamknąć edytor i zapisać.|Press PATTERN SELECT to stop. On the main grid, press EXIT to close the editor and save.
DOOM OS zamyka się. Po ponownym wejściu pattern zachowuje Twoje kroki.|DOOM OS closes. Reopening the pattern preserves your steps.
DOOM OS · PRÓBA → NAGRANIE|DOOM OS · REHEARSE → RECORD
Przećwicz partię, potem nagraj ją do patternu.|Rehearse a passage, then record it into the pattern.
Otwarty pattern w DOOM OS i wybrane sample. Możesz użyć patternu z poprzedniej ścieżki.|A pattern is open in DOOM OS with samples selected. You can use the pattern from the previous workflow.
Zagrana partia jest zapisana w patternie.|The played passage is recorded in the pattern.
PRZEŁĄCZ PADY NA GRANIE|SWITCH PADS TO PLAYING
Naciśnij HOLD, jeśli pady nadal edytują kroki.|Press HOLD if the pads still edit steps.
Pady odtwarzają sample.|The pads play samples.
PRZEĆWICZ PARTIĘ|REHEARSE THE PASSAGE
Naciśnij REC raz i zagraj frazę.|Press REC once and play a phrase.
Ekran pokazuje REHEARSAL; partia jeszcze się nie zapisuje.|The screen shows REHEARSAL; the passage is not being recorded yet.
WYBIERZ TRYB|SELECT A MODE
Podczas próby użyj SHIFT + REC, aby wybrać SINGLE, MULTI lub CHROMATIC odpowiednio do partii.|During rehearsal, use SHIFT + REC to select SINGLE, MULTI or CHROMATIC to suit the passage.
Ekran pokazuje wybrany tryb nagrywania.|The screen shows the selected recording mode.
NAGRAJ PARTIĘ|RECORD THE PASSAGE
Naciśnij REC ponownie i zagraj przygotowaną frazę.|Press REC again and play the prepared phrase.
Nagrywanie zapisuje grane nuty do patternu.|Recording writes the played notes into the pattern.
ZAKOŃCZ I ODSŁUCHAJ|FINISH AND LISTEN
Naciśnij EXIT, aby zakończyć nagrywanie. Sprawdź kroki w siatce i odsłuchaj pattern przez PATTERN SELECT.|Press EXIT to finish recording. Check the grid steps and audition the pattern with PATTERN SELECT.
Nagrywanie jest zakończone, a pattern zawiera zagrane nuty.|Recording has ended and the pattern contains the played notes.
DOOM OS · NAGRAJ RUCHY FX|DOOM OS · RECORD FX MOVEMENTS
Zapisz ruch pokrętła i popraw go na wybranym kroku.|Record a knob movement and refine it at a selected step.
Otwarty pattern w DOOM OS, słyszalny sample skierowany na bus z efektem. Ustawienia zapisu automatyki mogą zastąpić wcześniejsze ruchy.|A pattern is open in DOOM OS with an audible sample routed to an effect bus. Automation recording settings may replace earlier movements.
Pattern odtwarza zapisaną automatykę efektu.|The pattern plays its recorded effect automation.
OTWÓRZ STRONĘ EFEKTU|OPEN THE EFFECT PAGE
Wybierz bus przez BUS FX i otwórz stronę wybranego efektu jego przyciskiem.|Select the bus with BUS FX and open the chosen effect page using its button.
Widzisz parametry efektu i słyszysz jego działanie.|The effect parameters are visible and its processing is audible.
PRZEJDŹ Z PRÓBY DO ZAPISU|GO FROM REHEARSAL TO RECORDING
Na stronie efektu naciśnij REC raz dla próby, a drugi raz dla nagrywania.|On the effect page, press REC once to rehearse and a second time to record.
Nagrywanie jest aktywne na stronie efektu.|Recording is active on the effect page.
NAGRAJ RUCH|RECORD A MOVEMENT
Podczas grania patternu obróć CTRL 1, 2 lub 3, zmieniając parametr efektu.|While the pattern plays, turn CTRL 1, 2 or 3 to change an effect parameter.
Słyszysz zmianę efektu w trakcie nagrywania.|You hear the effect change during recording.
ZAKOŃCZ NAGRYWANIE|FINISH RECORDING
Naciśnij EXIT, aby zakończyć zapis. Zamknij stronę efektu, jeśli nadal jest otwarta.|Press EXIT to finish recording. Close the effect page if it is still open.
Nagrywanie już nie jest aktywne.|Recording is no longer active.
SPRAWDŹ AUTOMATYKĘ|CHECK AUTOMATION
Naciśnij SHIFT + MARK, wybierz parametr obrotem VALUE i naciśnij VALUE.|Press SHIFT + MARK, turn VALUE to select a parameter and press VALUE.
Widzisz zapisane ruchy wybranego parametru w krokach.|The selected parameter’s recorded movements are visible as steps.
POPRAW WYBRANY KROK|REFINE A SELECTED STEP
Trzymaj pad kroku i obróć VALUE. START/END w ekranie automatyki włącza lub wyłącza odtwarzanie ruchów; pozostaw je włączone i odsłuchaj pattern.|Hold the step pad and turn VALUE. START/END on the automation screen toggles movement playback; leave it on and listen to the pattern.
Wartość kroku zmienia się, a podczas odsłuchu słychać zapisaną automatykę.|The step value changes and the recorded automation is audible during playback.
obróć VALUE|turn VALUE
naciśnij VALUE|press VALUE
PAD kroku|step PAD
PAD ścieżki|track PAD
sterowanie · osobny firmware|controls · custom firmware
wersja i instalacja|version and installation
Pattern jako siatka. Mikser pod ręką. Ruchy FX zapisane w beacie.|Patterns as a grid. A mixer at your fingertips. FX movements recorded in your beat.
przewodnik DOOM OS|DOOM OS guide
ZACZNIJ|GET STARTED
STEROWANIE|CONTROLS
WERSJA / INSTALACJA|VERSION / INSTALLATION
WEJDŹ DO DOOM OS|ENTER DOOM OS
Trzymaj REMAIN, naciśnij SUB PAD. EXIT z głównej siatki zamyka edytor i zapisuje zmiany.|Hold REMAIN and press SUB PAD. EXIT on the main grid closes the editor and saves changes.
Instrukcje poniżej dotyczą zainstalowanego DOOM OS. Pozostałe funkcje SP opisuje dotychczasowy przewodnik Roland.|These instructions apply to an installed DOOM OS. The Roland guide covers the SP’s other features.
ZRÓB TO NA SP|TRY IT ON THE SP
KROKÓW ·|STEPS ·
TE SAME GAŁKI, INNY KONTEKST|SAME KNOBS, DIFFERENT CONTEXT
CTRL 1 velocity · CTRL 2 długość · CTRL 3 nudge. Trzymaj pad kroku, aby zmienić jedną nutę. Bez pada wszystkie nuty ścieżki dostają tę samą wartość.|CTRL 1 velocity · CTRL 2 length · CTRL 3 nudge. Hold a step pad to change one note. Without a pad, every note on the track receives the same value.
CTRL 1 panorama · CTRL 2 bus B1 / B2 / DRY · CTRL 3 poziom.|CTRL 1 pan · CTRL 2 bus B1 / B2 / DRY · CTRL 3 level.
CTRL 1–3 zmieniają parametry otwartego efektu. Tu możesz nagrać ruchy pokręteł.|CTRL 1–3 adjust the open effect’s parameters. You can record knob movements here.
WSZYSTKIE|ALL
CZYNNOŚCI →|CONTROLS →
NIE WIESZ, CO ROBI PRZYCISK?|UNSURE WHAT A BUTTON DOES?
Trzymaj SHIFT przez 3 sekundy. W trybie pomocy dotknij przycisku lub pokrętła, aby zobaczyć opis dla aktualnego ekranu. EXIT kończy pomoc.|Hold SHIFT for 3 seconds. In help mode, try a button or knob to see its function on the current screen. EXIT leaves help.
POMOC NA SPRZĘCIE →|ON-DEVICE HELP →
Skróty obowiązują w DOOM OS i wskazanym widoku. ★ zapisuje czynność w MY KIT.|Controls apply to DOOM OS and the indicated view. ★ saves an action to MY KIT.
← WSZYSTKIE W TEJ KATEGORII|← ALL IN THIS CATEGORY
np. nudge, solo, SHIFT, automatyka|e.g. nudge, solo, SHIFT, automation
szukaj sterowania DOOM OS|search DOOM OS controls
kategorie DOOM OS|DOOM OS categories
★ ULUBIONE|★ FAVOURITES
CZYNNOŚCI|CONTROLS
Brak pasujących czynności. Zmień kategorię, zapytanie lub filtr ulubionych.|No matching controls. Change the category, query or favourites filter.
WERSJE I ZAKRES|VERSIONS AND SCOPE
Sprawdzono|Reviewed
: wydanie|: release
bazuje na Roland|is based on Roland
. Quickstart autora nadal ma oznaczenie|. The author’s Quickstart is still labelled
Wersja 0.6.2 poprawia zawieszanie skrótu AUTO TRIG na MARK i dodaje wyświetlanie sum kontrolnych w patcherze. Opis sterowania w tej aplikacji oparto na Quickstart 0.6.1. Nie sprawdzono procedur na fizycznym SP.|Version 0.6.2 fixes the AUTO TRIG shortcut hanging on MARK and adds checksum display to the patcher. This app’s controls follow Quickstart 0.6.1. Procedures have not been tested on a physical SP.
Quickstart i changelog różnią się opisem kolejności trybów metronomu. Dlatego wybieraj tryb, sprawdzając nazwę na ekranie urządzenia.|The Quickstart and changelog describe different metronome cycling orders. Choose a mode by checking its name on the device screen.
Patterny 5/4, 6/4 i 7/4 są w DOOM OS tylko do podglądu pierwszych 16 kroków taktu. Metrum nowego patternu ustaw w stockowym RECORD SETTING przed nagrywaniem.|In DOOM OS, 5/4, 6/4 and 7/4 patterns are view only, showing the first 16 steps per bar. Set a new pattern’s time signature in stock RECORD SETTING before recording.
Changelog autora ↗|Author’s changelog ↗
INSTALACJA WEDŁUG AUTORA|AUTHOR’S INSTALLATION GUIDE
DOOM OS to nieoficjalna modyfikacja firmware w fazie alpha. Autor zaleca kopię danych przed instalacją; modyfikacja może wpływać na gwarancję.|DOOM OS is an unofficial firmware modification in alpha. The author recommends backing up data before installation; modification may affect the warranty.
Zrób backup danych SP. Pobierz oficjalny system Roland 5.52 i rozpakuj go.|Back up SP data. Download and unpack the official Roland 5.52 system.
W patcherze autora wybierz|In the author’s patcher, select
. Patcher sprawdza zgodność pliku i sumy kontrolne, a przetwarzanie odbywa się w przeglądarce. APP0 nie jest potrzebny do tej procedury.|. The patcher checks file compatibility and checksums, processing in the browser. APP0 is not needed for this procedure.
Zapisz zmodyfikowany|Save the modified
w katalogu głównym karty SD.|in the SD card’s root directory.
Włóż kartę, trzymaj SHIFT podczas włączania SP. Po pojawieniu się menu aktualizacji naciśnij VALUE.|Insert the card and hold SHIFT while powering on the SP. Press VALUE when the update menu appears.
Po zakończeniu aktualizacji wyłącz i ponownie włącz urządzenie.|After the update completes, turn the device off and on again.
Powrót do oryginalnego systemu: użyj procedury aktualizacji z oryginalnym firmware Roland.|To return to the original system, follow the update procedure using original Roland firmware.
PATCHER AUTORA ↗|AUTHOR’S PATCHER ↗
Aktualna instrukcja instalacji autora ↗|Author’s current installation instructions ↗
Polskie opracowanie do używania obok samplera. Treść działa offline po pełnym załadowaniu aplikacji; zewnętrzne źródła wymagają internetu.|A companion guide for use beside your sampler. Content works offline once the app has fully loaded; external sources require internet.
Pełny Quickstart autora ↗|Author’s full Quickstart ↗
Źródła i weryfikacja →|Sources and verification →
JESTEM NA EKRANIE|ON THIS SCREEN
CO WIDZISZ NA SP?|WHAT’S ON YOUR SP SCREEN?
Wybierz ekran urządzenia. Poniżej zobaczysz pasujące pokrętła i czynności.|Choose the device screen to see its knob functions and relevant controls.
ekran urządzenia|device screen
TR-REC · WSTAWIANIE KROKÓW|TR-REC · STEP ENTRY
Wybrany pusty pattern; ustawiasz parametry przed rozpoczęciem zapisu.|An empty pattern is selected; set its parameters before recording.
LENGTH · liczba taktów|LENGTH · number of bars
Pełny opis TR-REC|Full TR-REC guide
TR-REC jest aktywne. Parametry wybierasz przed wstawieniem nuty. CTRL 1 zależy od trybu TRIG / HOLD STEP.|TR-REC is active. Choose parameters before inserting a note. CTRL 1 depends on TRIG / HOLD STEP mode.
Porównaj z siatką DOOM OS|Compare with the DOOM OS grid
Edytujesz granice aktywnego sampla. Punkt pętli jest dostępny przy włączonym LOOP.|Edit the active sample’s boundaries. The loop point is available when LOOP is enabled.
LOOP POINT (przy LOOP)|LOOP POINT (with LOOP enabled)
Edycja sampla i granice|Sample editing and boundaries
Tempo i wysokość aktywnego sampla. VINYL MODE wiąże pitch ze speed.|Tempo and pitch of the active sample. VINYL MODE links pitch to speed.
Pitch, speed i envelope|Pitch, speed and envelope
Gałki odpowiadają parametrom wyświetlonego efektu. Ich nazwy zmieniają się wraz z efektem.|The knobs control the displayed effect’s parameters. Their names change with the effect.
Parametr 1 efektu|Effect parameter 1
Parametr 2 efektu|Effect parameter 2
Parametr 3 efektu|Effect parameter 3
Efekty i routing|Effects and routing
VALUE wybiera ścieżkę. Trzymaj pad kroku podczas edycji jednej nuty; bez pada wszystkie nuty ścieżki otrzymają tę samą wartość.|VALUE selects a track. Hold a step pad to edit one note; without a pad, every note on the track receives the same value.
Zobacz zmianę w Groove Lab|See the change in Groove Lab
RECORD SETTING → MIXER. Obrót VALUE wybiera ścieżkę; EXIT wraca do siatki.|RECORD SETTING → MIXER. Turn VALUE to select a track; EXIT returns to the grid.
PAD 5 daje oryginalny pitch. Trzymaj pad kroku i wybierz wysokość drugim padem.|PAD 5 gives the original pitch. Hold a step pad and choose a pitch with another pad.
REC raz = próba; REC ponownie = zapis. EXIT kończy nagrywanie.|REC once = rehearsal; REC again = recording. EXIT ends recording.
Zależnie od otwartego widoku|Depends on the open view
Uruchom workflow nagrania|Start the recording workflow
Na otwartej stronie FX gałki sterują parametrami efektu. REC dwa razy uruchamia zapis ruchów.|On an open FX page, the knobs control effect parameters. Press REC twice to record movements.
Nagraj automatykę FX|Record FX automation
SHIFT + MARK otwiera ekran. VALUE wybiera parametr, SHIFT + VALUE inny efekt, REMAIN + VALUE inny takt.|SHIFT + MARK opens the screen. VALUE selects a parameter, SHIFT + VALUE another effect, REMAIN + VALUE another bar.
DWA SPOSOBY|TWO METHODS
TEN SAM CEL, DWIE DROGI|SAME GOAL, TWO METHODS
Porównaj czynności w obu systemach i wybierz metodę pasującą do swojej sesji.|Compare the controls in both systems and choose the method that suits your session.
cel porównania|comparison goal
Wygodne, gdy:|Useful for:
Uważaj:|Watch for:
OTWÓRZ INSTRUKCJĘ →|OPEN THE GUIDE →
STOPA NA CZTERY|FOUR-ON-THE-FLOOR KICK
Jeden takt 4/4, stopa na krokach 1, 5, 9 i 13. Przygotuj ten sam sample i pusty pattern.|One 4/4 bar with a kick at steps 1, 5, 9 and 13. Prepare the same sample and an empty pattern.
PATTERN SELECT, potem REC i pusty pad patternu.|PATTERN SELECT, then REC and an empty pattern pad.
REMAIN wybiera TR-REC. Przed zapisem ustaw LENGTH 1 przez CTRL 2 i metrum 4/4 przez SHIFT + CTRL 2; CTRL 1 ustawia BPM.|REMAIN selects TR-REC. Before recording, set LENGTH 1 with CTRL 2 and 4/4 with SHIFT + CTRL 2; CTRL 1 sets BPM.
REC rozpoczyna TR-REC. Trzymaj SUB PAD i wybierz sample padem.|REC starts TR-REC. Hold SUB PAD and select a sample pad.
Wybierz parametry nuty, potem stuknij kroki 1, 5, 9 i 13.|Choose note parameters, then tap steps 1, 5, 9 and 13.
EXIT kończy zapis i zapisuje pattern; drugie EXIT zatrzymuje odtwarzanie.|EXIT finishes recording and saves the pattern; a second EXIT stops playback.
Szybkie wstawianie rytmu z parametrami wybranymi przed wpisaniem nuty.|Quick rhythm entry with parameters selected before inserting each note.
Gałki w RECORD SETTING mają inne funkcje niż podczas wstawiania kroków.|The knobs in RECORD SETTING have different functions from those during step entry.
DOOM OS · SIATKA|DOOM OS · GRID
REMAIN + SUB PAD otwiera edytor. Trzymaj PATTERN SELECT i wybierz pusty pad patternu.|REMAIN + SUB PAD opens the editor. Hold PATTERN SELECT and select an empty pattern pad.
Użyj patternu 4/4. RECORD SETTING dwa razy → LENGTH 1; SHIFT + PAD 11 ustawia tempo przez VALUE.|Use a 4/4 pattern. RECORD SETTING twice → LENGTH 1; SHIFT + PAD 11 sets tempo using VALUE.
Trzymaj SUB PAD, wybierz sample i zwolnij SUB PAD.|Hold SUB PAD, select a sample and release SUB PAD.
W siatce stuknij kroki 1, 5, 9 i 13. PATTERN SELECT uruchamia odtwarzanie.|In the grid, tap steps 1, 5, 9 and 13. PATTERN SELECT starts playback.
Trzymaj pad kroku, aby zmienić jedną nutę. Zatrzymaj przez PATTERN SELECT; EXIT z głównej siatki zamyka i zapisuje.|Hold a step pad to edit one note. Stop with PATTERN SELECT; EXIT on the main grid closes and saves.
Widzisz ścieżki i położenie nut; wygodna edycja po ich wpisaniu.|Visible tracks and note positions, with convenient editing after entry.
Gałka bez trzymania pada nadaje tę samą wartość wszystkim nutom ścieżki. Metrum 5/4–7/4 jest tylko do podglądu.|A knob without a held pad sets all track notes to the same value. Time signatures 5/4–7/4 are view only.
PARTIA ZAGRANA Z RĘKI|LIVE PAD PERFORMANCE
Zapisz krótką partię padów, wcześniej ją ćwicząc. Przygotuj bank sampli i pusty pattern.|Record a short pad performance after rehearsing it. Prepare a sample bank and an empty pattern.
PATTERN SELECT, REC, pusty pad patternu.|PATTERN SELECT, REC, empty pattern pad.
REMAIN wybiera Real-Time. Przed nagraniem ustaw długość i tempo.|REMAIN selects Real-Time. Set length and tempo before recording.
REC rozpoczyna zapis. Kolejne REC przełącza między nagrywaniem i próbą.|REC starts recording. Further REC presses switch between recording and rehearsal.
W próbie ćwicz bez zapisu, potem przełącz REC na nagrywanie i zagraj partię.|Rehearse without recording, then switch REC to recording and play the passage.
EXIT kończy zapis i zapisuje pattern; drugie EXIT zatrzymuje.|EXIT finishes recording and saves the pattern; a second EXIT stops playback.
Overdub kolejnych sampli i opcje quantize podczas nagrania.|Overdubbing additional samples and quantise options while recording.
Pierwsze REC ze standby uruchamia zapis. Sprawdź stan przed graniem.|The first REC from standby starts recording. Check the state before playing.
W otwartym patternie HOLD przełącza pady na granie sampli.|In an open pattern, HOLD switches pads to sample playback.
REC raz uruchamia próbę bez zapisu.|REC once starts rehearsal without recording.
SHIFT + REC wybiera SINGLE, MULTI lub CHROMATIC.|SHIFT + REC selects SINGLE, MULTI or CHROMATIC.
REC ponownie uruchamia zapis; zagraj partię.|REC again starts recording; play the passage.
EXIT kończy zapis. Sprawdź nuty i odsłuchaj pattern.|EXIT ends recording. Check the notes and listen to the pattern.
Próba jest pierwszym etapem; wynik można od razu poprawić w siatce.|Rehearsal comes first; immediately refine the result in the grid.
SHIFT + REC zmienia tryb w DOOM OS; w stockowym systemie kombinacja ma inny kontekst.|SHIFT + REC changes mode in DOOM OS; in the stock system the combination has a different context.
RUCH FX ZAPISANY W BEACIE|FX MOVEMENT IN A BEAT
Pattern odtwarza ruch parametrów efektu. Przygotuj pattern i słyszalny efekt na właściwym busie.|The pattern plays effect parameter movements. Prepare a pattern and an audible effect on the correct bus.
PATTERN SELECT i pad istniejącego patternu uruchamiają odtwarzanie.|PATTERN SELECT and an existing pattern pad start playback.
REC uruchamia nagrywanie patternu.|REC starts pattern recording.
MARK rozpoczyna EFX MOTION REC; ekran pokazuje MOTION REC START.|MARK starts EFX MOTION REC; the screen shows MOTION REC START.
Zmieniaj parametry i włączaj efekty podczas gry patternu.|Adjust parameters and toggle effects while the pattern plays.
EXIT kończy zapis. START/END przełącza odtwarzanie motion; miganie oznacza ON.|EXIT ends recording. START/END toggles motion playback; flashing means ON.
Nagrywanie operacji efektów w istniejącym patternie.|Recording effect operations in an existing pattern.
Wejście w motion wymaga MARK po REC.|Entering motion recording requires MARK after REC.
DOOM OS · AUTOMATYKA|DOOM OS · AUTOMATION
Otwórz stronę efektu na wybranym busie.|Open the effect page on the selected bus.
REC raz daje próbę; drugi raz zapisuje ruchy.|REC once rehearses; a second press records movements.
Zmieniaj CTRL 1–3 podczas odtwarzania.|Adjust CTRL 1–3 during playback.
EXIT kończy zapis. SHIFT + MARK otwiera ekran automatyki.|EXIT ends recording. SHIFT + MARK opens the automation screen.
VALUE wybiera parametr; po otwarciu edycji pad kroku + obrót VALUE zmienia jego wartość. START/END przełącza odtwarzanie ruchów.|VALUE selects a parameter; in its editor, hold a step pad and turn VALUE to change the value. START/END toggles movement playback.
Nagraną automatykę możesz obejrzeć i poprawić krok po kroku.|View and refine recorded automation step by step.
Sposób zapisu może łączyć lub zastępować wcześniejsze ruchy — sprawdź ustawienia DOOM OS.|Recording may merge or replace earlier movements — check DOOM OS settings.
KROKÓW|STEPS
Ta pozycja nie występuje w aktualnej bibliotece:|This item is not in the current library:
ulubione i własne zestawy|favourites and custom sets
Zapisuj czynności przez ★, potem ułóż własne zestawy do sesji lub grania na żywo. Zestaw może łączyć oba firmware.|Save actions with ★, then arrange your own sets for sessions or live performance. A set can combine both firmware systems.
zestawy MY KIT|MY KIT sets
WSZYSTKIE ULUBIONE|ALL FAVOURITES
NOWY ZESTAW|NEW SET
np. live set, sampling z telefonu|e.g. live set, phone sampling
UTWÓRZ|CREATE
Masz już 30 zestawów.|You already have 30 sets.
nazwa wybranego zestawu|selected set name
ZMIEŃ NAZWĘ|RENAME
DODAJ CZYNNOŚCI Z ULUBIONYCH|ADD ACTIONS FROM FAVOURITES
Zapisz najpierw skrót lub workflow przez ★.|First save a shortcut or workflow with ★.
Przeglądaj skróty →|Browse shortcuts →
Usunąć zestaw „|Delete set “
”? Ulubione zostaną.|”? Favourites will be kept.
TAK, USUŃ ZESTAW|YES, DELETE SET
ANULUJ|CANCEL
usuń ten zestaw|delete this set
pozycji|items
w ulubionych|in favourites
Dodaj czynności z ulubionych powyżej. Potem ustaw ich kolejność strzałkami.|Add actions from favourites above, then arrange them with the arrows.
Zapisz pierwszą czynność przez ★ przy skrócie, workflow lub poradzie FIX IT.|Save your first action with ★ on a shortcut, workflow or FIX IT tip.
PRZEGLĄDAJ SKRÓTY|BROWSE SHORTCUTS
przesuń w górę:|move up:
przesuń w dół:|move down:
usuń z zestawu:|remove from set:
USUŃ|REMOVE
KOPIA ZAPASOWA|BACKUP
Przenieś MY KIT, własne zestawy, postęp, trening, laboratorium groove’u i ustawienia na drugi telefon. Kopia jest plikiem zapisanym u Ciebie.|Move MY KIT, custom sets, progress, practice, Groove Lab and settings to another phone. The backup is a file saved on your device.
POBIERZ KOPIĘ|DOWNLOAD BACKUP
WCZYTAJ KOPIĘ|LOAD BACKUP
plik kopii zapasowej|backup file
Podgląd kopii|Backup preview
zestawów ·|sets ·
ulubionych ·|favourites ·
ukończonych workflow.|completed workflows.
Przywrócenie zastąpi obecne dane aplikacji na tym urządzeniu. Możesz najpierw pobrać aktualną kopię.|Restoring replaces this device’s current app data. You can download a current backup first.
PRZYWRÓĆ DANE Z KOPII|RESTORE BACKUP DATA
Kopia została przygotowana do pobrania.|The backup is ready to download.
Kopia została przywrócona.|The backup has been restored.
Plik jest za duży. Maksymalny rozmiar kopii to 2 MB.|The file is too large. The maximum backup size is 2 MB.
Nie można odczytać kopii.|Cannot read the backup.
wybierz firmware|choose firmware
Ta instrukcja dotyczy|This guide applies to
systemu Roland|Roland firmware
. Wybrany filtr:|. Selected filter:
WYBIERZ|SELECT
Ta przeglądarka nie obsługuje utrzymania włączonego ekranu.|This browser does not support keeping the screen awake.
Ekran pozostaje włączony|Screen stays awake
Utrzymanie ekranu zostało zwolnione przez urządzenie.|The device has released the screen wake lock.
Urządzenie nie pozwoliło utrzymać włączonego ekranu.|The device did not allow keeping the screen awake.
Zobacz i odsłuchaj wpływ velocity, przesunięcia i długości nuty. To model edukacyjny z syntetycznym dźwiękiem. Zmiany zapisują się lokalnie.|See and hear how velocity, nudge and note length interact. This is an educational model with synthetic sound. Changes are saved locally.
Słupek = velocity · punkt = timing · linia = długość|Bar = velocity · dot = timing · line = length
ODTWÓRZ|PLAY
DŹWIĘK|SOUND
WZÓR STARTOWY|STARTING PATTERN
wybór kroku|step selection
KROK|STEP
NUTA ON|NOTE ON
NUTA OFF|NOTE OFF
WSZYSTKIE NUTY|ALL NOTES
TYLKO TA NUTA|ONLY THIS NOTE
Zmiana parametru nada wszystkim nutom tę samą wartość — jak gałka w siatce DOOM OS bez trzymania pada.|Changing a parameter sets all notes to the same value — like a knob in the DOOM OS grid without holding a pad.
tempo laboratorium|lab tempo
velocity nuty|note velocity
przesunięcie nuty|note nudge
długość nuty|note length
DŁUGOŚĆ|LENGTH
kroku|steps
1 takt 4/4, 16 kroków. Ujemny nudge wyprzedza siatkę, dodatni opóźnia. Rzeczywisty czas wybrzmienia sampla zależy też od jego długości i trybu odtwarzania na SP.|One 4/4 bar, 16 steps. Negative nudge plays ahead of the grid, positive nudge behind it. Actual sample duration also depends on sample length and playback mode on the SP.
POKRĘTŁA NA PRAWDZIWYM SP →|KNOBS ON THE REAL SP →
Odsłuch dźwięku jest niedostępny. Nadal możesz korzystać z wizualizacji.|Audio playback is unavailable. You can still use the visualisation.
wersja i kontekst DOOM OS|DOOM OS version and context
Te czynności wykonuj w DOOM OS. Opis sterowania pochodzi z Quickstart|Perform these actions in DOOM OS. Controls follow Quickstart
; projekt jest nieoficjalnym firmware.|; the project is unofficial firmware.
Przewodnik DOOM OS →|DOOM OS guide →
pierwszy pattern|first pattern
kroki i nuty|steps and notes
próba → zapis|rehearse → record
efekty · bus|effects · bus
ruchy FX|FX movements
ustawienia · skróty|settings · shortcuts
wszystkie czynności|all controls
sprawdź krok po kroku|check step by step
TRENING|PRACTICE
powtórki DOOM|DOOM reviews
znajdź funkcję DOOM|find a DOOM function
Wybierz ekran SP i znajdź pokrętła oraz czynności.|Choose an SP screen to find its knobs and controls.
Velocity, nudge i długość nuty w interaktywnej siatce.|Velocity, nudge and note length in an interactive grid.
Porównaj sposoby wykonania tego samego zadania.|Compare methods for the same task.
`.trim().split('\n').map(line => line.split('|').map(part => part.trim())))

export function companionText(value: string, locale: Locale) {
  return locale === 'en' ? (companionEnglish[value.trim()] ?? value) : value
}
export function useC() {
  const { locale } = useLocale()
  return useCallback((value: string) => companionText(value, locale), [locale])
}
export function localizeCompanion<T>(value: T, locale: Locale): T {
  if (locale !== 'en') return value
  if (typeof value === 'string') return companionText(value, locale) as T
  if (Array.isArray(value)) return value.map(item => localizeCompanion(item, locale)) as T
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, localizeCompanion(item, locale)])) as T
  return value
}
