export type StepOverlay = {
  title?: string
  action?: string
  explanation?: string
  expectedResult?: string
  commonMistake?: string
  context?: string
}

export type WorkflowOverlay = {
  title?: string
  blurb?: string
  startingState?: string
  outcome?: string
  ending?: {
    check: string
    tryIt: string
    next: { label: string; preparation?: string }
  }
  category?: string
  steps?: Record<string, StepOverlay>
}

export const workflowsEn: Record<string, WorkflowOverlay> = {
  'source-to-pad': {
    title: 'SOURCE → PLAYABLE PAD',
    startingState: 'Plug in a source and have an empty pad ready. You don’t need the SP menus — we’ll check the result after every move.',
    outcome: 'Your trimmed sample is ready to play on a pad.',
    ending: {
      check: 'Play the pad a few times: do the start and tail sound as intended?',
      tryIt: 'Play a short phrase with this sample, leaving gaps.',
      next: {
        label: 'RECORD A PATTERN',
        preparation: 'Have an empty pattern ready; you’ll use your samples.',
      },
    },
    blurb: 'From input and level to a trimmed sample that’s ready to play.',
  },
  'pattern-to-print': {
    title: 'PATTERN → PRINT WITH FX',
    startingState: 'You’ve got a playing pattern, effects chosen, and an empty pad for the new take.',
    outcome: 'Your pattern and chosen effects are printed to a new sample.',
    blurb: 'Check routing, record the resample, compare it with the original.',
    ending: {
      check: 'Listen to the pattern and new sample separately: check the effect, level and length.',
      tryIt: 'Choose the version to use next and name one difference you hear.',
      next: {
        label: 'NOTE YOUR A/B COMPARISON',
      },
    },
    steps: {
      'print-compare': {
        title: 'COMPARE THE RESULT',
        action: 'Play the new pad and the original pattern separately. Check level, length, and whether the effect printed only where you meant it to.',
        expectedResult: 'The new sample sounds like the print you wanted, and the original pattern is still there.',
        commonMistake: 'If the print is dry or has an effect you didn’t want, don’t re-record blind — tap “THAT DIDN’T HAPPEN”.',
      },
    },
  },
  'loop-to-pattern': {
    title: 'LOOP → CHOPS → PATTERN',
    startingState: 'The loop is on a pad. Have a few neighbouring empty pads and an empty pattern ready.',
    outcome: 'Your new phrase made from chops is recorded in a pattern.',
    ending: {
      check: 'Listen to two repeats: do the chops form the phrase you intended?',
      tryIt: 'Play three chops in a different order without recording.',
      next: {
        label: 'MAKE A VARIATION',
        preparation: 'Continue with the pattern you just made.',
      },
    },
    blurb: 'Set tempo, spread the cuts across pads, and build a new phrase from them.',
  },
  'build-a-beat': {
    title: 'BUILD A BEAT',
    blurb: 'A full beat from scratch: sample → chop → drums → pattern → FX → sidechain → resample → bounce.',
    ending: {
      check: 'Listen through the arrangement you prepared.',
      tryIt: 'Choose one thing for the next session, or decide this version works for you.',
      next: {
        label: 'NOTE YOUR NEXT MOVE',
      },
    },
    outcome: 'You have a beat sketch ready to listen to and develop.',
    steps: {
      'usb-sample': {
        title: 'USB-C SAMPLE',
        action: 'Plug in a phone/computer over USB, press EXT SOURCE, and record a sample onto a pad with [REC].',
        explanation:
          'USB AUDIO treats the phone/computer like any other external source — after EXT SOURCE, the signal enters the SP-404MKII and you sample it like a normal input.',
        expectedResult: 'USB signal is in EXT SOURCE — you record it to a pad like any external signal.',
        commonMistake:
          'You forget to set “Speakers SP-404MKII-G” as the default output — then nothing comes over USB.',
      },
      chop: {
        title: 'CHOP',
        action: 'Drop markers (MARK) and slice the sample onto pads with ASSIGN TO PAD.',
        explanation: 'Markers split the sample; ASSIGN TO PAD spreads the slices across neighbouring pads, ready to fire.',
        expectedResult: 'The sample is chopped across several pads — each plays a different slice.',
        commonMistake: 'You don’t hear the cuts because ASSIGN TO PAD only happens after you confirm with [VALUE].',
      },
      drums: {
        title: 'DRUMS',
        action: 'Build drums on pads — kick, snare, hats (from the library, USB, or something you sampled).',
        explanation: 'Lay the kit so kick/snare/hats sit under your thumb — that’s the foundation for the pattern.',
        expectedResult: 'You’ve got a drum kit on the pads, ready to record a pattern.',
        commonMistake: 'Hats and kick land on random pads — then the pattern is a pain to record.',
      },
      bass: {
        title: 'BASS',
        action: 'Record or play bass onto a pad (sample with REC, or SOUND GENERATOR).',
        explanation: 'The low end carries the groove; with bass on its own pad, sidechain is easy to set.',
        expectedResult: 'You’ve got a separate pad with bass.',
        commonMistake: 'Bass volume jumps around — use FIXED VELOCITY so every hit is even.',
      },
      pattern: {
        title: 'PATTERN',
        action: 'Record a pattern in TR-REC or real-time.',
        explanation: 'TR-REC drops hits on the timeline (good for drums); real-time lets you play the groove by hand.',
        expectedResult: 'Your beat plays as a pattern on the PATTERN pad.',
        commonMistake: 'You forget to press [REMAIN] to switch to TR-REC — then you’re recording real-time.',
      },
      effects: {
        title: 'EFFECTS',
        action: 'Assign effects to BUS 1/2 (per sample) and add master FX on BUS 3/4.',
        explanation: 'BUS 1/2 are for chosen samples (e.g. drum compression); BUS 3/4 catch the whole mix before the output.',
        expectedResult: 'Kick and snare have their own effect, and the whole mix goes through master on BUS 3/4.',
        commonMistake: 'Effect is on the BUS but the sample plays dry — check the pad is routed to that BUS ([REMAIN] + pad).',
      },
      sidechain: {
        title: 'SIDECHAIN',
        action: 'Set kick→bass ducking (TARGET on bass, SOURCE on kick).',
        explanation: 'Sidechain drops the bass with the kick — classic pumping that makes space in the mix.',
        expectedResult: 'Bass ducks under the kick on every hit.',
        commonMistake: 'TARGET stays OFF — sidechain does nothing because you didn’t pick what gets ducked.',
      },
      resample: {
        title: 'RESAMPLE',
        action: 'Resample the pattern with FX onto a new pad (ROUTING Mix).',
        explanation: 'Resample freezes the whole mix with effects into one audio clip — lighter on CPU, then you can edit destructively.',
        expectedResult: 'The new pad plays the whole pattern as one sample with FX printed.',
        commonMistake: 'ROUTING stays ExtIn — resample only grabs the input, not samples + effects.',
      },
      variation: {
        title: 'VARIATION',
        action: 'Duplicate the pattern and change parts for a variant (different hat, no bass in the drop).',
        explanation: 'DUPLICATE copies the pattern and appends it — a base for a variant without touching the original.',
        expectedResult: 'The pattern is 2× longer; the second half has the changed parts.',
        commonMistake: 'You edit the original instead of the duplicate — DUPLICATE first, then change.',
      },
      arrangement: {
        title: 'ARRANGEMENT',
        action: 'Chain patterns (PATTERN CHAIN), e.g. intro → A → B → A.',
        explanation: 'PATTERN CHAIN plays patterns in order — song structure without stopping the fun.',
        expectedResult: 'The pattern layout plays like a song plan.',
        commonMistake: 'Chain too long — the limit is 16 patterns; keep sections tight.',
      },
      'final-bounce': {
        title: 'FINAL BOUNCE',
        action: 'In PATTERN SELECT, press COPY, select the chain with HOLD + its pad, choose an empty sample pad and confirm with COPY/ENTER.',
        explanation: 'Chain BOUNCE saves its arrangement as one sample.',
        expectedResult: 'The selected chain is on a pad as audio.',
        commonMistake: 'BOUNCE overwrites the sample on the destination pad — pick an empty pad.',
      },
    },
  },
  '8-bar-pattern': {
    title: '8-BAR PATTERN',
    blurb: 'Build an 8-bar TR-REC pattern, step by step.',
    ending: {
      check: 'Listen to the transition between the two halves of the pattern.',
      tryIt: 'Play a different ending over the pattern without recording changes.',
      next: {
        label: 'PLAN THE ARRANGEMENT',
      },
    },
    outcome: 'Your pattern plays, with a second half prepared.',
    steps: {
      tempo: {
        title: 'TEMPO',
        action: 'Set tempo (TEMPO SEL) to the target BPM.',
        explanation: 'Tempo first, then the pattern — length is counted in bars against BPM.',
        expectedResult: 'TEMPO SEL screen; BPM set for the project/bank.',
        commonMistake: 'You set tempo after recording — then the pattern needs BPM SYNC to line up.',
      },
      length: {
        title: 'LENGTH',
        action: 'Pick the destination pad and set LENGTH to 8 bars.',
        explanation: 'TR-REC lets you set length 1–64 bars; 8 is a classic phrase that holds a verse.',
        expectedResult: 'The pattern is 8 bars; RECORD SETTING shows LENGTH.',
        commonMistake: 'You leave the default 1–2 bars — it loops too soon and is hard to extend later.',
      },
      'tr-rec-drums': {
        title: 'TR-REC DRUMS',
        action: 'Pick a sample (SUB PAD + pad) and place hits step by step on pads 1–16.',
        explanation: 'TR-REC drops the sample on chosen steps — a tight rhythm without playing in time.',
        expectedResult: 'Kick/snare/hats have their steps; pads light where they play.',
        commonMistake: 'You tap pads without SUB PAD — then you’re picking steps, not the sample to insert.',
      },
      'bass-substep': {
        title: 'BASS & SUBSTEP',
        action: 'Add bass and finer steps — SUBSTEP splits a step into sub-steps for 16ths/32nds.',
        explanation: 'SUBSTEP breaks a step into smaller units — for 16ths on bass and ghost notes.',
        expectedResult: 'Bass plays 16ths, and hats get sub-steps.',
        commonMistake: 'MODE is TRIG but you want long notes — switch to HOLD STEP or lengthen HOLD STEP.',
      },
      quantize: {
        title: 'QUANTIZE',
        action: 'Tighten timing — QTZ (e.g. GRID 16) + STR (strength).',
        explanation: 'Quantize pulls notes to the grid; GRID 16 is 16ths, SHUFFLE adds swing.',
        expectedResult: 'Notes sit on the grid; with SHUFFLE 8 the rhythm swings.',
        commonMistake: 'STR at 100% can kill the groove — leave 50–80%.',
      },
      duplicate: {
        title: 'DUPLICATE',
        action: 'Duplicate the pattern to make a second bar of variation.',
        explanation: 'DUPLICATE copies the pattern and appends it — instant 16 bars with a second phrase to edit.',
        expectedResult: 'The pattern is 2× longer; the second half is a copy of the first.',
        commonMistake: 'Live edits without a duplicate — the variant vanishes on the next take.',
      },
      'bounce-optional': {
        title: 'BOUNCE (OPTIONAL)',
        action: 'Optionally bounce the pattern to a sample so you have audio to process further.',
        explanation: 'If the pattern plays and you want it frozen to audio — use BOUNCE or RESAMPLE.',
        expectedResult: 'The pattern as a sample on a pad.',
        commonMistake: 'Bounce too early — after the freeze you’re editing audio, not steps.',
      },
    },
  },
  'sample-something': {
    title: 'SAMPLE SOMETHING',
    blurb: 'Simplest sampling: REC → pad → REC (p.34).',
    ending: {
      check: 'Play the pad: can you hear the whole passage you wanted to capture?',
      tryIt: 'Play a simple rhythmic phrase with this one sample.',
      next: {
        label: 'REFINE THE SAMPLE',
      },
    },
    outcome: 'Your recording is on the pad you selected.',
    steps: {
      'rec-standby': {
        title: 'REC',
        action: 'Press [REC] — empty pads start blinking.',
        explanation: 'Sampling starts by entering record mode.',
        expectedResult: 'Empty pads blink red.',
      },
      'pick-pad': {
        title: 'PAD',
        action: 'Pick the pad you want to record onto.',
        expectedResult: 'The pad is selected as the sample destination.',
      },
      record: {
        title: 'REC',
        action: 'Press [REC] to start, and [REC] again to stop.',
        explanation: 'REC starts and stops recording; the second [REC] writes the sample.',
        expectedResult: 'The sample is on the pad.',
        commonMistake: 'After stopping you press [EXIT] instead of [REC] — the take isn’t saved.',
      },
    },
  },
  'chop-a-loop': {
    title: 'CHOP A LOOP',
    blurb: 'Slice a loop onto pads: SHIFT+START/END → MARK → ASSIGN TO PAD (p.45–48).',
    ending: {
      check: 'Audition each chop: does it start where you intended?',
      tryIt: 'Play a new phrase using three chosen slices.',
      next: {
        label: 'RECORD YOUR PHRASE',
        preparation: 'Have an empty pattern ready; you’ll use your samples.',
      },
    },
    outcome: 'Your loop slices are assigned to pads.',
    steps: {
      'marker-screen': {
        title: 'MARKER SCREEN',
        action: 'Open the marker screen for the loop.',
        explanation: 'This is where you add cut points on the waveform.',
        expectedResult: 'Marker screen; you can see the sample waveform.',
      },
      'add-markers': {
        title: 'MARK',
        action: 'Place markers where the cuts should be.',
        explanation: '[CTRL 1] moves the cursor, [MARK] drops a marker.',
        expectedResult: 'Markers at the chosen spots on the sample.',
      },
      'assign-to-pad': {
        title: 'ASSIGN TO PAD',
        action: 'Choose ASSIGN TO PAD and spread the slices across pads.',
        explanation: 'ASSIGN TO PAD lays the sample onto the chosen pads, starting from the first marker.',
        expectedResult: 'Loop spread across pads — each plays a different slice.',
        commonMistake: 'Without confirming [VALUE] at the end, the sample isn’t assigned.',
      },
    },
  },
  'make-drums': {
    title: 'MAKE DRUMS',
    blurb: 'Build a kit on pads, set MUTE GROUP, and record a pattern.',
    ending: {
      check: 'Listen to the pattern: can you hear every hit you intended to keep?',
      tryIt: 'Play the rhythm by hand, leaving one extra gap.',
      next: {
        label: 'VARY THE RHYTHM',
        preparation: 'Continue with the pattern you just made.',
      },
    },
    outcome: 'The pattern plays your drum kit.',
    steps: {
      'build-kit': {
        title: 'KIT',
        action: 'Build a kit on pads — kick, snare, hat on separate pads.',
        explanation: 'A sensible pad layout makes pattern recording faster.',
        expectedResult: 'A drum kit on the pads.',
      },
      'mute-group': {
        title: 'MUTE GROUP',
        action: 'Set MUTE GROUP so drums don’t layer.',
        explanation: 'MUTE GROUP kills the previous sample in the group when a new one starts — kick doesn’t stack on snare.',
        expectedResult: 'MUTE GROUP screen; pads in the group mute each other.',
      },
      'drum-pattern': {
        title: 'PATTERN',
        action: 'Record a pattern from the kit.',
        explanation: 'Real-time or TR-REC — groove vs steps, your call.',
        expectedResult: 'The pattern plays your kit.',
      },
    },
  },
  'resample-with-fx': {
    title: 'RESAMPLE WITH FX',
    blurb: 'RESAMPLE → ROUTING Mix → REC (p.37) — freeze a sample with effects.',
    ending: {
      check: 'Listen to the new pad on its own: is the effect part of the recording?',
      tryIt: 'Play a short phrase with the new sample.',
      next: {
        label: 'NOTE YOUR A/B COMPARISON',
      },
    },
    outcome: 'You have a new sample with the processing recorded into it.',
    steps: {
      'resample-on': {
        title: 'RESAMPLE',
        action: 'Press [RESAMPLE] and set the sample length.',
        explanation: 'Resample grabs what’s leaving the output — including effects.',
        expectedResult: 'Resample mode; length set.',
      },
      'routing-mix': {
        title: 'ROUTING Mix',
        action: 'Set ROUTING to Mix.',
        explanation: 'Mix captures samples + effects; ExtIn is only the external input.',
        expectedResult: 'ROUTING set to Mix.',
        commonMistake: 'ROUTING stays ExtIn — the resample doesn’t include playing samples.',
      },
      'resample-record': {
        title: 'REC',
        action: 'Pick a pad and record the resample.',
        explanation: 'Recording starts with [REC], stop is another [REC].',
        expectedResult: 'A new sample with effects printed, on the pad.',
      },
    },
  },
  'add-sidechain': {
    title: 'ADD SIDECHAIN',
    blurb: 'SHIFT+PAD 16 → EFX SET → SIDE CHAIN (5.50) — ducking in 3 steps.',
    ending: {
      check: 'Listen to the kick and bass together: does the volume dip at the intended moment?',
      tryIt: 'Compare a shorter and longer bass recovery; choose the one that fits the rhythm.',
      next: {
        label: 'NOTE YOUR CHOSEN SOUND',
      },
    },
    outcome: 'The sidechain responds to your chosen source.',
    steps: {
      'open-sidechain': {
        title: 'SIDE CHAIN',
        action: 'Open SIDE CHAIN.',
        explanation: 'SHIFT+PAD 16 opens UTILITY → EFX SET; SIDE CHAIN landed in 5.50.',
        expectedResult: 'SIDE CHAIN screen.',
      },
      'set-target': {
        title: 'TARGET',
        action: 'Set SOURCE (e.g. kick) and TARGET (e.g. bass).',
        explanation: 'TARGET is the signal that gets ducked; SOURCE is what triggers it.',
        expectedResult: 'Sidechain reacts to SOURCE.',
        commonMistake: 'TARGET = OFF — ducking doesn’t run at all.',
      },
      'tune-threshold': {
        title: 'THRESHOLD / RELEASE',
        action: 'Make sure TARGET ≠ OFF, then tune THRESHOLD/RELEASE.',
        explanation: 'THRESHOLD decides when ducking starts; RELEASE how fast the bass comes back.',
        expectedResult: 'Bass breathes under the kick.',
      },
    },
  },
  'capture-skip-back': {
    title: 'CAPTURE SKIP BACK',
    blurb: 'Play without REC, then MARK → REC → pad — catch what you already played (p.38).',
    ending: {
      check: 'Play the saved pad: does it contain the moment you wanted to catch?',
      tryIt: 'Choose a part of this recording to develop into another phrase.',
      next: {
        label: 'REFINE THE CAPTURE',
      },
    },
    outcome: 'The moment you chose from Skip Back is on a pad.',
    steps: {
      'play-to-buffer': {
        title: 'PLAY',
        action: 'Play or play back without REC so skip-back writes to memory.',
        explanation: 'Skip-back buffers the last ~25 s even when you’re not recording.',
        expectedResult: 'MARK blinks — skip-back is recording in the background.',
      },
      'mark-capture': {
        title: 'MARK',
        action: 'Press [MARK] after a great pass.',
        explanation: 'MARK opens the skip-back buffer as a waveform preview.',
        expectedResult: '“SKIP BACK...” screen with the waveform.',
      },
      'save-skip-back': {
        title: 'REC → PAD',
        action: 'Press [REC] and save to a pad.',
        explanation: 'Without assigning to a pad, the skip-back buffer is gone after EXIT.',
        expectedResult: 'The skip-back fragment is on the pad.',
      },
    },
  },
  'build-variation': {
    title: 'BUILD VARIATION',
    blurb: 'Extend the pattern with DUPLICATE and change its second half.',
    ending: {
      check: 'Listen to both parts: can you hear the change in the second?',
      tryIt: 'Decide whether the variation should be a break or a stronger entrance.',
      next: {
        label: 'PLACE THE VARIATION',
      },
    },
    outcome: 'You have a variation in the second part of the pattern.',
    steps: {
      'duplicate-pattern': {
        title: 'DUPLICATE',
        action: 'In PATTERN EDIT, select the pattern, press VALUE and confirm DUPLICATE.',
        explanation: 'The copy is appended within the same pattern.',
        expectedResult: 'The pattern is 2× longer.',
      },
      'edit-variation': {
        title: 'VARIANT',
        action: 'Change parts in the second half (different hat, no bass).',
        explanation: 'Work in the second half of the extended pattern.',
        expectedResult: 'The variant plays differently from the original.',
        commonMistake: 'DUPLICATE does not create a separate pattern. Check which half you are editing.',
      },
    },
  },
  'final-bounce': {
    title: 'FINAL BOUNCE',
    blurb: 'PATTERN SELECT → BOUNCE to a pad (p.66) — pattern turned into audio.',
    ending: {
      check: 'Listen to the new sample from start to finish: is anything missing?',
      tryIt: 'Choose one improvement for later, or keep this version.',
      next: {
        label: 'NOTE YOUR LISTENING TAKEAWAY',
      },
    },
    outcome: 'The selected pattern is saved as a sample.',
    steps: {
      'select-pattern': {
        title: 'PATTERN SELECT',
        action: 'In PATTERN SELECT, press COPY, then the source pattern pad.',
        explanation: 'Select the pattern to convert to audio.',
        expectedResult: 'The source pattern is selected on the COPY screen.',
      },
      bounce: {
        title: 'BOUNCE',
        action: 'Press PATTERN SELECT, choose an empty sample pad and confirm with VALUE or COPY.',
        explanation: 'BOUNCE bypasses BUS 1–4 effects. Use RESAMPLE to include effects.',
        expectedResult: 'The pattern as a sample on the pad.',
        commonMistake: 'BOUNCE onto an occupied pad deletes the existing sample.',
      },
    },
  },
}
