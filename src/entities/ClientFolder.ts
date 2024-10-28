import { v4 } from 'uuid'

export type ClientFolderType = {
  uuid: string
  name: string,
}

export default class ClientFolder {
  uuid: string
  name: string

  constructor() {
    this.uuid = v4()
    this.name = ''
  }

  setUUID(value: string): ClientFolder {
    this.uuid = value
    return this
  }

  setName(value: string): ClientFolder {
    this.name = value
    return this
  }

  serialize() {
    return JSON.parse(JSON.stringify(this))
  }
}
