import { Section } from '../types'

export const section: Section = {
  id: 'skipback',
  pad: 6,
  title: 'SKIP BACK',
  short: 'graj bez REC, wróć w czasie',
  body: [
    {
      kind: 'intro',
      text: 'Skip Back cały czas nagrywa to, co grasz (do 25 s domyślnie). Dobre przejście, którego nie nagrałeś? Wróć i zapisz. Graj pierwszy, decyduj później.',
    },
    {
      kind: 'note',
      text: 'Bufor: 25 s domyślnie. SYSTEM → MARK Function: SBS Long wydłuża do 40 s; Looper przełącza funkcję MARK na looper (wyklucza skip back).',
      source: { manual: 'RM5.50', page: 38 },
    },
    {
      kind: 'steps',
      title: 'ZŁAP TO, CO GRAŁO',
      steps: [
        {
          id: 'k1',
          title: 'GRAJ',
          action: 'Graj sample/pattern lub wejście. Gdy poziom przekracza Auto Trig Level, bufor nagrywa — MARK miga.',
          expectedResult: 'MARK miga — bufor skip back zapisuje to, co grasz.',
          commonMistake: 'MARK nie miga = bufor nie nagrywa (za niski poziom). Podbij Auto Trig Level albo głośność.',
          source: { manual: 'RM5.50', page: 38 },
          kind: 'verified',
        },
        {
          id: 'k2',
          title: 'WRÓĆ',
          action: 'Wciśnij MARK — "SKIP BACK..." i waveform bufora.',
          buttons: ['MARK'],
          expectedResult: 'Na ekranie przebieg ostatnich sekund — możesz odsłuchać.',
          commonMistake: 'Przyciskasz MARK, gdy nie migał — "No SKIP BACK Trigger Data", bufor pusty.',
          source: { manual: 'RM5.50', page: 38 },
          kind: 'verified',
        },
        {
          id: 'k3',
          title: 'ZAPISZ',
          action: 'REC → wybierz pad. Bufor przepada po EXIT lub wyłączeniu — zapisz od razu.',
          buttons: ['REC'],
          expectedResult: 'Audio z bufora ląduje na padzie jako nowy sample.',
          commonMistake: 'Zostawiasz na później — po EXIT/wyłączeniu bufor znika bezpowrotnie.',
          source: { manual: 'RM5.50', page: 38 },
          kind: 'verified',
        },
      ],
    },
    {
      kind: 'note',
      text: 'SYSTEM → Auto Trig Level (1–10): próg startu nagrywania bufora; poniżej progu przez 3 s nagrywanie pauzuje.',
      source: { manual: 'RM5.50', page: 121 },
    },
    {
      kind: 'tip',
      text: 'Filozofia: PLAY FIRST. DECIDE LATER. Nie zatrzymuj się, żeby "zacząć nagrywać" — wciśnij MARK po fakcie.',
    },
    { kind: 'h', title: '5 TECHNIK' },
    {
      kind: 'steps',
      title: 'HAPPY ACCIDENT',
      steps: [
        { id: 't1a', title: 'GRAJ', action: 'Grasz bez REC. Coś dobrego się wydarzyło.', kind: 'tip' },
        { id: 't1b', title: 'Zapisz przypadek', action: 'MARK → REC → wybierz pad.', buttons: ['MARK'], kind: 'tip' },
      ],
    },
    {
      kind: 'steps',
      title: 'FX HUNTING',
      steps: [
        { id: 't2a', title: 'KOMBIŃ', action: 'Kręcisz efektami, nie nagrywasz.', kind: 'tip' },
        { id: 't2b', title: 'Łów brzmienia', action: 'Po dobrym momencie: MARK → REC → pad.', buttons: ['MARK'], kind: 'tip' },
      ],
    },
    {
      kind: 'steps',
      title: 'DRUM FILL CAPTURE',
      steps: [
        { id: 't3a', title: 'ZAGRAJ FILL', action: 'Fill perkusyjny w patternie — niech przejdzie.', kind: 'tip' },
        { id: 't3b', title: 'Fill na padzie', action: 'MARK → REC → zapisz jako osobny sample.', buttons: ['MARK'], kind: 'tip' },
      ],
    },
    {
      kind: 'steps',
      title: 'LIVE CHOP CAPTURE',
      steps: [
        { id: 't4a', title: 'CHOP NA ŻYWO', action: 'Chopujesz palcami po padach, bez nagrania.', kind: 'tip' },
        { id: 't4b', title: 'Zamroź improwizację', action: 'MARK → REC → cała improwizacja jako sample.', buttons: ['MARK'], kind: 'tip' },
      ],
    },
    {
      kind: 'steps',
      title: 'RESAMPLE WITHOUT REC',
      steps: [
        { id: 't5a', title: 'BUDUJ', action: 'Układasz warstwy na żywo.', kind: 'tip' },
        { id: 't5b', title: 'Resample bez REC', action: 'MARK → REC → nowy pad — jak resample bez arming.', buttons: ['MARK'], kind: 'tip' },
      ],
    },
    { kind: 'link', title: 'WORKFLOW: CAPTURE SKIP BACK', route: '/workflow/capture-skip-back' },
  ],
}
