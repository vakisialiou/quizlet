import {NextRequest, NextResponse} from 'next/server'
import { getToken } from 'next-auth/jwt'
import { config, ENV } from '@config'

export async function privateMiddleware(req: NextRequest, res: NextResponse) {
  const token = await getToken({ req, secret: config.oauth.secret, secureCookie: config.server.env === ENV.PROD, raw: true })

  if (!token) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return res
}


export async function privateApiMiddleware(req: NextRequest, res: NextResponse) {
  const token = await getToken({ req, secret: config.oauth.secret, secureCookie: config.server.env === ENV.PROD, raw: true })

  if (!token) {
    return new NextResponse(null, { status: 401 })
  }

  return res
}
