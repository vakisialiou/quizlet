import RelationFolder, { RelationFolderData } from '@entities/RelationFolder'
import { v4 } from 'uuid'

export type FolderGroupData = {
  id: string,
  name: string,
  moduleId: string,
  relationFolders: RelationFolderData[]
  updatedAt: Date,
}

export default class FolderGroup {
  id: string
  name: string | null
  moduleId: string | null
  relationFolders: RelationFolder[]
  updatedAt: Date

  constructor() {
    this.id = v4()
    this.name = null
    this.moduleId = null
    this.relationFolders = []
    this.updatedAt = new Date()
  }

  setUpdatedAt(value: Date): FolderGroup {
    this.updatedAt = value
    return this
  }

  setId(value: string): FolderGroup {
    this.id = value
    return this
  }

  setModuleId(value: string): FolderGroup {
    this.moduleId = value
    return this
  }

  setName(value: string | null): FolderGroup {
    this.name = value
    return this
  }

  setRelationFolders(relationTerms: RelationFolder[]) {
    this.relationFolders = relationTerms
    return this
  }

  serialize(): FolderGroupData {
    return JSON.parse(JSON.stringify(this))
  }
}
