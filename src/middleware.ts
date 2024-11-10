import { privateApiMiddleware, privateMiddleware } from './middleware/private'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  console.log(req.nextUrl.pathname)
  if (req.nextUrl.pathname.startsWith('/private')) {
    return await privateMiddleware(req)
  }

  if (req.nextUrl.pathname.startsWith('/api/folders') || req.nextUrl.pathname.startsWith('/api/terms')) {
    return await privateApiMiddleware(req)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/private', '/api/folders', '/api/folders/:uuid', '/api/folders/:uuid/terms', '/api/terms/:uuid'],
}
