import { useEffect } from 'react'
import { useT } from '../i18n'
import { useSettings, type Settings as S } from '../lib/settings'

export function SettingsDialog({ onClose }: { onClose: () => void }) {
  const t = useT()
  const { settings, set } = useSettings()
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    addEventListener('keydown', k); return () => removeEventListener('keydown', k)
  }, [onClose])
  const Seg = <K extends keyof S>({ k, label, opts }: { k: K; label: string; opts: [S[K], string][] }) => (
    <div className="seg">
      <span className="seg__label">{label}</span>
      <div className="seg__row" role="group" aria-label={label}>
        {opts.map(([v, name]) => <button key={String(v)} className="cut-sm" aria-pressed={settings[k] === v} onClick={() => set(k, v)}>{name}</button>)}
      </div>
    </div>
  )
  return (
    <div className="dlg" onClick={onClose} role="presentation">
      <div className="plate-offset dlg__wrap" onClick={e => e.stopPropagation()}>
      <div className="dlg__box cut" role="dialog" aria-modal aria-label={t.settings.title}>
        <h2>{t.settings.title}</h2>
        <Seg k="lang" label={t.settings.lang} opts={[['ru', 'Русский'], ['en', 'English']]} />
        <Seg k="theme" label={t.settings.theme} opts={[['dark', t.settings.dark], ['light', t.settings.light]]} />
        <Seg k="motion" label={t.settings.motion} opts={[['full', t.settings.full], ['less', t.settings.less]]} />
        <button className="btn btn--ghost cut-sm" onClick={onClose}>{t.settings.close}</button>
      </div>
      </div>
    </div>
  )
}
