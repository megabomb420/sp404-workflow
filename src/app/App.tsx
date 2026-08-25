import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { StoreProvider, useStore } from '../state/store'
import { DisplayProvider } from '../state/display'
import { Layout } from './Layout'
import { HomePage } from '../pages/HomePage'
import { SectionPage } from '../pages/SectionPage'
import { SearchPage } from '../pages/SearchPage'
import { WorkflowsPage } from '../pages/WorkflowsPage'
import { WorkflowPage } from '../pages/WorkflowPage'
import { ShortcutsPage } from '../pages/ShortcutsPage'
import { FixItPage } from '../pages/FixItPage'
import { KitPage } from '../pages/KitPage'
import { MusclePage } from '../pages/MusclePage'
import { GlossaryPage } from '../pages/GlossaryPage'
import { SettingsPage } from '../pages/SettingsPage'
import { SourcesPage } from '../pages/SourcesPage'
import { OnboardingPage } from '../pages/OnboardingPage'
import { LoopFitPage } from '../pages/LoopFitPage'

function Gate() {
  const { state } = useStore()
  if (!state.ui.onboarded) {
    // pierwsze uruchomienie: tylko onboarding
    return (
      <Routes>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    )
  }
  return (
    <Routes>
      <Route path="/onboarding" element={<Navigate to="/" replace />} />
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/section/:id" element={<SectionPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/workflows" element={<WorkflowsPage />} />
        <Route path="/workflow/:id" element={<WorkflowPage />} />
        <Route path="/shortcuts" element={<ShortcutsPage />} />
        <Route path="/fix-it" element={<FixItPage />} />
        <Route path="/kit" element={<KitPage />} />
        <Route path="/muscle" element={<MusclePage />} />
        <Route path="/glossary" element={<GlossaryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/sources" element={<SourcesPage />} />
        <Route path="/loop-fit" element={<LoopFitPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export function App() {
  return (
    <StoreProvider>
      <DisplayProvider>
        <HashRouter>
          <Gate />
        </HashRouter>
      </DisplayProvider>
    </StoreProvider>
  )
}
