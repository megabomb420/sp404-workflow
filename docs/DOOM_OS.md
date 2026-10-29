# DOOM OS w SP Workflow

## Aktualizacja 0.7.1 — 2026-10-29

Na podstawie [Quickstart](https://klangfeldlabs.com/doom-os/manual/) i [informacji autora o wydaniu](https://klangfeldlabs.com/doom-os/): wersja 0.7.1, build E7F5, firmware Roland 5.52. Nagłówek Quickstart zachowuje 0.7. Zaktualizowano bounce z wyborem pada, odsłuch i zmianę instrumentów, sterowanie padami miksera, limit EQ 16 padów oraz tryb nagrywania 16 VEL. Zachowano istniejące ID i dane użytkownika. Nie wykonano testu na fizycznym samplerze.


## Aktualizacja 0.7 beta — 2026-10-27

Źródło: dostarczony przez użytkownika plik `C:\temp\DOOM OS Quickstart.html`, zapisany ze strony https://klangfeldlabs.com/doom-os/beta/manual/. Nagłówek i stopka wskazują DOOM OS 0.7. SHA-256 pliku: `a2e4cd0523979b80fa71c86448a7929c7ac025bc11def399e833d35c9b6bc57f`. Oryginalnego HTML, czcionek i ilustracji nie publikujemy; aplikacja zawiera własne opracowanie PL/EN.

Dodano 33 czynności (łącznie 111), sześć kategorii funkcji i pięć kontekstów ekranów. Nowości: bounce ścieżki / odsłuchu, instrumenty i kity, locki, ARP / PRINT ARP, EQ, waveform, sidechain i opcje startu / wyjścia. Zachowano istniejące ID, trzy workflow i stan użytkownika.

Istotne korekty: 11 kroków undo i limit 512 nut/ruchów; zapisany pattern po starcie trzeba najpierw odtworzyć; przełączanie patternów oczekuje na ich koniec; REC wyłącza HOLD; ustawienia SHIFT + PAD 13 otwiera się na ekranach stockowych, nie wewnątrz DOOM; metronom ON / RECPLAY / OFF; EFX MOTION PLAY OFF wyłącza efekty obu busów.

Manual wyraźnie ostrzega o nieodwracalnym usunięciu sampli przy OVERWRITE BANK i usunięciu instrumentu. PRINT ARP zastępuje nuty ścieżki. Limity locków i brak EQ w EXPORT/BACKUP urządzenia są opisane przy właściwych czynnościach. Kopia SP Workflow przechowuje notatki i postęp, nie dane firmware czy audio SP.

Link patchera zaktualizowano do https://klangfeldlabs.com/doom-os/beta/patcher/. Samej strony patchera nie udało się odczytać: numer buildu i wymagana wersja Rolanda pozostają niepotwierdzone. Nie przenosimy oznaczenia 3824 / Roland 5.52 ze starej alphy na betę. Nie wykonano testu na fizycznym samplerze.

## Historia integracji alphy


Przegląd źródeł DOOM: 2026-10-08. Moduł `/doom-os` zawiera polskie i angielskie opracowanie czynności do używania przy SP-404MKII. Nie zawiera firmware, patchera ani oryginalnych animacji.

## Źródła

- [Quickstart Klangfeld Labs](https://klangfeldlabs.com/doom-os/manual/) — oznaczony **0.6.1 alpha**; podstawowe sterowanie, ścieżki, nuty, widoki, piano roll, nagrywanie, narzędzia patternu, mikser, FX, automatyka i ustawienia.
- [Strona projektu](https://klangfeldlabs.com/doom-os/) i [repozytorium](https://github.com/klangfeld-labs/doom-os) — **0.6.2 alpha, build 3824**, dla oficjalnego firmware Roland **5.52**; instrukcja instalacji i dodatkowe informacje o funkcjach.
- [Changelog](https://github.com/klangfeld-labs/doom-os/blob/main/CHANGELOG.md) — 0.6.2 wydane 2026-10-06; poprawka AUTO TRIG / MARK oraz wyświetlanie sum kontrolnych w patcherze.

Quickstart i changelog 0.6.1 różnią się opisem przełączania metronomu. Aplikacja opisuje nazwy z Quickstart i zaleca sprawdzenie aktywnego trybu na ekranie. Nie rozstrzyga kolejności bez testu na sprzęcie. Patterny 5/4, 6/4 i 7/4 mają ograniczony podgląd i nie są edytowalne w tym wydaniu DOOM OS.

## Integracja

- Ekran NOW ma kartę DOOM OS i narzędzia. W trybie Roland mapa 16 padów zachowuje dotychczasowe przypisania, a w trybie DOOM prowadzi do jego siatki, ścieżek, nut, piano roll, nagrywania, pattern tools, miksera, FX, automatyki, widoków, ustawień, sterowania, pomocy, treningu i wyszukiwania. Pady są stale widoczne.
- Moduł zawiera start, sterowanie z filtrem kategorii / tekstu / ulubionych oraz wersje i instrukcję instalacji autora.
- Skróty DOOM OS mają osobną kategorię. ALL i lista workflow korzystają z globalnego wyboru firmware. MY KIT obsługuje oba systemy, własne uporządkowane zestawy i zachowuje oznaczenie źródła.
- Globalna wyszukiwarka otwiera konkretną czynność DOOM OS. Zapytania zawierające DOOM / DOOMOS ograniczają wyniki do tego firmware.
- Trzy workflow wykorzystują istniejący odtwarzacz, potwierdzanie rezultatu, wznowienie i zapis ulubionych. Nieudany krok otwiera FIX IT DOOM: pojedyncze sprawdzenia objawu i powrót do tego samego kroku. Obejmuje tryb padów, ciszę, nagrywanie, automatykę i przypadkową edycję całej ścieżki.
- MY KIT zapisuje projekt, bank/pad, BPM i uwagi. Trening DOOM zawiera czynności nawigacji i pomocy, bez kasowania danych. Terminy powtórek są lokalne: sukces po 1/3/7/14/30 dniach, pomyłka po 10 minutach. Kopia zapasowa obejmuje notatki i terminy.
- Etykieta Z DOKUMENTACJI wraz ze źródłem DOOM OS oznacza oparcie na manualu Klangfeld Labs. Szczegóły źródła pokazują datę przeglądu oraz brak testu na fizycznym samplerze.
- Treść, wyszukiwanie i zapis lokalny są częścią PWA i działają offline po pełnym załadowaniu. Łącza do autora, firmware i patchera wymagają internetu.

Treść znajduje się w `src/data/doom.ts`. Przed aktualizacją wersji sprawdź niezależnie Quickstart, stronę projektu i changelog. Test integracyjny: `npm run test:companion` po `npm run build:pages:cf`; test sam uruchamia podgląd statyczny na porcie 4175. `COMPANION_URL` wybiera istniejący serwer. Starsze dane pod `spw.state.v1` są normalizowane bez utraty postępu i ulubionych.

## Odsłuch SP

`/listen` udostępnia publiczne materiały Rolanda (przegląd źródeł 2026-10-09): [demonstracje efektów](https://articles.roland.com/watch-10-creative-sp-404mkii-performance-effects-in-action/), [video manual Roland Cloud Academy z rozdziałem Resampling Method w 19:33](https://www.youtube.com/watch?v=WLJcGjkbBig&t=1173s) i [prezentację sidechainu 5.50 powiązaną na stronie produktu](https://www.roland.com/global/products/sp-404mk2/). Odtwarzacz uruchamia użytkownik. Filmy pozostają na serwerach wydawców, wymagają internetu i mają bezpośredni link na wypadek zablokowania osadzenia. Podpowiedzi odsłuchu i ćwiczenia przed/po są dostępne offline. To demonstracje autorów; nie oznaczają testu na naszym fizycznym samplerze. Groove Lab nadal używa jawnie oznaczonego syntetycznego dźwięku.
