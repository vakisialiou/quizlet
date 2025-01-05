import { ConfigType } from '@store/initial-state'
import { ModuleData } from '@entities/Module'
import { useSelector } from 'react-redux'

export function useModuleSelect(): ModuleData[] {
  return useSelector((state: ConfigType) => state.modules)
}

