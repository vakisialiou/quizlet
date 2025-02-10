import TermSettings, { TermSettingsData } from './TermSettings'
import { MarkersEnum } from '@entities/Marker'
import { v4 } from 'uuid'

export enum ModuleTabId {
  cards = 1,
  sections = 2
}

export type ModuleData = {
  id: string
  activeTab: ModuleTabId
  userId: string | null
  name: string | null
  description: string | null
  collapsed: boolean
  order: number,
  degreeRate: number,
  markers: MarkersEnum[]
  termSettings: TermSettingsData
  updatedAt: Date
  createdAt: Date
}

export default class Module {
  id: string
  activeTab: ModuleTabId
  userId: string | null
  order: number
  collapsed: boolean
  name: string | null
  description: string | null
  degreeRate: number
  markers: MarkersEnum[]
  termSettings: TermSettingsData
  updatedAt: Date
  createdAt: Date

  constructor() {
    this.id = v4()
    this.userId = null
    this.order = 0
    this.activeTab = ModuleTabId.cards
    this.degreeRate = 0
    this.name = null
    this.description = null
    this.collapsed = false
    this.markers = []
    this.termSettings = new TermSettings().serialize()
    this.updatedAt = new Date()
    this.createdAt = new Date()
  }

  setUserId(value: string | null): Module {
    this.userId = value
    return this
  }

  setActiveTab(value: ModuleTabId): Module {
    this.activeTab = value
    return this
  }

  setTermSettings(value: TermSettingsData | null): Module {
    this.termSettings = {...this.termSettings, ...value}
    return this
  }

  setCollapsed(value: boolean): Module {
    this.collapsed = value
    return this
  }

  setUpdatedAt(value: Date): Module {
    this.updatedAt = value
    return this
  }

  setCreatedAt(value: Date): Module {
    this.createdAt = value
    return this
  }

  setOrder(value: number): Module {
    this.order = value
    return this
  }

  setDegreeRate(value: number): Module {
    this.degreeRate = value
    return this
  }

  setMarkers(value: MarkersEnum[]): Module {
    this.markers = value
    return this
  }

  addMarker(value: MarkersEnum): Module {
    this.markers.push(value)
    return this
  }

  setId(value: string): Module {
    this.id = value
    return this
  }

  setName(value: string | null): Module {
    this.name = value
    return this
  }

  setDescription(value: string | null): Module {
    this.description = value
    return this
  }

  serialize(): ModuleData {
    return JSON.parse(JSON.stringify(this))
  }

  copy(data: Partial<ModuleData>): Module {
    for (const prop in data) {
      if (prop in this) {
        if (prop === 'id') {
          this.setId(v4())
          continue
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this as any)[prop] = data[prop as keyof ModuleData]
      }
    }
    return this
  }
}
