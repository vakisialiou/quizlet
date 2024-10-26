import { v4 } from 'uuid'

export type FolderType = {
  id: number | null,
  userId: number | null,
  uuid: string
  name: string,
  count: number,
  createdAt: Date,
  updatedAt: Date,
}

export default class EntityFolder {
  id: number | null;
  userId: number | null;
  uuid: string;
  name: string;
  count: number;
  createdAt: Date;
  updatedAt: Date;

  constructor() {
    this.id = null
    this.userId = null
    this.uuid = v4()
    console.log(this.uuid)
    this.name = ''
    this.count = 0
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }

  setId(value: number): EntityFolder {
    this.id = value
    return this
  }

  setCount(value: number): EntityFolder {
    this.count = value
    return this
  }

  setUserId(value: number): EntityFolder {
    this.userId = value
    return this
  }

  setUUID(value: string): EntityFolder {
    this.uuid = value
    return this
  }

  setName(value: string): EntityFolder {
    this.name = value
    return this
  }

  setCreatedAt(value: Date): EntityFolder {
    this.createdAt = value
    return this
  }

  setUpdatedAt(value: Date): EntityFolder {
    this.updatedAt = value
    return this
  }
}
