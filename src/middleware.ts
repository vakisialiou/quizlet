import { privateApiMiddleware, privateMiddleware } from './middleware/private'
import { routing, locales } from '@i18n/routing'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import createMiddleware from 'next-intl/middleware'

const LOCALES_PATTERN = `^/(${[...locales].join('|')})`

const intlMiddleware = createMiddleware(routing)

export async function middleware(req: NextRequest) {
  const intlResponse = intlMiddleware(req)
  if (intlResponse) {
    return intlResponse
  }

  // Убираем локаль из пути, если она есть
  const pathname = req.nextUrl.pathname.replace(new RegExp(LOCALES_PATTERN), '')

  if (pathname.startsWith('/private')) {
    return await privateMiddleware(req)
  }

  if (
    pathname.startsWith('/api/folders')
    || pathname.startsWith('/api/terms')
    || pathname.startsWith('/api/settings')
  ) {
    return await privateApiMiddleware(req)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    // '/(ru|en)/:path*',
    '/(ru|en)(!/api)(/.*|)',

    '/private',
    '/api/folders',
    '/api/folders/:id',
    '/api/folders/:id/terms',
    '/api/terms/:id',
    '/api/settings/simulator'
  ],
}
