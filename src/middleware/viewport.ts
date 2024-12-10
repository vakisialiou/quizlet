import { NextRequest, userAgent } from 'next/server'
import { ViewportEnums } from '@lib/viewport'

export function viewportMiddleware(req: NextRequest): void {
  const { device } = userAgent(req)
  req.nextUrl.searchParams.set(
    'viewport',
    device.type === 'mobile'
      ? ViewportEnums.mobile
      : ViewportEnums.desktop
  )
}
