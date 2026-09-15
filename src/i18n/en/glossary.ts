export type GlossaryOverlay = { definition: string }

export const glossaryEn: Record<string, GlossaryOverlay> = {
  Project: {
    definition:
      'One bundle on the SP: 10 sample banks and 10 pattern banks. You get 16 projects.',
  },
  Bank: {
    definition:
      'A collection of 16 samples and 16 patterns. There are 10 banks (A–J); samples and patterns in the same bank can share a tempo (bank tempo).',
  },
  Pad: {
    definition:
      'One of 16 buttons you assign a sample or pattern to. In SUB PAD mode, pads 1–16 select another 16 samples.',
  },
  Sample: {
    definition:
      'A recorded audio clip plus its settings (playback mode, loop, BUS FX routing). Assigned to a pad and usable in patterns.',
  },
  Pattern: {
    definition:
      'A stored sequence of sample playback — order and timing. Built in the pattern sequencer (real-time, TR-REC) and played back like a track.',
  },
  BPM: {
    definition:
      'Tempo in beats per minute. Samples and patterns have their own tempo; bank and project share a tempo chosen with TEMPO SEL.',
  },
  'BPM SYNC': {
    definition:
      'Keeps a sample or pattern locked to bank tempo, project tempo, or MIDI clock (USB / MIDI IN). Needs tempo data on the sample first.',
  },
  'EXT SOURCE': {
    definition:
      'Button that turns on audio input from a connected device (LINE IN / INPUT). When the input level is too high, the button blinks red.',
  },
  'INPUT FX': {
    definition:
      'Effects that only hit the input signal (INPUT / EXT SOURCE), applied before recording — you can hear them while sampling.',
  },
  'Skip Back': {
    definition:
      'Rewind in time: a buffer always holds the last ~25 s (sample, pattern, EXT SOURCE). Hit [MARK] to preview and save that fragment.',
  },
  Resample: {
    definition:
      'Record what’s already playing on the SP — effects and a mix of several pads — into one new sample.',
  },
  Resampling: {
    definition:
      'For patterns: record a playing pattern to a sample, with effects. BOUNCE writes the same thing without effects.',
  },
  'BUS 1': {
    definition:
      'First effects bus for samples. Each sample can go to BUS 1, BUS 2, or DRY; pad colour shows the bus (orange = BUS 1).',
  },
  'BUS 2': {
    definition:
      'Second effects bus for samples. A sample sent to BUS 2 lights green; the chosen effect (BUS FX) runs on that bus.',
  },
  'BUS 3': {
    definition:
      'Effects bus for the overall sound. Set via FAVORITE; the summed signal after BUS 1/2 lands here.',
  },
  'BUS 4': {
    definition: 'Second effects bus for the overall sound. Chosen together with BUS 3 inside FAVORITE.',
  },
  DRY: {
    definition:
      'Signal with no BUS FX — not sent to BUS 1 or BUS 2. A DRY pad lights white.',
  },
  'DRY Routing': {
    definition:
      'Chooses whether the input hits the buses (Input Bus) or bypasses them (DRY). Set in EFX SETTING.',
  },
  'MUTE BUS': {
    definition:
      'Momentarily mutes the dry send into a BUS and leaves the effect tail (reverb/delay) — for live breaks.',
  },
  'EFFECT GRAB': {
    definition: 'The effect only runs while you hold the effect button — quick on/off in time with playing.',
  },
  FAVORITE: {
    definition: 'Saved effect combos for BUS 3/BUS 4 (FAVORITE 1–16) you can recall quickly on the whole output.',
  },
  MFX: {
    definition:
      'Multieffect from the MFX list — assignable to an effects bus (BUS FX) or an effect button (DIRECT FX).',
  },
  SUBSTEP: {
    definition:
      'Splits a pattern step into smaller sub-steps (e.g. 1/2, 1/4, 1/8) so notes can land between the main steps.',
  },
  'TR-REC': {
    definition:
      'Step recording a pattern: you set which steps a sample plays on — handy for building drum beats.',
  },
  Microscope: {
    definition: 'Note-by-note pattern edit — fix single events (timing, velocity) on the step timeline.',
  },
  Quantize: {
    definition:
      'Snaps pattern-note timing to a grid. Grid is QTZ (GRID 32–4 or SHUFFLE 16/8); pull strength is STR (0–100%).',
  },
  Shuffle: {
    definition:
      'Shifts offbeat timing for a swinging feel. Controlled by SHFL RATE; SHUFFLE can also be chosen as the QTZ grid.',
  },
  VariMode: {
    definition:
      'Algorithm that keeps pitch/speed changes sounding more natural. Available when VINYL MODE = No.',
  },
  VinylMode: {
    definition:
      'Mode that changes pitch and speed together, like an analogue turntable (VINYL MODE = Yes) — vinyl-style tempo shift.',
  },
  'Chromatic Mode': {
    definition:
      'Play a sample like an instrument — pads play chromatically with changed pitch. You can pick scale and root.',
  },
  GATE: {
    definition: 'Playback mode where the sample only plays while you hold the pad. [GATE] toggles gate behaviour globally.',
  },
  'One-shot': {
    definition:
      'Playback mode where the sample plays once to the end and ignores retriggers until it finishes — useful for long beds.',
  },
  LOOP: {
    definition: 'Playback mode where the sample repeats. Set the loop point in START/END edit.',
  },
  REVERSE: {
    definition: 'Plays the sample backwards. Reverse start point depends on REVERSE TYPE.',
  },
  ROLL: {
    definition:
      'Repeats the sample at a set interval (e.g. 1/4, 1/8, 1/64). Holding [ROLL] while editing points lets you preview sound before the end.',
  },
  'Sample Merge': {
    definition: 'Merge several samples from different pads into one sample stored on a single pad.',
  },
  'Mute Group': {
    definition:
      'A group of samples that cannot play at once — hitting another in the group silences the previous one (last one wins). Up to 10 groups, 16 samples each.',
  },
  'PAD LINK': {
    definition:
      'PAD LINK GROUPS — a group of up to 4 pads that play together when you press any one of them. Up to 10 groups (A–J).',
  },
  CUE: {
    definition: 'Headphone monitoring: a sample sent to CUE is heard only in PHONES (not LINE OUT or USB).',
  },
  'DJ MODE': {
    definition: 'Mixer mode: two samples on CH1 and CH2 with crossfader, EQ, pitch, reverse, and tempo sync.',
  },
  Looper: {
    definition:
      'Loop recording — overdub layers live and build a loop in real time. Enabled by setting MARK Function = Looper.',
  },
  'Sound Generator': {
    definition:
      'Built-in synth for basses and other sounds. Generated tones can be sampled and assigned to pads.',
  },
  Normalize: {
    definition: 'Process that raises overall sample level to the maximum. Irreversible.',
  },
  Truncate: {
    definition: 'Cuts unused audio before START and after END. Irreversible.',
  },
  Chop: {
    definition:
      'Split a sample at markers into smaller pieces and assign them to consecutive pads — for breaks and chops.',
  },
  Marker: {
    definition:
      'A point in the sample used for splitting (CHOP) and for jumping to a position in DJ MODE. Up to 7 markers per sample.',
  },
  'END SNAP': {
    definition:
      'While sampling, automatically sets the sample end on the beat before the end — the take lands in time. Turned on with [START/END] during recording.',
  },
}
