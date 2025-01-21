import { v4 } from 'uuid'

export type RelationFolderData = {
  id: string,
  order: number
  groupId: string,
  folderId: string,
  createdAt: Date
}

export default class RelationFolder {
  id: string
  order: number
  groupId: string | null
  folderId: string | null
  createdAt: Date

  constructor() {
    this.id = v4()
    this.order = 0
    this.groupId = null
    this.folderId = null
    this.createdAt = new Date()
  }

  setCreatedAt(value: Date): RelationFolder {
    this.createdAt = value
    return this
  }

  setOrder(value: number): RelationFolder {
    this.order = value
    return this
  }

  setId(value: string): RelationFolder {
    this.id = value
    return this
  }

  setFolderId(value: string | null): RelationFolder {
    this.folderId = value
    return this
  }

  setGroupId(value: string | null): RelationFolder {
    this.groupId = value
    return this
  }

  serialize(): RelationFolderData {
    return JSON.parse(JSON.stringify(this))
  }
}
