'use client'

import React, { ReactNode, useEffect } from 'react'
import { config } from '@lib/config'

export default function ProviderWorker({ children }: { children: ReactNode }) {
  useEffect(() => {
    navigator.serviceWorker
      .register(`/sw.js?cacheName=${config.sw.cacheName}&enabled=${config.sw.enabled}`)
      .then(() => console.log('Service Worker registered successfully'))
      .catch((err) => console.error('Service Worker registration failed:', err))
  }, [])

  return (
    <>
      {children}
    </>
  )
}
