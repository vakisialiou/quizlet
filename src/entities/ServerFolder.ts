import { v4 } from 'uuid'

export type ServerFolderType = {
  id: number,
  userId: number,
  uuid: string
  name: string | null,
  createdAt: Date,
  updatedAt: Date,
}

export default class ServerFolder {
  id: number | null
  userId: number
  uuid: string
  name: string | null
  createdAt: Date
  updatedAt: Date

  constructor() {
    this.id = null
    this.name = null
    this.userId = -1
    this.uuid = v4()
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }

  setId(value: number): ServerFolder {
    this.id = value
    return this
  }

  setUserId(value: number): ServerFolder {
    this.userId = value
    return this
  }

  setUUID(value: string): ServerFolder {
    this.uuid = value
    return this
  }

  setName(value: string | null): ServerFolder {
    this.name = value
    return this
  }

  setCreatedAt(value: Date | string): ServerFolder {
    this.createdAt = new Date(value)
    return this
  }

  setUpdatedAt(value: Date | string): ServerFolder {
    this.updatedAt = new Date(value)
    return this
  }
}
