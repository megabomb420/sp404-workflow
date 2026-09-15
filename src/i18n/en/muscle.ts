export type MuscleOverlay = { task: string; hint?: string }

export const muscleEn: Record<string, MuscleOverlay> = {
  'utylity-menu': {
    task: 'Open UTILITY menu',
    hint: 'UTILITY MENU is the gateway to SYSTEM, PAD SET, EFX SET, and IMPORT/EXPORT.',
  },
  'efx-setting-screen': {
    task: 'Open EFX SETTING screen',
  },
  'tap-tempo': {
    task: 'Set tempo by tapping a pad (TAP TEMPO)',
    hint: 'Tap the pad in time, like you’re hitting the beat.',
  },
  'metronome-toggle': {
    task: 'Turn the metronome on or off',
  },
  'count-in-cycle': {
    task: 'Change the count-in setting',
    hint: 'Hold SHIFT and tap PAD 10 — the options cycle: 1MEAS, 2MEAS, WAIT, OFF.',
  },
  'chromatic-mode': {
    task: 'Turn on CHROMATIC',
    hint: 'Pads play the sample chromatically, changing pitch.',
  },
  'fixed-velocity': {
    task: 'Set velocity to a fixed 127 (FIXED VELOCITY)',
  },
  'sixteen-velocity': {
    task: 'Turn on 16 velocity',
    hint: 'Sample velocity changes in 16 steps each time it plays.',
  },
  'stop-all': {
    task: 'Stop all samples',
  },
  'envelope-screen': {
    task: 'Open envelope settings (fade-in and fade-out)',
  },
  'chop-markers': {
    task: 'Open the marker screen (CHOP)',
  },
  'sample-merge-mode': {
    task: 'Enter sample merge mode (SAMPLE MERGE)',
  },
  'mute-bus': {
    task: 'Mute the sound sent to the buses (MUTE BUS)',
    hint: 'You only hear the effect, not the dry sample or input.',
  },
  'input-setting': {
    task: 'Open input settings (INPUT SETTING)',
  },
  'pause-playback': {
    task: 'Pause sample playback (PAUSE)',
  },
  'gate-all': {
    task: 'Turn GATE on for all samples in the bank',
    hint: 'GATE ALL ON/OFF — applies to the selected bank.',
  },
  'sync-all': {
    task: 'Turn BPM SYNC on for all samples in the bank',
  },
  'manual-sampling': {
    task: 'Record a sample manually',
    hint: 'REC → pick an empty pad (blinks red) → REC starts. REC again saves.',
  },
  'record-setting-screen': {
    task: 'Open the record settings screen',
    hint: 'Once you’re in sampling mode, RECORD SETTING opens the input setting screen.',
  },
  'resample-routing-mix': {
    task: 'Resample with Mix routing',
    hint: 'Set ROUTING = Mix (CTRL 2) to resample together with playing samples.',
  },
  'resample-routing-extin': {
    task: 'Resample only the external signal (ExtIn)',
    hint: 'Set ROUTING = ExtIn — playing samples won’t go into the resample.',
  },
  'skip-back-sample': {
    task: 'Catch a snippet from SKIP BACK memory',
    hint: 'MARK opens SKIP BACK, REC confirms the save, PAD 1 is an example destination pad.',
  },
  'count-in-one-measure': {
    task: 'Set count-in to 1 bar',
    hint: 'Cycle until COUNT-IN 1MEAS appears.',
  },
  'chop-assign': {
    task: 'Split the sample and spread it across pads (CHOP)',
    hint: 'Add markers at the cut points, then VALUE → pick ASSIGN TO PAD.',
  },
  'sample-length-measures': {
    task: 'Set sample length in bars',
    hint: 'On the sampling screen, CTRL 2 sets the number of bars (1–32).',
  },
  'real-time-record': {
    task: 'Record a pattern in real time',
    hint: 'Check that REC MODE = Real-Time (the REMAIN button).',
  },
  'tr-rec-pattern': {
    task: 'Build a pattern with TR-REC',
    hint: 'REMAIN switches REC MODE to TR-REC.',
  },
  'tr-rec-switch': {
    task: 'Switch to TR-REC while a pattern is playing',
  },
  'quantize-pattern': {
    task: 'Quantize a pattern',
    hint: 'If the quantize screen doesn’t appear, press RECORD SETTING again.',
  },
  'duplicate-pattern': {
    task: 'Duplicate and extend a pattern (DUPLICATE)',
    hint: 'The pattern is copied and appended at the end — it becomes twice as long.',
  },
  'pattern-chain': {
    task: 'Build a pattern chain (PATTERN CHAIN)',
    hint: 'Hold HOLD and pick a chain number (1–16), then add patterns.',
  },
  'efx-motion-rec': {
    task: 'Record effect moves into a pattern (EFX MOTION REC)',
    hint: 'While recording a pattern, press MARK to start capturing knob moves and effect on/off.',
  },
  'pad-mute-motion-rec': {
    task: 'Record pad mute moves into a pattern',
    hint: 'After turning on PAD MUTE MODE, mute and unmute samples with the pads in time.',
  },
  'efx-motion-erase': {
    task: 'Delete effect moves from a pattern',
    hint: 'On the pattern edit screen (PATTERN EDIT).',
  },
  'pad-mute-erase': {
    task: 'Delete pad mute moves from a pattern',
    hint: 'On the pattern edit screen (PATTERN EDIT).',
  },
  'undo-pattern-record': {
    task: 'Undo the last pattern recording (UNDO)',
    hint: 'Only works while recording a pattern.',
  },
  'mfx-select': {
    task: 'Pick an MFX effect',
    hint: 'Hold MFX and turn CTRL 3 (or VALUE) to scroll the effect list.',
  },
  'bypass-bus-34': {
    task: 'Temporarily bypass BUS 3 and BUS 4',
    hint: 'Hold VALUE and press BUS FX.',
  },
  'effect-grab': {
    task: 'Turn the effect on only while you hold it (EFFECT GRAB)',
    hint: 'Hold VALUE and press an effect button (e.g. MFX).',
  },
  'lock-effect-screen': {
    task: 'Lock the effect edit screen',
    hint: 'The screen won’t jump back to the previous view on its own.',
  },
  'bus-send-bank': {
    task: 'Set bus send for the whole bank',
  },
  'one-shot-toggle': {
    task: 'Toggle one-shot mode (GATE)',
    hint: 'Hold VALUE and press GATE.',
  },
  'input-fx-menu': {
    task: 'Set up INPUT FX from the input settings screen',
    hint: 'On the input setting screen, press VALUE — INPUT FX Setting opens.',
  },
  'input-fx-utility': {
    task: 'Set up INPUT FX from the UTILITY menu',
    hint: 'On the EFX SET screen, go to the OTHER tab and pick Input FX.',
  },
  'sample-merge-sum': {
    task: 'Merge samples with SUM',
    hint: 'Pick up to 4 samples, set the method to SUM (CTRL 1), and confirm with VALUE.',
  },
  'sample-merge-mul': {
    task: 'Merge samples with MUL',
    hint: 'MUL modulates one sample’s sound with the waveform of another.',
  },
  'bank-protect': {
    task: 'Turn on bank protect (BANK PROTECT)',
    hint: 'Protects samples and patterns from overwrite and delete.',
  },
  'copy-bank': {
    task: 'Copy a whole bank to another',
  },
  'delete-bank': {
    task: 'Delete all samples or patterns from a bank',
  },
  'live-mode': {
    task: 'Turn on live mode (LIVE MODE)',
    hint: 'Hold both buttons for at least 3 seconds.',
  },
  'save-efx-params': {
    task: 'Save BUS 1 and BUS 2 effect parameters',
    hint: 'Hold for at least 3 seconds.',
  },
  'project-select': {
    task: 'Open project select (PROJECT)',
  },
  'sound-generator': {
    task: 'Enter sound generator mode',
  },
  'import-export': {
    task: 'Open IMPORT/EXPORT',
    hint: 'Quick access to data transfer via SD.',
  },
  'sidechain-open': {
    task: 'Open SIDE CHAIN settings',
    hint: 'SIDE CHAIN is a tab in EFX SET (added in firmware 5.50).',
  },
  'sidechain-enable': {
    task: 'Turn sidechain on (TARGET ≠ OFF)',
    hint: 'Compression only works once TARGET is not set to OFF.',
  },
  'sidechain-kick-bass': {
    task: 'Set kick → bass ducking (SOURCE kick, TARGET bass)',
    hint: 'SOURCE is the trigger bus, TARGET is the bus being ducked. Order: SOURCE → TARGET → THRESHOLD → RELEASE.',
  },
}
