import { v4 } from 'uuid'

export enum ModuleShareEnum {
  readonly = 'readonly',
  editable = 'editable',
}

export type ModuleShareData = {
  id: string
  ownerId: string
  moduleId: string
  access: ModuleShareEnum
}

export default class ModuleShare {
  id: string
  ownerId: string | null
  moduleId: string | null
  access: ModuleShareEnum

  constructor() {
    this.id = v4()
    this.ownerId = null
    this.moduleId = null
    this.access = ModuleShareEnum.readonly
  }

  setId(value: string): ModuleShare {
    this.id = value
    return this
  }

  setOwnerId(value: string): ModuleShare {
    this.ownerId = value
    return this
  }

  setModuleId(value: string): ModuleShare {
    this.moduleId = value
    return this
  }

  setAccess(value: ModuleShareEnum): ModuleShare {
    this.access = value
    return this
  }

  serialize(): ModuleShareData {
    return JSON.parse(JSON.stringify(this))
  }
}
