import TermSettings, { TermSettingsData } from './TermSettings'
import { MarkersEnum } from '@entities/Marker'
import { v4 } from 'uuid'

export type ModuleData = {
  id: string
  name: string | null
  description: string | null
  collapsed: boolean
  termsCollapsed: boolean
  groupsCollapsed: boolean
  order: number,
  degreeRate: number,
  markers: MarkersEnum[]
  termSettings: TermSettingsData
  updatedAt: Date
  createdAt: Date
}

export default class Module {
  id: string
  order: number
  collapsed: boolean
  termsCollapsed: boolean
  groupsCollapsed: boolean
  name: string | null
  description: string | null
  degreeRate: number
  markers: MarkersEnum[]
  termSettings: TermSettingsData
  updatedAt: Date
  createdAt: Date

  constructor() {
    this.id = v4()
    this.order = 0
    this.degreeRate = 0
    this.name = null
    this.description = null
    this.collapsed = false
    this.termsCollapsed = false
    this.groupsCollapsed = false
    this.markers = []
    this.termSettings = new TermSettings().serialize()
    this.updatedAt = new Date()
    this.createdAt = new Date()
  }

  setTermSettings(value: TermSettingsData | null): Module {
    this.termSettings = {...this.termSettings, ...value}
    return this
  }

  setCollapsed(value: boolean): Module {
    this.collapsed = value
    return this
  }

  setTermsCollapsed(value: boolean): Module {
    this.termsCollapsed = value
    return this
  }

  setGroupsCollapsed(value: boolean): Module {
    this.groupsCollapsed = value
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
}
