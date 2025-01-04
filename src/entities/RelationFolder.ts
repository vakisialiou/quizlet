import { v4 } from 'uuid'

export type RelationFolderData = {
  id: string,
  groupId: string,
  folderId: string,
}

export default class RelationFolder {
  id: string
  groupId: string | null
  folderId: string | null

  constructor() {
    this.id = v4()
    this.groupId = null
    this.folderId = null
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
