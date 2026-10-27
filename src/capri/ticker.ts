// The label over her head ("ПРАВИТ  profile/README.md"), lifted from panel.js: throttled, flashes
// on change, sits on the tips of her mane and leans toward the middle of the view.
export interface TickerAction { verb: string; target?: string; error?: boolean; thinking?: boolean }
export interface Head { x: number; y: number; top: number }

export class Ticker {
  el: HTMLElement; verb: HTMLElement; target: HTMLElement
  private shownAt = -1e9; private timer = 0; private anchor: Head | null = null; private view = { w: 0, h: 0 }
  private hideTimer = 0
  constructor(el: HTMLElement) {
    this.el = el
    this.verb = el.querySelector('.ticker__verb') as HTMLElement
    this.target = el.querySelector('.ticker__target') as HTMLElement
  }
  set(action: TickerAction | null, { hold = 0 } = {}) {
    clearTimeout(this.timer); clearTimeout(this.hideTimer)
    if (!action) { this.el.hidden = true; return }
    const wait = Math.max(0, 380 - (performance.now() - this.shownAt))
    this.timer = window.setTimeout(() => {
      const counting = action.thinking && this.el.dataset.thinking === 'true' && !this.el.hidden
      this.shownAt = performance.now()
      this.verb.textContent = action.verb
      this.target.textContent = action.target || ''
      this.el.dataset.error = action.error ? 'true' : 'false'
      this.el.dataset.thinking = action.thinking ? 'true' : 'false'
      this.el.hidden = false
      if (!counting) { this.el.classList.remove('is-flash'); void this.el.offsetWidth; this.el.classList.add('is-flash') }
      this.place()
      if (hold) this.hideTimer = window.setTimeout(() => { this.el.hidden = true }, hold)
    }, wait)
  }
  setAnchor(head: Head, view: { w: number; h: number }) { this.anchor = head; this.view = view; this.place() }
  suspend() { this.el.style.visibility = 'hidden' }
  resume() { this.el.style.visibility = ''; this.place() }
  place() {
    if (this.el.hidden || !this.anchor) return
    const { x, top } = this.anchor
    const margin = 14
    const tw = this.el.offsetWidth
    const left = Math.min(Math.max(x - tw / 2, margin), this.view.w - tw - margin)
    // 70: under the sticky header it would be unreadable
    const topPx = Math.max(70, top - this.el.offsetHeight - 10)
    this.el.style.transform = `translate3d(${Math.round(left)}px, ${Math.round(topPx)}px, 0)`
  }
}
