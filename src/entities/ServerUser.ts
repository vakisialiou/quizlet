
export type ServerUserType = {
  id: number
  name: string | null
  email: string | null
  givenName: string | null
  familyName: string | null
  picture: string | null
  accountId: string
  refreshToken: string
  createdAt: Date
  updatedAt: Date
}

export default class ServerUser {
  id: number | null
  name: string | null
  email: string | null
  givenName: string | null
  familyName: string | null
  picture: string | null
  accountId: string
  refreshToken: string
  createdAt: Date
  updatedAt: Date

  constructor(accountId: string = '', refreshToken: string = '') {
    this.id = null
    this.name = null
    this.email = null
    this.givenName = null
    this.familyName = null
    this.picture = null
    this.accountId = accountId
    this.refreshToken = refreshToken
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }

  setId(value: number): ServerUser {
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

  setAccountId(value: string): ServerUser {
    this.accountId = value
    return this
  }

  setRefreshToken(value: string): ServerUser {
    this.refreshToken = value
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
