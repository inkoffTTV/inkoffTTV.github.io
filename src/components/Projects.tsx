import { useT } from '../i18n'
import { useSettings } from '../lib/settings'
import { projects, type Project } from '../content/projects'
import { timeAgo, useRepo } from '../lib/github'
import { useMedia } from '../lib/useMedia'
import { Deck } from './Deck'

function Card({ p }: { p: Project }) {
  const t = useT(); const { settings } = useSettings()
  const info = useRepo(p.repo)
  const c = t.projects[p.id]
  const name = p.repo.split('/')[1]
  return (
    <div className="plate-offset" data-accent={p.accent}>
    <article className="project cut" data-accent={p.accent} id={`project-${p.id}`} data-capri-window={p.id} data-capri-name={name}>
      <div>
        <div className="project__kicker"><span>{p.id === 'vicinity' ? t.ticker.running : t.ticker.editing}</span><span>{name}</span></div>
        <h3 className="project__title">{name}</h3>
        <p className="project__tag">{c.tag}</p>
        <p className="project__desc">{c.desc}</p>
        <ul className="project__bullets">
          {c.bullets.map(([b, d]) => <li key={b}><span><b>{b}</b> · {d}</span></li>)}
        </ul>
        <div className="project__meta" aria-live="polite">
          {info && <>
            <span>★ <b>{info.stars}</b> {t.projects.stars}</span>
            <span>⑂ <b>{info.forks}</b> {t.projects.forks}</span>
            {info.language && <span>{t.projects.lang}: <b>{info.language}</b></span>}
            <span>{t.projects.updated} <b>{timeAgo(info.pushedAt, settings.lang)}</b></span>
          </>}
        </div>
        <div className="project__links">
          <a className="btn cut-sm" data-shatter data-project={p.id} href={p.links.repo} target="_blank" rel="noreferrer">{t.projects.repo}</a>
          {p.links.download && <a className="btn btn--red cut-sm" data-shatter data-project={p.id} href={p.links.download} target="_blank" rel="noreferrer">{t.projects.download}</a>}
          {p.links.site && <a className="btn btn--ghost cut-sm" data-shatter data-project={p.id} href={p.links.site} target="_blank" rel="noreferrer">{t.projects.site}</a>}
          {p.links.releases && <a className="btn btn--ghost cut-sm" data-shatter data-project={p.id} href={p.links.releases} target="_blank" rel="noreferrer">{t.projects.releases}</a>}
        </div>
      </div>
      <div className="project__side">
        <div className={'project__art cut-sm' + (p.id === 'vicinity' ? ' project__art--vicinity' : '')}>
          {p.image ? <img src={p.image} alt="" loading="lazy" /> : <span>Vicinity</span>}
        </div>
        <div className="chips">{p.stack.map(s => <span key={s} className="chip cut-sm">{s}</span>)}</div>
      </div>
    </article>
    </div>
  )
}

export function Projects() {
  const t = useT()
  const wide = useMedia('(min-width: 900px) and (hover: hover)')
  if (wide) return <Deck />
  return (
    <section className="section" id="projects">
      <div className="wrap">
        <div className="section__head"><h2 className="section__title">{t.projects.title}</h2><span className="section__eyebrow">{t.projects.eyebrow}</span></div>
        <div className="projects">{projects.map(p => <Card key={p.id} p={p} />)}</div>
      </div>
    </section>
  )
}
