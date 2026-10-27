import { useEffect, useRef, useState } from 'react'
import { useT } from '../i18n'

// The ruler on the right: ticks along the page, a marker at the scroll position, section names at
// their ticks. Like the depth gauge on a dive computer, in her colours.
const SECTIONS = ['top', 'projects', 'stack', 'about', 'contact'] as const
const TICKS = 48

export function ScrollRuler() {
  const t = useT()
  const [progress, setProgress] = useState(0)
  const [marks, setMarks] = useState<{ id: string; p: number }[]>([])
  const raf = useRef(0)
  useEffect(() => {
    const measure = () => {
      const max = document.documentElement.scrollHeight - innerHeight
      setProgress(max > 0 ? scrollY / max : 0)
      setMarks(SECTIONS.map(id => { const el = document.getElementById(id); return { id, p: el && max > 0 ? Math.min(1, Math.max(0, (el.getBoundingClientRect().top + scrollY - 60) / max)) : 0 } }))
    }
    const onScroll = () => { cancelAnimationFrame(raf.current); raf.current = requestAnimationFrame(measure) }
    measure()
    addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll)
    return () => { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); cancelAnimationFrame(raf.current) }
  }, [])
  const names: Record<string, string> = { top: 'inkoff', projects: t.nav.projects, stack: t.nav.stack, about: t.nav.about, contact: t.nav.contact }
  return (
    <nav className="ruler" aria-label="Scroll position">
      <div className="ruler__ticks" aria-hidden>
        {Array.from({ length: TICKS }, (_, i) => <span key={i} className={'ruler__tick' + (i % 8 === 0 ? ' is-major' : '')} style={{ opacity: Math.abs(i / (TICKS - 1) - progress) < 0.06 ? 1 : undefined }} />)}
      </div>
      <span className="ruler__marker" style={{ top: `${progress * 100}%` }} aria-hidden />
      {marks.map(m => (
        <a key={m.id} href={`#${m.id}`} className={'ruler__mark' + (Math.abs(m.p - progress) < 0.08 ? ' is-active' : '')} style={{ top: `${m.p * 100}%` }}>{names[m.id]}</a>
      ))}
      <span className="ruler__pct" aria-hidden>{String(Math.round(progress * 100)).padStart(3, '0')}</span>
    </nav>
  )
}
