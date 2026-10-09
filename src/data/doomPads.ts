import type { HomePad } from './sections'

// App navigation in DOOM mode, not an emulation of the SP's current pad state.
export const doomPads: HomePad[] = [
  { pad: 1, label: 'START DOOM', sublabel: 'pierwszy pattern', route: '/workflow/doom-first-pattern' },
  { pad: 2, label: 'SIATKA', sublabel: 'kroki i nuty', route: '/screen?id=grid' },
  { pad: 3, label: 'ŚCIEŻKI', sublabel: 'sample · mute · solo', route: '/doom-os?view=controls&topic=tracks' },
  { pad: 4, label: 'NUTY', sublabel: 'velocity · length · nudge', route: '/doom-os?view=controls&topic=notes' },
  { pad: 5, label: 'PIANO ROLL', sublabel: 'pitch', route: '/screen?id=piano' },
  { pad: 6, label: 'NAGRYWANIE', sublabel: 'próba → zapis', route: '/workflow/doom-live-record' },
  { pad: 7, label: 'PATTERN TOOLS', sublabel: 'quantise · swing', route: '/doom-os?view=controls&topic=tools' },
  { pad: 8, label: 'MIKSER', sublabel: 'pan · bus · level', route: '/screen?id=mixer' },
  { pad: 9, label: 'FX', sublabel: 'efekty · bus', route: '/screen?id=doom-fx' },
  { pad: 10, label: 'AUTOMATYKA', sublabel: 'ruchy FX', route: '/workflow/doom-fx-automation', tone: 'accent' },
  { pad: 11, label: 'TAKTY / WIDOKI', sublabel: 'length · follow · zoom', route: '/doom-os?view=controls&topic=views' },
  { pad: 12, label: 'SYSTEM DOOM', sublabel: 'ustawienia · skróty', route: '/doom-os?view=controls&topic=settings' },
  { pad: 13, label: 'STEROWANIE', sublabel: 'wszystkie czynności', route: '/doom-os?view=controls' },
  { pad: 14, label: 'FIX IT DOOM', sublabel: 'sprawdź krok po kroku', route: '/fix-it?firmware=doom', tone: 'danger' },
  { pad: 15, label: 'TRENING', sublabel: 'powtórki DOOM', route: '/muscle' },
  { pad: 16, label: 'SEARCH', sublabel: 'znajdź funkcję DOOM', route: '/search' },
]
