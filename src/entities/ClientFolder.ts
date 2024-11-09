import { v4 } from 'uuid'

export type ClientFolderType = {
  uuid: string | null
  name: string | null,
}

export default class ClientFolder {
  uuid: string | null
  name: string | null

  constructor() {
    this.uuid = v4()
    this.name = null
  }

  setUUID(value: string | null): ClientFolder {
    this.uuid = value
    return this
  }

  setName(value: string | null): ClientFolder {
    this.name = value
    return this
  }

  serialize() {
    return JSON.parse(JSON.stringify(this))
  }
}
