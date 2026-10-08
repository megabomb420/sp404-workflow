import { useLocale } from './locale'
import { messages, type Messages } from './messages'

export function useT(): Messages {
  const { locale } = useLocale()
  return messages[locale]
}
