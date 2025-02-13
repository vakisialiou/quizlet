import { NextRequest, NextResponse } from 'next/server'
import { ViewportEnums } from '@lib/viewport'
import { UAParser } from 'ua-parser-js'

export function viewportMiddleware(req: NextRequest, res: NextResponse): void {
  const userAgentString = req.headers.get('user-agent') || ''
  const parser = new UAParser(userAgentString)
  const { type } = parser.getDevice()

  res.headers.set('x-viewport', type === 'mobile' ? ViewportEnums.mobile : ViewportEnums.desktop)
}
