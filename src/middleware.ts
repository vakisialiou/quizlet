import { privateApiMiddleware, privateMiddleware } from './middleware/private'
import { viewportMiddleware } from './middleware/viewport'
import { routing, locales } from '@i18n/routing'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import createMiddleware from 'next-intl/middleware'

const LOCALES_PATTERN = `^/(${[...locales].join('|')})`

const intlMiddleware = createMiddleware(routing)

export async function middleware(req: NextRequest) {
  viewportMiddleware(req)

  // /api маршруты без локализации поэтому сначала проверяем эти маршруты.
  const originPathname = req.nextUrl.pathname
  if (originPathname.startsWith('/api/')) {
    return await privateApiMiddleware(req)
  }

  // Убираем локаль из пути, если она есть
  const intlResponse = intlMiddleware(req)
  if (intlResponse.status !== 200) {
    return intlResponse
  }

  const pathname = originPathname.replace(new RegExp(LOCALES_PATTERN), '')
  if (pathname.startsWith('/private')) {
    return await privateMiddleware(req)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/(ru|en)/private/:path*',
    '/((?!api|.*\\..*).*)',
  ],
}
