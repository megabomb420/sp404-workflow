<div align="center">

# SP WORKFLOW

**Interaktywny, offline-first przewodnik workflow po samplerze Roland SP-404MKII** — PWA, która wygląda i działa jak companion app do sprzętu, nie jak strona dokumentacji.

`Manual, którego użyjesz przy robieniu beatu — nie na kanapie.`

[![CI](https://github.com/megabomb420/sp404-workflow/actions/workflows/ci.yml/badge.svg)](https://github.com/megabomb420/sp404-workflow/actions/workflows/ci.yml)
[![Deploy](https://github.com/megabomb420/sp404-workflow/actions/workflows/deploy.yml/badge.svg)](https://github.com/megabomb420/sp404-workflow/actions/workflows/deploy.yml)
[![Live](https://img.shields.io/badge/Live-GitHub%20Pages-2ea44f)](https://megabomb420.github.io/sp404-workflow/)

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-offline-5A0FC8?logo=pwa&logoColor=white)

</div>

---

## 🔥 Co to jest

Companion app do **Rolanda SP-404MKII** do używania *obok* samplera — na telefonie. Znajdziesz tu dokładne sekwencje przycisków, workflow krok po kroku, cheat sheety i trener muscle memory. Nie zastępuje manuala — zamienia go w szybkie, wizualne narzędzie.

**Najważniejsze:** każdy fakt merytoryczny jest zweryfikowany względem **Roland Reference Manual v5.50** i opatrzony paginacją (`RM5.50 p.X`). Porady praktyczne są oznaczone osobno jako **WORKFLOW TIP**.

## ✨ Funkcje

- **16 padów** jako mapa urządzenia → 12 sekcji merytorycznych
- **MiniDisplay (LCD)** komunikujący realny stan: sekcję, krok, licznik wyników, READY
- **Wyszukiwarka offline** z aliasami — wpisz `sidechain`, `ducking`, `skipback`, `chop`, `USB` i dostajesz ścieżkę przycisków
- **Workflow krok po kroku** (Build a Beat — 11 kroków, 8-bar pattern, 8 quick workflow) z zapisanym postępem
- **Cheat sheet skrótów** z filtrami po kategoriach + **MY KIT** (ulubione)
- **Trener muscle memory** — losowanie zadań, POKAŻ ODPOWIEDŹ
- **Sekcja SIDECHAIN** (funkcja z firmware **5.50**) z prawdziwymi parametrami, 3 presetami startowymi i **interaktywnym eksploratorem** (pokrętła + wykres duckingu)
- **FIX IT** — 18 problemów (clipping, loop click, routing…) w formacie *Problem → Dlaczego → Fix*
- **PWA**: instalacja na ekran główny, działa w 100% offline po pierwszym załadowaniu

## 🚀 Live & instalacja

**https://megabomb420.github.io/sp404-workflow/**

1. Otwórz link na telefonie (iPhone / Android).
2. Dodaj do ekranu głównego (Safari: *Udostępnij → Dodaj do ekranu głównego*; Chrome: *Zainstaluj aplikację*).
3. Gotowe — działa offline, bez logowania, dane trzyma lokalnie.

## 🧰 Stack

React 18 · TypeScript (strict) · Vite 5 · CSS (design tokens) · vite-plugin-pwa (Workbox) · react-router (hash) · localStorage. Bez backendu, bez ciężkich bibliotek UI.

## ⚡ Szybki start

```bash
git clone https://github.com/megabomb420/sp404-workflow.git
cd sp404-workflow
npm install

npm run dev       # development
npm run build     # tsc (strict) + vite build → dist/
npm run preview   # podgląd buildu
```

## ✅ Testy i audit

Testy działają na headless Chromium (Playwright) — `npx playwright install chromium` po instalacji.

```bash
npm run audit          # 12 kontroli funkcjonalnych przy 390 px
npm run offline-test   # działanie offline po pierwszym załadowaniu
npm run explorer-test  # interaktywne pokrętła SIDE CHAIN
npm run shots          # screenshoty ekranów + kontrola horizontal overflow
```

Te same testy lecą w **CI** przy każdym pushu, a **deploy** wypycha build na GitHub Pages.

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

- **ROLAND / VERIFIED** — fakt zacytowany z manuala, z paginacją `RM5.50 p.X`.
- **WORKFLOW TIP** — praktyczna porada workflow, nie cytat z manuala.
- Źródła: **Roland SP-404MKII Reference Manual v5.50** (edycja HTML 404 Day 2026 + PDF v5, 07.2025).
- Fakty zweryfikowane **2026-08-19**. Szczegóły i lista ustaleń w sekcji **SOURCES & VERSION** w aplikacji.

## ⚠️ Zastrzeżenie

**SP-404MKII** i **Roland** są znakami towarowymi Roland Corporation. Aplikacja jest **nieoficjalna** — nie jest powiązana ani autoryzowana przez Roland. Design inspirowany sprzętem, ale nie kopiuje wyglądu produktu.

## 📜 Licencja

© 2026 myby — **Wszelkie prawa zastrzeżone.** Kod jest publiczny do wglądu i nauki. Nazwy funkcji, skróty i parametry SP-404MKII pochodzą z manuala Roland i należą do Roland Corporation.
