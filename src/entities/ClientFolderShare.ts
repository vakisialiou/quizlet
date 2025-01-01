import { v4 } from 'uuid'

export enum ClientFolderShareEnum {
  readonly = 'readonly',
  editable = 'editable',
}

export type ClientFolderShareData = {
  id: string
  ownerUserId: string
  folderId: string
  access: ClientFolderShareEnum
  createdAt: Date
  updatedAt: Date
}

export default class ClientFolderShare {
  id: string
  ownerUserId: string
  folderId: string
  access: ClientFolderShareEnum
  createdAt: Date
  updatedAt: Date

  constructor(ownerUserId: string, folderId: string) {
    this.id = v4()
    this.ownerUserId = ownerUserId
    this.folderId = folderId
    this.access = ClientFolderShareEnum.readonly
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }

  setId(value: string): ClientFolderShare {
    this.id = value
    return this
  }

  setOwnerUserId(value: string): ClientFolderShare {
    this.ownerUserId = value
    return this
  }

  setFolderId(value: string): ClientFolderShare {
    this.folderId = value
    return this
  }

  setAccess(value: ClientFolderShareEnum): ClientFolderShare {
    this.access = value
    return this
  }

  setCreatedAt(value: Date): ClientFolderShare {
    this.createdAt = value
    return this
  }

  setUpdatedAt(value: Date): ClientFolderShare {
    this.updatedAt = value
    return this
  }

  serialize(): ClientFolderShareData {
    return JSON.parse(JSON.stringify(this))
  }
}
