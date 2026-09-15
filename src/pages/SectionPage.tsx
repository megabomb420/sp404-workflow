import { useEffect } from 'react'
import { Navigate, useParams } from '@/lib/rr'
import { SectionHeader } from '@/components/content/SectionHeader'
import { SectionRenderer } from '@/components/content/SectionRenderer'
import { useLocalizedSection } from '@/i18n/content'
import { useT } from '@/i18n/useT'
import { useDisplay } from '@/state/display'
import { useStore } from '@/state/store'

export function SectionPage() {
  const { id } = useParams<{ id: string }>()
  const section = useLocalizedSection(id)
  const { setDisplay } = useDisplay()
  const { dispatch } = useStore()
  const t = useT()

  useEffect(() => {
    if (!section) return
    setDisplay({
      title: section.title,
      sub: section.short,
      right: t.section.padRight(String(section.pad).padStart(2, '0')),
    })
    dispatch({ type: 'SET_LAST_SECTION', id: section.id })
    dispatch({ type: 'PUSH_RECENT', id: section.id })
  }, [section, setDisplay, dispatch, t])

  if (!section) return <Navigate to="/" replace />

  return (
    <div className="page">
      <SectionHeader title={section.title} short={section.short} meta={t.section.meta(String(section.pad).padStart(2, '0'))} />
      <SectionRenderer section={section} />
    </div>
  )
}
