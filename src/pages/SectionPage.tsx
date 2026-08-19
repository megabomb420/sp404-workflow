import { useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { SectionHeader } from '../components/content/SectionHeader'
import { SectionRenderer } from '../components/content/SectionRenderer'
import { sectionsById } from '../data/sections'
import { useDisplay } from '../state/display'
import { useStore } from '../state/store'

export function SectionPage() {
  const { id } = useParams<{ id: string }>()
  const section = id ? sectionsById[id] : undefined
  const { setDisplay } = useDisplay()
  const { dispatch } = useStore()

  useEffect(() => {
    if (!section) return
    setDisplay({
      title: section.title,
      sub: section.short,
      right: `PAD ${String(section.pad).padStart(2, '0')}`,
    })
    dispatch({ type: 'SET_LAST_SECTION', id: section.id })
    dispatch({ type: 'PUSH_RECENT', id: section.id })
  }, [section, setDisplay, dispatch])

  if (!section) return <Navigate to="/" replace />

  return (
    <div className="page">
      <SectionHeader
        title={section.title}
        short={section.short}
        meta={`SEKCJA ${String(section.pad).padStart(2, '0')} / 16`}
      />
      <SectionRenderer section={section} />
    </div>
  )
}
