import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Lang = 'ru' | 'en'
export type Theme = 'dark' | 'light'
export type Motion = 'full' | 'less'
export interface Settings { lang: Lang; theme: Theme; motion: Motion }

const KEY = 'inkoff:settings:v1'
const DEFAULTS: Settings = { lang: 'ru', theme: 'dark', motion: 'full' }

function load(): Settings {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || 'null') as Partial<Settings> | null
    const s = { ...DEFAULTS, ...(raw || {}) }
    if (!raw && typeof navigator !== 'undefined' && !/^ru/i.test(navigator.language)) s.lang = 'en'
    if (!raw && typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches) s.motion = 'less'
    return s
  } catch { return DEFAULTS }
}

interface Ctx { settings: Settings; set: <K extends keyof Settings>(k: K, v: Settings[K]) => void }
const SettingsCtx = createContext<Ctx | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(load)
  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = settings.theme
    root.style.colorScheme = settings.theme
    root.lang = settings.lang
    if (settings.motion === 'less') root.dataset.motion = 'less'; else delete root.dataset.motion
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', settings.theme === 'light' ? '#f6eef1' : '#14101c')
    try { localStorage.setItem(KEY, JSON.stringify(settings)) } catch { /* storage is optional */ }
  }, [settings])
  const set = useCallback(<K extends keyof Settings>(k: K, v: Settings[K]) => setSettings(s => ({ ...s, [k]: v })), [])
  const value = useMemo(() => ({ settings, set }), [settings, set])
  return <SettingsCtx.Provider value={value}>{children}</SettingsCtx.Provider>
}

export function useSettings() {
  const ctx = useContext(SettingsCtx)
  if (!ctx) throw new Error('useSettings outside SettingsProvider')
  return ctx
}
