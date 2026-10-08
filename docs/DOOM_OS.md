# DOOM OS w SP Workflow

Przegląd źródeł: 2026-10-08. Moduł `/doom-os` jest polskim opracowaniem czynności do używania przy SP-404MKII, a nie kopią strony autora. Nie zawiera firmware, patchera ani oryginalnych animacji.

## Źródła

- [Quickstart Klangfeld Labs](https://klangfeldlabs.com/doom-os/manual/) — oznaczony **0.6.1 alpha**; podstawowe sterowanie, ścieżki, nuty, widoki, piano roll, nagrywanie, narzędzia patternu, mikser, FX, automatyka i ustawienia.
- [Strona projektu](https://klangfeldlabs.com/doom-os/) i [repozytorium](https://github.com/klangfeld-labs/doom-os) — **0.6.2 alpha, build 3824**, dla oficjalnego firmware Roland **5.52**; instrukcja instalacji i dodatkowe informacje o funkcjach.
- [Changelog](https://github.com/klangfeld-labs/doom-os/blob/main/CHANGELOG.md) — 0.6.2 wydane 2026-10-06; poprawka AUTO TRIG / MARK oraz wyświetlanie sum kontrolnych w patcherze.

Quickstart i changelog 0.6.1 różnią się opisem przełączania metronomu. Aplikacja opisuje nazwy z Quickstart i zaleca sprawdzenie aktywnego trybu na ekranie. Nie rozstrzyga kolejności bez testu na sprzęcie. Patterny 5/4, 6/4 i 7/4 mają ograniczony podgląd i nie są edytowalne w tym wydaniu DOOM OS.

## Integracja

- Ekran NOW ma kartę DOOM OS; mapa 16 padów zachowuje dotychczasowe przypisania i dodatkowy odsyłacz w BROWSE.
- Moduł zawiera start, sterowanie z filtrem kategorii / tekstu / ulubionych oraz wersje i instrukcję instalacji autora.
- Skróty DOOM OS mają osobną kategorię. ALL w dotychczasowym cheat sheet obejmuje system Roland. MY KIT obsługuje oba zestawy i zachowuje oznaczenie źródła.
- Globalna wyszukiwarka otwiera konkretną czynność DOOM OS. Zapytania zawierające DOOM / DOOMOS ograniczają wyniki do tego firmware.
- Trzy workflow wykorzystują istniejący odtwarzacz, potwierdzanie rezultatu, wznowienie i zapis ulubionych. Nieudany krok otwiera pomoc DOOM OS zamiast stockowych procedur Rescue.
- Etykieta DOOM OS / MANUAL oznacza oparcie na dokumentacji Klangfeld Labs. Nie oznacza weryfikacji przez Roland ani testu na fizycznym samplerze.
- Treść, wyszukiwanie i zapis lokalny są częścią PWA i działają offline po pełnym załadowaniu. Łącza do autora, firmware i patchera wymagają internetu.

Treść znajduje się w `src/data/doom.ts`. Przed aktualizacją wersji sprawdź niezależnie Quickstart, stronę projektu i changelog. Test integracyjny: `npm run doom-test` po buildzie, z serwerem podglądu na porcie 4173 lub ustawionym `TEST_BASE_URL`.
