import cx from '../../utils/cx'

/**
 * Renderuje sekwencję przycisków jako fizyczne klawisze.
 *
 * `[SHIFT] + [PAD 16]` → [SHIFT] + [16], a następnie strzałką ↓ ścieżka menu.
 * Tokeny: "PAD 1".."PAD 16" → klawisz pada; znane modyfikatory → klawisz mod;
 * "CTRL n" → gałka; reszta → klawisz menu/ścieżki.
 */

const MOD_KEYS = new Set([
  'SHIFT',
  'REMAIN',
  'VALUE',
  'DEL',
  'COPY',
  'MFX',
  'EXIT',
  'REC',
  'RECORD SETTING',
  'RESAMPLE',
  'START/END',
  'PITCH/SPEED',
  'MARK',
  'BPM SYNC',
  'GATE',
  'LOOP',
  'REVERSE',
  'ROLL',
  'BUS FX',
  'EXT SOURCE',
  'SUB PAD',
  'HOLD',
  'PATTERN SELECT',
  'PATTERN EDIT',
  'VOLUME',
  'A/F',
  'B/G',
  'C/H',
  'D/I',
  'E/J',
  'POWER',
  'REMAIN+',
])

function isPad(token: string): boolean {
  return /^PAD \d{1,2}$/i.test(token)
}

function isKnob(token: string): boolean {
  return /^CTRL ?[1-3]$/i.test(token)
}

function KeyCap({ token, tone }: { token: string; tone: 'pad' | 'mod' | 'knob' | 'menu' }) {
  return (
    <span className={`bkey bkey--${tone}`} aria-hidden="true">
      {token}
    </span>
  )
}

export function renderKey(token: string): JSX.Element {
  const t = token.trim()
  if (isPad(t)) {
    const num = t.split(' ')[1]
    return (
      <span className="bkey bkey--pad">
        <span className="bkey__padnum u-mono">{num}</span>
        <span className="bkey__padword u-label">PAD</span>
      </span>
    )
  }
  if (isKnob(t)) return <KeyCap token={t} tone="knob" />
  if (MOD_KEYS.has(t.toUpperCase())) return <KeyCap token={t.toUpperCase()} tone="mod" />
  return <KeyCap token={t} tone="menu" />
}

interface ButtonSequenceProps {
  buttons?: string[]
  path?: string[]
  note?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ButtonSequence({ buttons, path, note, size = 'md', className }: ButtonSequenceProps) {
  const hasButtons = buttons && buttons.length > 0
  const hasPath = path && path.length > 0
  if (!hasButtons && !hasPath) return null

  return (
    <div className={cx('bseq', `bseq--${size}`, className)}>
      {hasButtons && (
        <div className="bseq__buttons">
          {buttons!.map((b, i) => (
            <span key={i} className="bseq__group">
              {i > 0 && <span className="bseq__plus u-mono">+</span>}
              {renderKey(b)}
            </span>
          ))}
        </div>
      )}
      {hasButtons && hasPath && <span className="bseq__arrow u-mono" aria-hidden="true">↓</span>}
      {hasPath && (
        <div className="bseq__path">
          {path!.map((p, i) => (
            <span key={i} className="bseq__group">
              {i > 0 && <span className="bseq__arrow u-mono" aria-hidden="true">↓</span>}
              {renderKey(p)}
            </span>
          ))}
        </div>
      )}
      {note ? <p className="bseq__note">{note}</p> : null}
    </div>
  )
}
