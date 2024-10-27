import { v4 } from 'uuid'

export type ClientFolderType = {
  uuid: string
  name: string,
  count: number
}

export default class ClientFolder {
  uuid: string
  name: string
  count: number

  constructor() {
    this.uuid = v4()
    this.name = ''
    this.count = 0
  }

  setUUID(value: string): ClientFolder {
    this.uuid = value
    return this
  }

  setName(value: string): ClientFolder {
    this.name = value
    return this
  }

  setCount(value: number): ClientFolder {
    this.count = value
    return this
  }

  serialize() {
    return JSON.parse(JSON.stringify(this))
  }
}
