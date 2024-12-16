import { ClientTermData } from '@entities/ClientTerm'
import { clientFetch } from '@lib/fetch-client'

export const saveClientTermData = async (term: ClientTermData) => {
  const res = await clientFetch(`/api/terms/${term.id}`, {
    method: 'PUT',
    body: JSON.stringify(term)
  })

  if (!res.ok) {
    throw new Error('Save term error.', { cause: res.statusText })
  }
}
