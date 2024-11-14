import { config } from '@lib/config'

export const clientFetch = async (path: string,  init?: RequestInit) => {
  return await fetch(`${config.server.baseURL}${path}`, {...init })
}
