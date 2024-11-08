import type { NextRequest } from 'next/server'
import { getCookieTokenId } from '@lib/cookie'
import { getUserInfo } from '@lib/auth'
import { NextResponse } from 'next/server'

export async function authMiddleware(request: NextRequest) {
  const tokenId = await getCookieTokenId()
  if (tokenId) {
    const tokenInfo = await getUserInfo(tokenId)
    console.log({ tokenId, tokenInfo })
  }
  return NextResponse.next()
  // if (checkIfUserIsAdmin(request)) {
  //   return NextResponse.next()
  // }

  // return NextResponse.redirect(new URL('/private', request.url))
}

// function checkIfUserIsAdmin(request: NextRequest) {
//   return !!request.nextUrl.searchParams.get('token')
// }
