import { useEffect, useRef, useState } from 'react'
import { Director, type Rect } from './director'

import { useSettings } from '../lib/settings'
import { useT } from '../i18n'

// One director per page: React StrictMode mounts twice in dev, and the WebGL renderer has no teardown.
let shared: Director | null = null

function rectOf(el: Element): Rect { const r = el.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height } }

export function CapriStage({ onReady, active }: { onReady: () => void; active: boolean }) {
  const stage = useRef<HTMLDivElement>(null)
  const [fallback, setFallback] = useState(false)
  const { settings } = useSettings()
  const t = useT()
  const tRef = useRef(t)
  useEffect(() => { tRef.current = t }, [t])

  useEffect(() => {
    const el = stage.current!
    if (shared) { onReady(); return }
    const d = new Director({
      stage: el,
      fx: el.querySelector('canvas.fx')!,
      root: el.querySelector('.capri')!,
      sprite: el.querySelector('.capri__sprite')!,
      mask: el.querySelector('canvas.mask')!,
      ticker: el.querySelector('.ticker')!,
    })
    shared = d
    ;(window as unknown as { capri: Director }).capri = d // for the curious: capri.poke(), capri.cheer(), capri.possess()
    d.idleLabel = () => {
      const k = tRef.current.ticker
      const verbs = [k.idle, k.thinking, k.watching, k.searching]
      const verb = verbs[Math.floor(Math.random() * verbs.length)]
      const target = verb === k.watching ? k.targets[5] : verb === k.thinking ? `${Math.round(5 + Math.random() * 40)} ${k.sec}` : k.targets[Math.floor(Math.random() * 5)]
      return { verb, target, thinking: verb === k.thinking }
    }
    d.boot({ home: () => { const h = document.getElementById('capri-home'); return h ? rectOf(h) : null } })
      .then(ok => { if (!ok) setFallback(true) })
      .catch(() => setFallback(true))
      .finally(onReady)
  }, [onReady])

  useEffect(() => { shared?.setMotion(settings.motion === 'less') }, [settings.motion])

  // Once the boot screen is gone: a ticker line, and section/card wiring.
  useEffect(() => {
    if (!active || !shared) return
    const d = shared
    d.enter().then(() => d.label({ verb: t.ticker.showing, target: 'portfolio' }, 3200))

    // The project cards are her windows. Hovering one for a moment: she comes and sits on it.
    const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-capri-window]'))
    d.setWindowElements(cards)
    let hoverTimer = 0
    const enter = (e: Event) => {
      const card = e.currentTarget as HTMLElement
      clearTimeout(hoverTimer)
      hoverTimer = window.setTimeout(() => {
        const name = card.querySelector('.project__title')?.textContent || ''
        d.label({ verb: t.ticker.editing, target: name }, 4000)
        d.perch(card.dataset.capriWindow || card.id)
      }, 500)
    }
    const leave = () => { clearTimeout(hoverTimer); d.unperch() }
    cards.forEach(c => { c.addEventListener('pointerenter', enter); c.addEventListener('pointerleave', leave) })

    // Opening a project link: the card tears and sheds shards for a beat.
    const shatter = (e: Event) => {
      const card = (e.currentTarget as HTMLElement).closest<HTMLElement>('.project'); if (!card) return
      d.shatter(rectOf(card))
      card.classList.remove('is-shatter'); void card.offsetWidth; card.classList.add('is-shatter')
    }
    const cardLinks = Array.from(document.querySelectorAll<HTMLElement>('.project a.btn'))
    cardLinks.forEach(a => a.addEventListener('click', shatter))

    // Contact buttons: a cheer. Hero in view again: she comes back to her column.
    const cheer = () => { d.label({ verb: t.ticker.running, target: 'telegram' }, 3000); d.cheer() }
    const contacts = Array.from(document.querySelectorAll<HTMLElement>('#contact a.btn, .hero__cta a.btn--red'))
    contacts.forEach(a => a.addEventListener('click', cheer))
    const home = document.getElementById('capri-home')
    const io = home && new IntersectionObserver(([en]) => { if (en.isIntersecting && en.intersectionRatio > 0.6) d.goHome() }, { threshold: [0.6] })
    if (home && io) io.observe(home)

    return () => {
      clearTimeout(hoverTimer)
      cards.forEach(c => { c.removeEventListener('pointerenter', enter); c.removeEventListener('pointerleave', leave) })
      d.setWindowElements([])
      contacts.forEach(a => a.removeEventListener('click', cheer))
      cardLinks.forEach(a => a.removeEventListener('click', shatter))
      io?.disconnect()
    }
  }, [active, t])

  return (
    <div className="capri-stage" ref={stage} aria-hidden>
      <canvas className="fx" />
      <div className="capri"><canvas className="capri__sprite" /></div>
      <canvas className="mask chip" hidden />
      <div className="ticker" hidden>
        <div className="ticker__plate"><span className="ticker__dot" /><span className="ticker__verb" /><span className="ticker__target" /></div>
      </div>
      {fallback && <img className="capri-fallback" src={`${import.meta.env.BASE_URL}capri/capri-rest.png`} alt="" />}
    </div>
  )
}
