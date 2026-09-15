export type ActionOverlay = {
  title: string
  action: string
  startingState?: string
  explanation?: string
  expectedResult: string
  warning?: string
  toolLabel?: string
}

export const actionsEn: Record<string, ActionOverlay> = {
  'open-input-settings': {
    title: 'CHECK INPUT',
    action: 'Open INPUT SETTING and set the level so the input is clear but not clipping.',
    startingState: 'The source is plugged into the right input, or selected as USB output.',
    explanation: 'A good input level stops silence and clipping before you even record.',
    expectedResult: 'You see INPUT SETTING, and EXT SOURCE does not light red at the loudest signal.',
  },
  'enable-ext-source': {
    title: 'ENABLE SOURCE',
    action: 'Press [EXT SOURCE] and listen to the source.',
    expectedResult: 'EXT SOURCE is lit and you hear the source on the SP output.',
  },
  'sampling-standby': {
    title: 'ENTER SAMPLING',
    action: 'Press [REC].',
    startingState: 'You’re in normal pad mode and you can hear the prepared source.',
    expectedResult: 'Empty pads blink red.',
  },
  'sampling-pick-pad': {
    title: 'PICK AN EMPTY PAD',
    action: 'Press the empty pad you want to record onto.',
    expectedResult: 'The pad is selected as the sample destination.',
    warning: 'Pick an empty pad — don’t overwrite material you still need.',
  },
  'sampling-record': {
    title: 'RECORD',
    action: 'Press [REC], play the material, then press [REC] again to stop.',
    expectedResult: 'The new sample plays from the chosen pad.',
  },
  'trim-sample': {
    title: 'SET START AND END',
    action: 'Select the recorded pad, open [START/END], and set the sample start and end.',
    expectedResult: 'The sample starts with no dead air and ends at the point you chose.',
  },
  'check-pad-playback': {
    title: 'CHECK THE PAD',
    action: 'Play the pad a few times and decide if the sample should be GATE, one-shot, or LOOP.',
    expectedResult: 'The pad starts and stops the sample exactly the way you need while playing.',
  },
  'select-pattern-for-print': {
    title: 'SELECT PATTERN',
    action:
      'Turn on PATTERN SELECT and listen to the pattern you want to freeze to a sample. Stop playback before you set up recording.',
    startingState: 'The pattern plays correctly and you have an empty pad for the result.',
    expectedResult: 'The chosen pattern plays start to finish with nothing missing.',
  },
  'check-bus-routing': {
    title: 'CHECK FX ROUTING',
    action: 'Hold [REMAIN] and check routing on the pads that should go through BUS FX.',
    explanation: 'Orange pad goes to BUS 1, green to BUS 2, white stays DRY.',
    expectedResult: 'Every important pad hits the intended BUS, or stays DRY on purpose.',
  },
  'resample-on': {
    title: 'ENABLE RESAMPLE',
    action: 'Make sure PATTERN SELECT is on. Press [RESAMPLE] and set the length of the new sample.',
    expectedResult: 'The SP is in resample mode and waiting for a destination pad.',
  },
  'resample-routing-mix': {
    title: 'SET ROUTING: MIX',
    action: 'In RECORD SETTING, set ROUTING to Mix.',
    explanation: 'Mix captures playing samples plus the intended processing; ExtIn is for the external input.',
    expectedResult: 'The ROUTING screen shows Mix.',
  },
  'resample-record-pattern': {
    title: 'RECORD THE PRINT',
    action:
      'Leave RECORD SETTING with [EXIT]. Pick an empty pad blinking red. When you see “Press Pad to START”, press the pattern pad — recording starts with it. Stop with [REC].',
    expectedResult: 'The new pad holds the pattern as audio with the intended effects.',
    warning: 'Use an empty pad and keep the original pattern to compare.',
  },
  'set-sample-bpm': {
    title: 'SET SAMPLE BPM',
    action:
      'In PITCH/SPEED, select the loop pad. Turn VALUE to pick BPM SET: AUTO to analyse, or MANU / MANU-F to type tempo by hand; press VALUE to confirm.',
    expectedResult: 'The sample has a stored tempo that matches the material.',
    toolLabel: 'CALCULATE LOOP LENGTH AND DRIFT',
  },
  'enable-bpm-sync': {
    title: 'FIT THE LOOP TO TEMPO',
    action: 'Turn on [BPM SYNC] and listen to the loop against the pattern or metronome.',
    expectedResult: 'Repeats of the loop stay in the project or bank tempo.',
    toolLabel: 'CHECK LOOP FIT',
  },
  'open-marker-screen': {
    title: 'OPEN MARKERS',
    action: 'Select the loop and open the marker screen.',
    expectedResult: 'The screen shows the sample waveform and marker positions.',
  },
  'add-markers': {
    title: 'ADD CUTS',
    action: 'Move the cursor with [CTRL 1] and add [MARK] at the spots you want to play separately.',
    expectedResult: 'Each intended slice of the loop has its own start marker.',
  },
  'assign-chops-to-pads': {
    title: 'SPREAD CHOPS ACROSS PADS',
    action: 'Choose ASSIGN TO PAD, point at the first empty pad, and confirm with [VALUE].',
    expectedResult: 'Consecutive pads play consecutive slices of the loop.',
    warning: 'Check the destination pad range so you don’t replace samples you still need.',
  },
  'record-chops-to-pattern': {
    title: 'RECORD CHOPS INTO A PATTERN',
    action: 'Pick an empty pattern and record the chops in real-time or lay them out in TR-REC.',
    expectedResult: 'The pattern plays the new phrase from the chopped loop and lands cleanly back at the start.',
  },
}
