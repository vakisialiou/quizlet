import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { config } from '@config'

export async function privateMiddleware(req: NextRequest) {
  const token = await getToken({ req, secret: config.oauth.secret })

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}


export async function privateApiMiddleware(req: NextRequest) {
  const token = await getToken({ req, secret: config.oauth.secret })

  if (!token) {
    return new NextResponse(null, { status: 401 })
  }

  return NextResponse.next()
}
