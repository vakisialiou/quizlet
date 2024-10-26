import { v4 } from 'uuid'

export type FolderType = {
  id: number | null,
  userId: number | null,
  uuid: string
  name: string,
  createdAt: Date,
  updatedAt: Date,
}

export class Folder {
  id: number | null;
  userId: number | null;
  uuid: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  constructor() {
    this.id = null
    this.userId = null
    this.uuid = v4()
    this.name = ''
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }

  setId(value: number): Folder {
    this.id = value
    return this
  }

  setUserId(value: number): Folder {
    this.userId = value
    return this
  }

  setUUID(value: string): Folder {
    this.uuid = value
    return this
  }

  setName(value: string): Folder {
    this.name = value
    return this
  }

  setCreatedAt(value: Date | string): Folder {
    this.createdAt = new Date(value)
    return this
  }

  setUpdatedAt(value: Date | string): Folder {
    this.updatedAt = new Date(value)
    return this
  }
}

export type EntityFolderType = {
  id: number | null,
  userId: number | null,
  uuid: string
  name: string,
  count: number,
  createdAt: Date,
  updatedAt: Date,
}

export default class EntityFolder extends Folder {
  count: number

  constructor() {
    super()
    this.count = 0
  }

  setCount(value: number): EntityFolder {
    this.count = value
    return this
  }
}
