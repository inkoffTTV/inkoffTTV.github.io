// Puts Capri on the page: the WebGL sprite, the FX layer and the ticker on one fixed, full-viewport
// stage (so her coordinates are plain viewport pixels, as in the desktop app), and a small API the
// React side drives: show a card, cheer, poke, change labels.
import { Capri } from './vendor/capri.js'
import { FxLayer } from './vendor/fx.js'
import { Mask } from './vendor/chip.js'
import { reducedMotion, pick, rand } from './vendor/util.js'
import { Ticker, type TickerAction } from './ticker'

const CUTINS = ['grin', 'laugh', 'eyes', 'many', 'look'] as const
const silentVoice = { play() {}, configure() {} }

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => { const i = new Image(); i.onload = () => resolve(i); i.onerror = reject; i.src = src })
}
function hasWebGL() {
  try { const c = document.createElement('canvas'); return Boolean(c.getContext('webgl') || c.getContext('experimental-webgl')) } catch { return false }
}

export interface Rect { x: number; y: number; w: number; h: number }
export interface StageEls { stage: HTMLElement; fx: HTMLCanvasElement; root: HTMLElement; sprite: HTMLCanvasElement; mask: HTMLCanvasElement; ticker: HTMLElement }

export class Director {
  capri: InstanceType<typeof Capri> | null = null
  fx: InstanceType<typeof FxLayer> | null = null
  mask: InstanceType<typeof Mask> | null = null
  ticker: Ticker
  private els: StageEls
  private base = import.meta.env.BASE_URL
  private mouse: { x: number; y: number } | null = null
  private disposed = false
  private onResize = () => this.resize()
  private onMouse = (e: MouseEvent) => { this.mouse = { x: e.clientX, y: e.clientY }; this.refreshHit() }
  private onLeave = () => { this.mouse = null; this.refreshHit() }
  private homeRect: (() => Rect | null) | null = null
  private windowEls: HTMLElement[] = []
  private frontId: string | number = 0
  private syncQueued = false
  private onScroll = () => this.queueSync()
  idleLabel: (() => TickerAction) | null = null
  private idleTimer = 0

  constructor(els: StageEls) { this.els = els; this.ticker = new Ticker(els.ticker) }

  async boot({ home }: { home: () => Rect | null }): Promise<boolean> {
    this.homeRect = home
    if (!hasWebGL()) return false
    const [image, ...cutins] = await Promise.all([
      loadImage(`${this.base}capri/capri-full.png`),
      ...CUTINS.map(n => loadImage(`${this.base}capri/cutin-${n}.png`).catch(() => null)),
      document.fonts.load('600 16px "Chakra Petch"').catch(() => null),
      document.fonts.load('400 11px "JetBrains Mono"').catch(() => null),
    ])
    if (this.disposed) return false
    const { fx, root, sprite, mask } = this.els
    this.fx = new FxLayer(fx, { cutins: Object.fromEntries(CUTINS.map((n, i) => [n, cutins[i]])) })
    this.fx.resize(innerWidth, innerHeight)
    let capri: InstanceType<typeof Capri>
    try {
      capri = new Capri({ root, canvas: sprite, image, fx: this.fx, voice: silentVoice })
    } catch { return false }
    this.capri = capri
    capri.wander = true
    capri.possessWindows = true
    capri.restOn = 'corner'
    capri.chipAt = () => ({ x: innerWidth - 40, y: innerHeight - 40 })
    this.mask = new Mask(mask)
    capri.onMove = (head: { x: number; y: number; top: number }) => { this.ticker.setAnchor(head, capri.view); this.refreshHit() }
    capri.onTeleport = (phase: string) => (phase === 'start' ? this.ticker.suspend() : this.ticker.resume())
    capri.onDoze = (phase: string, face: { x: number; y: number }) => {
      if (!this.mask) return
      if (phase === 'start') { this.mask.place(face.x, face.y, capri.scale * 1.1); this.mask.show() }
      else if (phase === 'waking') this.mask.wake()
      else this.mask.hide()
    }
    capri.onClick = () => this.poke()
    capri.onMenu = () => {}
    this.resize()
    addEventListener('resize', this.onResize)
    addEventListener('scroll', this.onScroll, { passive: true })
    addEventListener('mousemove', this.onMouse)
    document.addEventListener('mouseleave', this.onLeave)
    const at = this.homeSpot()
    capri.pos = { ...at }
    await capri.materialize(at)
    capri.nextMove = performance.now() + rand(20000, 40000)
    this.scheduleIdleLabel()
    return true
  }

  // Where she stands on the first screen: the column the hero keeps free for her.
  private homeSpot() {
    const c = this.capri!
    const r = this.homeRect?.()
    if (r && r.w > 200 && r.y + r.h > 200) {
      return { x: r.x + r.w * 0.55, y: Math.min(r.y + r.h - 16, c.floor) }
    }
    return c.spot('post')
  }

  private scale() {
    const byHeight = (innerHeight / 900) * 0.78
    const byWidth = (innerWidth / 1400) * 0.9
    return Math.min(0.85, Math.max(0.42, Math.min(byHeight, byWidth)))
  }

  resize() {
    const c = this.capri; if (!c || !this.fx) return
    const h = this.els.stage.clientHeight || innerHeight
    this.fx.resize(innerWidth, h)
    c.setView(innerWidth, h, h - 8)
    c.setScale(this.scale())
    this.syncWindows()
  }

  // The page's cards are her "windows": she perches on their top edge, rides along as they scroll,
  // falls when they leave the screen, and now and then dives into one (fx.possess draws over it).
  setWindowElements(els: HTMLElement[]) { this.windowEls = els; this.syncWindows() }
  private queueSync() {
    if (this.syncQueued) return
    this.syncQueued = true
    requestAnimationFrame(() => { this.syncQueued = false; this.syncWindows() })
  }
  private windows() {
    const stageTop = this.els.stage.getBoundingClientRect().top
    return this.windowEls.map(el => {
      const r = el.getBoundingClientRect()
      return { id: el.dataset.capriWindow || el.id, x: r.left, y: r.top - stageTop, w: r.width, h: r.height, max: false }
    })
  }
  syncWindows() {
    const c = this.capri; if (!c) return
    const wins = this.windows()
    const front = wins.find(w => w.id === this.frontId)
    c.setWindows({ fg: this.frontId, wins: front ? [front, ...wins.filter(w => w !== front)] : wins })
  }
  private sitOnCard(id: string) {
    const c = this.capri; if (!c || c.busy || c.dragging || c.dormant) return
    const win = this.windows().find(w => w.id === id)
    if (!win || !c.canSit(win)) return
    if (c.mode === 'sleep') c.wake()
    if (c.stance === 'sit' && c.perch?.id === id) return
    c.nextMove = performance.now() + 45000
    const dx = Math.min(Math.max(win.w * 0.72, 60), Math.max(60, win.w - 190))
    c.sitOn({ win, dx })
  }

  // Click-through everywhere except on her body (the app did this with the OS; here with pointer-events).
  private refreshHit() {
    const c = this.capri; if (!c) return
    const on = c.dragging || (this.mouse ? c.hit(this.mouse.x, this.mouse.y) : false)
    this.els.sprite.style.pointerEvents = on ? 'auto' : 'none'
    this.els.sprite.style.cursor = c.dragging ? 'grabbing' : on ? 'grab' : ''
  }

  setMotion(less: boolean) { reducedMotion.setting = less ? 'reduced' : 'auto' }

  label(action: TickerAction | null, hold = 2600) { this.ticker.set(action, { hold }) }

  private scheduleIdleLabel() {
    clearTimeout(this.idleTimer)
    this.idleTimer = window.setTimeout(() => {
      const c = this.capri
      if (c && !c.busy && !c.dormant && this.idleLabel && this.capri?.mode !== 'sleep') this.label(this.idleLabel(), 2400)
      this.scheduleIdleLabel()
    }, rand(9000, 18000))
  }

  // Hovering a card: she goes and sits on its top edge, like on a window.
  perch(id: string) { this.frontId = id; this.syncWindows(); this.sitOnCard(id) }
  unperch() { this.frontId = 0; this.syncWindows() }
  // She dives into the card she sits on and looks out of it with her eyes.
  possess() { const c = this.capri; if (c && c.canPossess()) c.possess() }

  // A card being opened: it tears into slices and throws shards, like her teleport.
  shatter(rect: Rect) {
    const fx = this.fx; if (!fx) return
    const cx = rect.x + rect.w / 2, cy = rect.y + rect.h / 2
    fx.slices(cx, rect.y, rect.w, rect.h, { count: 12, life: 260 })
    fx.burst(cx, cy, { count: 18, power: 0.8, spread: rect.w * 0.5 })
    fx.ring(cx, cy, { size: 1.2 })
    const c = this.capri
    if (c && !c.busy && c.stance === 'sit') c.perform('flinch', c.towardCenter())
  }

  // Something good happened (a contact click): her victory beat with the laugh cut-in.
  async cheer() { const c = this.capri; if (!c || c.busy) return; await c.celebrate() }

  poke() {
    const c = this.capri; if (!c || c.busy) return
    if (c.mode === 'sleep') { c.wake(); return }
    const acts = ['spin', 'hop', 'split', 'curious', 'look', 'victory']
    c.perform(pick(acts), c.towardCenter())
  }

  async goHome() {
    const c = this.capri; if (!c || c.busy || c.dragging) return
    if (c.stance === 'sit') return
    const at = this.homeSpot()
    if (Math.hypot(at.x - c.pos.x, at.y - c.pos.y) > 60) await c.teleport(at)
  }

  dispose() {
    this.disposed = true
    clearTimeout(this.idleTimer)
    removeEventListener('resize', this.onResize)
    removeEventListener('scroll', this.onScroll)
    removeEventListener('mousemove', this.onMouse)
    document.removeEventListener('mouseleave', this.onLeave)
    // The vendor classes keep their own rAF loops; hide the stage so an orphan instance never shows.
    this.els.stage.hidden = true
  }
}
