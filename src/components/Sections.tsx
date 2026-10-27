import { useT } from '../i18n'
import { links, stack } from '../content/projects'

const faces = ['face-calm', 'face-aside', 'face-smug', 'face-wide', 'face-look', 'face-laugh', 'face-many', 'capri-face']

export function Stack() {
  const t = useT()
  const groups: Record<string, string[]> = {}
  for (const s of stack) (groups[s.group] ||= []).push(s.name)
  return (
    <section className="section" id="stack">
      <div className="wrap">
        <div className="section__head"><h2 className="section__title">{t.stack.title}</h2><span className="section__eyebrow">{t.stack.eyebrow}</span></div>
        <p className="muted" style={{ marginTop: 0 }}>{t.stack.note}</p>
        <div className="stack">
          {Object.entries(groups).map(([g, items]) => (
            <div key={g} className="stack__group cut-sm">
              <h3>{g}</h3>
              <div className="chips">{items.map(i => <span key={i} className="chip cut-sm">{i}</span>)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function About() {
  const t = useT()
  return (
    <section className="section" id="about">
      <div className="wrap">
        <div className="section__head"><h2 className="section__title">{t.about.title}</h2><span className="section__eyebrow">{t.about.eyebrow}</span></div>
        <div className="about">
          <div>
            <p>{t.about.p1}</p>
            <p>{t.about.p2}</p>
            <div className="faces" aria-hidden>{faces.map(f => <img key={f} src={`capri/${f}.png`} alt="" loading="lazy" className="cut-sm" />)}</div>
          </div>
          <div className="facts">{t.about.facts.map(([k, v]) => <div key={k} className="fact cut-sm"><span>{k}</span><span>{v}</span></div>)}</div>
        </div>
      </div>
    </section>
  )
}

export function Contact() {
  const t = useT()
  return (
    <section className="section" id="contact">
      <div className="wrap">
        <div className="section__head"><h2 className="section__title">{t.contact.title}</h2><span className="section__eyebrow">{t.contact.eyebrow}</span></div>
        <p className="contact__lead">{t.contact.lead}</p>
        <div className="contact__row">
          <a className="btn btn--red cut-sm" href={links.telegram} target="_blank" rel="noreferrer">{t.contact.telegram} · {links.telegramHandle}</a>
          <a className="btn cut-sm" href={links.github} target="_blank" rel="noreferrer">{t.contact.github}</a>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  const t = useT()
  return (
    <footer className="footer">
      <div className="wrap footer__in">
        <span>{t.footer.rights}</span>
        <span>© {new Date().getFullYear()} inkoff · <a href={links.source} target="_blank" rel="noreferrer">{t.footer.source}</a></span>
      </div>
    </footer>
  )
}
