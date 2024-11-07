import ServerUser, { ServerUserType } from '@entities/ServerUser'
import { getTokens, getUserInfo, isScopeValid } from '@lib/auth'
import { setCookieAccess, setCookieRefresh } from '@lib/cookie'
import { upsertUser } from '@repositories/users'
import { type NextRequest } from 'next/server'
import { redirect } from 'next/navigation'

export async function GET(req: NextRequest) {
  const error = req.nextUrl.searchParams.get('error')
  if (error) {
    return new Response(null, { status: 401 })
  }

  const code = req.nextUrl.searchParams.get('code') || ''
  const scopeOutput = req.nextUrl.searchParams.get('scope') || ''

  if (!isScopeValid(scopeOutput) || !code) {
    return new Response(null, { status: 403 })
  }

  const tokens = await getTokens(code)

  if (!tokens) {
    return new Response(null, { status: 401 })
  }

  const userInfo = getUserInfo(tokens.idToken)
  if (!userInfo) {
    return new Response(null, { status: 401 })
  }

  const user = new ServerUser()
    .setName(userInfo.name)
    .setEmail(userInfo.email)
    .setGivenName(userInfo.givenName)
    .setFamilyName(userInfo.familyName)
    .setPicture(userInfo.picture)
    // Move to table 'credentials'
    .setAccountId(userInfo.accountId)
    .setRefreshToken(tokens.refreshToken)

  await upsertUser(user as ServerUserType)
  await setCookieAccess(tokens.accessToken)
  await setCookieRefresh(tokens.refreshToken)

  redirect('/')
}
