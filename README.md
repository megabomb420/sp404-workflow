<div align="center">

# SP WORKFLOW

**Interaktywny, offline-first przewodnik workflow po samplerze Roland SP-404MKII** — PWA, która wygląda i działa jak companion app do sprzętu, nie jak strona dokumentacji.

`Manual, którego użyjesz przy robieniu beatu — nie na kanapie.`

[![CI](https://github.com/megabomb420/sp404-workflow/actions/workflows/ci.yml/badge.svg)](https://github.com/megabomb420/sp404-workflow/actions/workflows/ci.yml)
[![Deploy](https://github.com/megabomb420/sp404-workflow/actions/workflows/deploy.yml/badge.svg)](https://github.com/megabomb420/sp404-workflow/actions/workflows/deploy.yml)
[![Live](https://img.shields.io/badge/Live-GitHub%20Pages-2ea44f)](https://megabomb420.github.io/sp404-workflow/)

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-offline-5A0FC8?logo=pwa&logoColor=white)

</div>

---

## 🔥 Co to jest

Companion app do **Rolanda SP-404MKII** do używania *obok* samplera — na telefonie. Znajdziesz tu dokładne sekwencje przycisków, workflow krok po kroku, cheat sheety i trener muscle memory. Nie zastępuje manuala — zamienia go w szybkie, wizualne narzędzie.

**Źródło wiedzy:** Roland Reference Manual HTML v5.50 oraz PDF v5. Odsyłacze przy instrukcjach otwierają dokumentację online. Porady praktyczne są oznaczone jako **WORKFLOW TIP**. Nie wszystkie procedury przetestowano na fizycznym sprzęcie; opis aktualnego zakresu weryfikacji jest w SOURCES i [handover](docs/HANDOVER.md).

## ✨ Funkcje

- **16 padów** jako mapa urządzenia → 12 sekcji merytorycznych
- **MiniDisplay (LCD)** komunikujący realny stan: sekcję, krok, licznik wyników, READY
- **NOW** — trzy główne ścieżki: źródło → grywalny pad, pattern → print z FX, loop → chopy → pattern; wznowienie ostatniej sesji
- **Wyszukiwarka offline** z polską normalizacją i aliasami; otwiera dokładną akcję, skrót lub hasło i zachowuje zapytanie po powrocie
- **Workflow krok po kroku** — oczekiwany rezultat na SP, potwierdzenia, pominięte kroki, zapis postępu i ulubione. Link do konkretnego kroku nie nadpisuje późniejszego postępu po odświeżeniu
- **Cheat sheet skrótów** z filtrami po kategoriach + **MY KIT** (ulubione)
- **Trener muscle memory** — wspólne akcje z workflow, uczciwa samoocena i lokalna kolejka powtórek z trudności. Odsłonięcie odpowiedzi nie daje zaliczenia
- **Sekcja SIDECHAIN** (funkcja z firmware **5.50**) z prawdziwymi parametrami, 3 presetami startowymi i **interaktywnym eksploratorem** (pokrętła + wykres duckingu)
- **Rescue / FIX IT** — cztery rodziny obserwacji, pojedyncze testy z odpowiedzią „pomogło / bez zmian”, biblioteka 20 porad, powrót do przerwanego kroku bez automatycznego zaliczenia
- **Loop Fit Lab** — lokalne obliczenia czasu frazy 4/4, szacowanego BPM i przesunięcia swobodnej pętli; walidacja, zapis wejść i powrót do sesji
- **PWA**: instalacja na ekran główny; główne funkcje działają offline po pełnym pierwszym załadowaniu. Zewnętrzne manuale wymagają internetu

## 🚀 Live & instalacja

**https://megabomb420.github.io/sp404-workflow/**

1. Otwórz link na telefonie (iPhone / Android).
2. Dodaj do ekranu głównego (Safari: *Udostępnij → Dodaj do ekranu głównego*; Chrome: *Zainstaluj aplikację*).
3. Gotowe — działa offline, bez logowania, dane trzyma lokalnie.

## 🧰 Stack

React 18 · TypeScript (strict) · Vite 7 · CSS (design tokens) · vite-plugin-pwa 1 (Workbox) · react-router 7 (hash) · localStorage. Node **22.12+**. Bez backendu, bez wysyłania danych i bez kluczy API w aplikacji.

## ⚡ Szybki start

```bash
git clone https://github.com/megabomb420/sp404-workflow.git
cd sp404-workflow
npm ci

npm run dev       # development
npm run build     # tsc (strict) + vite build → dist/
npm run preview   # podgląd buildu
```

## ✅ Testy i audit

Testy działają na headless Chromium (Playwright) — `npx playwright install chromium` po instalacji.

```bash
npm run audit          # 22 kontrole funkcjonalne przy 390 px
npm run offline-test   # działanie offline po pierwszym załadowaniu
npm run explorer-test  # interaktywne pokrętła SIDE CHAIN
npm run recent-test    # historia otwartych sekcji
npm run regression-test # sesje, Rescue, trainer, błędne dane, 320–768 px, offline
npm run shots          # screenshoty ekranów + kontrola horizontal overflow
```

Uruchom najpierw `npm run build` oraz `npm run preview -- --port 4173 --strictPort` w drugim terminalu. Dla podkatalogu ustaw `BASE_PATH=/sp404-workflow/` przy buildzie i podglądzie oraz `TEST_BASE_URL=http://localhost:4173/sp404-workflow` przy testach.

CI uruchamia testy dla zmian kodu i konfiguracji. Deploy testuje również faktyczny build z podkatalogiem Pages i publikuje dopiero po powodzeniu kontroli. `npm audit` sprawdza zależności; `npm run audit` to test funkcjonalny aplikacji.

## 🗂 Struktura

```
src/
  app/            # shell, router, onboarding gate
  components/     # hardware UI (Pad, MiniDisplay, ButtonSequence…) + content
  data/           # cała treść — types + shortcuts/sections/workflows/glossary…
  pages/          # ekrany
  state/          # store + localStorage, display context
  styles/         # tokens, base, components, pages
scripts/          # generate-icons.ps1, fetch-fonts.py, testy Playwright
.github/workflows/  # CI + deploy do GitHub Pages
```

Treść dodaje się w `src/data/*` — nowe skróty, sekcje i workflow bez zmian w komponentach.

## 📚 Treść i weryfikacja

- **ROLAND / VERIFIED** — instrukcja opracowana na podstawie manuala, z odsyłaczem do źródła. To nie automatyczna walidacja stanu sprzętu.
- **WORKFLOW TIP** — praktyczna porada workflow, nie cytat z manuala.
- Źródła: **Roland SP-404MKII Reference Manual v5.50** (edycja HTML 404 Day 2026 + PDF v5, 07.2025).
- Ostatni przegląd wybranych instrukcji: **2026-09-14** (resampling patternu, Mix / BOUNCE, BPM, UTILITY). Nie był to pełny ponowny audyt biblioteki. Szczegóły w **SOURCES & VERSION** i [handover](docs/HANDOVER.md).

## ⚠️ Zastrzeżenie

**SP-404MKII** i **Roland** są znakami towarowymi Roland Corporation. Aplikacja jest **nieoficjalna** — nie jest powiązana ani autoryzowana przez Roland. Design inspirowany sprzętem, ale nie kopiuje wyglądu produktu.

## 📜 Licencja

© 2026 myby — **Wszelkie prawa zastrzeżone.** Kod jest publiczny do wglądu i nauki. Nazwy funkcji, skróty i parametry SP-404MKII pochodzą z manuala Roland i należą do Roland Corporation.
