import { v4 } from 'uuid'

export type ServerFolderType = {
  id: number,
  userId: number,
  uuid: string
  name: string,
  createdAt: Date,
  updatedAt: Date,
}

export default class ServerFolder {
  id: number | null
  userId: number | null
  uuid: string
  name: string
  createdAt: Date
  updatedAt: Date

  constructor() {
    this.id = null
    this.userId = null
    this.uuid = v4()
    this.name = ''
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

  setName(value: string): ServerFolder {
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
