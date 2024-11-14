'use client'

import { ReactNode } from 'react'

export default function ReduxProvider(
  { children }:
  {
    children: ReactNode,
  }
) {
  return children
}
