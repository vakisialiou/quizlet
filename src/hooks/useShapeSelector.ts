import { ShareConfigType } from '@store/initial-state-share'
import { getShareStore } from '@store/store'
import { useState, useEffect } from 'react'

export function useShareSelector<Selected = unknown>(callback: (state: ShareConfigType) => Selected): Selected {
  const store = getShareStore()
  const [selectedState, setSelectedState] = useState(() => callback(store.getState()))

  useEffect(() => {
    return store.subscribe(() => {
      const newSelectedState = callback(store.getState())
      setSelectedState(newSelectedState)
    })
  }, [store, callback])

  return selectedState
}
