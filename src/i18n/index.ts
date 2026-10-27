import { ru, type Dict } from './ru'
import { en } from './en'
import { useSettings } from '../lib/settings'

export const dicts: Record<'ru' | 'en', Dict> = { ru, en }
export function useT(): Dict {
  const { settings } = useSettings()
  return dicts[settings.lang]
}
