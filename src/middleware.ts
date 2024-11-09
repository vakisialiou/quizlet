import { authMiddleware } from './middleware/auth'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import type {  } from 'next-auth'
import { auth } from '@auth'


export default auth((req) => {
  if (req.nextUrl.pathname.startsWith('/private')) {
    if (!req.auth) {
      const newUrl = new URL('/login', req.nextUrl.origin)
      return Response.redirect(newUrl)
    }
  }

  NextResponse.next()
})

export const config = {
  matcher: ['/private'],
}
