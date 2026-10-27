import { useCallback, useState } from 'react'
import { Boot } from './components/Boot'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Projects } from './components/Projects'
import { About, Contact, Footer, Stack } from './components/Sections'
import { SettingsDialog } from './components/Settings'
import { CapriStage } from './capri/CapriStage'
import { ScrollRuler } from './components/ScrollRuler'
import { RelicField } from './components/RelicField'

export default function App() {
  const [ready, setReady] = useState(false)
  const [booted, setBooted] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const onReady = useCallback(() => setReady(true), [])
  const onDone = useCallback(() => setBooted(true), [])
  return (
    <>
      {!booted && <Boot ready={ready} onDone={onDone} />}
      <RelicField />
      <Header onSettings={() => setSettingsOpen(true)} />
      <main>
        <Hero />
        <Projects />
        <Stack />
        <About />
        <Contact />
      </main>
      <Footer />
      {booted && <ScrollRuler />}
      <CapriStage onReady={onReady} active={booted} />
      {settingsOpen && <SettingsDialog onClose={() => setSettingsOpen(false)} />}
    </>
  )
}
