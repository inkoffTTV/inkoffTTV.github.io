import { useT } from '../i18n'

export function Hero() {
  const t = useT()
  return (
    <section className="hero" id="top">
      <div className="hero__bg" aria-hidden />
      <div className="wrap hero__grid">
        <div>
          <p className="eyebrow">{t.hero.eyebrow}</p>
          <h1 className="hero__name" aria-label={t.hero.name}>
            <span className="ghost ghost--r" aria-hidden>{t.hero.name}</span>
            <span className="ghost ghost--g" aria-hidden>{t.hero.name}</span>
            {t.hero.name}
          </h1>
          <p className="hero__tagline">{t.hero.tagline}</p>
          <div className="hero__cta">
            <a className="btn cut-sm" href="#projects">{t.hero.cta}</a>
            <a className="btn btn--red cut-sm" href="#contact">{t.hero.cta2}</a>
          </div>
          <p className="hero__hint">{t.hero.hint}</p>
        </div>
        {/* Capri herself lives on the fixed stage; this column reserves her room on the first screen. */}
        <div className="hero__stage" id="capri-home" aria-hidden />
      </div>
    </section>
  )
}
