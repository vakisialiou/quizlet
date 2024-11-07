import ServerCredential , { ServerCredentialType } from '@entities/ServerCredential'
import ServerUser, { ServerUserType } from '@entities/ServerUser'
import { getTokens, getUserInfo, isScopeValid } from '@lib/auth'
import { upsertCredential } from '@repositories/credentials'
import { upsertUser } from '@repositories/users'
import { type NextRequest } from 'next/server'
import { setCookieTokenId } from '@lib/cookie'
import { redirect } from 'next/navigation'

export async function GET(req: NextRequest) {
  const error = req.nextUrl.searchParams.get('error')
  if (error) {
    // TODO redirect to 401 page
    return new Response(null, { status: 401 })
  }

  const code = req.nextUrl.searchParams.get('code') || ''
  const scopeOutput = req.nextUrl.searchParams.get('scope') || ''

  if (!isScopeValid(scopeOutput) || !code) {
    // TODO redirect to 403 page
    return new Response(null, { status: 403 })
  }

  const tokens = await getTokens(code)

  if (!tokens) {
    // TODO redirect to 401 page
    return new Response(null, { status: 401 })
  }

  const userInfo = getUserInfo(tokens.idToken)
  if (!userInfo) {
    // TODO redirect to 401 page
    return new Response(null, { status: 401 })
  }

  const user = new ServerUser()
    .setName(userInfo.name)
    .setEmail(userInfo.email)
    .setPicture(userInfo.picture)
    .setGivenName(userInfo.givenName)
    .setFamilyName(userInfo.familyName)

  const userId = await upsertUser(user as ServerUserType)

  if (!userId) {
    // TODO redirect to 500 page
    return new Response(null, { status: 500 })
  }

  const credential = new ServerCredential()
    .setUserId(userId)
    .setAccountId(userInfo.accountId)
    .setAccessToken(tokens.accessToken)
    .setRefreshToken(tokens.refreshToken)

  await upsertCredential(credential as ServerCredentialType)

  await setCookieTokenId(tokens.idToken)

  redirect('/')
}
