export const shortcutsEn: Record<string, { description: string }> = {
  'fixed-velocity': {
    description:
      'Locks sample velocity at a fixed 127 (maximum), so the pad always plays at the same volume.',
  },
  '16-velocity': {
    description:
      'Steps the sample’s velocity (volume) as it plays — 16 levels of dynamics.',
  },
  'cue': {
    description: 'Sets what you hear in PHONES — headphone preview, not LINE OUT.',
  },
  'chromatic': {
    description:
      'Play samples chromatically — pitch follows the pad, like a keyboard.',
  },
  'exchange': {
    description: 'Swaps sample or pattern data stored on different pads.',
  },
  'init-param': {
    description: 'Resets sample parameters on the selected pad back to factory defaults.',
  },
  'pad-link': {
    description:
      'Links pads into a group — one pad plays every pad in that group at once.',
  },
  'mute-group': {
    description:
      'Puts pads in a group where only one plays at a time — a new hit mutes the previous one.',
  },
  'metronome': {
    description: 'Turns the metronome on and off.',
  },
  'count-in': {
    description: 'Adds a count-in before sampling or pattern recording.',
  },
  'tap-tempo': {
    description: 'Sets tempo by feel — tap the pad in time, like you’re clapping the beat.',
  },
  'gain': {
    description: 'Opens UTILITY > SYSTEM > GAIN — input / level gain.',
  },
  'utility': {
    description: 'Opens the UTILITY menu screen.',
  },
  'import-export': {
    description: 'Opens the IMPORT/EXPORT menu — import and export samples on the SD card.',
  },
  'pad-setting': {
    description: 'Opens pad settings (PAD SETTING) — e.g. sensitivity and playback mode.',
  },
  'efx-setting': {
    description: 'Opens effect settings (EFX SETTING).',
  },
  'mute-bus': {
    description:
      'Momentarily mutes the sound sent to the bus (playing sample or INPUT signal) — you only hear the effect.',
  },
  'pause': {
    description: 'Pauses the sample that’s currently playing.',
  },
  'input-setting': {
    description: 'Opens the input settings screen (INPUT SETTING).',
  },
  'project': {
    description: 'Opens the project select screen (SELECT PROJECT).',
  },
  'save-efx-parameter': {
    description:
      'Saves the main effect parameters assigned to BUS 1 and BUS 2 (hold MARK about 3 seconds).',
  },
  'envelope': {
    description:
      'Opens envelope settings — how sample volume changes as it plays (ATTACK / HOLD / RELEASE).',
  },
  'chop': {
    description:
      'Splits the sample at the markers and assigns the pieces to separate pads (CHOP).',
  },
  'undo-pattern-rec': {
    description:
      'Undoes the data you just entered (recorded) — only works while recording a pattern.',
  },
  'roll-set': {
    description: 'Sets the roll interval — how fast the roll repeats.',
  },
  'pad-mute': {
    description: 'Toggles pad mute on/off — works on every pad 1–16.',
  },
  'pad-mute-mode': {
    description:
      'Latches SHIFT and REVERSE as if held — makes it easier to toggle pad mute on many pads quickly.',
  },
  'ping-pong-loop': {
    description: 'Loops the sample, playing it forwards then backwards (ping-pong).',
  },
  'gate-all': {
    description: 'Turns GATE on or off for all samples in the selected bank.',
  },
  'sync-all': {
    description: 'Turns BPM SYNC on or off for all samples in the selected bank.',
  },
  'tr-rec': {
    description:
      'Switches to TR-REC pattern recording — you record samples onto the playing pattern (only while a pattern is playing).',
  },
  'bank-volume': {
    description: 'Sets overall volume for the whole bank — works for banks A/F–E/J.',
  },
  'live-mode': {
    description:
      'Disables buttons unused while playing live (sampling and edit) — hold about 3 seconds.',
  },
  'bank-protect': {
    description:
      'Protects samples and patterns assigned to a pad from copy, overwrite in edit, and accidental delete.',
  },
  'mark-function': {
    description:
      'Switches the function called by MARK — between “SBS *** (skip-back sampling)” and “Looper”.',
  },
  'sample-merge-mode': {
    description:
      'Switches to sample merge mode (SAMPLE MERGE) — records stacked samples as one.',
  },
  'sound-generator-mode': {
    description: 'Switches to sound generator mode (SOUND GENERATOR MODE).',
  },
  'stop': {
    description: 'Stops playback of all samples.',
  },
  'remain-bus-routing': {
    description:
      'Sets which bus the playing sample goes to (i.e. which effects are used) — per sample.',
  },
  'remain-bank-bus-send': {
    description: 'Sets bus send for all samples in the bank — the same effects on the whole bank.',
  },
  'remain-keep-efx-edit': {
    description:
      'Keeps the effect edit screen on display (it doesn’t disappear after you change a parameter).',
  },
  'remain-swap-bus12': {
    description: 'Swaps BUS 1 and BUS 2 effects — effect parameter values are kept.',
  },
  'value-select-sample': {
    description:
      'Selects a sample without playing it. When PATTERN SELECT is lit, also selects a pattern (without playing).',
  },
  'value-bypass-bus34': {
    description: 'Temporarily bypasses BUS 3 and BUS 4.',
  },
  'value-multi-timing': {
    description: 'Minimizes small timing differences when playing several samples at once.',
  },
  'effect-grab': {
    description:
      'Applies the effect only while you hold the effect button (from FILTER+DRIVE to MFX) — EFFECT GRAB.',
  },
  'value-one-shot': {
    description:
      'Turns one-shot playback on and off — the sample plays to the end, without GATE.',
  },
  'del-efx-motion': {
    description:
      'Deletes effect operations recorded by EFX MOTION REC from the pattern (on the pattern edit screen).',
  },
  'del-mute-motion': {
    description:
      'Deletes pad mute operations recorded by EFX MOTION REC from the pattern (on the pattern edit screen).',
  },
  'del-bank': {
    description: 'Deletes all samples or patterns in the bank.',
  },
  'copy-edit-mute-group': {
    description:
      'On the PITCH/SPEED screen, lets you edit parameters (SPEED, PITCH, VOLUME, PAN, BPM, BPM SYNC, GATE, LOOP, REVERSE) of samples in the same mute group at once.',
  },
  'copy-edit-mute-group-env': {
    description:
      'On the envelope settings screen, lets you edit parameters (ATTACK, HOLD, RELEASE, BPM SYNC, GATE, LOOP, REVERSE) of samples in the same mute group at once.',
  },
  'copy-bank': {
    description: 'Copies all samples or patterns from a bank to another bank.',
  },
  'mfx-list-17': {
    description: 'Displays the MFX list from #17 onward.',
  },
  'mfx-list-33': {
    description: 'Displays the MFX list from #33 onward.',
  },
  'tr-rec-del-notes-pad': {
    description: 'In TR-REC, deletes notes (for one bar) matching the selected pad.',
  },
  'tr-rec-del-notes-all': {
    description: 'In TR-REC, deletes notes (for one bar) matching all pads.',
  },
  'tr-rec-rec-ctrl1-motion': {
    description: 'In TR-REC, records CTRL 1 knob motion in steps (MODE set to TRIG).',
  },
  'tr-rec-rec-ctrl2-motion': {
    description: 'In TR-REC, records CTRL 2 knob motion in steps (MODE set to TRIG).',
  },
  'tr-rec-rec-ctrl3-motion': {
    description: 'In TR-REC, records CTRL 3 knob motion in steps (MODE set to TRIG).',
  },
  'tr-rec-select-sample': {
    description: 'In TR-REC, selects samples without playing them.',
  },
  'sidechain': {
    description: 'Side-chain compressor: SOURCE ducks the TARGET bus.',
  },
}
