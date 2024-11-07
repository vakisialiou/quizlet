import { google } from 'googleapis'
import { decode } from '@lib/jwt'
import { config } from '@config'

export const REDIRECT_URL = 'http://localhost:3000/api/auth/done'

export const scope = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
]

const oauth2Client = new google.auth.OAuth2(
  config.oauth.clientId,
  config.oauth.clientSecret,
  REDIRECT_URL
)

export const generateAuthUrl = (): string => {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope
  })
}

export type TokensType = {
  idToken: string,
  accessToken: string,
  refreshToken: string
}

export const getTokens = async (code: string): Promise<TokensType | null> => {
  const res = await oauth2Client.getToken(code)
  if (res && res.tokens) {
    return {
      accessToken: res.tokens.access_token || '',
      refreshToken: res.tokens.refresh_token || '',
      idToken: res.tokens.id_token || ''
    }
  }
  return null
}

export type UserInfoType = {
  name: string
  email: string
  givenName: string
  familyName: string
  picture: string
  accountId: string
}

export const getUserInfo = (idToken: string): UserInfoType | null => {
  const userInfo = decode(idToken)
  if (!userInfo?.sub) {
    return null
  }

  return {
    name: userInfo.name,
    email: userInfo.email,
    accountId: userInfo.sub,
    picture: userInfo.picture,
    givenName: userInfo.given_name,
    familyName: userInfo.family_name
  }
}

export const isScopeValid = (scopeOutput: string): boolean => {
  const arr = (scopeOutput || '').split(' ')
  for (let str of scope) {
    if (!arr.includes(str)) {
      return false
    }
  }
  return true
}
