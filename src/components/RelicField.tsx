import { useEffect, useRef } from 'react'
import { RelicField as Field } from '../capri/relic'
import { useSettings } from '../lib/settings'

export function RelicField() {
  const ref = useRef<HTMLCanvasElement>(null)
  const field = useRef<Field | null>(null)
  const { settings } = useSettings()
  useEffect(() => {
    if (settings.motion === 'less' || matchMedia('(hover: none)').matches) return
    const f = new Field(ref.current!)
    field.current = f
    return () => { f.dispose(); field.current = null }
  }, [settings.motion])
  useEffect(() => { field.current?.setLight(settings.theme === 'light') }, [settings.theme])
  return <canvas ref={ref} className="relic" aria-hidden />
}
