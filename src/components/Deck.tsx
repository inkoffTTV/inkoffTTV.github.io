import { useEffect, useRef, useState } from 'react'
import { useT } from '../i18n'
import { useSettings } from '../lib/settings'
import { projects } from '../content/projects'
import { timeAgo, useRepo } from '../lib/github'

// The projects as a deck: giant titles on the left, a stack of tilted cards on the right.
// Scrolling through the section flips the deck: the front card slides up and back, the next one
// rises from below. Each card is one of Capri's "windows", so she rides the front one.
const N = projects.length

function Detail({ index }: { index: number }) {
  const t = useT(); const { settings } = useSettings()
  const p = projects[index]; const c = t.projects[p.id]
  const info = useRepo(p.repo)
  return (
    <div className="deck__detail" key={p.id}>
      <p className="deck__desc">{c.desc}</p>
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
  )
}

export function Deck() {
  const t = useT()
  const section = useRef<HTMLElement>(null)
  const [f, setF] = useState(0) // 0 … N-1, fractional: how far the deck is flipped
  useEffect(() => {
    let raf = 0
    const measure = () => {
      const el = section.current; if (!el) return
      const top = el.offsetTop; const len = el.offsetHeight - innerHeight
      const p = len > 0 ? Math.min(1, Math.max(0, (scrollY - top) / len)) : 0
      setF(p * (N - 1))
    }
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure) }
    measure(); addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll)
    return () => { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); cancelAnimationFrame(raf) }
  }, [])
  const active = Math.round(f)
  const go = (i: number) => {
    const el = section.current; if (!el) return
    const len = el.offsetHeight - innerHeight
    scrollTo({ top: el.offsetTop + (len * i) / Math.max(1, N - 1) + 1, behavior: 'smooth' })
  }
  return (
    <section className="section deck" id="projects" ref={section} style={{ height: `${N * 100 + 60}vh` }}>
      <div className="deck__sticky">
        <div className="wrap">
          <div className="section__head"><h2 className="section__title">{t.projects.title}</h2><span className="section__eyebrow">{t.projects.eyebrow}</span></div>
          <div className="deck__grid">
            <div className="deck__list">
              {projects.map((p, i) => {
                const c = t.projects[p.id]; const name = p.repo.split('/')[1]
                return (
                  <button key={p.id} className={'deck__item' + (i === active ? ' is-active' : '')} onClick={() => go(i)} aria-current={i === active}>
                    <span className="deck__num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="deck__title">{name}</span>
                    <span className="deck__tag">{c.tag}</span>
                  </button>
                )
              })}
              <Detail index={active} />
            </div>
            <div className="deck__stage" aria-hidden={false}>
              {projects.map((p, i) => {
                const d = i - f // 0: in front; negative: already flipped away; positive: still to come
                const back = Math.max(0, -d), ahead = Math.max(0, d)
                const style = {
                  transform: `translate3d(0, ${-34 * back + 112 * ahead}%, ${-160 * back}px) scale(${1 - 0.08 * back}) rotateX(${-10 * ahead}deg)`,
                  opacity: 1 - 0.45 * Math.min(1, back),
                  filter: back > 0.05 ? `blur(${Math.min(3, back * 2)}px)` : 'none',
                  zIndex: N - Math.round(Math.abs(d) * 10) + 10,
                } as const
                const c = t.projects[p.id]
                return (
                  <article key={p.id} className="plate-offset deck__slot" data-accent={p.accent} style={style}>
                    <div className="project deck__card cut" data-accent={p.accent} id={`project-${p.id}`} data-capri-window={p.id} data-capri-name={p.repo.split('/')[1]}>
                      <div className={'project__art cut-sm' + (p.id === 'vicinity' ? ' project__art--vicinity' : '')}>
                        {p.image ? <img src={p.image} alt="" loading="lazy" /> : <span>Vicinity</span>}
                      </div>
                      <ul className="project__bullets">
                        {c.bullets.map(([b, dsc]) => <li key={b}><span><b>{b}</b> · {dsc}</span></li>)}
                      </ul>
                      <div className="chips">{p.stack.map(s => <span key={s} className="chip cut-sm">{s}</span>)}</div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
