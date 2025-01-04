import { ClientTermData } from '@entities/Term'

export const searchTerms = (items: ClientTermData[], search: string | null, termEditId?: string | null): ClientTermData[] => {
  if (!search) {
    return items
  }

  return items.filter(({ id, question, answer, association }) => {
    if (termEditId === id) {
      return true
    }

    return `${question}`.toLocaleLowerCase().includes(search)
      || `${answer}`.toLocaleLowerCase().includes(search)
      || `${association}`.toLocaleLowerCase().includes(search)
  })
}
