'use client'

import React, { ReactNode, useLayoutEffect, useEffect, useState, useRef } from 'react'
import { SessionProvider } from 'next-auth/react'
import { ConfigType } from '@store/initial-state'
import { presetStore } from '@store/index'
import Offline from '@containers/Offline'
import { Provider } from 'react-redux'
import { config } from '@lib/config'

export function AppProvider({ children, initialState }: { children: ReactNode, initialState: ConfigType }) {
  const store = presetStore(initialState)

  const refOnLine = useRef(typeof navigator === 'object' ? navigator.onLine : true)
  const [isOnline, setIsOnline] = useState(refOnLine.current)

  useLayoutEffect(() => {
    const updateHeight = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)

    return () => {
      window.removeEventListener('resize', updateHeight)
    }
  }, [])

  useEffect(() => {
    const sendNetworkStatus = () => {
      refOnLine.current = navigator.onLine
      setIsOnline(navigator.onLine)
    }

    window.addEventListener('online', sendNetworkStatus)
    window.addEventListener('offline', sendNetworkStatus)

    return () => {
      window.removeEventListener('online', sendNetworkStatus)
      window.removeEventListener('offline', sendNetworkStatus)
    }
  }, [setIsOnline])

  console.log(config.sw, 'server')

  useEffect(() => {
    console.log(config.sw, 'client')
    navigator.serviceWorker
      .register(`/sw.js?cacheName=${config.sw.cacheName}&enabled=${config.sw.enabled}`)
      .then(() => console.log('Service Worker registered successfully'))
      .catch((err) => console.error('Service Worker registration failed:', err))

    navigator.serviceWorker.ready
      .then((registration) => {
        registration?.active?.postMessage({ isOnline: refOnLine.current })
      })
      .catch((err) => {
        console.error('Error accessing service worker:', err)
      })
  }, [])

  return (
    <SessionProvider>
      <Provider store={store}>
        {children}

        {!isOnline &&
          <Offline
            className="fixed left-0 top-0 h-full w-full bg-black"
          />
        }
      </Provider>
    </SessionProvider>
  )
}
