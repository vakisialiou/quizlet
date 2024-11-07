import type { NextRequest } from 'next/server'
import { getCookieTokenId } from '@lib/cookie'
import { NextResponse } from 'next/server'
import { googleTokenIdVerify } from '@lib/jwt-rsa'

export async function authMiddleware(request: NextRequest) {
  const tokenId = await getCookieTokenId()
  const tokenInfo = await googleTokenIdVerify(tokenId)
  console.log({ tokenId, tokenInfo })
  return NextResponse.next()
  // if (checkIfUserIsAdmin(request)) {
  //   return NextResponse.next()
  // }

  // return NextResponse.redirect(new URL('/private', request.url))
}

// function checkIfUserIsAdmin(request: NextRequest) {
//   return !!request.nextUrl.searchParams.get('token')
// }
