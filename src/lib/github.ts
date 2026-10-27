import { useEffect, useState } from 'react'

export interface RepoInfo { stars: number; forks: number; pushedAt: string; language: string | null; description: string | null }
const TTL = 60 * 60 * 1000

export function useRepo(full: string): RepoInfo | null {
  const [info, setInfo] = useState<RepoInfo | null>(null)
  useEffect(() => {
    const key = `inkoff:repo:${full}`
    try {
      const c = JSON.parse(sessionStorage.getItem(key) || 'null') as { at: number; info: RepoInfo } | null
      if (c && Date.now() - c.at < TTL) { setInfo(c.info); return }
    } catch { /* ignore */ }
    const ctrl = new AbortController()
    fetch(`https://api.github.com/repos/${full}`, { signal: ctrl.signal, headers: { Accept: 'application/vnd.github+json' } })
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: { stargazers_count: number; forks_count: number; pushed_at: string; language: string | null; description: string | null }) => {
        const i: RepoInfo = { stars: d.stargazers_count, forks: d.forks_count, pushedAt: d.pushed_at, language: d.language, description: d.description }
        setInfo(i)
        try { sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), info: i })) } catch { /* ignore */ }
      })
      .catch(() => { /* rate limit or offline: the card still renders from static content */ })
    return () => ctrl.abort()
  }, [full])
  return info
}

export function timeAgo(iso: string, lang: 'ru' | 'en'): string {
  const d = (Date.now() - new Date(iso).getTime()) / 1000
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' })
  if (d < 3600) return rtf.format(-Math.round(d / 60), 'minute')
  if (d < 86400) return rtf.format(-Math.round(d / 3600), 'hour')
  if (d < 86400 * 30) return rtf.format(-Math.round(d / 86400), 'day')
  return rtf.format(-Math.round(d / (86400 * 30)), 'month')
}
