'use client'

import React, { ReactNode, useEffect, useState, useRef, useImperativeHandle, forwardRef, Ref } from 'react'
import Offline from '@containers/Offline'

function ProviderOnline(
  {
    children
  }:
  {
    children: ReactNode
  },
  ref: Ref<{ isOnline: boolean }>
) {
  const refOnLine = useRef(typeof navigator === 'object' ? navigator.onLine : true)
  const [isOnline, setIsOnline] = useState(refOnLine.current)

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

  useImperativeHandle(ref, () => ({ isOnline: refOnLine.current }))

  return (
    <>
      {children}

      {!isOnline &&
        <Offline
          className="fixed left-0 top-0 h-full w-full bg-black"
        />
      }
    </>
  )
}

export default forwardRef(ProviderOnline)
