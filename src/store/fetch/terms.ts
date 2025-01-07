import { clientFetch } from '@lib/fetch-client'
import { TermData } from '@entities/Term'

export const upsertTermData = async (term: TermData, shareId: string | null): Promise<boolean> => {
  const res = await clientFetch(`/api/terms/${term.id}`, {
    method: 'PUT',
    body: JSON.stringify({ term, shareId })
  })

  return res.ok
}
