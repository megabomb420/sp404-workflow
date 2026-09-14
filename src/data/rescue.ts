/** Observation-led navigation. These questions select existing references, not diagnoses. */
export const rescueFamilies = [
  { id: 'input', title: 'WEJŚCIE / CISZA', question: 'Co jest źródłem problemu?', choices: [
    { label: 'Telefon lub komputer przez USB', ids: ['ext-source-usb-brak-dzwieku', 'brak-sygnalu-wejscia', 'brak-dzwieku-z-gniazda'] },
    { label: 'Urządzenie przez kabel audio', ids: ['brak-sygnalu-wejscia', 'brak-dzwieku-z-gniazda'] },
    { label: 'Sygnał słychać, ale jest przesterowany', ids: ['clipping-przesterowany-sample'] },
  ] },
  { id: 'print', title: 'PRINT / EFEKTY', question: 'Co słyszysz po nagraniu?', choices: [
    { label: 'Nowy pad milczy', ids: ['resample-cisza', 'gate-loop-zachowanie', 'brak-dzwieku-z-gniazda'] },
    { label: 'Nagranie jest suche', ids: ['print-jest-suchy', 'zly-routing-bus'] },
    { label: 'Są efekty, których nie chcę', ids: ['niechciany-fx-resampling', 'zly-routing-bus'] },
  ] },
  { id: 'timing', title: 'LOOP / RYTM', question: 'Jak zachowuje się fraza?', choices: [
    { label: 'Loop stopniowo odpływa od patternu', ids: ['bpm-sync-bez-tempa', 'sample-bpm-vs-pattern-bpm'] },
    { label: 'Nuty są nierówno nagrane', ids: ['pattern-nie-gra-w-rytmie', 'quantize-nie-dziala'] },
    { label: 'Na połączeniu pętli słychać klik', ids: ['loop-click', 'zly-start-end'] },
  ] },
  { id: 'playback', title: 'PAD / ODTWARZANIE', question: 'Co dzieje się po zagraniu pada?', choices: [
    { label: 'Ucina się po puszczeniu lub gra w kółko', ids: ['gate-loop-zachowanie', 'zly-start-end'] },
    { label: 'Dźwięki znikają przy graniu kilku padów', ids: ['znikajacy-dzwiek', 'polyphony-ucina-dzwieki'] },
    { label: 'Gra inny dźwięk niż oczekuję', ids: ['sample-gra-nie-tam-gdzie-trzeba'] },
  ] },
]
