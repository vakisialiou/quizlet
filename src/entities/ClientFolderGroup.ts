import ClientRelationFolder, { ClientRelationFolderData } from '@entities/ClientRelationFolder'
import { v4 } from 'uuid'

export type ClientFolderGroupData = {
  id: string,
  name: string,
  folderId: string,
  relationFolders: ClientRelationFolderData[]
  createdAt: Date,
  updatedAt: Date,
}

export default class ClientFolderGroup {
  id: string
  name: string | null
  folderId: string | null
  relationFolders: ClientRelationFolder[]
  createdAt: Date
  updatedAt: Date

  constructor() {
    this.id = v4()
    this.name = null
    this.folderId = null
    this.relationFolders = []
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }

  setCreatedAt(value: Date): ClientFolderGroup {
    this.createdAt = value
    return this
  }

  setUpdatedAt(value: Date): ClientFolderGroup {
    this.updatedAt = value
    return this
  }

  setId(value: string): ClientFolderGroup {
    this.id = value
    return this
  }

  setName(value: string | null): ClientFolderGroup {
    this.name = value
    return this
  }

  setFolderId(value: string | null): ClientFolderGroup {
    this.folderId = value
    return this
  }

  setRelationFolders(relationTerms: ClientRelationFolder[]) {
    this.relationFolders = relationTerms
    return this
  }

  serialize(): ClientFolderGroupData {
    return JSON.parse(JSON.stringify(this))
  }
}
