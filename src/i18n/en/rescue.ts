export type RescueOverlay = {
  title: string
  question: string
  choices: string[]
}

export const rescueEn: Record<string, RescueOverlay> = {
  input: {
    title: 'INPUT / SILENCE',
    question: 'Where is the problem coming from?',
    choices: [
      'Phone or computer over USB',
      'A device on an audio cable',
      'I can hear it, but it clips',
    ],
  },
  print: {
    title: 'PRINT / EFFECTS',
    question: 'What do you hear after recording?',
    choices: [
      'The new pad is silent',
      'The take is dry',
      'There are effects I don’t want',
    ],
  },
  timing: {
    title: 'LOOP / GROOVE',
    question: 'How does the phrase behave?',
    choices: [
      'The loop slowly drifts off the pattern',
      'Notes were recorded unevenly',
      'There’s a click at the loop join',
    ],
  },
  playback: {
    title: 'PAD / PLAYBACK',
    question: 'What happens when you hit the pad?',
    choices: [
      'It cuts off when you release, or loops forever',
      'Sounds vanish when several pads play',
      'It plays a different sound than I expect',
    ],
  },
}
