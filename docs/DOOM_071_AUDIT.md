# DOOM OS 0.7.1 — przegląd zmian

Przegląd 2026-10-29. Oficjalna [strona autora](https://klangfeldlabs.com/doom-os/) podaje 0.7.1, build E7F5, dla Roland 5.52. [Quickstart](https://klangfeldlabs.com/doom-os/manual/) ma nagłówek 0.7, lecz zawiera zaktualizowane opisy funkcji 0.7.1. W chwili przeglądu aplikacja opisywała betę 0.7.

- Bounce wymaga teraz wskazania wolnego pada i uruchomienia przez RESAMPLE albo VALUE. Zajęty pad jest odrzucany. Poprzednie opisy automatycznego wyboru pada i potwierdzenia YES wymagają korekty.
- Przeglądarka instrumentów pozwala odsłuchać wybrany instrument przez przytrzymanie SUB PAD i wybierać kolejne podczas odsłuchu. W edytorze REMAIN otwiera przeglądarkę z natychmiastowym odsłuchem kolejnego instrumentu; VALUE rozpoczyna potwierdzenie zamiany, EXIT przywraca oryginał.
- Mikser pozwala wyciszać pady przez dotknięcie i przełączać solo ścieżki przez REMAIN + pad. SHIFT + VALUE dla wybranej ścieżki oraz SHIFT + ROLL pozostają opisane w Quickstart.
- EQ obejmuje do 16 padów, a nie 8. Po pokazaniu EQ przez PITCH/SPEED pierwszy obrót CTRL otwiera edycję i zmienia pasmo; VALUE otwiera edycję bez zmiany wartości.
- Nagrywanie ma dodatkowy tryb 16 VEL; SHIFT + pad 2 przełącza go w siatce. Wymaga wybranej ścieżki.

Przed wdrożeniem sprawdzić wszystkie powiązane skróty, konteksty ekranów, workflow, źródła, oba języki, zachowanie offline oraz zgodność istniejących danych. Nie oznaczać aktualizacji jako opublikowanej bez testów i wdrożenia.
