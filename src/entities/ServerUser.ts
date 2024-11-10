
export default class ServerUser {
  id: string | null
  name: string | null
  email: string | null
  givenName: string | null
  familyName: string | null
  picture: string | null
  createdAt: Date
  updatedAt: Date

  constructor() {
    this.id = null
    this.name = null
    this.email = null
    this.givenName = null
    this.familyName = null
    this.picture = null
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }

  setId(value: string): ServerUser {
    this.id = value
    return this
  }

  setName(value: string): ServerUser {
    this.name = value
    return this
  }

  setEmail(value: string): ServerUser {
    this.email = value
    return this
  }

  setGivenName(value: string): ServerUser {
    this.givenName = value
    return this
  }

  setFamilyName(value: string): ServerUser {
    this.familyName = value
    return this
  }

  setPicture(value: string): ServerUser {
    this.picture = value
    return this
  }

  setCreatedAt(value: Date | string): ServerUser {
    this.createdAt = new Date(value)
    return this
  }

  setUpdatedAt(value: Date | string): ServerUser {
    this.updatedAt = new Date(value)
    return this
  }
}
