import { NextRequest, userAgent } from 'next/server'
import { ViewportEnums } from '@lib/viewport'

export function viewportMiddleware(req: NextRequest): void {
  const { device } = userAgent(req)
  req.headers.set(
    'x-viewport',
    device.type === 'mobile'
      ? ViewportEnums.mobile
      : ViewportEnums.desktop
  )
}
