import { authMiddleware } from './middleware/auth'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/private')) {
    return authMiddleware(request)
  }

  NextResponse.next()
}

export const config = {
  matcher: ['/private'],
}
