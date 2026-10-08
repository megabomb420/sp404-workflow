export type TroubleOverlay = { symptom: string; cause: string; fix: string }

export const troubleshootingEn: Record<string, TroubleOverlay> = {
  'resample-cisza': {
    symptom: 'New pad after resampling is empty, or you recorded silence',
    cause:
      'ROUTING may be set to ExtIn instead of Mix, the source pads/pattern weren’t started after recording began, or you stopped before any sound.',
    fix: 'Check ROUTING: Mix in RECORD SETTING. Exit with [EXIT] and pick an empty destination pad. After “Press Pad to START”, trigger the source pad; for a pattern, set up RESAMPLE with PATTERN SELECT on and trigger the pattern pad. Stop with [REC].',
  },
  'print-jest-suchy': {
    symptom: 'Print / the new sample is dry — it didn’t capture the effects',
    cause: 'The material may have been sent DRY, or you used BOUNCE, which doesn’t keep BUS FX the way resampling does.',
    fix: 'Before recording, hold [REMAIN] and check pad routing: orange = BUS 1, green = BUS 2, white = DRY. To freeze the effects you hear, use RESAMPLE with ROUTING set to Mix instead of BOUNCE.',
  },
  'clipping-przesterowany-sample': {
    symptom: 'The sample plays clipped / distorted',
    cause: 'The input signal is too hot — the input is clipping.',
    fix: 'Turn down the input with [GAIN] and [CTRL 3] on the INPUT SETTING screen ([SHIFT] + [EXT SOURCE]). When [EXT SOURCE] lights red, the level is too high — drop it until the light goes out.',
  },
  'brak-sygnalu-wejscia': {
    symptom: 'You can’t hear the signal from a connected device',
    cause: '[EXT SOURCE] is off, or the signal isn’t routed to the output.',
    fix: 'Press [EXT SOURCE] to turn the input on (the button lights). Check which jack the source is in: LINE IN on the back, or INPUT on the front (with the MIC/GUITAR switch). Make sure [GAIN] isn’t at 0.',
  },
  'ext-source-usb-brak-dzwieku': {
    symptom: 'No USB audio even with [EXT SOURCE] on',
    cause:
      'The system parameter “USB IN” routes USB audio somewhere else (LINE IN or MIX OUT), so it never hits the input.',
    fix: 'In SYSTEM, set the “USB IN” parameter. Pick “LINE IN” to mix USB audio with the LINE IN jacks, or “MIX OUT” to add it to the mixer output (without INPUT FX and BUS FX).',
  },
  'zly-routing-bus': {
    symptom: 'The sample doesn’t play through BUS FX / you can’t hear the effects',
    cause: 'The sample isn’t assigned to any BUS (DRY), or it’s hitting a different BUS than you think.',
    fix: 'Hold [REMAIN] and tap the sample pad to cycle its routing (BUS 1, BUS 2, DRY). Pad color tells the destination: orange = BUS 1, green = BUS 2, white = DRY (no BUS 1/2).',
  },
  'sample-gra-nie-tam-gdzie-trzeba': {
    symptom: 'The sample plays from a different pad / bank / project than expected',
    cause: 'Wrong bank or project — samples in different banks/projects share the same pad numbers.',
    fix: 'Check which bank is lit (bank buttons A/F–E/J) and which project is selected (hold [SUB PAD] and pick a project). Copy the sample to the right place with [COPY] and [SHIFT].',
  },
  'bpm-sync-bez-tempa': {
    symptom: 'BPM SYNC doesn’t change the sample tempo',
    cause: 'The sample has no accurate tempo data — BPM SYNC has nothing to lock to.',
    fix: 'Set the sample tempo: in PITCH/SPEED set “BPM SET” to “AUTO” (detect) or “MANU” (by hand), then turn on [BPM SYNC].',
  },
  'loop-click': {
    symptom: 'You hear a click when the sample loops (at the start/end)',
    cause: 'START/END points aren’t on a zero-crossing, so the loop join has a phase jump.',
    fix: 'In [START/END] edit, press [RESAMPLE] (SNAP to Zero-Cross) to pull start/end/loop to the nearest zero crossing. It works when the [RESAMPLE] button is lit.',
  },
  'zly-start-end': {
    symptom: 'The sample cuts off, or starts in the wrong place',
    cause: 'START/END points are in the wrong spots, or they’re locked together (loop/ROLL).',
    fix: 'Open [START/END], move the point with the [CTRL] knob, and preview the sound around the end by holding [ROLL]. If you don’t want looping, check the loop settings. Once the points are set, you can TRUNCATE to trim the data.',
  },
  'niechciany-fx-resampling': {
    symptom: 'You hear unwanted effects during bounce/resampling',
    cause:
      'When you turn a pattern into a sample with BOUNCE, BUS 1–4 effects are automatically off, but resampling records effects (including INPUT FX).',
    fix: 'ROUTING: Mix does not turn effects off. Disable unwanted effects before resampling and check the monitor. If you’re converting a pattern without BUS FX, pick BOUNCE — that method skips BUS 1–4. DRY bypasses BUS 1/2; it doesn’t replace checking the whole path.',
  },
  'gate-loop-zachowanie': {
    symptom: 'The sample behaves differently than expected: cuts off when you release the pad, or loops forever',
    cause: 'The sample playback mode is GATE, One-shot, or LOOP.',
    fix: 'Toggle [GATE] (plays only while you hold the pad) or change the sample playback mode: GATE — p. 18, One-shot — p. 19, LOOP — p. 19. One-shot plays once to the end and ignores hits until it finishes.',
  },
  'pattern-nie-gra-w-rytmie': {
    symptom: 'The pattern doesn’t stay in time / plays off the beat',
    cause: 'No quantize, shuffle is off, or the pattern tempo doesn’t match the rest of the track.',
    fix: 'Set the pattern tempo ([CTRL] in pattern settings), turn on QUANTIZE (QTZ: GRID 16/8, etc.) and match STRENGTH 0–100%. Swing is the SHFL RATE parameter.',
  },
  'sample-bpm-vs-pattern-bpm': {
    symptom: 'The sample doesn’t play in the pattern / project tempo',
    cause: 'The sample tempo data (BPM SET) or the TEMPO SEL choice (BANK/PROJECT) doesn’t match the pattern tempo.',
    fix: 'Set the sample tempo (BPM SET: AUTO/MANU) and turn on [BPM SYNC]. Check whether TEMPO SEL uses bank or project tempo — the pattern plays at that tempo, and the sample is converted to it.',
  },
  'quantize-nie-dziala': {
    symptom: 'Quantize doesn’t work, or it’s too strong',
    cause: 'QTZ is set to too fine or too coarse a grid, or STRENGTH is the wrong value.',
    fix: 'In QUANTIZE pick a QTZ grid (GRID 32–4, SHUFFLE 16/8) and set STR 0–100%. Higher STR = stronger pull to the grid; 0% = no quantize.',
  },
  'znikajacy-dzwiek': {
    symptom: 'Sound suddenly disappears / some samples go silent',
    cause:
      'Samples are in the same MUTE GROUP (only the last one in the group plays), or they were muted with Pad MUTE. Some voices may also have been cut by the polyphony limit (32 voices).',
    fix: 'Check MUTE GROUP ([SHIFT] + pad 8) and remove the pad from the group. Turn off Pad MUTE ([REVERSE] + pad). With many sounds at once, older voices get cut by the 32-voice limit — thin the arrangement.',
  },
  'polyphony-ucina-dzwieki': {
    symptom: 'When several pads play at once, some sounds get cut off',
    cause: 'Max polyphony is 32 voices — once you go over, older voices get cut.',
    fix: 'Play fewer layers at once, or shorten long samples (TRUNCATE). Remember that long samples with a long RELEASE/reverb still occupy voices after you let go of the pad.',
  },
  'no-skip-back-trigger-data': {
    symptom: '“No SKIP BACK Trigger Data” after pressing [MARK]',
    cause:
      'SKIP BACK memory isn’t recording — [MARK] isn’t blinking. SKIP BACK recording only starts once the input signal crosses AUTO TRIG LEVEL.',
    fix: 'Play or send something (a sample, a pattern, or [EXT SOURCE] input) so [MARK] starts blinking. Only then press [MARK] to preview and save SKIP BACK.',
  },
  'max-length-pattern': {
    symptom: '“Max Length Pattern” while recording a pattern',
    cause: 'You hit the maximum number of notes the pattern sequencer can store.',
    fix: 'Use fewer notes in the pattern, or shorten/split it (e.g. two patterns). If the bank is protected (PROTECT), turn bank protect off first.',
  },
  'brak-dzwieku-z-gniazda': {
    symptom: 'No sound on the output / in the headphones',
    cause: 'Wrong routing (e.g. the signal is sent to CUE), muted master, or Pad MUTE/MUTE GROUP.',
    fix: 'Check that CUE isn’t on (audio then only goes to PHONES). Raise the master volume and check Pad MUTE / MUTE GROUP. Try another jack: PHONES vs LINE OUT.',
  },
}
