'use client'

import React, { ReactNode, useLayoutEffect } from 'react'

export default function ProviderResize({ children }: { children: ReactNode }) {
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

  return (
    <>
      {children}
    </>
  )
}
