import { useEffect, useState } from 'react'
import { useT } from '../i18n'

export function Boot({ ready, onDone }: { ready: boolean; onDone: () => void }) {
  const t = useT()
  const [n, setN] = useState(0)
  const [leaving, setLeaving] = useState(false)
  useEffect(() => {
    // Counts up quickly to 90, then waits for assets; snaps to 100 when ready.
    const id = setInterval(() => setN(v => (v < 90 ? v + Math.max(1, Math.round((90 - v) / 8)) : v)), 60)
    return () => clearInterval(id)
  }, [])
  useEffect(() => {
    if (!ready) return
    setN(100)
    const t1 = setTimeout(() => setLeaving(true), 220)
    const t2 = setTimeout(onDone, 820)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [ready, onDone])
  return (
    <div className={'boot' + (leaving ? ' is-leaving' : '')} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={n} aria-label={t.boot.loading}>
      <span className="boot__num" aria-hidden>{String(n).padStart(3, '0')}</span>
      <span className="boot__label">{t.boot.loading}</span>
      <div className="boot__track"><div className="boot__fill" style={{ transform: `scaleX(${n / 100})` }} /></div>
    </div>
  )
}
