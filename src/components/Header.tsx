import { useT } from '../i18n'
import { useSettings } from '../lib/settings'

export function Header({ onSettings }: { onSettings: () => void }) {
  const t = useT()
  const { settings, set } = useSettings()
  return (
    <header className="header">
      <div className="wrap header__in">
        <a className="brand" href="#top"><img src="favicon.png" alt="" width={28} height={28} />inkoff</a>
        <nav className="nav" aria-label="Sections">
          <a href="#projects">{t.nav.projects}</a>
          <a href="#stack">{t.nav.stack}</a>
          <a href="#about">{t.nav.about}</a>
          <a href="#contact">{t.nav.contact}</a>
          <button className="lang" onClick={() => set('lang', settings.lang === 'ru' ? 'en' : 'ru')} aria-label={t.settings.lang}>
            {settings.lang === 'ru' ? 'EN' : 'RU'}
          </button>
          <button onClick={onSettings}>{t.nav.settings}</button>
        </nav>
      </div>
    </header>
  )
}
