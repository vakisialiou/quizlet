import { useEffect, useRef } from 'react'

export function useEffectTimeout(callback: () => void, active: boolean, delay: number) {
  const ref = useRef<NodeJS.Timeout | undefined>(undefined)
  useEffect(() => {
    if (active) {
      ref.current = setTimeout(() => callback(), delay)
    }
    return () => {
      if (ref.current) {
        clearTimeout(ref.current)
        ref.current = undefined
      }
    }
  }, [active, delay, callback])
}
