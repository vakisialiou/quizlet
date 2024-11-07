import { cookies } from 'next/headers'
import { days } from '@lib/time'

const EXP_DAYS = 365
export const AUTH_TOKEN_ID = 'auth-id'

export enum SameSite {
  LAX = 'lax',
  NONE = 'none',
  STRICT = 'strict'
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export type CookieType = {
  name?: string,
  value?: string,
  expires?: Date
  maxAge?: number
  domain?: string
  path?: string
  secure?: boolean,
  httpOnly?: boolean
  sameSite?: SameSite
  priority?: Priority
  partitioned?: boolean
}

export const setCookie = async (name: string, value: string, options: CookieType = {}): Promise<void> => {
  (await cookies()).set(name, value, {
    expires: new Date(Date.now() + days(EXP_DAYS)),
    sameSite: SameSite.STRICT,
    priority: Priority.HIGH,
    httpOnly: true,
    secure: true,
    path: '/',
    ...options
  })
}

export const getCookie = async (name: string): Promise<CookieType | null> => {
  const cookie = (await cookies()).get(name) as CookieType
  return cookie || null
}

export const removeCookie = async (name: string): Promise<void> => {
  (await cookies()).delete(name)
}

export const setCookieTokenId = async (value: string, options: CookieType = {}): Promise<void> => {
  return setCookie(AUTH_TOKEN_ID, value, options)
}

export const getCookieTokenId = (): Promise<string | null> => {
  return getCookie(AUTH_TOKEN_ID).then((res) => res?.value || null)
}
