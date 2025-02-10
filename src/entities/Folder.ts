import TermSettings, { TermSettingsData } from './TermSettings'
import { MarkersEnum } from './Marker'
import { v4 } from 'uuid'

export type FolderData = {
  id: string
  name: string | null
  collapsed: boolean
  order: number,
  degreeRate: number,
  markers: MarkersEnum[]
  termSettings: TermSettingsData
  updatedAt: Date
  createdAt: Date
}

export default class Folder {
  id: string
  order: number
  collapsed: boolean
  name: string | null
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
    this.collapsed = false
    this.markers = []
    this.termSettings = new TermSettings().serialize()
    this.updatedAt = new Date()
    this.createdAt = new Date()
  }

  setTermSettings(value: TermSettingsData | null): Folder {
    this.termSettings = { ...this.termSettings, ...value }
    return this
  }

  setCollapsed(value: boolean): Folder {
    this.collapsed = value
    return this
  }

  setUpdatedAt(value: Date): Folder {
    this.updatedAt = value
    return this
  }

  setCreatedAt(value: Date): Folder {
    this.createdAt = value
    return this
  }

  setOrder(value: number): Folder {
    this.order = value
    return this
  }

  setDegreeRate(value: number): Folder {
    this.degreeRate = value
    return this
  }

  setMarkers(value: MarkersEnum[]): Folder {
    this.markers = value
    return this
  }

  addMarker(value: MarkersEnum): Folder {
    this.markers.push(value)
    return this
  }

  setId(value: string): Folder {
    this.id = value
    return this
  }

  setName(value: string | null): Folder {
    this.name = value
    return this
  }

  serialize(): FolderData {
    return JSON.parse(JSON.stringify(this))
  }
}
