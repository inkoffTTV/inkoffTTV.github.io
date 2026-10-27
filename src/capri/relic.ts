// The "relic glitch" background: a field that answers the pointer. Where the pointer moves, thin
// horizontal slices of the backdrop tear sideways in red, green and violet, and a faint grid of
// her ink shows through. Plain 2D canvas, under the content, cheap when the pointer is still.
import { pick, rand } from './vendor/util.js'

const COLORS = ['#ff2152', '#36ff7a', '#7b3dff', '#fff4f6']
interface Slice { x: number; y: number; w: number; h: number; dx: number; color: string; born: number; life: number }

export class RelicField {
  private ctx: CanvasRenderingContext2D
  private slices: Slice[] = []
  private running = false
  private last = { x: -1, y: -1, t: 0 }
  private dpr = 1
  private onMove = (e: PointerEvent) => this.pointer(e.clientX, e.clientY)
  private onResize = () => this.resize()
  private light = false
  private canvas: HTMLCanvasElement
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
    this.resize()
    addEventListener('pointermove', this.onMove, { passive: true })
    addEventListener('resize', this.onResize)
  }
  setLight(light: boolean) { this.light = light }
  resize() {
    this.dpr = Math.min(2, devicePixelRatio || 1)
    this.canvas.width = Math.round(innerWidth * this.dpr)
    this.canvas.height = Math.round(innerHeight * this.dpr)
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
  }
  private pointer(x: number, y: number) {
    const now = performance.now()
    const d = Math.hypot(x - this.last.x, y - this.last.y)
    if (now - this.last.t < 40 || d < 6) return
    const speed = Math.min(1, d / 60)
    this.last = { x, y, t: now }
    const n = 1 + Math.round(speed * 3)
    for (let i = 0; i < n; i++) {
      this.slices.push({
        x: x + rand(-140, 40), y: y + rand(-90, 90), w: rand(60, 260) * (0.5 + speed), h: rand(1, 3),
        dx: rand(-40, 40) * (0.4 + speed), color: pick(COLORS), born: now, life: rand(140, 420),
      })
    }
    if (this.slices.length > 90) this.slices.splice(0, this.slices.length - 90)
    this.start()
  }
  private start() {
    if (this.running) return
    this.running = true
    requestAnimationFrame(t => this.frame(t))
  }
  private frame(now: number) {
    const { ctx } = this
    ctx.clearRect(0, 0, innerWidth, innerHeight)
    this.slices = this.slices.filter(s => now - s.born < s.life)
    // drawn on twos, like her: positions only move every other frame
    const step = Math.floor(now / (1000 / 12))
    for (const s of this.slices) {
      const k = (now - s.born) / s.life
      const a = (1 - k) * (this.light ? 0.55 : 0.75)
      ctx.globalAlpha = a
      ctx.fillStyle = s.color
      const jitter = ((step + s.y) % 2) * 2 - 1
      ctx.fillRect(s.x + s.dx * k * jitter, s.y, s.w, s.h)
    }
    ctx.globalAlpha = 1
    if (this.slices.length) requestAnimationFrame(t => this.frame(t))
    else this.running = false
  }
  dispose() { removeEventListener('pointermove', this.onMove); removeEventListener('resize', this.onResize) }
}
