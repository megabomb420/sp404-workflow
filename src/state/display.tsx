import React, { createContext, useContext, useMemo, useState } from 'react'

export interface DisplayState {
  /** linia główna (np. nazwa sekcji) */
  title: string
  /** linia druga (np. breadcrumb / status) */
  sub: string
  /** prawy, mono status (np. BPM, STEP 03/07, READY) */
  right?: string
}

const EMPTY: DisplayState = { title: 'SP WORKFLOW', sub: 'READY', right: '' }

const DisplayContext = createContext<{
  display: DisplayState
  setDisplay: (d: DisplayState) => void
}>({ display: EMPTY, setDisplay: () => {} })

export function DisplayProvider({ children }: { children: React.ReactNode }) {
  const [display, setDisplay] = useState<DisplayState>(EMPTY)
  const value = useMemo(() => ({ display, setDisplay }), [display])
  return <DisplayContext.Provider value={value}>{children}</DisplayContext.Provider>
}

/** Steruje ekranem LCD na górze aplikacji. */
export function useDisplay() {
  return useContext(DisplayContext)
}
