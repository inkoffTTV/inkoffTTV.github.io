import { useEffect, useState } from 'react'
export function useMedia(q: string) {
  const [m, setM] = useState(() => (typeof matchMedia !== 'undefined' ? matchMedia(q).matches : false))
  useEffect(() => { const mq = matchMedia(q); const f = () => setM(mq.matches); f(); mq.addEventListener('change', f); return () => mq.removeEventListener('change', f) }, [q])
  return m
}
