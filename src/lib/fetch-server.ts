import { clientFetch } from '@lib/fetch-client'
import { cookies } from 'next/headers'

export const serverFetch = async (path: string,  init?: RequestInit) => {
  const token = (await cookies()).get('authjs.session-token')?.value
  return await clientFetch(path, {
    headers: { Authorization: `Bearer ${token}`, ...init?.headers },
    ...init
  })
}
