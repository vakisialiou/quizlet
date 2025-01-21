import {NextRequest, NextResponse} from 'next/server'
import { getToken } from 'next-auth/jwt'
import { config } from '@config'

export async function privateMiddleware(req: NextRequest) {
  const token = await getToken({ req, secret: config.oauth.secret, secureCookie: false, raw: true })

  if (!token) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}


export async function privateApiMiddleware(req: NextRequest) {
  const token = await getToken({ req, secret: config.oauth.secret, secureCookie: false, raw: true })

  if (!token) {
    return new NextResponse(null, { status: 401 })
  }

  return NextResponse.next()
}
