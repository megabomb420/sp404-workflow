export type PadOverlay = {
  label?: string
  sublabel: string
}

/** Keys: pad number as string ("1"–"16") or route. */
export const padsEn: Record<string, PadOverlay> = {
  '1': { label: 'START HERE', sublabel: 'basics' },
  '2': { label: 'SAMPLING', sublabel: 'record' },
  '3': { label: 'SAMPLE EDIT', sublabel: 'chop · pitch' },
  '4': { label: 'INPUTS & ROUTING', sublabel: 'USB · EXT SOURCE' },
  '5': { label: 'RESAMPLING', sublabel: 'destroy' },
  '6': { label: 'SKIP BACK', sublabel: 'catch the moment' },
  '7': { label: 'PATTERN', sublabel: 'sequencer' },
  '8': { label: 'PATTERN VS RESAMPLE', sublabel: 'pick a path' },
  '9': { label: 'EFFECTS', sublabel: 'BUS 1–4' },
  '10': { label: 'SIDECHAIN', sublabel: 'ducking 5.50' },
  '11': { label: 'BUILD A BEAT', sublabel: 'full workflow' },
  '12': { label: 'QUICK WORKFLOWS', sublabel: 'quick moves' },
  '13': { label: 'SHORTCUTS', sublabel: 'cheat sheet' },
  '14': { label: 'FIX IT', sublabel: 'problems' },
  '15': { label: 'MUSCLE MEMORY', sublabel: 'trainer' },
  '16': { label: 'SEARCH', sublabel: 'find a function' },
  '/section/start': { label: 'START HERE', sublabel: 'basics' },
  '/section/sampling': { label: 'SAMPLING', sublabel: 'record' },
  '/section/edit': { label: 'SAMPLE EDIT', sublabel: 'chop · pitch' },
  '/section/inputs': { label: 'INPUTS & ROUTING', sublabel: 'USB · EXT SOURCE' },
  '/section/resample': { label: 'RESAMPLING', sublabel: 'destroy' },
  '/section/skipback': { label: 'SKIP BACK', sublabel: 'catch the moment' },
  '/section/pattern': { label: 'PATTERN', sublabel: 'sequencer' },
  '/section/pattern-vs-resample': { label: 'PATTERN VS RESAMPLE', sublabel: 'pick a path' },
  '/section/effects': { label: 'EFFECTS', sublabel: 'BUS 1–4' },
  '/section/sidechain': { label: 'SIDECHAIN', sublabel: 'ducking 5.50' },
  '/section/beat': { label: 'BUILD A BEAT', sublabel: 'full workflow' },
  '/section/quick': { label: 'QUICK WORKFLOWS', sublabel: 'quick moves' },
  '/shortcuts': { label: 'SHORTCUTS', sublabel: 'cheat sheet' },
  '/fix-it': { label: 'FIX IT', sublabel: 'problems' },
  '/muscle': { label: 'MUSCLE MEMORY', sublabel: 'trainer' },
  '/search': { label: 'SEARCH', sublabel: 'find a function' },
}
