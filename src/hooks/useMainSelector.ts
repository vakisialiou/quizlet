import { ConfigType } from '@store/initial-state-main'
import { getMainStore } from '@store/store'
import { useState, useEffect } from 'react'

export function useMainSelector<Selected = unknown>(callback: (state: ConfigType) => Selected): Selected {
  const store = getMainStore()
  const [selectedState, setSelectedState] = useState(() => callback(store.getState()))

  useEffect(() => {
    return store.subscribe(() => {
      const newSelectedState = callback(store.getState())
      setSelectedState(newSelectedState)
    })
  }, [store, callback])

  return selectedState
}
