import { v4 } from 'uuid'

export type ClientRelationFolderData = {
  id: string,
  folderId: string,
  folderGroupId: string,
  createdAt: Date,
}

export default class ClientRelationFolder {
  id: string
  folderId: string | null
  folderGroupId: string | null
  createdAt: Date

  constructor() {
    this.id = v4()
    this.folderId = null
    this.folderGroupId = null
    this.createdAt = new Date()
  }

  setCreatedAt(value: Date): ClientRelationFolder {
    this.createdAt = value
    return this
  }

  setId(value: string): ClientRelationFolder {
    this.id = value
    return this
  }

  setFolderId(value: string | null): ClientRelationFolder {
    this.folderId = value
    return this
  }

  setFolderGroupId(value: string | null): ClientRelationFolder {
    this.folderGroupId = value
    return this
  }

  serialize(): ClientRelationFolderData {
    return JSON.parse(JSON.stringify(this))
  }
}
