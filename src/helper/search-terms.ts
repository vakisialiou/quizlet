import { TermData } from '@entities/Term'

export const searchTerms = (items: TermData[], search: string | null, termEditId?: string | null): TermData[] => {
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
